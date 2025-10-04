import { createRouter } from "next-connect";
import { runner as migrationRunner, RunnerOption } from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { NextApiRequest, NextApiResponse } from "next";
import controller from "@/infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

function getMigrationOptions(dbClient, dryRun) {
  const options: RunnerOption = {
    dbClient: dbClient,
    dryRun: !dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  return options;
}

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const liveRun = false;
    const options = getMigrationOptions(dbClient, liveRun);
    const migrations = await migrationRunner(options);
    const status = liveRun && migrations.length > 0 ? 201 : 200;
    return response.status(status).json(migrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const liveRun = true;
    const options = getMigrationOptions(dbClient, liveRun);
    const migrations = await migrationRunner(options);
    const status = liveRun && migrations.length > 0 ? 201 : 200;
    return response.status(status).json(migrations);
  } finally {
    await dbClient.end();
  }
}
