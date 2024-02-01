const { contextBridge } = require("electron")
const { storeNote, listNotes, getNote, editTitle, deleteNote } = require("./models/note")

contextBridge.exposeInMainWorld('api', {
    storeNote: storeNote,
    listNotes: listNotes,
    getNote: getNote,
    editTitle: editTitle,
    deleteNote: deleteNote,
})
