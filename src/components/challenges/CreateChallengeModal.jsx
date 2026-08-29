import React, { useState, useRef } from "react";
import {
  X,
  Loader2,
  Code,
  HelpCircle,
  FileText,
  Image,
  Upload,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import challengeService from "../../services/challenge.Service";
import { useAuth } from "../contexts/AuthContext";

const CreateChallengeModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [challengeType, setChallengeType] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Common fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",

    problemData: {
      inputFormat: "",
      outputFormat: "",
      sampleInput: "",
      sampleOutput: "",
    },

    quizData: {
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },

    noteData: {
      content: "",
      imageUrl: "",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  // const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const challengeTypes = [
    {
      id: "PROBLEM",
      label: "Problem",
      icon: <Code className="w-8 h-8" />,
      description: "Create a coding problem challenge",
      color: "blue",
    },
    {
      id: "QUIZ",
      label: "Quiz",
      icon: <HelpCircle className="w-8 h-8" />,
      description: "Create a multiple choice quiz",
      color: "green",
    },
    {
      id: "NOTE",
      label: "Note",
      icon: <FileText className="w-8 h-8" />,
      description: "Create a note or article",
      color: "purple",
    },
  ];

  const handleTypeSelect = (type) => {
    setChallengeType(type);
    setFormData({ ...formData, type });
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProblemDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      problemData: { ...prev.problemData, [name]: value },
    }));
  };

  const handleQuizOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.quizData.options];
    updatedOptions[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      quizData: { ...prev.quizData, options: updatedOptions },
    }));
  };

  const handleNoteDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      noteData: { ...prev.noteData, [name]: value },
    }));
  };

  // Handle image upload
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      noteData: {
        ...prev.noteData,
      },
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
    setUploadedImageUrl("");
    setFormData((prev) => ({
      ...prev,
      noteData: {
        ...prev.noteData,
        imageUrl: "",
      },
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() && !formData.description.trim()) {
      toast.error("Please fill in title or description");
      return;
    }

    setLoading(true);

    try {
      // Validate based on type
      if (challengeType === "PROBLEM") {
        if (
          !formData.problemData.sampleInput ||
          !formData.problemData.sampleOutput
        ) {
          toast.error("Please provide sample input and output");
          setLoading(false);
          return;
        }
      }

      if (challengeType === "QUIZ") {
        const hasCorrect = formData.quizData.options.some(
          (opt) => opt.isCorrect,
        );
        if (!hasCorrect) {
          toast.error("Please select at least one correct answer");
          setLoading(false);
          return;
        }
      }

      if (challengeType === "NOTE") {
        if (!formData.noteData.content.trim()) {
          toast.error("Please provide note content");
          setLoading(false);
          return;
        }
      }

      let uploadedImageUrl = "";

      if (challengeType === "NOTE" && imageFile) {
        try {
          const uploadResponse =
            await challengeService.uploadNoteImage(imageFile);
          if (uploadResponse.success) {
            uploadedImageUrl = uploadResponse.data.imageUrl;
          } else {
            toast.error(uploadResponse.message || "Failed to upload image");
            setLoading(false);
            return;
          }
        } catch (error) {
          toast.error(error.message || "Failed to upload image");
          setLoading(false);
          return;
        }
      }

      // Create payload
      const payload = {
        title: formData.title || "",
        description: formData.description || "",
        type: challengeType,
      };

      if (challengeType === "PROBLEM") {
        payload.problemData = formData.problemData;
      } else if (challengeType === "QUIZ") {
        payload.quizData = formData.quizData;
      } else if (challengeType === "NOTE") {
        payload.noteData = {
          content: formData.noteData.content,
          imageUrl: uploadedImageUrl,
        };
      }

      const response = await challengeService.createChallenge(payload);

      if (response.success) {
        toast.success("Challenge created successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to create challenge");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create challenge");
    } finally {
      setLoading(false);
    }
  };

  const renderTypeSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {challengeTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => handleTypeSelect(type.id)}
          className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${
            challengeType === type.id
              ? `border-${type.color}-500 bg-${type.color}-50`
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className={`text-${type.color}-500 mb-3`}>{type.icon}</div>
          <h3 className="text-lg font-semibold text-gray-800">{type.label}</h3>
          <p className="text-sm text-gray-500">{type.description}</p>
        </button>
      ))}
    </div>
  );

  const renderProblemForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Input Format
        </label>
        <textarea
          name="inputFormat"
          value={formData.problemData.inputFormat}
          onChange={handleProblemDataChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none"
          placeholder="Describe the input format..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Output Format
        </label>
        <textarea
          name="outputFormat"
          value={formData.problemData.outputFormat}
          onChange={handleProblemDataChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none"
          placeholder="Describe the output format..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sample Input <span className="text-red-500">*</span>
          </label>
          <textarea
            name="sampleInput"
            value={formData.problemData.sampleInput}
            onChange={handleProblemDataChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none font-mono text-sm"
            placeholder="Sample input..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sample Output <span className="text-red-500">*</span>
          </label>
          <textarea
            name="sampleOutput"
            value={formData.problemData.sampleOutput}
            onChange={handleProblemDataChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none font-mono text-sm"
            placeholder="Sample output..."
          />
        </div>
      </div>
    </div>
  );

  const renderQuizForm = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Select the correct option(s) by clicking the checkbox{" "}
        <span className="text-red-400">*</span>
      </p>
      {formData.quizData.options.map((option, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
        >
          <input
            type="checkbox"
            checked={option.isCorrect}
            onChange={(e) => {
              const updatedOptions = [...formData.quizData.options];
              updatedOptions[index].isCorrect = e.target.checked;
              setFormData((prev) => ({
                ...prev,
                quizData: { ...prev.quizData, options: updatedOptions },
              }));
            }}
            className="w-4 h-4 text-[#3e4bc4] rounded border-gray-300 focus:ring-[#3e4bc4]"
          />
          <span className="text-sm font-medium text-gray-500">
            Option {index + 1}
          </span>
          <input
            type="text"
            value={option.text}
            onChange={(e) =>
              handleQuizOptionChange(index, "text", e.target.value)
            }
            placeholder={`Enter option ${index + 1}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
          />
        </div>
      ))}
    </div>
  );

  const renderNoteForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={formData.noteData.content}
          onChange={handleNoteDataChange}
          rows="8"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none"
          placeholder="Write your note content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Image (Optional)
        </label>

        {uploadingImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 text-[#3e4bc4] animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Uploading image...</p>
          </div>
        ) : imagePreview ? (
          <div className="relative border border-gray-200 rounded-lg p-2 bg-gray-50">
            <img
              src={imagePreview}
              alt="Note attachment"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#3e4bc4] transition-colors cursor-pointer"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Click to upload an image</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 1 ? "Choose Challenge Type" : "Create New Challenge"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            renderTypeSelection()
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-[#3e4bc4] hover:underline"
                >
                  ← Change Type
                </button>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm font-medium text-gray-600">
                  {challengeTypes.find((t) => t.id === challengeType)?.label}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter challenge title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your challenge..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none resize-none"
                  />
                </div>

                {challengeType === "PROBLEM" && renderProblemForm()}
                {challengeType === "QUIZ" && renderQuizForm()}
                {challengeType === "NOTE" && renderNoteForm()}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || uploadingImage}
                  className="flex-1 py-2.5 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Challenge"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeModal;
