import path from 'path';
import { fileURLToPath } from 'url';
import Knex from 'knex';
import knexfile from '../../knexfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const env = process.env.NODE_ENV || 'development';
  const baseConfig = knexfile[env] ?? knexfile;

  const knex = Knex({
    ...baseConfig,
    seeds: {
      directory: path.resolve(__dirname, './', 'basic-seeds'),
    },
  });

  try {
    console.log('Starting basic seeds...');
    await knex.seed.run();
    console.log('Finished basic seeds...');
  } catch (err) {
    console.error('Failed running basic seeds:', err);
    process.exitCode = 1;
  } finally {
    await knex.destroy();
  }
}

run();
