export type EventStatus = "draft" | "published";

export type Event = {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    coverImage: string | null;
    status: EventStatus;
    isFeatured: boolean;
    nftMintAddress: string | null;
    nftTxSignature: string | null;
    nftNetwork: string | null;
    nftMintedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateEventInput = {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    coverImage?: string;
    status: EventStatus;
    isFeatured: boolean;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};