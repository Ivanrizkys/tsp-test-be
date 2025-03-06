import { MetaPagination, UserRequest } from "#/common/model/index.js";
import { sendResponseSuccess } from "#/common/utils/send-response.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { WorkOrder } from "./work-order-model.js";
import { WorkOrderService } from "./work-order-service.js";

export class WorkOrderController {
  private readonly workOrderService: WorkOrderService;

  constructor(workOrderService: WorkOrderService) {
    this.workOrderService = workOrderService;
  }

  public createWorkOrder: RequestHandler = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const workOrder = req.body;
      const createdWorkOrder = await this.workOrderService.createWorkOrder(user, workOrder);
      sendResponseSuccess(res, 201, createdWorkOrder, {
        message: "Work order created successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  public getWorkOrderDetail: RequestHandler = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const workOrderDetail = await this.workOrderService.getWorkOrderDetail(req.user!, {
        work_order_id: Number(req.params.workOrderId),
      });
      sendResponseSuccess(res, 200, workOrderDetail, {
        message: "Get work order detail succesfully",
      });
    } catch (error) {
      next(error);
    }
  };
  public getWorkOrders: RequestHandler = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const workOrders = await this.workOrderService.getWorkOrders(req.user!, {
        page: Number(req.query.page),
        per_page: Number(req.query.per_page),
        ...(req.query.created_at ? { created_at: req.query.created_at as unknown as Date } : {}),
        ...(req.query.status_id ? { status_id: Number(req.query.status_id) } : {}),
      });
      sendResponseSuccess<WorkOrder[], MetaPagination>(res, 200, workOrders.data, {
        message: "Get work orders succesfully",
        ...workOrders.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
  public getWorkOrderStatuses: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workOrderStatuses = await this.workOrderService.getWorkOrderStatus();
      sendResponseSuccess(res, 200, workOrderStatuses, {
        message: "Get work order status succesfully",
      });
    } catch (error) {
      next(error);
    }
  };
  public updateWorkOrderManager: RequestHandler = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      await this.workOrderService.updateWorkOrderManager(req.user!, { ...req.body, work_order_id: Number(req.params.workOrderId) });
      sendResponseSuccess(res, 200, null, {
        message: "Work order updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  public updateWorkOrderOperator: RequestHandler = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      await this.workOrderService.updateWorkOrderOperator(req.user!, { ...req.body, work_order_id: Number(req.params.workOrderId) });
      sendResponseSuccess(res, 200, null, {
        message: "Work order updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
