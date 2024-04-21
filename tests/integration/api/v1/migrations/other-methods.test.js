import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function getMigrationsResponse(method) {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method,
  });
  return response;
}

test("Other HTTP methods to api/v1/migrations shouldn't let opened connections in database", async () => {
  let methods = ["DELETE", "PUT", "HEAD", "OPTIONS", "PATCH"];
  for (let method of methods) {
    await cleanDatabase();
    const migrationsResponse = await getMigrationsResponse(method);
    expect(migrationsResponse.status).toBe(405);
  }
});
