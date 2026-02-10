import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import controller from "@/infra/controller";
import user from "@/models/user/user";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);
  return response.status(201).json(newUser);
}
