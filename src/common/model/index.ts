import { Request } from "express";

export interface DecodedToken {
  email: string;
  id: number;
  name: string;
  permissions: string[];
}

export interface Meta {
  message: string;
}
export interface MetaPagination extends Meta, Pagination {}
export interface Pageable<TData> {
  data: TData;
  pagination: Pagination;
}
export interface Pagination {
  page: number;
  per_page: number;
  total_data: number;
  total_page: number;
}
export interface Response<TData, TMeta> {
  data: TData;
  meta: TMeta;
}

export interface UserRequest extends Request {
  user: DecodedToken;
}
