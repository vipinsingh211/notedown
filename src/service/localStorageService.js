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

	intiDB() {
		this.#db.serialize(() => {
			this.#db.run(
				`CREATE TABLE IF NOT EXISTS ${
					this.#table_name
				} (id TEXT NOT NULL,
                    created_at INTEGER NOT NULL,
                    updated_at INTEGER NOT NULL,
                    title TEXT,
                    note TEXT,
                    changelog INTEGER DEFAULT 0)`,
				(error) => {
					if (error) throw error;
				}
			);
		});
		this.#db.close((error) => {
			if (error) throw error;
		});
	}

	insertNote(title, note) {
		const current_time = new Date().getTime();

		return new Promise((resolve, reject) => {
			this.#db.run(
				`INSERT INTO ${this.#table_name} VALUES (?, ?, ?, ?, ?, ?)`,
				[uuidv4(), current_time, current_time, title, note, 0],
				(error) => {
					this.#db.close();
					if (error) return reject(error);
					return resolve(true);
				}
			);
		});
	}

	notesList() {
		return new Promise((resolve, reject) => {
			this.#db.all(
				`SELECT id, created_at, updated_at, title FROM ${
					this.#table_name
				}`,
				(error, rows) => {
					this.#db.close();
					if (error) return reject(error);
					return resolve(rows);
				}
			);
		});
	}

	noteById(id) {
		return new Promise((resolve, reject) => {
			this.#db.all(
				`SELECT * FROM ${this.#table_name} WHERE id=? LIMIT 1`,
				[id],
				(error, rows) => {
					this.#db.close();
					if (error) return reject(error);
					return resolve(rows);
				}
			);
		});
	}

	updateNote(id, title, note) {
		const current_time = new Date().getTime();

		return new Promise((resolve, reject) => {
			this.#db.run(
				`UPDATE ${
					this.#table_name
				} SET updated_at=?, title=?, note=? WHERE id=?`,
				[current_time, title, note, id],
				(error) => {
					if (error) return reject(error);
					return resolve(true);
				}
			);
		});
	}
}

exports.LocalStorageService = LocalStorageService;
