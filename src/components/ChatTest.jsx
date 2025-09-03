import React from 'react';
import RAGChat from './RAGChat';

const ChatTest = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enhanced Chatbot Test</h1>
      <div className="max-w-md">
        <RAGChat showControls={false} />
      </div>
    </div>
  );
};

export default ChatTest;