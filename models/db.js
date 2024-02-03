const sqlite = require("better-sqlite3")
const { DB_FILE } = require("../constants")

const db = sqlite(DB_FILE, { fileMustExist: true, })

function enableForeignKeys(params) {
    return db.prepare(`PRAGMA foreign_keys=ON`)
}

function createMetadataTable() {
    const statement = `
    CREATE TABLE IF NOT EXISTS metadata(
        note_id TEXT PRIMARY KEY,
        title TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    )
    `
    return db.prepare(statement)
}

function createNotesTable() {
    const statement = `
    CREATE TABLE IF NOT EXISTS note(
        note TEXT,
        note_id TEXT NOT NULL UNIQUE,
        FOREIGN KEY (note_id) 
            REFERENCES metadata (note_id) 
                ON DELETE CASCADE 
                ON UPDATE NO ACTION
    )
    `
    return db.prepare(statement)
}

function setupTables() {
    enableForeignKeys().run()

    const runTransactions = db.transaction(() => {
        createMetadataTable().run()
        createNotesTable().run()
    })
    runTransactions()
}

exports.db = db
exports.setupTables = setupTables