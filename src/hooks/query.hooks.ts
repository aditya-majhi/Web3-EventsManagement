import { useQuery, useMutation, useQueryClient } from "react-query";
import { eventsApi } from "@/api/events.api";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/types";

export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: () => eventsApi.getAll(),
    });
}

export function useEventById(id: string) {
    return useQuery({
        queryKey: ["event", id],
        queryFn: () => eventsApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateEventInput) =>
            eventsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

export function useUpdateEvent(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateEventInput) => eventsApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["event", id] });
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => eventsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}