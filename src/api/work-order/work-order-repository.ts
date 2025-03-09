import db, { DB, DBTransaction } from "#/common/config/database/connection.js";
import {
  InsertWorkOrder,
  InsertWorkOrderInProgressHistory,
  InsertWorkOrderStatusHistory,
  usersTable,
  WorkOrder,
  WorkOrderInProgressHistory,
  workOrderInProgressHistoryTable,
  WorkOrderStatus,
  WorkOrderStatusHistory,
  workOrderStatusHistoryTable,
  workOrderStatusTable,
  workOrderTable,
} from "#/common/config/database/schema.js";
import { takeUniqueOrThrow } from "#/common/utils/index.js";
import { endOfDay, startOfDay } from "date-fns";
import { and, asc, between, desc, eq, inArray, sql } from "drizzle-orm";

export class WorkOrderRepository {
  private readonly DB: DB;

  constructor(DB: DB = db) {
    this.DB = DB;
  }

  async countSearchWorkOrder(createdAt?: Date, statusId?: number, operatorId?: number): Promise<number> {
    const result = await this.DB.$count(
      workOrderTable,
      and(
        createdAt ? between(workOrderTable.createdAt, startOfDay(createdAt), endOfDay(createdAt)) : undefined,
        statusId ? eq(workOrderTable.currentStatusId, statusId) : undefined,
        operatorId ? eq(workOrderTable.operatorId, operatorId) : undefined,
      ),
    );
    return result;
  }
  async countUserByIdAndRole(userId: number, roleId: number): Promise<number> {
    const result = await this.DB.$count(usersTable, and(eq(usersTable.id, userId), eq(usersTable.roleId, roleId)));
    return result;
  }
  async createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder> {
    const result = await this.DB.insert(workOrderTable).values(workOrder).returning();
    return takeUniqueOrThrow("Created work order")(result)!;
  }
  async deleteWorkorderBulkById(workOrderIds: number[], transaction?: DBTransaction): Promise<WorkOrder[]> {
    const db = transaction ?? this.DB;
    const result = await db.delete(workOrderTable).where(inArray(workOrderTable.id, workOrderIds)).returning();
    return result;
  }
  async deleteWorkOrderById(id: number, transaction?: DBTransaction): Promise<WorkOrder> {
    const db = transaction ?? this.DB;
    const result = await db.delete(workOrderTable).where(eq(workOrderTable.id, id)).returning();
    return takeUniqueOrThrow("Delete work order by id")(result)!;
  }
  async getInProgressHistoryByWoIdWithUser(workOrderId: number) {
    const result = await this.DB.select()
      .from(workOrderInProgressHistoryTable)
      .where(eq(workOrderInProgressHistoryTable.workOrderId, workOrderId))
      .orderBy(asc(workOrderInProgressHistoryTable.createdAt))
      .leftJoin(usersTable, eq(workOrderInProgressHistoryTable.createdBy, usersTable.id));
    return result;
  }
  async getLastWorkOrderStatusHistoryByWoId(id: number): Promise<null | WorkOrderStatusHistory> {
    const result = await db
      .select()
      .from(workOrderStatusHistoryTable)
      .where(eq(workOrderStatusHistoryTable.workOrderId, id))
      .orderBy(desc(workOrderStatusHistoryTable.createdAt))
      .limit(1);
    return takeUniqueOrThrow("Get last work order status history by work order id")(result);
  }
  async getStatusHistoryByWoId(workOrderId: number): Promise<WorkOrderStatusHistory[]> {
    const result = await this.DB.select().from(workOrderStatusHistoryTable).where(eq(workOrderStatusHistoryTable.workOrderId, workOrderId));
    return result;
  }
  async getStatusHistoryByWoIdWithUser(workOrderId: number) {
    const result = await this.DB.select()
      .from(workOrderStatusHistoryTable)
      .where(eq(workOrderStatusHistoryTable.workOrderId, workOrderId))
      .orderBy(asc(workOrderStatusHistoryTable.createdAt))
      .leftJoin(usersTable, eq(workOrderStatusHistoryTable.createdBy, usersTable.id));
    return result;
  }
  async getWorkOrderById(id: number): Promise<null | WorkOrder> {
    const result = await this.DB.select().from(workOrderTable).where(eq(workOrderTable.id, id));
    return takeUniqueOrThrow("Get work order by id")(result);
  }
  async getWorkOrderByIdAndOperatorId(id: number, operatorId: number): Promise<null | WorkOrder> {
    const result = await this.DB.select()
      .from(workOrderTable)
      .where(and(eq(workOrderTable.id, id), eq(workOrderTable.operatorId, operatorId)));
    return takeUniqueOrThrow("Get work order by id and operator id")(result);
  }
  async getWorkOrderByIdAndOperatorIdWithOperatorAndStatus(id: number, operatorId: number) {
    const result = await this.DB.select()
      .from(workOrderTable)
      .where(and(eq(workOrderTable.id, id), eq(workOrderTable.operatorId, operatorId)))
      .leftJoin(usersTable, eq(workOrderTable.operatorId, usersTable.id))
      .leftJoin(workOrderStatusTable, eq(workOrderTable.currentStatusId, workOrderStatusTable.id));
    return takeUniqueOrThrow("Get work order by id")(result);
  }
  async getWorkOrderByIds(ids: number[]): Promise<null | WorkOrder[]> {
    const result = await this.DB.select().from(workOrderTable).where(inArray(workOrderTable.id, ids));
    return result;
  }
  async getWorkOrderByIdWithOperatorAndStatus(id: number) {
    const result = await this.DB.select()
      .from(workOrderTable)
      .where(eq(workOrderTable.id, id))
      .leftJoin(usersTable, eq(workOrderTable.operatorId, usersTable.id))
      .leftJoin(workOrderStatusTable, eq(workOrderTable.currentStatusId, workOrderStatusTable.id));
    return takeUniqueOrThrow("Get work order by id")(result);
  }
  async getWorkOrders(): Promise<WorkOrder[]> {
    const result = await this.DB.select().from(workOrderTable);
    return result;
  }
  async getWorkOrderStatus(): Promise<WorkOrderStatus[]> {
    const result = await this.DB.select().from(workOrderStatusTable);
    return result;
  }
  async getWorkOrderStatusById(id: number): Promise<null | WorkOrderStatus> {
    const result = await db.select().from(workOrderStatusTable).where(eq(workOrderStatusTable.id, id));
    return takeUniqueOrThrow("Get work order status by id")(result);
  }
  async insertWorkOrderInProgressHistory(
    workOrderProgressHistory: InsertWorkOrderInProgressHistory,
    transaction?: DBTransaction,
  ): Promise<WorkOrderInProgressHistory> {
    const db = transaction ?? this.DB;
    const result = await db.insert(workOrderInProgressHistoryTable).values(workOrderProgressHistory).returning();
    return takeUniqueOrThrow("Insert work order in progress history")(result)!;
  }
  async insertWorkOrderStatusHistory(
    workOrderStatusHistory: InsertWorkOrderStatusHistory,
    transaction?: DBTransaction,
  ): Promise<WorkOrderStatusHistory> {
    const db = transaction ?? this.DB;
    const result = await db.insert(workOrderStatusHistoryTable).values(workOrderStatusHistory).returning();
    return takeUniqueOrThrow("Insert work order status history")(result)!;
  }
  async operatorWorkOrderStats() {
    const result = await db
      .select({
        canceledCount: sql<number>`
        COALESCE(COUNT(CASE WHEN ${workOrderStatusHistoryTable.statusId} = 4 THEN 1 END), 0)::integer
      `,
        completedCount: sql<number>`
        COALESCE(COUNT(CASE WHEN ${workOrderStatusHistoryTable.statusId} = 3 THEN 1 END), 0)::integer
      `,
        email: usersTable.email,
        id: usersTable.id,
        inProgressCount: sql<number>`
        COALESCE(COUNT(CASE WHEN ${workOrderStatusHistoryTable.statusId} = 2 THEN 1 END), 0)::integer
      `,
        name: usersTable.name,
        pendingCount: sql<number>`
        COALESCE(COUNT(CASE WHEN ${workOrderStatusHistoryTable.statusId} = 1 THEN 1 END), 0)::integer
      `,
        totalCount: sql<number>`
        COUNT(${workOrderStatusHistoryTable.id})::integer
      `,
        uuid: usersTable.uuid,
      })
      .from(usersTable)
      .leftJoin(workOrderStatusHistoryTable, eq(usersTable.id, workOrderStatusHistoryTable.createdBy))
      .where(eq(usersTable.roleId, 2))
      .groupBy(usersTable.id, usersTable.uuid, usersTable.name, usersTable.email);
    return result;
  }
  async searchWorkOrder(limit: number, offset: number, createdAt?: Date, statusId?: number, operatorId?: number) {
    const result = await this.DB.select()
      .from(workOrderTable)
      .where(
        and(
          createdAt ? between(workOrderTable.createdAt, startOfDay(createdAt), endOfDay(createdAt)) : undefined,
          statusId ? eq(workOrderTable.currentStatusId, statusId) : undefined,
          operatorId ? eq(workOrderTable.operatorId, operatorId) : undefined,
        ),
      )
      .orderBy(desc(workOrderTable.createdAt))
      .leftJoin(usersTable, eq(workOrderTable.operatorId, usersTable.id))
      .leftJoin(workOrderStatusTable, eq(workOrderTable.currentStatusId, workOrderStatusTable.id))
      .limit(limit)
      .offset(offset);
    return result;
  }
  async updateWorkOrderById(id: number, workOrder: Partial<InsertWorkOrder>, transaction?: DBTransaction): Promise<WorkOrder> {
    const db = transaction ?? this.DB;
    const result = await db.update(workOrderTable).set(workOrder).where(eq(workOrderTable.id, id)).returning();
    return takeUniqueOrThrow("Update work order by id")(result)!;
  }
  async updateWorkOrderStatusHistoryById(
    id: number,
    workOrderStatusHistory: Partial<InsertWorkOrderStatusHistory>,
    transaction?: DBTransaction,
  ): Promise<WorkOrderStatusHistory> {
    const db = transaction ?? this.DB;
    const result = await db.update(workOrderStatusHistoryTable).set(workOrderStatusHistory).where(eq(workOrderStatusHistoryTable.id, id)).returning();
    return takeUniqueOrThrow("Update work order status history by id")(result)!;
  }
}
