import React, { useState } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import RAGChat from './RAGChat';

const RAGWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open CricTourney Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          <div className="bg-white rounded-lg shadow-2xl border h-full flex flex-col">
            {/* Widget Header */}
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="font-semibold">CricTourney Help</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMinimize}
                  className="hover:bg-blue-700 p-1 rounded transition-colors"
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={toggleWidget}
                  className="hover:bg-blue-700 p-1 rounded transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <RAGChat />
              </div>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="flex-1 flex items-center justify-center text-gray-600">
                <span className="text-sm">Click to expand chat</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RAGWidget;