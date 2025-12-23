"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEvents, useDeleteEvent } from "@/hooks/query.hooks";
import { CreateEventModal } from "@/components/createEventsModal";
import { UpdateEventModal } from "@/components/updateEventsModal";
import type { Event } from "@/types/types";

export default function EventsPage() {
  const router = useRouter();
  const { data: events = [], isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate stats
  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter(
      (e) => new Date(e.startDate) > new Date()
    ).length;
    const ongoing = events.filter(
      (e) =>
        new Date(e.startDate) <= new Date() && new Date(e.endDate) > new Date()
    ).length;
    const cancelled = events.filter((e) => e.status === "draft").length;
    return { total, upcoming, ongoing, cancelled };
  }, [events]);

  // Pagination
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return events.slice(start, start + itemsPerPage);
  }, [events, currentPage]);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setUpdateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(id);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const monthStr = d.toLocaleString("en-US", { month: "short" });
    const dayStr = d.getDate();
    const timeStr = d.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${monthStr} ${dayStr}, ${timeStr}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span className="font-inter">Event Management</span>
          <span>/</span>
          <span className="font-inter text-white">Events</span>
        </div>
      </div>

      {/* Event Overview Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-inter text-lg font-semibold text-white">
            Event Overview
          </h2>
          <div className="flex gap-2 text-xs font-inter">
            <button className="px-3 py-1.5 rounded bg-[#1a1f2e] text-gray-400 hover:text-white transition-colors">
              1D
            </button>
            <button className="px-3 py-1.5 rounded bg-[#1a1f2e] text-gray-400 hover:text-white transition-colors">
              7D
            </button>
            <button className="px-3 py-1.5 rounded bg-[#1a1f2e] text-gray-400 hover:text-white transition-colors">
              1M
            </button>
            <button className="px-3 py-1.5 rounded bg-[#1a1f2e] text-gray-400 hover:text-white transition-colors">
              3M
            </button>
            <button className="px-3 py-1.5 rounded bg-[#1a1f2e] text-gray-400 hover:text-white transition-colors">
              Custom
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg bg-[#1a1f2e] p-5 border border-[#252b3b]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-500 text-sm">📅</span>
              </div>
              <p className="font-inter text-sm text-gray-400">Total events</p>
            </div>
            <h3 className="font-inter text-2xl md:text-3xl font-bold text-white mb-2">
              {stats.total.toLocaleString()}
            </h3>
            <p className="font-inter text-xs text-green-400">
              ↑ 10% From last week
            </p>
          </div>

          <div className="rounded-lg bg-[#1a1f2e] p-5 border border-[#252b3b]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-500 text-sm">🔵</span>
              </div>
              <p className="font-inter text-sm text-gray-400">
                Upcoming events
              </p>
            </div>
            <h3 className="font-inter text-2xl md:text-3xl font-bold text-white mb-2">
              {stats.upcoming}
            </h3>
            <p className="font-inter text-xs text-green-400">
              ↑ 12% From last week
            </p>
          </div>

          <div className="rounded-lg bg-[#1a1f2e] p-5 border border-[#252b3b]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-sm">🟢</span>
              </div>
              <p className="font-inter text-sm text-gray-400">Ongoing events</p>
            </div>
            <h3 className="font-inter text-2xl md:text-3xl font-bold text-white mb-2">
              {stats.ongoing}
            </h3>
            <p className="font-inter text-xs text-red-400">
              ↓ 12% From last week
            </p>
          </div>

          <div className="rounded-lg bg-[#1a1f2e] p-5 border border-[#252b3b]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-500 text-sm">🔴</span>
              </div>
              <p className="font-inter text-sm text-gray-400">
                Cancelled events
              </p>
            </div>
            <h3 className="font-inter text-2xl md:text-3xl font-bold text-white mb-2">
              {stats.cancelled}
            </h3>
            <p className="font-inter text-xs text-green-400">
              ↑ 5% From last week
            </p>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-[#252b3b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-inter text-base font-semibold text-white">
            Events ({events.length.toLocaleString()})
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search by event location"
                className="w-full sm:w-64 px-4 py-2 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="px-4 py-2 bg-[#0a0e1a] border border-[#252b3b] text-gray-300 font-inter text-sm rounded-lg hover:bg-[#13182a] transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-[#0a0e1a] border border-[#252b3b] text-gray-300 font-inter text-sm rounded-lg hover:bg-[#13182a] transition-colors">
              ↓
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-inter text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              + Create Event
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No events found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#252b3b] bg-[#13182a]">
                    <th className="px-4 md:px-6 py-3 text-left font-inter text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left font-inter text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left font-inter text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left font-inter text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Tickets Sold
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left font-inter text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right font-inter text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event: Event) => (
                    <tr
                      key={event.id}
                      className="border-b border-[#252b3b] hover:bg-[#13182a] transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <button
                          onClick={() => router.push(`/events/${event.id}`)}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {event.title.charAt(0)}
                            </span>
                          </div>
                          <span className="font-inter text-sm text-white group-hover:text-blue-400 transition-colors truncate max-w-50">
                            {event.title}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 md:px-6 py-4 font-inter text-sm text-gray-300 whitespace-nowrap">
                        {formatDate(event.startDate)}
                      </td>
                      <td className="px-4 md:px-6 py-4 font-inter text-sm text-gray-300">
                        {event.location}
                      </td>
                      <td className="px-4 md:px-6 py-4 font-inter text-sm text-gray-300 hidden sm:table-cell">
                        0
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-inter text-xs font-medium ${
                            event.status === "published"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              event.status === "published"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          ></span>
                          {event.status || "Cancelled"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="relative group inline-block">
                          <button className="text-gray-400 hover:text-gray-200 p-1">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <circle cx="8" cy="3" r="1.5" />
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                            </svg>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] border border-[#252b3b] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() => handleEdit(event)}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252b3b] hover:text-white font-inter rounded-t-lg"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => router.push(`/events/${event.id}`)}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252b3b] hover:text-white font-inter"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#252b3b] font-inter rounded-b-lg"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 border-t border-[#252b3b] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-inter text-sm text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, events.length)} of{" "}
                {events.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-[#0a0e1a] border border-[#252b3b] text-gray-400 rounded hover:bg-[#13182a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded font-inter text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-[#0a0e1a] border border-[#252b3b] text-gray-400 hover:bg-[#13182a]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-[#0a0e1a] border border-[#252b3b] text-gray-400 rounded hover:bg-[#13182a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateEventModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <UpdateEventModal
        open={updateModalOpen}
        event={selectedEvent}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
