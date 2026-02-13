import bcrypt from "bcryptjs";

async function hash(password: string) {
  const rounds = getNumberOfRounds();
  const peper = getPasswordPeper();
  return await bcrypt.hash(password + peper, rounds);
}

async function compare(providedPassword: string, storedPassword: string) {
  const peper = getPasswordPeper();
  return await bcrypt.compare(providedPassword + peper, storedPassword);
}

function getNumberOfRounds() {
  const rounds = process.env.NODE_ENV === "production" ? 14 : 1;
  return rounds;
}

function getPasswordPeper() {
  return process.env.PASSWORD_PEPER;
}

const password = { hash, compare };

export default password;
