import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Send, Bot, User, Lightbulb, HelpCircle, Maximize2, Minimize2, X, ExternalLink, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ragService from '../services/ragService';

/**
 * RAGChat component for interactive chat interface
 * @param {Object} props - Component props
 * @param {Function} props.onMinimize - Function to minimize the chat
 * @param {Function} props.onClose - Function to close the chat
 * @param {boolean} props.showControls - Whether to show control buttons
 * @param {Object} ref - React ref for imperative handle
 */
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
  const navigate = useNavigate();

  const suggestions = [
    "Show available tournaments",
    "How do I register a team?",
    "Show my teams",
    "What is CricTourney?",
    "View tournament schedule",
    "How does payment work?"
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
      const response = await ragService.query(message);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
        showSuggestions: true,
        interactive: response.interactive,
        data: response.data,
        dataType: response.type,
        action: response.action
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

  const getSuggestionsForMessage = (message) => {
    if (message.interactive && message.dataType === 'tournaments') {
      return ["Show my teams", "How to register a team?", "View tournament schedule"];
    }
    if (message.interactive && message.dataType === 'teams') {
      return ["Show available tournaments", "How to create a team?", "View payment history"];
    }
    return suggestions.slice(0, 3);
  };

  const handleTournamentAction = (tournament, action) => {
    if (action === 'register') {
      navigate(`/register-team?tournamentId=${tournament.id}&fee=${tournament.entryFee}`);
    } else if (action === 'view') {
      window.location.href = `/tournament-details?tournamentId=${tournament.id}`;
    } else if (action === 'schedule') {
      navigate(`/view-schedule?tournamentId=${tournament.id}`);
    }
  };

  const handleTeamAction = (team, action) => {
    if (action === 'view') {
      navigate(`/my-team/${team.id}`);
    } else if (action === 'edit') {
      navigate(`/edit-team/${team.id}`);
    }
  };

  const renderInteractiveContent = (message) => {
    if (!message.interactive) return null;
    
    // Handle redirect actions
    if (message.action?.type === 'redirect') {
      return (
        <div className="mt-3">
          <button
            onClick={() => navigate(message.action.url)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <ExternalLink size={14} />
            Go to Payment History
          </button>
        </div>
      );
    }
    
    if (!message.data) return null;

    if (message.dataType === 'tournaments') {
      return (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {message.data.slice(0, 5).map((tournament) => (
            <div key={tournament.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm text-gray-800">{tournament.name}</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">₹{tournament.entryFee}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {tournament.city}, {tournament.state} • {tournament.teamLimit} teams
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handleTournamentAction(tournament, 'register')}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  <Users size={12} />
                  Register
                </button>
                <button
                  onClick={() => handleTournamentAction(tournament, 'view')}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink size={12} />
                  View
                </button>
                <button
                  onClick={() => handleTournamentAction(tournament, 'schedule')}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                >
                  <Calendar size={12} />
                  Schedule
                </button>
              </div>
            </div>
          ))}
          {message.data.length > 5 && (
            <div className="text-xs text-gray-500 text-center py-2">
              Showing 5 of {message.data.length} tournaments. Visit dashboard for more.
            </div>
          )}
        </div>
      );
    }

    if (message.dataType === 'teams') {
      return (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {message.data.slice(0, 5).map((team) => (
            <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm text-gray-800">{team.teamName}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID: {team.id}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Captain: {team.captainName} • Players: {team.players?.length || 0}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handleTeamAction(team, 'view')}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={12} />
                  View
                </button>
                <button
                  onClick={() => handleTeamAction(team, 'edit')}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          {message.data.length > 5 && (
            <div className="text-xs text-gray-500 text-center py-2">
              Showing 5 of {message.data.length} teams. Visit My Teams for more.
            </div>
          )}
        </div>
      );
    }

    return null;
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
                  {renderInteractiveContent(message)}
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
                        {getSuggestionsForMessage(message).map((suggestion) => (
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lightbulb size={16} />
              <span>Quick Actions:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSendMessage('Show available tournaments')}
                className="flex items-center gap-2 p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
              >
                <Users size={14} />
                <span>View Tournaments</span>
              </button>
              <button
                onClick={() => handleSendMessage('Show my teams')}
                className="flex items-center gap-2 p-2 text-sm bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors"
              >
                <ExternalLink size={14} />
                <span>My Teams</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HelpCircle size={16} />
              <span>Or ask:</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.slice(2).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                >
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



// eslint-disable-next-line react/forbid-prop-types
RAGChat.propTypes = {
  onMinimize: PropTypes.func,
  onClose: PropTypes.func,
  showControls: PropTypes.bool
};

export default RAGChat;