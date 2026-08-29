// base url
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";


// auth api url 
export const authURL = `${baseURL}/api/auth`;

// OTP api url
export const otpURL = `${baseURL}/api/otp`;

// problem api url
export const problemURL = `${baseURL}/api/problem`;

// contest api url
export const contestURL = `${baseURL}/api/contest`;

// user api url
export const userURL = `${baseURL}/api/user`;

export const submissionURL = `${baseURL}/api/submission`;

// execute api
export const executeURL = `${baseURL}/api/execute`;

export const userProgressURL = `${baseURL}/api/user-progress`;

export const leaderboardURL = `${baseURL}/api/leaderboard`;

export const statsURL = `${baseURL}/api/stats`;

export const challengeURL = `${baseURL}/api/challenges`;

export const commentURL = `${baseURL}/api/comments`;