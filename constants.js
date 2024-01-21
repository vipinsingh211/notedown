const os = require("node:os")
const path = require('node:path');

const NOTES_PATH = path.join(os.homedir(), ".notedown")
const DB_FILE = path.join(NOTES_PATH, "notedown.db");

exports.NOTES_PATH = NOTES_PATH
exports.DB_FILE = DB_FILE;
