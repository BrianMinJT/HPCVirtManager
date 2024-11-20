import React, { createContext, useContext, useState, useEffect } from 'react';

const BreadcrumbContext = createContext();

export function BreadcrumbProvider({ children }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    console.log('Breadcrumb items updated:', breadcrumbItems);
  }, [breadcrumbItems]);

  const value = {
    breadcrumbItems,
    setBreadcrumbItems,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}
