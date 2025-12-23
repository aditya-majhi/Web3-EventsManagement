import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const eventsTableService = {
    async getAll() {
        return await db.select().from(eventsTable).orderBy(eventsTable.startDate);
    },

    async getById(id: string) {
        const result = await db
            .select()
            .from(eventsTable)
            .where(eq(eventsTable.id, id));

        return result[0] ?? null;
    },

    async create(data: typeof eventsTable.$inferInsert) {
        console.log({ data });

        const result = await db
            .insert(eventsTable)
            .values(data)
            .returning();

        return result[0];
    },

    async update(id: string, data: Partial<typeof eventsTable.$inferInsert>) {
        const result = await db
            .update(eventsTable)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(eventsTable.id, id))
            .returning();

        return result[0];
    },

    async remove(id: string) {
        await db.delete(eventsTable).where(eq(eventsTable.id, id));
    },
};
