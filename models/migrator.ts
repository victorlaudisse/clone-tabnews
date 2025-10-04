import database from "@/infra/database";
import { runner as migrationRunner, RunnerOption } from "node-pg-migrate";
import { resolve } from "node:path";
import { Client } from "pg";

function getMigrationOptions({
  dbClient,
  dryRun,
}: {
  dbClient: Client;
  dryRun: boolean;
}) {
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

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationOptions = getMigrationOptions({ dbClient, dryRun: false });
    const pendingMigrations = await migrationRunner(migrationOptions);
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationOptions = getMigrationOptions({
      dbClient,
      dryRun: true,
    });
    const migrations = await migrationRunner(migrationOptions);
    return migrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
