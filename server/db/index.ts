import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const runtimeConfig = useRuntimeConfig();

// Создаем пул соединений с базой данных
const poolConnection = mysql.createPool({
  uri: runtimeConfig.databaseUrl,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
