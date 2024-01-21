const sqlite = require("better-sqlite3")
const { DB_FILE } = require("../constants")

const db = sqlite(DB_FILE, { fileMustExist: true, })

function enableForeignKeys(params) {
    return db.prepare(`PRAGMA foreign_keys=ON`)
}

function createMetadataTable() {
    const statement = `
    CREATE TABLE IF NOT EXISTS metadata(
        metadata_id INTEGER PRIMARY KEY,
        title TEXT,
        create_at INTEGER NOT NULL
    )
    `
    return db.prepare(statement)
}

function createNotesTable() {
    const statement = `
    CREATE TABLE IF NOT EXISTS note(
        note_id INTEGER PRIMARY KEY,
        note TEXT,
        metadata_id INTEGER NOT NULL,
        FOREIGN KEY (metadata_id) 
            REFERENCES metadata (metadata_id) 
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