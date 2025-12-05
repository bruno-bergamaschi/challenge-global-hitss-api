import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import { dbConnectionMiddleware } from './middleware/dbConnections.js';

const app = express();

app.use(express.json());
app.use(dbConnectionMiddleware);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (_, res) => {
  res.send('API funcionando');
});

app.use(routes);

app.use((err, _, res, __) => {
  const status = err?.httpStatusCode ?? 500;

  res.status(status).json({
    message: err.message ?? 'Internal Server Error',
    code: err.businessStatusCode ?? '500-internal_error',
    ...(err.details && { details: err.details }),
  });
});

export default app;
