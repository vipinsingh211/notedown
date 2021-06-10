const sqlite3 = require('sqlite3').verbose();
const _dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

class LocalStorageService {
    #db_file = process.env.DB_PATH;
    #table_name = 'note';
    #db;

    constructor() {
        this.#db = new sqlite3.Database(this.#db_file);
    }

    createTable() {
        this.#db.run(`CREATE TABLE IF NOT EXISTS ${this.#table_name} (id TEXT NOT NULL, ` +
            `created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, title TEXT, note TEXT)`,
            (error) => {
                this.#db.close();
                if (error) throw error;
            });
    }

    insertNote(title, note) {
        const current_time = new Date().getTime();
        
        return new Promise((resolve, reject) => {
            this.#db.run(`INSERT INTO ${this.#table_name} VALUES (?, ?, ?, ?, ?)`, [
                uuidv4(),
                current_time,
                current_time,
                title,
                note
            ], (error) => {
                this.#db.close();
                if (error) return reject(error);
                return resolve(true);
            })
        });
    }

    notesList() {
        return new Promise((resolve, reject) => {
            this.#db.all(`SELECT id, created_at, updated_at, title FROM ${this.#table_name}`,
            (error, rows) => {
                this.#db.close();
                if (error) return reject(error);
                return resolve(rows);
            });
        });
    }
}

exports.LocalStorageService = LocalStorageService;