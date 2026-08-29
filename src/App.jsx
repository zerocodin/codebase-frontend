import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Problems from "./pages/Problems";
import Contests from "./pages/Contests";
import Forgot from "./pages/Forgot";
import Compailer from "./pages/Compailer";
import ContestDetails from "./components/contests/ContestDetails";
import ProblemDetails from "./components/problem/ProblemDetails";
import Profile from "./pages/Profile";
import { AuthProvider } from "./components/contexts/AuthContext";
import Settings from "./pages/Settings";
import CreateContest from "./pages/CreateContest";
import CreateProblem from "./pages/CreateProblem";
import ContestView from "./pages/ContestView";
import EditContest from "./components/contests/EditContest";
import EditProblem from "./components/problem/EditProblem";
import Leaderboard from "./components/contests/Leaderboard";
import SubmissionDetails from "./pages/SubmissionDetails";
import PublicProfile from "./components/profile/PublicProfile";
import ChallengeDetails from "./pages/ChallengeDetails";

const App = () => {
  const location = useLocation();

  const isProblemDetails =
    location.pathname.startsWith("/problems") &&
    location.pathname != "/problems";

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/compailer" ||
    location.pathname === "/forgot" ||
    isProblemDetails;

  return (
    <AuthProvider>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        {!hideNavbar && <Navbar />}
        <div className={!hideNavbar ? "pt-9" : ""}>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />

            {/* Profie Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />

            {/* Contest Routes */}
            <Route path="/contests" element={<Contests />} />
            <Route path="/create-contest" element={<CreateContest />} />
            <Route path="/contests/:id" element={<ContestDetails />} />
            <Route path="/contests-data/:id" element={<ContestView />} />
            <Route path="/contests/:id/edit" element={<EditContest />} />
            <Route path="/contests/:id/leaderboard" element={<Leaderboard />} />
            <Route
              path="/contests/:contestId/create-problem"
              element={<CreateProblem />}
            />

            {/* Problem Routes */}
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            <Route path="/problems/:id/edit" element={<EditProblem />} />

            {/* Submission Route */}
            <Route path="/submissions/:id" element={<SubmissionDetails />} />

            {/* Compiler Route */}
            <Route path="/compailer" element={<Compailer />} />
            
            {/* Challenge Route */}
            <Route path="/challenges/:id" element={<ChallengeDetails />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 1500,
            style: {
              background: "#363636",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
            },
            success: {
              duration: 1000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 1500,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
};

export default App;
