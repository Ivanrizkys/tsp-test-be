export interface CreateWorkOrderRequest {
  due_date: Date;
  expected_quantity: number;
  note?: string;
  operator_id: number;
  product_name: string;
}

export interface GetWorkOrderDetailParams {
  work_order_id: number;
}

export interface GetWorkOrderDetailResponse {
  actual_completion_date: Date | null;
  actual_quantity: null | number;
  created_at: Date;
  current_status: {
    id: number;
    name: string;
    uuid: string;
  };
  due_date: Date;
  expected_quantity: number;
  id: number;
  in_progress_history: {
    created_at: Date;
    created_by: number;
    id: number;
    name: string;
    uuid: string;
  }[];
  operator: {
    id: number;
    name: string;
  };
  order_number: string;
  product_name: string;
  status_history: {
    created_at: Date;
    created_by: {
      id: number;
      name: string;
    };
    execute_time_seconds: null | number;
    id: number;
    note: null | string;
    quantity_produced: null | number;
    uuid: string;
  }[];
  updated_at: Date;
}

export interface GetWorkOrderParams {
  created_at?: Date;
  page: number;
  per_page: number;
  status_id?: number;
}

export interface UpdateWorkOrderManagerRequest {
  in_progress_state?: string;
  note?: string;
  operator_id: number;
  quantity_produced: number;
  status_id: number;
  work_order_id: number;
}

export interface UpdateWorkOrderOperatorRequest {
  in_progress_state?: string;
  note?: string;
  quantity_produced: number;
  status_id: number;
  // * From request params
  work_order_id: number;
}

export interface UpdateWorkOrderStatus {
  in_progress_state?: string;
  note?: string;
  quantity_produced: number;
  status_id: number;
  work_order_id: number;
}

export interface WorkOrder {
  actual_completion_date: Date | null;
  created_at: Date;
  current_status: {
    id: number;
    name: string;
  };
  due_date: Date;
  expected_quantity: number;
  id: number;
  operator: {
    id: number;
    name: string;
  };
  order_number: string;
  product_name: string;
  updated_at: Date;
}

export interface WorkOrderStatus {
  created_at: Date;
  id: number;
  name: string;
  updated_at: Date;
  uuid: string;
}
