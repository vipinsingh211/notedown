import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash/';
import { SqliteService } from './sqliteService';

export class LocalStorageService extends SqliteService {
	#TABLE_NAME = 'note';
	#note_table_fields = [
		'id TEXT NOT NULL',
		'created_at INTEGER NOT NULL',
		'updated_at INTEGER NOT NULL',
		'title TEXT',
		'note TEXT',
		'is_deleted INTEGER DEFAULT 0',
		'changelog INTEGER DEFAULT 0',
	];

	intiDB() {
		const values = {
			table: this.#TABLE_NAME,
			fields: this.#note_table_fields.join(', '),
		};
		const query = _.template(
			'CREATE TABLE IF NOT EXISTS ${table} (${fields})'
		)(values);
		this.createTable(query);
	}

	insertNote(title, note) {
		const current_time = new Date().getTime();
		const query = `INSERT INTO ${
			this.#TABLE_NAME
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
			this.#TABLE_NAME
		}`;
		return this.readQuery(query);
	}

	noteById(id) {
		const query = `SELECT * FROM ${this.#TABLE_NAME} WHERE id=? LIMIT 1`;
		const values = [id];
		return this.readQuery(query, values);
	}

	updateNote(id, title, note) {
		const current_time = new Date().getTime();
		const query = `UPDATE ${
			this.#TABLE_NAME
		} SET updated_at=?, title=?, note=? WHERE id=?`;
		const values = [current_time, title, note, id];
		return this.executeQuery(query, values);
	}

	deleteNote(id) {
		const current_time = new Date().getTime();
		const query = `UPDATE ${
			this.#TABLE_NAME
		} SET updated_at=?, is_deleted=? WHERE id=?`;
		const values = [current_time, 1, id];
		return this.executeQuery(query, values);
	}

	closeDB() {
		console.log('closing DB');
		this.close();
	}
}
