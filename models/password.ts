import bcrypt from "bcryptjs";

async function hash(password: string) {
  const rounds = getNumberOfRounds();
  return await bcrypt.hash(password, rounds);
}

async function compare(providedPassword: string, storedPassword: string) {
  return await bcrypt.compare(providedPassword, storedPassword);
}

function getNumberOfRounds() {
  const rounds = process.env.NODE_ENV === "production" ? 14 : 1;
  return rounds;
}

const password = { hash, compare };

export default password;
