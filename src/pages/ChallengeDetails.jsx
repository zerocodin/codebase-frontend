import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Heart,
  MessageCircle,
  Code,
  HelpCircle,
  FileText,
  Send,
  Loader2,
  Trash2,
  Image,
  ThumbsUp,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../components/contexts/AuthContext";
import challengeService from "../services/challenge.Service";
import commentService from "../services/comment.Service";

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentLikes, setCommentLikes] = useState({});

  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  useEffect(() => {
    if (challenge?.type === "QUIZ" && challenge._id) {
      // same key as ChallengeCard
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
  }, [challenge]);

  const fetchChallenge = async () => {
    setLoading(true);
    try {
      const response = await challengeService.getChallengeById(id);
      if (response.success) {
        setChallenge(response.data);
        setLikesCount(response.data.likes || 0);
        setIsLiked(
          response.data.likedBy?.some((id) => id === user?._id) || false,
        );

        // Initialize comment likes state
        const likes = {};
        response.data.comments?.forEach((comment) => {
          likes[comment._id] =
            comment.likedBy?.some((id) => id === user?._id) || false;
        });

        setCommentLikes(likes);

        setSelectedQuizOption(null);
        setShowQuizResult(false);
      } else {
        toast.error(response.message || "Failed to fetch challenge");
        navigate("/problems?tab=challenges");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load challenge");
      navigate("/problems?tab=challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    try {
      const response = await challengeService.toggleLike(id);
      if (response.success) {
        setIsLiked(!isLiked);
        setLikesCount(response.data.likes);
      }
    } catch (error) {
      toast.error(error.message || "Failed to like");
    }
  };

  const handleComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const response = await commentService.addComment(id, comment);
      if (response.success) {
        toast.success("Comment added!");
        setComment("");
        fetchChallenge();
      } else {
        toast.error(response.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        toast.success("Comment deleted");
        fetchChallenge();
      } else {
        toast.error(response.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    try {
      const response = await commentService.toggleLikeComment(commentId);
      if (response.success) {
        setCommentLikes((prev) => ({
          ...prev,
          [commentId]: !prev[commentId],
        }));
        // Update comment in challenge
        setChallenge((prev) => ({
          ...prev,
          comments: prev.comments.map((c) =>
            c._id === commentId ? { ...c, likes: response.data.likes } : c,
          ),
        }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to like comment");
    }
  };

  const getTypeIcon = () => {
    switch (challenge?.type) {
      case "PROBLEM":
        return <Code className="w-6 h-6 text-blue-500" />;
      case "QUIZ":
        return <HelpCircle className="w-6 h-6 text-green-500" />;
      case "NOTE":
        return <FileText className="w-6 h-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (challenge?.type) {
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
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = imageUrl.split(".").pop().split("?")[0] || "jpg";
      link.download = `${title || "note"}-image.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/problems?tab=challenges")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#3e4bc4] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Challenges</span>
        </button>

        {/* Challenge Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor()}`}
              >
                {getTypeIcon()}
                <span className="ml-2">{challenge.type}</span>
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(challenge.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {challenge.title}
          </h1>
          {/* Creator */}
          <div className="flex items-center gap-2 mb-4">
            {challenge.createdBy?.profileImage ? (
              <img
                src={challenge.createdBy.profileImage}
                alt={""}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-600">
              Created by{" "}
              <span className="font-medium">
                {challenge.createdBy?.name ||
                  challenge.createdBy?.username ||
                  "Unknown"}
              </span>
            </span>
          </div>
          {/* Description */}
          <p className="text-gray-700 mb-6">{challenge.description}</p>
          {/* Type-specific content */}
          {challenge.type === "PROBLEM" && challenge.problemData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Problem Details
              </h3>
              <div className="space-y-3 text-sm">
                {challenge.problemData.inputFormat && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Input Format:
                    </span>
                    <p className="text-gray-700 mt-1">
                      {challenge.problemData.inputFormat}
                    </p>
                  </div>
                )}
                {challenge.problemData.outputFormat && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Output Format:
                    </span>
                    <p className="text-gray-700 mt-1">
                      {challenge.problemData.outputFormat}
                    </p>
                  </div>
                )}
                {challenge.problemData.constraints && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Constraints:
                    </span>
                    <p className="text-gray-700 mt-1">
                      {challenge.problemData.constraints}
                    </p>
                  </div>
                )}
                {challenge.problemData.sampleInput && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Sample Input:
                    </span>
                    <pre className="mt-1 p-2 bg-gray-300 text-sm rounded-md overflow-x-auto">
                      {challenge.problemData.sampleInput}
                    </pre>
                  </div>
                )}
                {challenge.problemData.sampleOutput && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Sample Output:
                    </span>
                    <pre className="mt-1 p-2 bg-gray-300 text-green-600 text-sm rounded-md overflow-x-auto">
                      {challenge.problemData.sampleOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* QUIZ - Interactive with clickable options */}
          {challenge.type === "QUIZ" && challenge.quizData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Quiz Options
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Click on an option to check your answer
              </p>
              <div className="space-y-2">
                {challenge.quizData.options.map((option, index) => {
                  let optionClass = "border-gray-200 bg-white hover:bg-gray-50";
                  let icon = null;

                  if (showQuizResult && selectedQuizOption === index) {
                    if (option.isCorrect) {
                      optionClass = "border-green-500 bg-green-50";
                      icon = <CheckCircle className="w-5 h-5 text-green-500" />;
                    } else {
                      optionClass = "border-red-500 bg-red-50";
                      icon = <XCircle className="w-5 h-5 text-red-500" />;
                    }
                  } else if (showQuizResult && option.isCorrect) {
                    optionClass = "border-green-500 bg-green-50";
                    icon = <CheckCircle className="w-5 h-5 text-green-500" />;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuizOptionClick(index)}
                      disabled={showQuizResult}
                      className={`w-full flex items-center justify-between p-3 border-2 rounded-lg text-sm transition-all duration-200 ${optionClass}`}
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
                <div
                  className={`mt-3 p-3 rounded-lg text-sm font-medium ${
                    challenge.quizData.options[selectedQuizOption]?.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {challenge.quizData.options[selectedQuizOption]?.isCorrect
                    ? "✅ Correct! Great job!"
                    : `❌ Incorrect. The correct answer was: ${challenge.quizData.options.find((o) => o.isCorrect)?.text || "N/A"}`}
                </div>
              )}
            </div>
          )}

          {/* Note section */}
          {challenge.type === "NOTE" && challenge.noteData && (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {challenge.noteData.content}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {challenge.noteData.imageUrl && (
                  <div className="h-90 w-full relative group">
                    <img
                      src={challenge.noteData.imageUrl}
                      alt="Note attachment"
                      className="w-fit h-full object-cover rounded-lg"
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
                      className="absolute bottom-3 right-3 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                      title="Download image"
                    >
                      <Download className="w-5 h-5 text-amber-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Like & Comment Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
              <span>{likesCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span>{challenge.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>

        {/* Comments Section*/}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Comments ({challenge.comments?.length || 0})
          </h3>

          {/* Add Comment */}
          {user ? (
            <div className="flex gap-3 mb-6">
              <div className="shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={""}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="1"
                    className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-sm"
                    style={{ minHeight: "40px" }}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleComment}
                    disabled={submitting || !comment.trim()}
                    className="px-6 py-1.5 bg-[#3e4bc4] text-white text-sm rounded-full hover:bg-[#5a4bd1] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-6">
              <Link to="/login" className="text-[#3e4bc4] hover:underline">
                Login
              </Link>{" "}
              to comment
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {challenge.comments?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet</p>
            ) : (
              challenge.comments?.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  {/* User Avatar  */}
                  <div className="shrink-0">
                    {comment.user?.profileImage ? (
                      <img
                        src={comment.user.profileImage}
                        alt={""}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                          {comment.user?.name ||
                            comment.user?.username ||
                            "Unknown"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {comment.content}
                      </p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 mt-1 ml-2">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          commentLikes[comment._id]
                            ? "text-[#3e4bc4]"
                            : "text-gray-400 hover:text-[#3e4bc4]"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comment.likes || 0}</span>
                      </button>

                      {user?._id === comment.user?._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;
