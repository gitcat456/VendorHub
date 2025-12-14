import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('marketplace_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        const mockUser = {
            id: 'v1',
            name: 'Vendor John',
            email: email,
            avatar: 'V',
            phone: '+254700000000',
            whatsapp: '254700000000'
        };
        setUser(mockUser);
        localStorage.setItem('marketplace_user', JSON.stringify(mockUser));
        return true;
    };

    const signup = (userData) => {
        const mockUser = {
            id: 'v' + Date.now(),
            ...userData,
            avatar: userData.name.charAt(0).toUpperCase()
        };
        setUser(mockUser);
        localStorage.setItem('marketplace_user', JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('marketplace_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
