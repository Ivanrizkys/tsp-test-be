import { Meta, Response } from "#/common/model/index.ts";
import { Response as ExpressResponse } from "express";
import { StatusCodes } from "http-status-codes";

export const sendResponseSuccess = <TData, TMeta = Meta>(res: ExpressResponse, data: TData, meta: TMeta) => {
  const response: Response<TData, TMeta> = {
    data,
    meta,
  };

  return res.status(200).json(response);
};

export const sendResponseFailure = (res: ExpressResponse, statusCode: StatusCodes, message: string) => {
  const response: Response<null, Meta> = {
    data: null,
    meta: {
      message,
    },
  };
  return res.status(statusCode).json(response);
};
