import sqlite3 from 'sqlite3';

sqlite3.verbose();

export class SqliteService {
	#db_file = process.env.DB_PATH;
	#db;

	constructor() {
		this.#db = new sqlite3.Database(String(this.#db_file));
	}

	createTable = (query) => {
		this.#db.serialize(() => {
			this.#db.run(query, (error) => {
				if (error) throw error;
				console.log('Created the table successfully.');
			});
		});
	}

	executeQuery = (query, values=[]) => {
		return new Promise((resolve, reject) => {
			this.#db.run(query, values, (error) => {
				if (error) return reject(error);
				return resolve(true);
			});
		});
	}

	readQuery = (query, values = []) => {
		return new Promise((resolve, reject) => {
			this.#db.all(query, values, (error, rows) => {
				if (error) return reject(error);
				return resolve(rows);
			});
		});
	}

    close = () => {
        this.#db.close();
    }
}