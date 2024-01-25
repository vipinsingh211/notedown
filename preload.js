const { contextBridge } = require("electron")
const { storeNote } = require("./models/note")

contextBridge.exposeInMainWorld('api', {
    storeNote: storeNote
})
