import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a new context
const StudentFilterContext = createContext();

// Custom hook to easily access the context in other components
export const useStudentFilter = () => useContext(StudentFilterContext);

// Provider component to wrap your app and provide the context
export const StudentFilterProvider = ({ children }) => {
  const [studentFilter, setStudentFilter] = useState(() => {
    const savedFilter = localStorage.getItem('studentFilter');
    return savedFilter || 'proctoring'; // Default value if none is saved
  });

  // Keep localStorage in sync with the state
  useEffect(() => {
    console.log(`StudentFilterContext: Setting filter to ${studentFilter}`);
    localStorage.setItem('studentFilter', studentFilter);
  }, [studentFilter]);

  // Toggle the filter manually if needed
  const toggleStudentFilter = (value) => {
    console.log(`StudentFilterContext: Toggling filter from ${studentFilter} to ${value}`);
    setStudentFilter(value);
  };

  return (
    <StudentFilterContext.Provider value={{ studentFilter, setStudentFilter, toggleStudentFilter }}>
      {children}
    </StudentFilterContext.Provider>
  );
};

export default StudentFilterContext;
