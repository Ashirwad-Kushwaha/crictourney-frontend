import React, { useState, useRef } from 'react';
import RAGChat from '../components/RAGChat';
import ragService from '../services/ragService';
import bgImage from '../assets/cricket-stadium-vector.jpg';

const HelpCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const chatRef = useRef(null);
  
  const topics = ragService.getAvailableTopics();
  const categories = ['all', ...new Set(topics.map(topic => topic.category))];

  const filteredTopics = selectedCategory === 'all' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory);

  const handleQuickAction = (query) => {
    if (chatRef.current) {
      chatRef.current.sendMessage(query);
    }
  };

  const handleTopicClick = (topic) => {
    const query = `Tell me about ${topic.title}`;
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
          {/* Left Column - Quick Actions & Topics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-cricket-green mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100"
                    onClick={() => handleQuickAction(action.query)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{action.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                ))}
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
              <RAGChat ref={chatRef} />
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;