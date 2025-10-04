import { NextApiRequest, NextApiResponse } from "next";
import { InternalServerError, MethodNotAllowedError } from "./errors";

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
