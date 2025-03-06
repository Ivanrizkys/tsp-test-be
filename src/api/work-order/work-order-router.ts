import db from "#/common/config/database/connection.js";
import { authenticate, authorize } from "#/common/middleware/auth-middleware.js";
import { Router } from "express";

import { WorkOrderController } from "./work-order-controller.js";
import { WorkOrderRepository } from "./work-order-repository.js";
import { WorkOrderService } from "./work-order-service.js";

const workOrderRepository = new WorkOrderRepository(db);
const workOrderService = new WorkOrderService(workOrderRepository);
const workOrderController = new WorkOrderController(workOrderService);

export const workOrderRouter = Router();

workOrderRouter.get("/", authenticate, authorize(["view_wo"]), workOrderController.getWorkOrders);
workOrderRouter.get("/:workOrderId", authenticate, authorize(["view_wo"]), workOrderController.getWorkOrderDetail);
workOrderRouter.post("/", authenticate, authorize(["create_wo"]), workOrderController.createWorkOrder);
workOrderRouter.patch(
  "/:workOrderId/manager-update",
  authenticate,
  authorize(["update_wo", "update_wo_status"]),
  workOrderController.updateWorkOrderManager,
);
workOrderRouter.patch("/:workOrderId/operator-update", authenticate, authorize(["update_wo_status"]), workOrderController.updateWorkOrderOperator);
workOrderRouter.get("/status", authenticate, workOrderController.getWorkOrderStatuses);
