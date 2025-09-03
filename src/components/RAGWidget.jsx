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
          isMinimized ? 'w-96 h-16' : 'w-96 h-[500px]'
        }`}>
          {!isMinimized ? (
            <RAGChat 
              showControls={true}
              onMinimize={toggleMinimize}
              onClose={toggleWidget}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-2xl border h-full flex flex-col">
              {/* Minimized Header */}
              <div className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-between h-full">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span className="font-semibold">CricTourney Help</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMinimize}
                    className="hover:bg-blue-700 p-1 rounded transition-colors"
                    aria-label="Maximize"
                  >
                    <Maximize2 size={16} />
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
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RAGWidget;