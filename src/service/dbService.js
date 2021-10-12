const _dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();

class DBService {
	#db_file = process.env.DB_PATH;
	#db;

	constructor() {
		this.#db = new sqlite3.Database(this.#db_file);
	}

	createTable(query) {
		this.#db.serialize(() => {
			this.#db.run(query, (error) => {
				if (error) throw error;
			});
		});
		this.#db.close((error) => {
			if (error) throw error;
		});
	}

	executeQuery(query, values) {
		return new Promise((resolve, reject) => {
			this.#db.run(query, values, (error) => {
				this.#db.close();
				if (error) return reject(error);
				return resolve(true);
			});
		});
	}

	readQuery(query, values = []) {
		return new Promise((resolve, reject) => {
			this.#db.all(query, values, (error, rows) => {
				this.#db.close();
				if (error) return reject(error);
				return resolve(rows);
			});
		});
	}
}

exports.DBService = DBService;
