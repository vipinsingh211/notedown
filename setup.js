const fs = require("node:fs")
const path = require('node:path')
const { DB_FILE, NOTES_PATH } = require("./constants")
const { setupTables } = require("./models/db")

function createNoteDir() {
    if (!fs.existsSync(NOTES_PATH)) {
        fs.mkdirSync(NOTES_PATH, { recursive: true })
        console.log(`${NOTES_PATH} has created`)
    }
};

function createDBFile() {
    createNoteDir()
    if (!fs.existsSync(DB_FILE)) {
        fs.open(DB_FILE, "w", (err, _) => {
            if (err) throw err;
            console.log("${DB_FILE} has created")
        })
    }
}

exports.createDBFile = createDBFile
exports.setupTables = setupTables
