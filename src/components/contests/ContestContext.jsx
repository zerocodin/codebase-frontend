import React, { createContext, useContext, useState } from "react";

const ContestContext = createContext();

export const useContest = () => {
  const context = useContext(ContestContext);
  if (!context) {
    throw new Error("useContest must be used within ContestProvider");
  }
  return context;
};

export const ContestProvider = ({ children }) => {
  const [currentContestId, setCurrentContestId] = useState(null);

  return (
    <ContestContext.Provider value={{ currentContestId, setCurrentContestId }}>
      {children}
    </ContestContext.Provider>
  );
};
