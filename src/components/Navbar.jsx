import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, removeToken } from "../auth";

export default function Navbar() {
    const user = getUser();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = () => {
        removeToken();
        navigate("/login");
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-blue-600 shadow-xl relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <button 
                        onClick={() => {
                            if (user) {
                                navigate(user.role === 'ADMIN' ? '/admin' : '/user');
                            } else {
                                navigate('/login');
                            }
                        }}
                        className="flex items-center space-x-3 text-white hover:text-orange-200 transition-colors"
                    >
                        <img 
                            src="/logo-wh.png" 
                            alt="CricTourney" 
                            className="h-10 w-auto"
                        />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link 
                            to="/help" 
                            className="text-white hover:text-orange-200 px-3 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                            </svg>
                            <span>Help</span>
                        </Link>

                        {!user ? (
                            <div className="flex space-x-3">
                                <Link 
                                    to="/login" 
                                    className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <span className="text-white font-medium">Welcome, {user.username}</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </button>
                                    
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                            <button
                                                onClick={() => { navigate("/my-teams"); setIsMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                                </svg>
                                                <span>My Teams</span>
                                            </button>
                                            <button
                                                onClick={() => { navigate("/my-tournaments"); setIsMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                                <span>My Tournaments</span>
                                            </button>
                                            <button
                                                onClick={() => { navigate("/payment-history"); setIsMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                                <span>Payment History</span>
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                                </svg>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-orange-200 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-800 rounded-lg mt-2 mb-4 p-4">
                        <div className="space-y-3">
                            <Link to="/help" className="block text-white hover:text-orange-200 py-2">Help</Link>
                            {!user ? (
                                <>
                                    <Link to="/login" className="block text-white hover:text-orange-200 py-2">Login</Link>
                                    <Link to="/signup" className="block text-white hover:text-orange-200 py-2">Sign Up</Link>
                                </>
                            ) : (
                                <>
                                    <div className="text-white py-2 border-b border-blue-600">Welcome, {user.username}</div>
                                    <button onClick={() => { navigate("/my-teams"); setIsMenuOpen(false); }} className="block text-white hover:text-orange-200 py-2 w-full text-left">My Teams</button>
                                    <button onClick={() => { navigate("/my-tournaments"); setIsMenuOpen(false); }} className="block text-white hover:text-orange-200 py-2 w-full text-left">My Tournaments</button>
                                    <button onClick={() => { navigate("/payment-history"); setIsMenuOpen(false); }} className="block text-white hover:text-orange-200 py-2 w-full text-left">Payment History</button>
                                    <button onClick={logout} className="block text-red-300 hover:text-red-200 py-2 w-full text-left">Logout</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}