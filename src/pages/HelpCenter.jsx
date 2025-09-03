import React, { useRef } from 'react';
import RAGChat from '../components/RAGChat';
import bgImage from '../assets/cricket-stadium-vector.jpg';

const HelpCenter = () => {
  const chatRef = useRef(null);

  const handleQuickAction = (query) => {
    if (chatRef.current) {
      chatRef.current.sendMessage(query);
    }
  };

  const quickActions = [
    {
      title: "Getting Started",
      description: "Learn how to set up your first tournament",
      query: "How do I create a tournament?",
      icon: "🏏"
    },
    {
      title: "Team Registration", 
      description: "Register your team for tournaments",
      query: "How do I register a team?",
      icon: "👥"
    },
    {
      title: "Payment Process",
      description: "Understand how payments work",
      query: "How does payment work?",
      icon: "💰"
    },
    {
      title: "System Architecture",
      description: "Learn about our technical setup",
      query: "Tell me about the architecture",
      icon: "⚙️"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cricket-green/90 via-cricket-blue/80 to-cricket-brown/90"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            CricTourney Help Center
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Get instant answers about our cricket tournament management platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - About & Technologies */}
          <div className="space-y-6">
            {/* About CricTourney */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-cricket-green mb-6">About CricTourney</h2>
              <p className="text-gray-700 mb-4">
                CricTourney is a comprehensive cricket tournament management platform designed to streamline the organization and management of cricket tournaments. Our platform provides role-based access control, team management, match scheduling, and payment processing.
              </p>
              <p className="text-gray-700">
                Whether you're an administrator organizing tournaments or a team captain registering your squad, CricTourney offers an intuitive interface with powerful features to manage every aspect of cricket tournaments efficiently.
              </p>
            </div>

            {/* Technologies & Tools */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-cricket-green mb-4">Technologies & Tools</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Frontend</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React 19</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Vite</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Material-UI</span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">Tailwind CSS</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Backend & APIs</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Spring Boot</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">JWT Auth</span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Razorpay</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Axios</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">AI & Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">RAG System</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Jest Testing</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">ESLint</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - RAG Chat */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-cricket-green mb-2">Ask Our AI Assistant</h2>
                <p className="text-gray-600 mb-4">
                  Get instant, detailed answers about CricTourney features, setup, and usage.
                </p>
              </div>
              <div className="min-h-[400px]">
                <RAGChat ref={chatRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;