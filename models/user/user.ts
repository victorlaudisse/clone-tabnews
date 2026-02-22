import database from "@/infra/database";
import password from "@/models/password";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@/pages/api/types/user";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { UpdateUserDto } from "./dto/update-user.dto";

async function findOneByUsername(username: string): Promise<User> {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }
    return results.rows[0] as User;
  }
}

async function create(userInputValues: CreateUserDto): Promise<User> {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues: CreateUserDto) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password)
      VALUES 
        ($1, $2, $3)
      RETURNING 
        *
      ;
    `,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return result.rows[0];
  }
}

async function update(username: string, userInputValues: UpdateUserDto) {
  const currentUser = await findOneByUsername(username);
  if (userInputValues.username) {
    await validateUniqueUsername(userInputValues.username);
  }
  if (userInputValues.email) {
    await validateUniqueEmail(userInputValues.email);
  }
  if (userInputValues.password) {
    await hashPasswordInObject(userInputValues);
  }
  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues: User): Promise<User> {
    const results = await database.query({
      text: `
        UPDATE 
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE 
          id = $1
        RETURNING
          *
      ;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function validateUniqueEmail(email: string) {
  const result = await database.query({
    text: `
        SELECT 
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });
  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O e-mail informado já está sendo utilizado.",
      action: "Utilize outro e-mail para realizar esta operação.",
    });
  }
}

async function validateUniqueUsername(username: string) {
  const result = await database.query({
    text: `
        SELECT 
          email
        FROM 
          users
        WHERE
          LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });
  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject<T extends { password?: string }>(
  object: T,
) {
  const hashedPassword = await password.hash(object.password);
  object.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
