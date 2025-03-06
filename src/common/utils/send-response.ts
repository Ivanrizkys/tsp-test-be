import { Meta, Response } from "#/common/model/index.js";
import { Response as ExpressResponse } from "express";

/**
 * Sends a successful response with data and metadata
 *
 * @param res - Express response object
 * @param data - Data payload to be sent in the response
 * @param meta - Metadata to be included in the response
 * @returns Express response object with 200 status code and JSON payload
 * @typeParam TData - Type of the data payload
 * @typeParam TMeta - Type of the metadata
 */
export const sendResponseSuccess = <TData, TMeta = Meta>(res: ExpressResponse, statusCode: number, data: TData, meta: TMeta) => {
  const response: Response<TData, TMeta> = {
    data,
    meta,
  };

  return res.status(statusCode).json(response);
};

/**
 * Sends a failure response with an error message
 *
 * @param res - Express response object
 * @param statusCode - HTTP status code for the error response
 * @param message - Error message to be included in the response metadata
 * @returns Express response object with the specified status code and error message
 */
export const sendResponseFailure = (res: ExpressResponse, statusCode: number, message: string) => {
  const response: Response<null, Meta> = {
    data: null,
    meta: {
      message,
    },
  };
  return res.status(statusCode).json(response);
};
