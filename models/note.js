const { db } = require("./db");

/**
 * To store a note
 * @param {string} title The note title
 * @param {UUID} uuid The note uuid
 * @param {EpochTimeStamp} timestamp The create/update timestamp
 * @param {string} note The note text
 */
function storeNote(title, uuid, timestamp, note) {
    const upsertToMetadata = db.prepare(`
    INSERT INTO metadata(note_id, title, created_at, updated_at)
    VALUES (@uuid, @title, @timestamp, @timestamp)
    ON CONFLICT (note_id) DO UPDATE SET
    title=@title,
    updated_at=@timestamp
    `)

    const upsertToNote = db.prepare(`
    INSERT INTO note(note_id, note)
    VALUES (@uuid, @note)
    ON CONFLICT (note_id) DO UPDATE SET
    note=@note
    `)

    const runTransactions = db.transaction((value) => {
        upsertToMetadata.run(value)
        upsertToNote.run(value)
    })
    runTransactions({
        uuid: uuid,
        title: title,
        timestamp: timestamp,
        note: note,
    })
}

/**
 * To get list of notes' metadata
 * @returns {{note_id: UUID, title: string, created_at: EpochTimeStamp,  updated_at: EpochTimeStamp}[]} The list of notes metadata
 */
function listNotes() {
    return db.prepare(`SELECT * FROM metadata ORDER BY updated_at DESC`).all()
}

/**
 * To get note content
 * @param {UUID} uuid The note uuid
 * @returns {{note_id: UUID, note: string}} The note
 */
function getNote(uuid) {
    return db.prepare(`SELECT * FROM note WHERE note_id=@uuid LIMIT 1`).get({ uuid: uuid })
}

exports.storeNote = storeNote
exports.listNotes = listNotes
exports.getNote = getNote