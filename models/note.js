const { db } = require("./db");

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

exports.storeNote = storeNote