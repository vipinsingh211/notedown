const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { createDBFile, setupTables } = require('./setup')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

createDBFile()
setupTables()

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
