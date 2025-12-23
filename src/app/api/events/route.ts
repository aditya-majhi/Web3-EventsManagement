import { NextRequest, NextResponse } from "next/server";
import { createEventSchema } from "@/validations/events.validations";
import { eventsTableService } from "@/services/events.services";
import type { ApiResponse, Event } from "@/types/types";

export async function GET(): Promise<NextResponse<ApiResponse<Event[]>>> {
    try {
        const events = await eventsTableService.getAll();
        return NextResponse.json({ success: true, data: events as Array<Event> });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to fetch events";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest
): Promise<NextResponse<ApiResponse<Event>>> {
    try {
        const body = await req.json();
        const validated = createEventSchema.parse(body);

        const event = await eventsTableService.create(validated);


        if (!event) {
            return NextResponse.json(
                { success: false, error: "Failed to create event" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, data: event as Event },
            { status: 201 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create event";
        return NextResponse.json(
            { success: false, error: message },
            { status: 400 }
        );
    }
}