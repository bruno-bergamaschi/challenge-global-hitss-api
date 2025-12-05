import { truncateAllTables } from './helpers/database.helper.js';
import { closeConnections } from '../src/database/connection.js';

export const commonTestHooks = () => {
  afterAll(async () => {
    await truncateAllTables();
    await closeConnections();
  });
};
