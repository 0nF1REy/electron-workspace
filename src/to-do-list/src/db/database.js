import { app } from "electron";
import path from "node:path";
import Database from "better-sqlite3";

class AppDatabase {
  constructor() {
    const dbPath = path.join(app.getPath("userData"), "to-do-list.sqlite");
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    console.log("Banco salvo em:", dbPath);
  }

  setUpDataBase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
    `);

    console.log("db inicializado!");
  }
}

export default AppDatabase;
