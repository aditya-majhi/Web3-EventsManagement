import { db } from "@/db/index";
import { eventsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/types";

export async function createEvent(input: CreateEventInput): Promise<Event> {
    const result = await db
        .insert(eventsTable)
        .values({
            title: input.title,
            description: input.description,
            startDate: input.startDate,
            endDate: input.endDate,
            location: input.location,
            coverImage: input.coverImage || null,
            status: input.status,
            isFeatured: input.isFeatured,
        })
        .returning();

    if (!result[0]) {
        throw new Error("Failed to create event");
    }

    return mapRowToEvent(result[0]);
}

export async function getEventById(id: string): Promise<Event | null> {
    const result = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, id));

    return result[0] ? mapRowToEvent(result[0]) : null;
}

export async function getAllEvents(): Promise<Event[]> {
    const results = await db
        .select()
        .from(eventsTable)
        .orderBy(desc(eventsTable.createdAt));

    return results.map(mapRowToEvent);
}

export async function updateEvent(
    id: string,
    input: UpdateEventInput
): Promise<Event> {
    const result = await db
        .update(eventsTable)
        .set({
            ...input,
            updatedAt: new Date(),
        })
        .where(eq(eventsTable.id, id))
        .returning();

    if (!result[0]) {
        throw new Error("Event not found");
    }

    return mapRowToEvent(result[0]);
}

export async function deleteEvent(id: string): Promise<void> {
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
}

function mapRowToEvent(row: typeof eventsTable.$inferSelect): Event {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        startDate: row.startDate,
        endDate: row.endDate,
        location: row.location,
        coverImage: row.coverImage,
        status: row.status as "draft" | "published",
        isFeatured: row.isFeatured,
        nftMintAddress: row.nftMintAddress,
        nftTxSignature: row.nftTxSignature,
        nftNetwork: row.nftNetwork,
        nftMintedAt: row.nftMintedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}