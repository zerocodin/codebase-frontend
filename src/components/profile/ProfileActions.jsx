import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Mail, Trash2, Loader2, LogOut , X} from "lucide-react";
import toast from "react-hot-toast";

import profileService from "../../services/profile.Service";
import { otpURL } from "../../api/urlEndPoint";
import axios from "axios";

const ProfileActions = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const EmailChangeModal = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const handleVerifyAccount = async (e) => {
      e.preventDefault();
      
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }
      
      if (email == 'demo@demo.com') {
        toast.error("you can't change demo email");
        return;
      }

      setSubmitting(true);
      try {
        const result = await profileService.checkEmail({ email, password });
        toast.success(result.message || "Account verified successfully");
        setStep(2);
      } catch (error) {
        toast.error(error.message || "Failed to verify account");
      } finally {
        setSubmitting(false);
      }
    };

    const handleSendOTP = async (e) => {
      e.preventDefault();

      if (!newEmail) {
        toast.error("Please enter a new email");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setSubmitting(true);
      try {
        const result = await axios.post(
          `${otpURL}/sendOTP1`,
          { email, newEmail },
          { withCredentials: true },
        );
        toast.success(result.data.message || "OTP sent to new email");
        setStep(3);
        setResendCooldown(30);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      } finally {
        setSubmitting(false);
      }
    };

    const handleVerifyOTP = async (e) => {
      e.preventDefault();

      if (!otp || otp.length < 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }

      setSubmitting(true);
      try {
        const result = await axios.post(
          `${otpURL}/verifyOTP`,
          {
            email,
            OTP: otp,
          },
          { withCredentials: true },
        );

        toast.success(result.data.message || "OTP verified successfully");

        const result2 = await profileService.updateEmail({ newEmail });
        toast.success(result2.message || "Email updated successfully");

        setShowEmailModal(false);
        onUpdate();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update email");
      } finally {
        setSubmitting(false);
      }
    };

    const handleResendOTP = async () => {
      if (resendCooldown > 0) {
        toast.error(`Please wait ${resendCooldown} seconds`);
        return;
      }

      setSubmitting(true);
      try {
        const result = await axios.post(
          `${otpURL}/sendOTP1`,
          { email, newEmail },
          { withCredentials: true },
        );
        toast.success(result.data.message || "OTP resent successfully");

        setResendCooldown(30);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      } finally {
        setSubmitting(false);
      }
    };

    const goBack = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              {step === 1 && "Verify Account"}
              {step === 2 && "New Email"}
              {step === 3 && "Verify OTP"}
            </h3>
            <button
              onClick={() => setShowEmailModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {step === 1 && (
            <form onSubmit={handleVerifyAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                  placeholder="Enter your current email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify Account"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSendOTP} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                  placeholder="Enter your new email"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  An OTP will be sent to this email for verification
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleVerifyOTP} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none text-center text-2xl tracking-widest font-mono"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit OTP sent to {newEmail}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || submitting}
                  className="text-sm text-[#3e4bc4] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || otp.length < 6}
                  className="flex-1 py-2.5 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify & Update"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const PasswordChangeModal = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (currentPassword == '111111') {
        toast.error("you can't chage this account password");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      setSubmitting(true);
      try {
        await profileService.changePassword({
          password: currentPassword,
          newPassword: newPassword,
        });
        toast.success("Password changed successfully");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error(error.message || "Failed to change password");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Change Password
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Change Password"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteAccountModal = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await profileService.deleteAccount({ email, password });
        toast.success("Account deleted successfully");
        setShowDeleteModal(false);
        navigate("/login");
      } catch (error) {
        toast.error(error.message || "Failed to delete account");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-red-600 mb-2">
            Delete Account
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            This action cannot be undone. All your data will be permanently
            deleted.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Delete Account"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Key className="w-5 h-5 text-[#3e4bc4]" />
        Account Settings
      </h3>

      <div className="space-y-3">
        <button
          onClick={() => setShowEmailModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4" />
            Change Email
          </span>
          <span className="text-sm text-gray-400">{user?.email}</span>
        </button>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <Key className="w-4 h-4" />
            Change Password
          </span>
          <span className="text-sm text-gray-400">••••••••</span>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2 text-sm text-red-600">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </span>
          <span className="text-sm text-red-400">⚠️ Permanent</span>
        </button>
      </div>

      {/* Modals */}
      {showEmailModal && <EmailChangeModal />}
      {showPasswordModal && <PasswordChangeModal />}
      {showDeleteModal && <DeleteAccountModal />}
    </div>
  );
};;

export default ProfileActions;
