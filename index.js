import { app } from './src/app'
import * as _dotenv from 'dotenv'
import { LocalStorageService } from './src/service/localStorageService'

_dotenv.config();

const port = process.env.APP_PORT;
const local_storage = new LocalStorageService();

const closeServer = (server) => {
    local_storage.closeDB();
    server.close((err) => {
        console.log('server closed');
        let exit_code = 0;
        if (err) exit_code = 1;
        process.exit(exit_code);
    });
}

const server = app.listen(port, (error) => {
    if (error) throw error;
    local_storage.intiDB();
    console.log(`"notedown" has started at port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    console.log('closing server');
    closeServer(server);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received.');
    console.log('closing server');
    closeServer(server);
})