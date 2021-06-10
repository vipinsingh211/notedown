const app = require('./src/app');
const _dotenv = require('dotenv').config();
const { LocalStorageService } = require('./src/service/localStorageService');

const port = process.env.APP_PORT;

app.listen(port, (error) => {
    if (error) throw error;
    const local_storage = new LocalStorageService();
    local_storage.createTable();
    console.log(`"notedown" has started at port ${port}`);
});