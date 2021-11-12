import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash/';
import { createTable, executeQuery, readQuery, close } from './sqliteService';

const TABLE_NAME = 'note';

export const intiDB = () => {
	const note_table_fields = [
		'id TEXT NOT NULL',
		'created_at INTEGER NOT NULL',
		'updated_at INTEGER NOT NULL',
		'title TEXT',
		'note TEXT',
		'is_deleted INTEGER DEFAULT 0',
		'changelog INTEGER DEFAULT 0',
	];

	const values = {
		table: TABLE_NAME,
		fields: note_table_fields.join(', '),
	};
	const query = _.template('CREATE TABLE IF NOT EXISTS ${table} (${fields})')(
		values
	);
	createTable(query);
};

export const insertNote = (title, note) => {
	const current_time = new Date().getTime();
	const query = `INSERT INTO ${TABLE_NAME} VALUES (?, ?, ?, ?, ?, ?, ?)`;
	const values = [uuidv4(), current_time, current_time, title, note, 0, 0];
	return executeQuery(query, values);
};

export const notesList = () => {
	const query = `SELECT id, created_at, updated_at, title FROM ${TABLE_NAME}`;
	return readQuery(query);
};

export const noteById = (id) => {
	const query = `SELECT * FROM ${TABLE_NAME} WHERE id=? LIMIT 1`;
	const values = [id];
	return readQuery(query, values);
};

export const updateNoteById = (id, title, note) => {
	const current_time = new Date().getTime();
	const query = `UPDATE ${TABLE_NAME} SET updated_at=?, title=?, note=? WHERE id=?`;
	const values = [current_time, title, note, id];
	return executeQuery(query, values);
};

export const deleteNoteById = (id) => {
	const current_time = new Date().getTime();
	const query = `UPDATE ${TABLE_NAME} SET updated_at=?, is_deleted=? WHERE id=? LIMIT 1`;
	const values = [current_time, 1, id];
	return executeQuery(query, values);
};

export const closeDB = () => {
	console.log('closing DB');
	close();
};
