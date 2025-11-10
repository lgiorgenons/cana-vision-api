import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { routes } from '@api/routes';
import { errorHandler } from '@middlewares/error-handler.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(errorHandler);

export { app };
