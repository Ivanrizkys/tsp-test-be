import db from "#/common/config/database/connection.js";
import { InsertWorkOrder, InsertWorkOrderInProgressHistory, InsertWorkOrderStatusHistory } from "#/common/config/database/schema.js";
import { ResponseError } from "#/common/error/response-error.js";
import { DecodedToken, Pageable } from "#/common/model/index.js";
import { generateWorkOrderNumber } from "#/common/utils/index.js";
import { Validate } from "#/common/utils/validation.js";
import { differenceInSeconds } from "date-fns";

import {
  CreateWorkOrderRequest,
  DeleteBulkWorkOrderRequest,
  DeleteWorkOrderParams,
  GetOperatorWorkOrderStats,
  GetWorkOrderDetailParams,
  GetWorkOrderDetailResponse,
  GetWorkOrderParams,
  UpdateWorkOrderManagerRequest,
  UpdateWorkOrderOperatorRequest,
  WorkOrder,
  WorkOrderStatus,
} from "./work-order-model.js";
import { WorkOrderRepository } from "./work-order-repository.js";
import {
  CreateWorkOrderRequestSchema,
  DeleteWorkOrderBulkRequestSchema,
  DeleteWorkOrderParamsSchema,
  GetWorkOrderDetailParamsSchema,
  GetWorkOrderParamsSchema,
  UpdateWorkOrderManagerRequestSchema,
  UpdateWorkOrderOperatorRequestSchema,
} from "./work-order-validation.js";

export class WorkOrderService {
  private readonly workOrderRepository: WorkOrderRepository;

  constructor(workOrderRepository: WorkOrderRepository) {
    this.workOrderRepository = workOrderRepository;
  }

  async createWorkOrder(user: DecodedToken, workOrder: CreateWorkOrderRequest): Promise<WorkOrder> {
    const validatedRequest = Validate(CreateWorkOrderRequestSchema, workOrder);

    const operatorCount = await this.workOrderRepository.countUserByIdAndRole(validatedRequest.operator_id, 2);
    if (operatorCount === 0) {
      throw new ResponseError(403, "Operator not found");
    }

    // * insert work order (initial status to pending)
    const workOrderNumber = generateWorkOrderNumber();
    const newWorkOrder: InsertWorkOrder = {
      currentStatusId: 1,
      dueDate: validatedRequest.due_date,
      expectedQuantity: validatedRequest.expected_quantity,
      operatorId: validatedRequest.operator_id,
      orderNumber: workOrderNumber,
      productName: validatedRequest.product_name,
    };
    const createdWorkOrder = await this.workOrderRepository.createWorkOrder(newWorkOrder);

    // * insert work order status history (initial status to pending)
    const workOrderStatusHistory: InsertWorkOrderStatusHistory = {
      createdBy: user.id,
      quantityProduced: validatedRequest.expected_quantity,
      statusId: 1,
      workOrderId: createdWorkOrder.id,
      ...(validatedRequest.note ? { none: validatedRequest.note } : {}),
    };
    await this.workOrderRepository.insertWorkOrderStatusHistory(workOrderStatusHistory);

    const workOrderResponse: WorkOrder = {
      actual_completion_date: createdWorkOrder.actualCompletionDate,
      created_at: createdWorkOrder.createdAt,
      current_status: {
        id: createdWorkOrder.currentStatusId,
        name: "Pending",
      },
      due_date: createdWorkOrder.dueDate,
      expected_quantity: createdWorkOrder.expectedQuantity,
      id: createdWorkOrder.id,
      operator: {
        id: createdWorkOrder.operatorId,
        name: user.name,
      },
      order_number: createdWorkOrder.orderNumber,
      product_name: createdWorkOrder.productName,
      updated_at: createdWorkOrder.updatedAt,
    };
    return workOrderResponse;
  }

  async deleteBulkWorkOrder(body: DeleteBulkWorkOrderRequest): Promise<Partial<WorkOrder>[]> {
    const validatedBody = Validate(DeleteWorkOrderBulkRequestSchema, body);

    const workOrdersExist = await this.workOrderRepository.getWorkOrderByIds(validatedBody.work_order_ids);
    if (!workOrdersExist || workOrdersExist.length < 1) {
      throw new ResponseError(404, `Work order with id ${validatedBody.work_order_ids.join(", ")} not found`);
    }

    const deletedWorkOrders = await this.workOrderRepository.deleteWorkorderBulkById(validatedBody.work_order_ids);
    const response: Partial<WorkOrder>[] = [];
    if (deletedWorkOrders.length > 0) {
      for (const deletedData of deletedWorkOrders) {
        response.push({
          actual_completion_date: deletedData.actualCompletionDate,
          created_at: deletedData.createdAt,
          due_date: deletedData.dueDate,
          expected_quantity: deletedData.expectedQuantity,
          id: deletedData.id,
          order_number: deletedData.orderNumber,
          product_name: deletedData.productName,
          updated_at: deletedData.updatedAt,
        });
      }
    }
    return response;
  }

  async deleteWorkOrder(params: DeleteWorkOrderParams): Promise<Partial<WorkOrder>> {
    const validatedParams = Validate(DeleteWorkOrderParamsSchema, params);

    const workOrderExist = await this.workOrderRepository.getWorkOrderById(params.work_order_id);
    if (!workOrderExist) {
      throw new ResponseError(404, `Work order with id ${validatedParams.work_order_id} not found`);
    }

    const deletedWorkOrder = await this.workOrderRepository.deleteWorkOrderById(validatedParams.work_order_id);
    const response: Partial<WorkOrder> = {
      actual_completion_date: deletedWorkOrder.actualCompletionDate,
      created_at: deletedWorkOrder.createdAt,
      due_date: deletedWorkOrder.dueDate,
      expected_quantity: deletedWorkOrder.expectedQuantity,
      id: deletedWorkOrder.id,
      order_number: deletedWorkOrder.orderNumber,
      product_name: deletedWorkOrder.productName,
      updated_at: deletedWorkOrder.updatedAt,
    };
    return response;
  }

  async getOperatorWorkOrderStats(): Promise<GetOperatorWorkOrderStats[]> {
    const stats = await this.workOrderRepository.operatorWorkOrderStats();
    const res: GetOperatorWorkOrderStats[] = stats.map((value) => ({
      canceled_count: value.canceledCount,
      completed_count: value.completedCount,
      email: value.email,
      id: value.id,
      in_progress_count: value.inProgressCount,
      name: value.name,
      pending_count: value.pendingCount,
      total_count: value.totalCount,
      uuid: value.uuid,
    }));
    return res;
  }

  async getWorkOrderDetail(user: DecodedToken, params: GetWorkOrderDetailParams): Promise<GetWorkOrderDetailResponse> {
    const validatedParams = Validate(GetWorkOrderDetailParamsSchema, params);
    const workOrder =
      user.role === 1
        ? await this.workOrderRepository.getWorkOrderByIdWithOperatorAndStatus(validatedParams.work_order_id)
        : await this.workOrderRepository.getWorkOrderByIdAndOperatorIdWithOperatorAndStatus(validatedParams.work_order_id, user.id);
    if (!workOrder) {
      throw new ResponseError(404, `Work order with id ${validatedParams.work_order_id} not found`);
    }
    const statusHistory = await this.workOrderRepository.getStatusHistoryByWoIdWithUser(params.work_order_id);
    const inProgressHistory = await this.workOrderRepository.getInProgressHistoryByWoIdWithUser(params.work_order_id);
    const response: GetWorkOrderDetailResponse = {
      actual_completion_date: workOrder.work_orders.actualCompletionDate,
      actual_quantity: workOrder.work_orders.actualQuantity,
      created_at: workOrder.work_orders.createdAt,
      current_status: {
        id: workOrder.work_order_status!.id,
        name: workOrder.work_order_status!.name,
        uuid: workOrder.work_order_status!.uuid,
      },
      due_date: workOrder.work_orders.dueDate,
      expected_quantity: workOrder.work_orders.expectedQuantity,
      id: workOrder.work_orders.id,
      in_progress_history: inProgressHistory.map((value) => ({
        created_at: value.work_order_in_progress_history.createdAt,
        created_by: {
          id: value.users!.id,
          name: value.users!.name,
          role_id: value.users!.roleId,
        },
        id: value.work_order_in_progress_history.id,
        name: value.work_order_in_progress_history.progressName,
        uuid: value.work_order_in_progress_history.uuid,
      })),
      operator: {
        id: workOrder.users!.id,
        name: workOrder.users!.name,
      },
      order_number: workOrder.work_orders.orderNumber,
      product_name: workOrder.work_orders.productName,
      status_history: statusHistory.map((value) => ({
        created_at: value.work_order_status_history.createdAt,
        created_by: {
          id: value.users!.id,
          name: value.users!.name,
        },
        execute_time_seconds: value.work_order_status_history.executeTimeSeconds,
        id: value.work_order_status_history.id,
        note: value.work_order_status_history.note,
        quantity_produced: value.work_order_status_history.quantityProduced,
        status_id: value.work_order_status_history.statusId,
        uuid: value.work_order_status_history.uuid,
      })),
      updated_at: workOrder.work_orders.updatedAt,
    };
    return response;
  }

  async getWorkOrders(user: DecodedToken, params: GetWorkOrderParams): Promise<Pageable<WorkOrder[]>> {
    const validatedParams = Validate(GetWorkOrderParamsSchema, params);

    const offset = (validatedParams.page - 1) * validatedParams.per_page;
    const workOrders = await this.workOrderRepository.searchWorkOrder(
      validatedParams.per_page,
      offset,
      validatedParams.created_at,
      validatedParams.status_id,
      user.role === 2 ? user.id : undefined,
    );
    const totalWorkOrders = await this.workOrderRepository.countSearchWorkOrder(
      validatedParams.created_at,
      validatedParams.status_id,
      user.role === 2 ? user.id : undefined,
    );
    const responseData: WorkOrder[] = [];
    if (workOrders.length > 0) {
      for (const workOrder of workOrders) {
        responseData.push({
          actual_completion_date: workOrder.work_orders.actualCompletionDate,
          created_at: workOrder.work_orders.createdAt,
          current_status: {
            id: workOrder.work_order_status!.id,
            name: workOrder.work_order_status!.name,
          },
          due_date: workOrder.work_orders.dueDate,
          expected_quantity: workOrder.work_orders.expectedQuantity,
          id: workOrder.work_orders.id,
          operator: {
            id: workOrder.users!.id,
            name: workOrder.users!.name,
          },
          order_number: workOrder.work_orders.orderNumber,
          product_name: workOrder.work_orders.productName,
          updated_at: workOrder.work_orders.updatedAt,
        });
      }
    }
    const pageableData: Pageable<WorkOrder[]> = {
      data: responseData,
      pagination: {
        page: validatedParams.page,
        per_page: validatedParams.per_page,
        total_data: totalWorkOrders,
        total_page: Math.ceil(totalWorkOrders / validatedParams.per_page),
      },
    };
    return pageableData;
  }

  async getWorkOrderStatus(): Promise<WorkOrderStatus[]> {
    const workOrderStatuses = await this.workOrderRepository.getWorkOrderStatus();
    const res: WorkOrderStatus[] = workOrderStatuses.map((workOrderStatus) => ({
      created_at: workOrderStatus.createdAt,
      id: workOrderStatus.id,
      name: workOrderStatus.name,
      updated_at: workOrderStatus.updatedAt,
      uuid: workOrderStatus.uuid,
    }));
    return res;
  }

  async updateWorkOrderManager(operator: DecodedToken, data: UpdateWorkOrderManagerRequest): Promise<void> {
    const validatedData = Validate(UpdateWorkOrderManagerRequestSchema, data);

    const currentWorkOrder = await this.workOrderRepository.getWorkOrderById(validatedData.work_order_id);
    if (!currentWorkOrder) {
      throw new ResponseError(400, "Work order not found");
    }
    const workOrderStatus = await this.workOrderRepository.getWorkOrderStatusById(validatedData.status_id);
    if (!workOrderStatus) {
      throw new ResponseError(400, "Work order status not found");
    }
    if (validatedData.status_id < currentWorkOrder.currentStatusId) {
      throw new ResponseError(400, "Order can't be set to prev status");
    }
    if (currentWorkOrder.currentStatusId === 3 && validatedData.status_id === 4) {
      throw new ResponseError(400, "Completed order can't be set to canceled order");
    }
    await db.transaction(async (tx) => {
      try {
        // * If current work order (in_progress) and incoming update (in_progress)
        if (validatedData.status_id === 2 && validatedData.in_progress_state) {
          const inprogressHistory: InsertWorkOrderInProgressHistory = {
            createdBy: operator.id,
            progressName: validatedData.in_progress_state,
            workOrderId: validatedData.work_order_id,
          };
          await this.workOrderRepository.insertWorkOrderInProgressHistory(inprogressHistory, tx);
        }
        // * If current order status !== incoming work order status -> insert work order status history and update prev work order status (set total execution time in secconds)
        if (validatedData.status_id !== currentWorkOrder.currentStatusId) {
          const statusHistory: InsertWorkOrderStatusHistory = {
            createdBy: operator.id,
            statusId: validatedData.status_id,
            workOrderId: validatedData.work_order_id,
            ...(validatedData.quantity_produced ? { quantityProduced: validatedData.quantity_produced } : {}),
            ...(validatedData.note ? { note: validatedData.note } : {}),
          };
          await this.workOrderRepository.insertWorkOrderStatusHistory(statusHistory, tx);
          const prevStatusHistory = await this.workOrderRepository.getLastWorkOrderStatusHistoryByWoId(validatedData.work_order_id);
          await this.workOrderRepository.updateWorkOrderStatusHistoryById(prevStatusHistory!.id, {
            executeTimeSeconds: differenceInSeconds(new Date(), prevStatusHistory!.createdAt),
          });
        }
        const workOrder: Partial<InsertWorkOrder> = {
          currentStatusId: validatedData.status_id,
          operatorId: validatedData.operator_id,
          // * if work order (completed) => also set actual completion date and actual produced quantity
          ...(validatedData.status_id === 3 ? { actualCompletionDate: new Date() } : {}),
          ...(validatedData.status_id === 3 ? { actualQuantity: validatedData.quantity_produced } : {}),
        };
        await this.workOrderRepository.updateWorkOrderById(validatedData.work_order_id, workOrder, tx);
      } catch (error) {
        tx.rollback();
        throw error;
      }
    });
  }
  async updateWorkOrderOperator(operator: DecodedToken, data: UpdateWorkOrderOperatorRequest): Promise<void> {
    const validatedData = Validate(UpdateWorkOrderOperatorRequestSchema, data);

    const currentWorkOrder = await this.workOrderRepository.getWorkOrderByIdAndOperatorId(validatedData.work_order_id, operator.id);
    if (!currentWorkOrder) {
      throw new ResponseError(400, "Work order not found");
    }
    const workOrderStatus = await this.workOrderRepository.getWorkOrderStatusById(validatedData.status_id);
    if (!workOrderStatus) {
      throw new ResponseError(400, "Work order status not found");
    }
    if (validatedData.status_id < currentWorkOrder.currentStatusId) {
      throw new ResponseError(400, "Order can't be set to prev status");
    }
    if (currentWorkOrder.currentStatusId === 3 && validatedData.status_id === 4) {
      throw new ResponseError(400, "Completed order can't be set to canceled order");
    }
    await db.transaction(async (tx) => {
      try {
        // * If current work order (in_progress) and incoming update (in_progress)
        if (validatedData.status_id === 2 && validatedData.in_progress_state) {
          const inprogressHistory: InsertWorkOrderInProgressHistory = {
            createdBy: operator.id,
            progressName: validatedData.in_progress_state,
            workOrderId: validatedData.work_order_id,
          };
          await this.workOrderRepository.insertWorkOrderInProgressHistory(inprogressHistory, tx);
        }
        // * If current order status !== incoming work order status -> insert work order status history and update prev work order status (set total execution time in secconds)
        if (validatedData.status_id !== currentWorkOrder.currentStatusId) {
          const statusHistory: InsertWorkOrderStatusHistory = {
            createdBy: operator.id,
            statusId: validatedData.status_id,
            workOrderId: validatedData.work_order_id,
            ...(validatedData.quantity_produced ? { quantityProduced: validatedData.quantity_produced } : {}),
            ...(validatedData.note ? { note: validatedData.note } : {}),
          };
          await this.workOrderRepository.insertWorkOrderStatusHistory(statusHistory, tx);
          const prevStatusHistory = await this.workOrderRepository.getLastWorkOrderStatusHistoryByWoId(validatedData.work_order_id);
          await this.workOrderRepository.updateWorkOrderStatusHistoryById(prevStatusHistory!.id, {
            executeTimeSeconds: differenceInSeconds(new Date(), prevStatusHistory!.createdAt),
          });
        }
        const workOrder: Partial<InsertWorkOrder> = {
          currentStatusId: validatedData.status_id,
          // * if work order (completed) => also set actual completion date and actual produced quantity
          ...(validatedData.status_id === 3 ? { actualCompletionDate: new Date() } : {}),
          ...(validatedData.status_id === 3 ? { actualQuantity: validatedData.quantity_produced } : {}),
        };
        await this.workOrderRepository.updateWorkOrderById(validatedData.work_order_id, workOrder, tx);
      } catch (error) {
        tx.rollback();
        throw error;
      }
    });
  }
}
