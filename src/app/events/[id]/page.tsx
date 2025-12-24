"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteEvent, useEventById } from "@/hooks/query.hooks";
import { UpdateEventModal } from "@/components/updateEventsModal";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: event, isLoading } = useEventById(id);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const deleteEvent = useDeleteEvent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <p className="font-inter text-gray-400">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <p className="font-inter text-red-400">Event not found</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="font-inter">Event Management</span>
          <span>/</span>
          <span className="font-inter">Events</span>
          <span>/</span>
          <span className="font-inter text-white">Event Details</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] overflow-hidden">
            {event.coverImage && (
              <div className="w-full h-48 md:h-64 relative">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-2xl font-bold">
                      {event.title.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="font-inter text-xl md:text-2xl font-bold text-white">
                      {event.title}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full font-inter text-xs font-medium ${
                        event.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.status === "published"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      ></span>
                      {event.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUpdateModalOpen(true)}
                    className="p-2 bg-[#0a0e1a] border border-[#252b3b] rounded-lg hover:bg-[#13182a] transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 bg-[#0a0e1a] border border-[#252b3b] rounded-lg hover:bg-[#13182a] transition-colors"
                    onClick={() => handleDelete(event.id)}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="font-inter text-gray-300 mb-6 leading-relaxed text-sm">
                {event.description}
              </p>

              <div className="space-y-3 text-sm font-inter">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-[#0a0e1a] flex items-center justify-center shrink-0">
                    <span className="text-blue-400">📅</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">
                      Sports, Baseball
                    </p>
                    <p className="text-white">
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)} (GMT-6 Central Time)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-[#0a0e1a] flex items-center justify-center shrink-0">
                    <span className="text-blue-400">📍</span>
                  </div>
                  <div>
                    <p className="text-white">{event.location}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#252b3b]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs">Policy</p>
                  </div>
                  <p className="text-white text-sm">
                    Gastonia Ghost Peppers Policy
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs">Organizer</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-500"></div>
                    <p className="text-white text-sm">Gastonia Ghost Peppers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teams Section */}
          <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-inter text-base font-semibold text-white">
                Teams
              </h2>
              <button className="text-blue-400 text-sm font-inter hover:text-blue-300">
                See all
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#0a0e1a] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-orange-500 shrink-0"></div>
                <span className="font-inter text-sm text-white">
                  Gastonia Ghost Peppers
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#0a0e1a] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 shrink-0"></div>
                <span className="font-inter text-sm text-white">
                  Charleston Dirty Birds
                </span>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] p-6">
            <h2 className="font-inter text-base font-semibold text-white mb-4">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Fire Works (2)",
                "High Spender",
                "Music Lover",
                "Loyal",
                "VIP",
                "Sports",
                "Frequent Buyer",
                "Phone Verified",
                "Promo Code",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-[#0a0e1a] border border-[#252b3b] rounded-full font-inter text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] overflow-hidden">
            <div className="flex border-b border-[#252b3b] overflow-x-auto">
              {[
                "Ticket Collections",
                "Ticket Categories",
                "Attendee List",
                "Promotions / Discounts",
                "Seat chart",
              ].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-inter text-sm whitespace-nowrap ${
                    i === 0
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-8 text-center">
              <p className="font-inter text-gray-400 mb-2">
                No Ticket Collection Attached
              </p>
              <p className="font-inter text-sm text-gray-500 mb-4">
                Attach a ticket collection to enable publishing and sales.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white font-inter text-sm rounded-lg hover:bg-blue-700 transition-colors">
                + Attach Collection
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] p-6">
            <h3 className="font-inter text-base font-semibold text-white mb-6">
              Event Summary
            </h3>
            <div className="space-y-4">
              <div className="text-center p-5 bg-[#0a0e1a] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-400 text-lg">🎫</span>
                </div>
                <p className="font-inter text-xs text-gray-400 mb-1">
                  Total Tickets Sold
                </p>
                <p className="font-inter text-2xl font-bold text-white">
                  2,000
                </p>
              </div>
              <div className="text-center p-5 bg-[#0a0e1a] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-400 text-lg">💰</span>
                </div>
                <p className="font-inter text-xs text-gray-400 mb-1">
                  Total Revenue
                </p>
                <p className="font-inter text-2xl font-bold text-white">
                  $87,120
                </p>
              </div>
              <div className="text-center p-5 bg-[#0a0e1a] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-400 text-lg">👥</span>
                </div>
                <p className="font-inter text-xs text-gray-400 mb-1">
                  Unique Attendees
                </p>
                <p className="font-inter text-2xl font-bold text-white">
                  1,398
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="w-2 h-2 rounded-full bg-blue-500"></button>
              <button className="w-2 h-2 rounded-full bg-gray-600"></button>
              <button className="w-2 h-2 rounded-full bg-gray-600"></button>
            </div>
          </div>

          {/* NFT Details */}
          {event.nftMintAddress && (
            <div className="rounded-lg bg-[#1a1f2e] border border-[#252b3b] p-6">
              <h3 className="font-inter text-base font-semibold text-white mb-4">
                NFT Details
              </h3>
              <div className="space-y-4 text-sm font-inter">
                <div>
                  <p className="text-gray-400 mb-1 text-xs">Mint Address</p>
                  <p className="font-mono text-white break-all text-xs">
                    {event.nftMintAddress}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1 text-xs">
                    Transaction Signature
                  </p>
                  <p className="font-mono text-white break-all text-xs">
                    {event.nftTxSignature}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1 text-xs">Network</p>
                  <p className="text-white capitalize">{event.nftNetwork}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1 text-xs">Minted At</p>
                  <p className="text-white">{formatDate(event.nftMintedAt!)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      <UpdateEventModal
        event={event}
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
    </div>
  );
}
