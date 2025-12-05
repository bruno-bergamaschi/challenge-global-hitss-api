import { pools } from '../database/connection.js';

export const dbConnectionMiddleware = (req, res, next) => {
  req.dbConnection = {
    write: pools.write,
    read: pools.read,
  };

  next();
};
