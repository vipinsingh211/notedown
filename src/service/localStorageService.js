const { v4: uuidv4 } = require('uuid');
const l = require('lodash');
const { DBService } = require('./dbService');

class LocalStorageService extends DBService {
	#table_name = 'note';
	#note_table_fields = [
		'id TEXT NOT NULL',
		'created_at INTEGER NOT NULL',
		'updated_at INTEGER NOT NULL',
		'title TEXT',
		'note TEXT',
		'is_deleted INTEGER DEFAULT 0',
		'changelog INTEGER DEFAULT 0',
	];

	constructor() {
		super();
	}

	intiDB() {
		const values = {
			table: this.#table_name,
			fields: this.#note_table_fields.join(', '),
		};
		const query = l.template(
			'CREATE TABLE IF NOT EXISTS ${table} (${fields})'
		)(values);
		this.createTable(query);
	}

	insertNote(title, note) {
		const current_time = new Date().getTime();
		const query = `INSERT INTO ${
			this.#table_name
		} VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			uuidv4(),
			current_time,
			current_time,
			title,
			note,
			0,
			0,
		];
		return this.executeQuery(query, values);
	}

	notesList() {
		const query = `SELECT id, created_at, updated_at, title FROM ${
			this.#table_name
		}`;
		return this.readQuery(query);
	}

	noteById(id) {
		const query = `SELECT * FROM ${this.#table_name} WHERE id=? LIMIT 1`;
		const values = [id];
		return this.readQuery(query);
	}

	updateNote(id, title, note) {
		const current_time = new Date().getTime();
		const query = `UPDATE ${
			this.#table_name
		} SET updated_at=?, title=?, note=? WHERE id=?`;
		const values = [current_time, title, note, id];
		return this.executeQuery(query, values);
	}

	deleteNote(id) {
		const current_time = new Date().getTime();
		const query = `UPDATE ${
			this.#table_name
		} SET updated_at=?, is_deleted=? WHERE id=?`;
		const values = [current_time, 1, id];
		return this.executeQuery(query, values);
	}
}

exports.LocalStorageService = LocalStorageService;
