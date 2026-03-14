import React, { createContext, useContext } from 'react';

const NavigationVisibilityContext = createContext(1);

export const NavigationVisibilityProvider = ({ children, visibilityLevel }) => {
    return (
        <NavigationVisibilityContext.Provider value={visibilityLevel}>
            {children}
        </NavigationVisibilityContext.Provider>
    );
};

export const useNavigationVisibility = () => {
    return useContext(NavigationVisibilityContext);
};
