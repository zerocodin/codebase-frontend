import React from "react";

const Logo = ({ size = "md", variant = "light" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const colors = {
    light: {
      primary: "#3B82F6", // blue
      secondary: "#10B981", // green
      text: "#FFFFFF",
    },
    dark: {
      primary: "#60A5FA",
      secondary: "#34D399",
      text: "#1F2937",
    },
  };

  return (
    <div className={`flex items-center gap-2 ${colors[variant].text}`}>
      {/* SVG Logo */}
      <svg
        className={sizes[size]}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Code brackets */}
        <path
          d="M30 25L15 50L30 75"
          stroke={colors[variant].primary}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M70 25L85 50L70 75"
          stroke={colors[variant].primary}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center slash / code cursor */}
        <path
          d="M45 15L55 85"
          stroke={colors[variant].secondary}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Small decorative dots */}
        <circle cx="50" cy="50" r="3" fill={colors[variant].primary} />
        <circle cx="40" cy="42" r="2" fill={colors[variant].secondary} />
        <circle cx="60" cy="58" r="2" fill={colors[variant].secondary} />
      </svg>

      {/* Text Logo */}
      <div className="font-bold">
        <span className="text-[#00ffea]">Code</span>
        <span className="text-[#a5c6eb]">Base</span>
      </div>
    </div>
  );
};

export default Logo;
