import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Heart,
  MessageCircle,
  Code,
  HelpCircle,
  FileText,
  ChevronRight,
  Image,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import challengeService from "../../services/challenge.Service";

const ChallengeCard = ({ challenge, onLikeUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(challenge.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Check if user has liked this challenge
  useEffect(() => {
    if (user && challenge.likedBy) {
      const liked = challenge.likedBy.some((id) => id === user._id);
      setIsLiked(liked);
    }
  }, [user, challenge.likedBy]);

  useEffect(() => {
    if (challenge.type === "QUIZ" && challenge._id) {
      // Use the same key as ChallengeDetails
      const savedState = localStorage.getItem(`quiz_state_${challenge._id}`);
      if (savedState) {
        try {
          const { selectedIndex, resultShown } = JSON.parse(savedState);
          if (
            selectedIndex !== null &&
            selectedIndex < challenge.quizData.options.length
          ) {
            setSelectedQuizOption(selectedIndex);
            setShowQuizResult(resultShown);
          }
        } catch (e) {
          console.error("Error loading quiz state:", e);
        }
      }
    }
  }, [challenge._id, challenge.type]);

  const getTypeIcon = () => {
    switch (challenge.type) {
      case "PROBLEM":
        return <Code className="w-5 h-5 text-blue-500" />;
      case "QUIZ":
        return <HelpCircle className="w-5 h-5 text-green-500" />;
      case "NOTE":
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (challenge.type) {
      case "PROBLEM":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "QUIZ":
        return "bg-green-50 text-green-700 border-green-200";
      case "NOTE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like challenges");
      return;
    }

    setIsLiking(true);
    try {
      const response = await challengeService.toggleLike(challenge._id);
      if (response.success) {
        setIsLiked(!isLiked);
        setLikesCount(response.data.likes);
        if (onLikeUpdate) onLikeUpdate();
      }
    } catch (error) {
      toast.error(error.message || "Failed to like challenge");
    } finally {
      setIsLiking(false);
    }
  };

  const handleQuizOptionClick = (index) => {
    if (showQuizResult) return;
    setSelectedQuizOption(index);
    setShowQuizResult(true);

    localStorage.setItem(
      `quiz_state_${challenge._id}`,
      JSON.stringify({
        selectedIndex: index,
        resultShown: true,
      }),
    );
  };

  const handleDownloadImage = async (imageUrl, title) => {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "note"}-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Image downloading...");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor()}`}
            >
              {getTypeIcon()}
              <span className="ml-1">{challenge.type}</span>
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(challenge.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        {/* Title & Description */}
        <Link to={`/challenges/${challenge._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-[#3e4bc4] transition-colors mb-2 line-clamp-2">
            {challenge.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {challenge.description}
        </p>

        {/* Content Preview */}
        {challenge.type === "PROBLEM" && challenge.problemData && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="text-xs text-gray-500 space-y-1">
              {challenge.problemData.sampleInput && (
                <div>
                  <span className="font-medium">Sample Input:</span>
                  <pre className="mt-1 p-2 bg-gray-300 text-black text-xs rounded-md overflow-x-auto">
                    {challenge.problemData.sampleInput}
                  </pre>
                </div>
              )}
              {challenge.problemData.sampleOutput && (
                <div>
                  <span className="font-medium">Sample Output:</span>
                  <pre className="mt-1 p-2 bg-gray-300 text-black text-xs rounded-md overflow-x-auto">
                    {challenge.problemData.sampleOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUIZ - Show all options with clickable functionality */}
        {challenge.type === "QUIZ" && challenge.quizData && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 mb-2">Select your answer:</p>
            <div className="space-y-1.5">
              {challenge.quizData.options.map((option, index) => {
                let optionClass = "border-gray-200 bg-white hover:bg-gray-50";
                let icon = null;

                if (showQuizResult && selectedQuizOption === index) {
                  if (option.isCorrect) {
                    optionClass = "border-green-500 bg-green-50";
                    icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                  } else {
                    optionClass = "border-red-500 bg-red-50";
                    icon = <XCircle className="w-4 h-4 text-red-500" />;
                  }
                } else if (showQuizResult && option.isCorrect) {
                  optionClass = "border-green-500 bg-green-50";
                  icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleQuizOptionClick(index)}
                    disabled={showQuizResult}
                    className={`w-full flex items-center justify-between p-2 border rounded-lg text-sm transition-colors ${optionClass}`}
                  >
                    <span>
                      <span className="font-medium text-gray-500 mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-700">{option.text}</span>
                    </span>
                    {icon}
                  </button>
                );
              })}
            </div>
            {showQuizResult && (
              <p className="text-xs text-gray-500 mt-2">
                {challenge.quizData.options[selectedQuizOption]?.isCorrect
                  ? "✅ Correct!"
                  : "❌ Incorrect."}
              </p>
            )}
          </div>
        )}

        {/* NOTE - Show image with proper sizing */}
        {challenge.type === "NOTE" && challenge.noteData && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex gap-3">
              {/* Left side - Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {challenge.noteData.content}
                </p>
              </div>

              {/* Right side - Image */}
              {challenge.noteData.imageUrl && (
                <div className="shrink-0 w-[45%] h-40 relative group">
                  <img
                    src={challenge.noteData.imageUrl}
                    alt="Note attachment"
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    onClick={() =>
                      handleDownloadImage(
                        challenge.noteData.imageUrl,
                        challenge.title,
                      )
                    }
                    className="absolute bottom-1 right-1 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Download image"
                  >
                    <Download className="w-4 h-4 text-amber-200" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {challenge.createdBy?.profileImage ? (
                <img
                  src={challenge.createdBy.profileImage}
                  alt={challenge.createdBy.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {challenge.createdBy?.name ||
                  challenge.createdBy?.username ||
                  "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{likesCount}</span>
              </button>
              <Link
                to={`/challenges/${challenge._id}`}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#3e4bc4] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{challenge.comments?.length || 0}</span>
              </Link>
            </div>
          </div>
          <Link
            to={`/challenges/${challenge._id}`}
            className="flex items-center gap-1 text-sm text-[#3e4bc4] hover:underline"
          >
            View
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
