import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Trophy, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import challengeService from "../../services/challenge.Service";
import ChallengeCard from "./ChallengeCard";
import CreateChallengeModal from "./CreateChallengeModal";

const ChallengesTab = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [challengeFilter, setChallengeFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [challengeSearch, setChallengeSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch challenges when filter or search changes
  useEffect(() => {
    fetchChallenges();
  }, [challengeFilter, challengeSearch, pagination.page]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const response = await challengeService.getAllChallenges({
        type: challengeFilter,
        search: challengeSearch || undefined,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.success) {
        setChallenges(response.data.challenges || []);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message || "Failed to fetch challenges");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setChallengeSearch(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (e) => {
    setChallengeFilter(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={challengeFilter}
            onChange={handleFilterChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
          >
            <option value="ALL">All Challenges</option>
            <option value="PROBLEM">Problems</option>
            <option value="QUIZ">Quizzes</option>
            <option value="NOTE">Notes</option>
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Challenge
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={challengeSearch}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#3e4bc4] animate-spin" />
            <p className="text-gray-400 text-sm">Loading challenges...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && challenges.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <Trophy className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              No challenges found
            </h3>
            <p className="text-sm text-gray-500">
              Be the first to create a challenge!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 px-4 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Challenge
            </button>
          </div>
        </div>
      )}

      {/* Challenge Cards Grid */}
      {!loading && challenges.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onLikeUpdate={fetchChallenges}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3.5 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 text-sm rounded-md transition-all duration-200 ${
                    pagination.page === pageNum
                      ? "bg-[#3e4bc4] text-white shadow-sm"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3.5 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <CreateChallengeModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchChallenges();
          }}
        />
      )}
    </div>
  );
};

export default ChallengesTab;