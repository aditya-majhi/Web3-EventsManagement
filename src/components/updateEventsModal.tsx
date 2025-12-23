"use client";

import React, { useState, useEffect } from "react";
import { useUpdateEvent } from "@/hooks/query.hooks";
import type { Event, UpdateEventInput } from "@/types/types";

interface UpdateEventModalProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
}

export function UpdateEventModal({
  open,
  event,
  onClose,
}: UpdateEventModalProps) {
  const [formData, setFormData] = useState<UpdateEventInput>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    status: event?.status,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateEvent = useUpdateEvent(event?.id || "");

  useEffect(() => {
    if (event && open) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        location: event.location,
      });
      setErrors({});
    }
  }, [event, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !event) return;

    try {
      await updateEvent.mutateAsync(formData);
      onClose();
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-[#252b3b] bg-[#1a1f2e] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1a1f2e] border-b border-[#252b3b] px-6 py-4 flex items-center justify-between">
          <h2 className="font-inter text-xl font-semibold text-white">
            Update Event
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block font-inter text-sm font-medium text-gray-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1.5 font-inter text-xs text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-inter text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Enter event description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="mt-1.5 font-inter text-xs text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="block font-inter text-sm font-medium text-gray-300 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={
                formData.startDate instanceof Date
                  ? formData.startDate.toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startDate: new Date(e.target.value),
                })
              }
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="mt-1.5 font-inter text-xs text-red-400">
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block font-inter text-sm font-medium text-gray-300 mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={
                formData.endDate instanceof Date
                  ? formData.endDate.toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setFormData({ ...formData, endDate: new Date(e.target.value) })
              }
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.endDate && (
              <p className="mt-1.5 font-inter text-xs text-red-400">
                {errors.endDate}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-inter text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              placeholder="Enter event location"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="mt-1.5 font-inter text-xs text-red-400">
                {errors.location}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block font-inter text-sm font-medium text-gray-300 mb-2">
              Status *
            </label>
            <select
              value={formData.status || "draft"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "draft" | "published",
                })
              }
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] rounded-lg text-white font-inter text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#252b3b]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#0a0e1a] border border-[#252b3b] text-white font-inter font-medium rounded-lg hover:bg-[#13182a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateEvent.isLoading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-inter font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateEvent.isLoading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
