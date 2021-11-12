import sqlite3 from 'sqlite3';

sqlite3.verbose();

const DB_FILE = process.env.DB_PATH;
const DB = new sqlite3.Database(String(DB_FILE));

export const close = () => {
	DB.close();
}

export const createTable = (query) => {
	DB.serialize(() => {
		DB.run(query, (error) => {
			if (error) throw error;
			console.log('Created the table successfully.');
		});
	});
}

export const executeQuery = (query, values=[]) => {
	return new Promise((resolve, reject) => {
		DB.run(query, values, (error) => {
			if (error) return reject(error);
			return resolve(true);
		});
	});
}

export const readQuery = (query, values = []) => {
	return new Promise((resolve, reject) => {
		DB.all(query, values, (error, rows) => {
			if (error) return reject(error);
			return resolve(rows);
		});
	});
}