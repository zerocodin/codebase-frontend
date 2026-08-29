import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ContestForm = ({ contestData, setContestData, onSubmit, loading }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!contestData.name.trim()) {
      newErrors.name = "Contest name is required";
    }
    if (!contestData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!contestData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!contestData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (!contestData.duration || contestData.duration < 30) {
      newErrors.duration = "Duration must be at least 30 minutes";
    }

    if (contestData.startDate && contestData.endDate) {
      const start = new Date(contestData.startDate);
      const end = new Date(contestData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }
    onSubmit(contestData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contest Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={contestData.name}
            onChange={handleChange}
            placeholder="e.g., Weekly Coding Challenge"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={contestData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe your contest..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contest Type
          </label>
          <select
            name="contestType"
            value={contestData.contestType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
          >
            <option value="PUBLIC">Public (Anyone can join)</option>
            <option value="PRIVATE">Private (Invite only)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={contestData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={contestData.endDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="duration"
            value={contestData.duration}
            onChange={handleChange}
            min="30"
            step="5"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Minimum 30 minutes</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Contest...
            </>
          ) : (
            "Create Contest & Continue →"
          )}
        </button>
      </form>
    </div>
  );
};

export default ContestForm;