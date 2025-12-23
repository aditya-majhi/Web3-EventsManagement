import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    location: text("location").notNull(),
    coverImage: text("cover_image"),
    status: text("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),

    // Web3 NFT fields
    nftMintAddress: text("nft_mint_address"),
    nftTxSignature: text("nft_tx_signature"),
    nftNetwork: text("nft_network").default("devnet"),
    nftMintedAt: timestamp("nft_minted_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type EventRow = typeof eventsTable.$inferSelect;
export type EventInsert = typeof eventsTable.$inferInsert;