import React from "react";
import { Code, Trophy, Users, CheckCircle, XCircle } from "lucide-react";

const ProfileStats = ({ stats }) => {

  const solved = stats?.problemsSolved || 0;
  const attempted = stats?.totalAttempted || 0;

  const totalAttempts = solved + attempted;
  const successRate =
    totalAttempts > 0 ? Math.round((solved / totalAttempts) * 100) : 0;
  
  const statItems = [
    {
      icon: <Code className="w-5 h-5 text-blue-500" />,
      label: "Problems Solved",
      value: stats?.problemsSolved || 0,
      color: "bg-blue-50 border-blue-100",
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      label: "Contests Won",
      value: stats?.contestsWon || 0,
      color: "bg-yellow-50 border-yellow-100",
    },
    {
      icon: <Users className="w-5 h-5 text-purple-500" />,
      label: "Contests Participated",
      value: stats?.contestsParticipated || 0,
      color: "bg-purple-50 border-purple-100",
    },
    {
      icon:
        stats?.accuracy >= 70 ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : stats?.accuracy >= 40 ? (
          <CheckCircle className="w-5 h-5 text-yellow-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        ),
      label: "Success Rate",
      value: `${stats?.accuracy || 0}%`,
      color:
        stats?.accuracy >= 70
          ? "bg-green-50 border-green-100"
          : stats?.accuracy >= 40
            ? "bg-yellow-50 border-yellow-100"
            : "bg-red-50 border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`${item.color} border rounded-xl p-4 text-center transition-all hover:shadow-md`}
        >
          <div className="flex justify-center mb-2">{item.icon}</div>
          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;