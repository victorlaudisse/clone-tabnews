import { NextApiRequest, NextApiResponse } from "next";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "./errors";

function onNoMatchErrorHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(
  error: any,
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (error instanceof ValidationError) {
    response.status(error.statusCode).json(error);
  }
  const publicErrorObject = new InternalServerError({
    cause: error.cause,
    statusCode: error.statusCode,
  });
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchErrorHandler,
    onError: onErrorHandler,
  },
};

export default controller;
