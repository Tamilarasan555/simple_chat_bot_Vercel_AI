'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { PlusIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

// Component to render a single message bubble
const MessageBubble = ({ message }: { message: { id: string; role: string; content: string } }) => (
  <div
    key={message.id}
    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div
      className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${ 
        message.role === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-200 text-gray-900'
      }`}
    >
      {message.content}
    </div>
  </div>
);

// Component for the loading indicator
const LoadingSpinner = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  </div>
);

// Component for the chat input bar
const ChatInputBar = ({
  input,
  handleInputChange,
  handleSubmit,
  isInputAtBottom,
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isInputAtBottom: boolean;
}) => (
  <div className={`fixed inset-x-0 z-20 px-4 sm:px-6 lg:px-8 flex justify-center ${isInputAtBottom ? 'bottom-4' : 'top-1/2 transform -translate-y-1/2'}`}>
    {/* Pill-shaped Form Container */}
    <div className="bg-white rounded-full shadow-lg px-4 py-2 w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3 w-full">
        {/* Placeholder Icons (Left) */}
        <button type="button" className="p-1 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none">
          <PlusIcon className="h-6 w-6" />
        </button>
        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything"
          className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
        />
        {/* Placeholder Icon (Right) */}
        <button type="button" className="p-1.5 rounded-full bg-black text-white hover:bg-gray-800 focus:outline-none">
          <MicrophoneIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  </div>
);



export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [isInputAtBottom, setIsInputAtBottom] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const checkContentHeight = () => {
      const mainEl = mainRef.current;
      const contentEl = chatContentRef.current;
      if (mainEl && contentEl) {
        const contentHeight = contentEl.scrollHeight;
        // Use window height as reference for when content might reach the middle
        const viewportHeight = window.innerHeight;
        // Threshold: Move input down if content height exceeds 40% of viewport height
        const threshold = viewportHeight * 0.4;
        setIsInputAtBottom(contentHeight > threshold);
      }
    };

    // Initial check
    checkContentHeight();

    // Check on messages update
    // We might need a slight delay or ResizeObserver if scrollHeight isn't updated immediately
    const timeoutId = setTimeout(checkContentHeight, 50); 

    // Check on window resize
    window.addEventListener('resize', checkContentHeight);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkContentHeight);
    };
  }, [messages]); // Re-run when messages change

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">AI Chat</h1>
        </div>
      </header>

      <main ref={mainRef} className={`flex-grow overflow-auto ${isInputAtBottom ? 'pb-24' : 'pb-4'}`}> {/* Added ref, conditional padding */}
        <div ref={chatContentRef} className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8"> {/* Added ref */}
          <div className="space-y-6">
            {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
            {isLoading && <LoadingSpinner />}
          </div>
        </div>
      </main>

      <ChatInputBar
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isInputAtBottom={isInputAtBottom}
      />
    </div>
  );
}