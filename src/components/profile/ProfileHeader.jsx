import React, { useState, useRef } from "react";
import { Camera, User, Edit2, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import profileService from "../../services/profile.Service";
import { useAuth } from "../contexts/AuthContext";

const ProfileHeader = ({ user, onUpdate, onEdit }) => {
  const {updateUser} = useAuth() 
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    setUploading(true);
    try {
      const response = await profileService.updateProfileImage(formData);

      toast.success(response.message || "Profile image updated");

      updateUser(response.data.user);

      onUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to update image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Cover Image later maybe*/}
      <div className="h-32 bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6]"></div>

      <div className="relative px-6 pb-6">
        {/* Profile image */}
        <div className="absolute -top-12 left-6 group">
          <div className="relative w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {user?.profileImage &&
            user.profileImage !== "default-profile.png" ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6]">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-[#3e4bc4] p-2 rounded-full text-white hover:bg-[#5a4bd1] transition-colors shadow-lg disabled:opacity-50"
            title="Change profile picture"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div className="ml-28 pt-2 flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <span className="text-sm text-gray-400">@{user?.username}</span>
            </div>
            <p className="text-sm text-gray-500">{user?.bio || "No bio yet"}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
              <span>{user?.email}</span>
              <span>•</span>
              <span className="capitalize">
                {user?.emailStatus?.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;