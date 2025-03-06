import db, { DB } from "#/common/config/database/connection.js";
import { InsertUsers, UserRoles, userRolesTable, Users, usersTable } from "#/common/config/database/schema.js";
import { takeUniqueOrThrow } from "#/common/utils/index.js";
import { eq } from "drizzle-orm";

export class AuthRepository {
  private readonly DB: DB;

  constructor(DB: DB = db) {
    this.DB = DB;
  }

  async countUserByEmail(email: string): Promise<number> {
    const result = await this.DB.$count(usersTable, eq(usersTable.email, email));
    return result;
  }
  async createUser(user: InsertUsers): Promise<Users> {
    const result = await this.DB.insert(usersTable).values(user).returning();
    return takeUniqueOrThrow("Created user")(result)!;
  }
  async getUserByEmail(email: string): Promise<null | Users> {
    const result = await this.DB.select().from(usersTable).where(eq(usersTable.email, email));
    return takeUniqueOrThrow("Get user by email")(result);
  }
  async getUserRoleById(id: number): Promise<null | UserRoles> {
    const result = await this.DB.select().from(userRolesTable).where(eq(userRolesTable.id, id));
    return takeUniqueOrThrow("Get user role by id")(result);
  }
}
