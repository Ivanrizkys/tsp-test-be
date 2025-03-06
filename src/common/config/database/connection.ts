import { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

const db = drizzle(process.env.DATABASE_URL!);

export type DB = typeof db;
export type DBTransaction = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>;
export default db;
