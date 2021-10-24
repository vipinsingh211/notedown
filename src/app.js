import express from 'express'
import compression from 'compression'
import helmet from 'helmet'

import { local_storage_router } from './route/localStorageRoute';

export const app = express();
app.use(compression());
app.use(helmet());
app.use(express.json());

app.use('/local_storage', local_storage_router);
