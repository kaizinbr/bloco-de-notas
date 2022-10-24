import Database from '../database/database.js';
const c = console;


async function readAll() {
  const db = await Database.connect();

  const sql = `
    SELECT 
      *
    FROM 
      notes
  `;

  const notes = await db.all(sql);

  return notes;
}

async function readNote(id) {
  const db = await Database.connect();

  const sql = `
    SELECT 
      *
    FROM 
      notes
    WHERE
      id = ?
  `;

  const note = await db.get(sql, [id]);

  return note;
}

async function read(id) {
  const db = await Database.connect();

  const sql = `
  SELECT 
    *
  FROM 
    notes
  WHERE
    id = ?
  `;

  const note = await db.get(sql, [id]);

  return note;
}

async function create(note) {
  const db = await Database.connect();

  const { title, message, image } = note;
  c.log(title, message, image);
  const sql = `
    INSERT INTO
      notes (title, message, image)
    VALUES
      (?, ?, ?)
  `;

  const { lastID } = await db.run(sql, [title, message, image]);
  c.log('ate aqui ta dboa');

  return lastID;
}

async function update(note, id) {
  const db = await Database.connect();

  const { title, message, image } = note;

  const sql = `
    UPDATE 
      notes
    SET
      title = ?, message = ?, image = ?
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [title, message, image, id]);

  if (changes === 1) {
    return read(id);
  } else {
    return false;
  }
}

async function destroy(id) {
  const db = await Database.connect();

  const sql = `
    DELETE FROM
      notes
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [id]);

  return changes === 1;
}

export default { readAll, read, readNote, create, update, destroy };
