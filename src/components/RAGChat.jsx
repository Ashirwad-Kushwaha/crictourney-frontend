import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Bot, User, Lightbulb, HelpCircle, Maximize2, Minimize2, X } from 'lucide-react';
import ragService from '../services/ragService';

const RAGChat = forwardRef(({ onMinimize, onClose, showControls = false }, ref) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! Ask me anything about our cricket tournament management platform!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [chatHeight, setChatHeight] = useState(384); // 24rem in pixels
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const suggestions = [
    "How do I register a team?",
    "What is CricTourney?",
    "How does payment work?",
    "What are the user roles?",
    "How to create a tournament?",
    "Tell me about the architecture"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const rect = chatRef.current.getBoundingClientRect();
    const newHeight = e.clientY - rect.top;
    if (newHeight >= 200 && newHeight <= 800) {
      setChatHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  useImperativeHandle(ref, () => ({
    sendMessage: (message) => {
      handleSendMessage(message);
    }
  }));

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = ragService.query(message);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
        showSuggestions: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('RAG service error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      ref={chatRef}
      className="flex flex-col bg-white rounded-lg shadow-lg border relative"
      style={{ height: `${chatHeight}px` }}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">CricTourney Help</h3>
        </div>
        {showControls ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onMinimize}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <Maximize2 size={16} className="opacity-70" />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.type === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                {message.type === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 text-xs opacity-75">
                      <p className="font-semibold">Sources:</p>
                      <ul className="list-disc list-inside">
                        {message.sources.map((source) => (
                          <li key={`${message.id}-${source}`}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.type === 'bot' && message.showSuggestions && (
                    <div className="mt-3 space-y-1">
                      <div className="text-xs opacity-75 font-semibold">Ask more:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {suggestions.slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-left p-1 text-xs bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && messages.length === 1 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lightbulb size={16} />
              <span>Try asking:</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                >
                  <HelpCircle size={14} className="inline mr-2" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about CricTourney features, setup, or usage..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      
      {/* Resize Handle */}
      <button 
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center border-0 p-0"
        onMouseDown={handleMouseDown}
        aria-label="Resize chat window"
      >
        <div className="w-8 h-1 bg-gray-400 rounded"></div>
      </button>
    </div>
  );
});

export default RAGChat;