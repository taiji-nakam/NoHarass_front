import { createContext, useState } from 'react';

// Contextの作成
export const MyContext = createContext();

export function MyContextProvider({ children }) {
  // ページ間で共有するMessage
  const [sharedMsg, setSharedMsg] = useState(0);
  // ページ間で共有する診断ID
  const [assessmentId, setAssessmentId] = useState(0);
  
  return (
    <MyContext.Provider value={{ 
      sharedMsg, setSharedMsg,
      assessmentId, setAssessmentId
      }}>
      {children}
    </MyContext.Provider>
  );
  
}