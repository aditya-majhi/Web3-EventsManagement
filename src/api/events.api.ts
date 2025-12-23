import { axiosInstance } from "@/lib/axiosInstance";
import type { Event, CreateEventInput, UpdateEventInput, ApiResponse } from "@/types/types";

const API_BASE = "/api/events";

export const eventsApi = {
    async getAll(): Promise<Event[]> {
        try {
            const response = await axiosInstance.get<ApiResponse<Event[]>>(API_BASE);
            return response.data.data || [];
        } catch (error) {
            throw new Error("Failed to fetch events");
        }
    },

    async getById(id: string): Promise<Event> {
        try {
            const response = await axiosInstance.get<ApiResponse<Event>>(
                `${API_BASE}/${id}`
            );
            if (!response.data.data) throw new Error("Event not found");
            return response.data.data;
        } catch (error) {
            throw new Error("Failed to fetch event");
        }
    },

    async create(payload: CreateEventInput): Promise<Event> {
        try {
            const response = await axiosInstance.post<ApiResponse<Event>>(
                API_BASE,
                payload
            );
            if (!response.data.data) throw new Error("No data returned");
            return response.data.data;
        } catch (error) {
            console.log({ error });
            throw new Error("Failed to create event");
        }
    },

    async update(id: string, payload: UpdateEventInput): Promise<Event> {
        try {
            const response = await axiosInstance.put<ApiResponse<Event>>(
                `${API_BASE}/${id}`,
                payload
            );
            if (!response.data.data) throw new Error("No data returned");
            return response.data.data;
        } catch (error) {
            throw new Error("Failed to update event");
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await axiosInstance.delete(`${API_BASE}/${id}`);
        } catch (error) {
            throw new Error("Failed to delete event");
        }
    },
};