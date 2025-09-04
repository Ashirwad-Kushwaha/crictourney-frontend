import React, { useState } from "react";
import RAGChat from "../components/RAGChat";

export default function HelpCenter() {
    const [selectedCategory, setSelectedCategory] = useState("general");

    const categories = [
        { id: "general", name: "General", icon: "❓" },
        { id: "tournaments", name: "Tournaments", icon: "🏆" },
        { id: "teams", name: "Teams", icon: "👥" },
        { id: "payments", name: "Payments", icon: "💳" },
        { id: "technical", name: "Technical", icon: "⚙️" }
    ];

    const faqs = {
        general: [
            { q: "What is CricTourney?", a: "CricTourney is a comprehensive cricket tournament management platform." },
            { q: "How do I get started?", a: "Sign up for an account and choose your role (User or Admin)." },
            { q: "Is the platform free?", a: "Registration is free, but tournaments may have entry fees." }
        ],
        tournaments: [
            { q: "How to create a tournament?", a: "Login as Admin and use the tournament creation form." },
            { q: "Can I edit tournament details?", a: "Yes, admins can modify tournament information before it starts." },
            { q: "What tournament formats are supported?", a: "We support various formats including knockout and league." }
        ],
        teams: [
            { q: "How to register a team?", a: "Navigate to team registration and fill in your team details." },
            { q: "Can I edit my team?", a: "Yes, team captains can edit team information and player roster." },
            { q: "How many players per team?", a: "Standard cricket teams require 11 players with optional substitutes." }
        ],
        payments: [
            { q: "How does payment work?", a: "We use secure Razorpay integration for all transactions." },
            { q: "Can I get a refund?", a: "Refund policies depend on tournament organizer rules." },
            { q: "Is my payment information secure?", a: "Yes, all payments are processed securely through Razorpay." }
        ],
        technical: [
            { q: "Browser requirements?", a: "Modern browsers like Chrome, Firefox, Safari are supported." },
            { q: "Mobile app available?", a: "Currently web-based, but mobile-responsive design." },
            { q: "Having login issues?", a: "Check your credentials or contact support for assistance." }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-blue-800 mb-2">Help Center</h1>
                    <p className="text-gray-600 text-lg">Get help with CricTourney platform</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                            <h2 className="text-2xl font-bold text-blue-800 mb-6">Frequently Asked Questions</h2>
                            
                            {/* Category Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            selectedCategory === category.id
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        }`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* FAQ Items */}
                            <div className="space-y-4">
                                {faqs[selectedCategory].map((faq) => (
                                    <div key={faq.q} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <h3 className="font-semibold text-blue-800 mb-2">{faq.q}</h3>
                                        <p className="text-gray-700">{faq.a}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl text-center">
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    <h3 className="font-semibold mb-1">View Tournaments</h3>
                                    <p className="text-sm opacity-90">Browse available tournaments</p>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl text-center">
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                    </svg>
                                    <h3 className="font-semibold mb-1">Register Team</h3>
                                    <p className="text-sm opacity-90">Create and register your team</p>
                                </div>
                                <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-4 rounded-xl text-center">
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                    </svg>
                                    <h3 className="font-semibold mb-1">View Schedule</h3>
                                    <p className="text-sm opacity-90">Check match schedules</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Chat Assistant */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    AI Assistant
                                </h3>
                                <p className="text-sm opacity-90">Ask me anything about CricTourney!</p>
                            </div>
                            <div className="h-96">
                                <RAGChat showControls={false} />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">Need More Help?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    <span>support@crictourney.com</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                    <span>+91 12345 67890</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}