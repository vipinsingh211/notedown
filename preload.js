const { contextBridge } = require("electron")
const { storeNote, listNotes, getNote } = require("./models/note")

contextBridge.exposeInMainWorld('api', {
    storeNote: storeNote,
    listNotes: listNotes,
    getNote: getNote,
})
