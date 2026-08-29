import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  X,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import problemService from "../../services/problem.Service";
import contestService from "../../services/contest.Service";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [problem, setProblem] = useState(null);
  const [contest, setContest] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "MEDIUM",
    tags: [],
    inputFormat: "",
    outputFormat: "",
    constraints: "",
  });

  const [sampleCases, setSampleCases] = useState([
    { input: "", output: "", explanation: "" },
  ]);
  const [hiddenCases, setHiddenCases] = useState([{ input: "", output: "" }]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProblem();
  }, [id, user]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const response = await problemService.getProblemById(id);
      if (response.success) {
        const data = response.data.problem;
        setProblem(data);

        // Fetch contest details
        if (data.contestId) {
          const contestRes = await contestService.getContestById(
            data.contestId,
          );
          if (contestRes.success) {
            setContest(contestRes.data);
          }
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          difficulty: data.difficulty || "MEDIUM",
          tags: data.tags || [],
          inputFormat: data.inputFormat || "",
          outputFormat: data.outputFormat || "",
          constraints: data.constraints || "",
        });

        setSampleCases(
          data.sampleCases?.length > 0
            ? data.sampleCases
            : [{ input: "", output: "", explanation: "" }],
        );
        setHiddenCases(
          data.hiddenCases?.length > 0
            ? data.hiddenCases
            : [{ input: "", output: "" }],
        );
      } else {
        toast.error(response.message || "Failed to fetch problem");
        navigate("/problems");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load problem");
      navigate("/problems");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSampleChange = (index, field, value) => {
    const updated = [...sampleCases];
    updated[index][field] = value;
    setSampleCases(updated);
  };

  const addSampleCase = () => {
    setSampleCases([
      ...sampleCases,
      { input: "", output: "", explanation: "" },
    ]);
  };

  const removeSampleCase = (index) => {
    if (sampleCases.length > 1) {
      setSampleCases(sampleCases.filter((_, i) => i !== index));
    } else {
      toast.error("At least one sample case is required");
    }
  };

  const handleHiddenChange = (index, field, value) => {
    const updated = [...hiddenCases];
    updated[index][field] = value;
    setHiddenCases(updated);
  };

  const addHiddenCase = () => {
    setHiddenCases([...hiddenCases, { input: "", output: "" }]);
  };

  const removeHiddenCase = (index) => {
    if (hiddenCases.length > 0) {
      setHiddenCases(hiddenCases.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Problem title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Problem description is required";
    }
    if (!formData.inputFormat.trim()) {
      newErrors.inputFormat = "Input format is required";
    }
    if (!formData.outputFormat.trim()) {
      newErrors.outputFormat = "Output format is required";
    }
    if (!formData.constraints.trim()) {
      newErrors.constraints = "Constraints are required";
    }

    const hasValidSample = sampleCases.some(
      (s) => s.input.trim() && s.output.trim(),
    );
    if (!hasValidSample) {
      newErrors.sampleCases =
        "At least one sample case with input and output is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    setSubmitting(true);

    try {
      const updateData = {
        ...formData,
        sampleCases: sampleCases.filter(
          (s) => s.input.trim() && s.output.trim(),
        ),
        hiddenCases: hiddenCases.filter(
          (h) => h.input.trim() && h.output.trim(),
        ),
      };

      const response = await problemService.updateProblem(id, updateData);

      if (response.success) {
        toast.success("Problem updated successfully!");
        // Navigate back to contest view
        if (contest) {
          navigate(`/contests/${contest.id}`);
        } else {
          navigate("/problems");
        }
      } else {
        toast.error(response.message || "Failed to update problem");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update problem");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Problem not found
          </h2>
          <button
            onClick={() => navigate("/problems")}
            className="mt-4 text-[#3e4bc4] hover:underline"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Problem</h1>
            <p className="text-sm text-gray-500">
              {contest
                ? `Updating problem in "${contest.name}"`
                : "Update problem details"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Details Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3e4bc4]" />
                Problem Details
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Two Sum"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the problem..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tag..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Format <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="inputFormat"
                  value={formData.inputFormat}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Describe the input format..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none ${
                    errors.inputFormat ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.inputFormat && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.inputFormat}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Output Format <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Describe the output format..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none ${
                    errors.outputFormat ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.outputFormat && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.outputFormat}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Constraints <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g., 1 <= n <= 10^5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none ${
                    errors.constraints ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.constraints && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.constraints}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sample Test Cases */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Sample Test Cases
              </h2>
              <button
                type="button"
                onClick={addSampleCase}
                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Sample
              </button>
            </div>

            <div className="p-6 space-y-4">
              {errors.sampleCases && (
                <p className="text-red-500 text-sm">{errors.sampleCases}</p>
              )}
              {sampleCases.map((sample, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Sample Case {index + 1}
                    </span>
                    {sampleCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSampleCase(index)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Input
                      </label>
                      <textarea
                        value={sample.input}
                        onChange={(e) =>
                          handleSampleChange(index, "input", e.target.value)
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none font-mono text-sm"
                        placeholder="Sample input..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Output
                      </label>
                      <textarea
                        value={sample.output}
                        onChange={(e) =>
                          handleSampleChange(index, "output", e.target.value)
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none font-mono text-sm"
                        placeholder="Sample output..."
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Explanation (Optional)
                    </label>
                    <input
                      type="text"
                      value={sample.explanation}
                      onChange={(e) =>
                        handleSampleChange(index, "explanation", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none text-sm"
                      placeholder="Explain the sample case..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Hidden Test Cases
              </h2>
              <button
                type="button"
                onClick={addHiddenCase}
                className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Hidden
              </button>
            </div>

            <div className="p-6 space-y-4">
              {hiddenCases.map((hidden, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Hidden Case {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHiddenCase(index)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Input
                      </label>
                      <textarea
                        value={hidden.input}
                        onChange={(e) =>
                          handleHiddenChange(index, "input", e.target.value)
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none font-mono text-sm"
                        placeholder="Hidden input..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Output
                      </label>
                      <textarea
                        value={hidden.output}
                        onChange={(e) =>
                          handleHiddenChange(index, "output", e.target.value)
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none font-mono text-sm"
                        placeholder="Hidden output..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating Problem...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Problem
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProblem;
