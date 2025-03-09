import { DB } from "#/common/config/database/connection.js";
import { Users, usersTable } from "#/common/config/database/schema.js";
import { eq } from "drizzle-orm";

export class UserRepository {
  private readonly DB: DB;

  constructor(DB: DB) {
    this.DB = DB;
  }

  async getUserByRoleId(roleId: number): Promise<Pick<Users, "email" | "id" | "name" | "uuid">[]> {
    const result = await this.DB.select({
      email: usersTable.email,
      id: usersTable.id,
      name: usersTable.name,
      uuid: usersTable.uuid,
    })
      .from(usersTable)
      .where(eq(usersTable.roleId, roleId));
    return result;
  }
}
