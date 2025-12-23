import { NextRequest, NextResponse } from "next/server";
import { updateEventSchema } from "@/validations/events.validations";
import { eventsTableService } from "@/services/events.services";
import type { ApiResponse, Event } from "@/types/types";

type RouteParams = {
    params: { id: string };
};

export async function GET(
    _req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<Event | null>>> {
    try {
        const { id } = await params;
        const event = await eventsTableService.getById(id);

        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: event as Event });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to fetch event";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<Event>>> {
    try {
        const body = await req.json();
        const validated = updateEventSchema.parse(body);

        const { id } = await params;

        const event = await eventsTableService.update(id, validated);

        if (!event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: event as Event });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update event";
        return NextResponse.json(
            { success: false, error: message },
            { status: 400 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
    try {

        const { id } = await params;

        await eventsTableService.remove(id);
        return NextResponse.json({ success: true, data: null });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete event";
        return NextResponse.json(
            { success: false, error: message },
            { status: 400 }
        );
    }
}