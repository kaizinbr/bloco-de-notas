import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const categoriesSql = `
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL
    )
  `;

  await db.run(categoriesSql);
  
  const notesSql = `
    CREATE TABLE notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      image VARCHAR(50) NOT NULL
    )
  `;
  
  await db.run(notesSql);

  const foodsSql = `
  CREATE TABLE foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL,
    image VARCHAR(50) NOT NULL,
    price DOUBLE NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories (id)
  )
`;

  await db.run(foodsSql);

const usersSql = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL CHECK(LENGTH(password) >= 8)
  )
`;

  await db.run(usersSql);

}

export default { up };
