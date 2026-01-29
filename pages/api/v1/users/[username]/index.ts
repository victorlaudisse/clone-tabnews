import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import controller from "@/infra/controller";
import user from "@/models/user/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const username = request.query.username as string;
  const userFound = await user.findOneByUsername(username);
  return response.status(200).json(userFound);
}
