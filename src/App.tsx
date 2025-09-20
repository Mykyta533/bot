import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Brain, Lightbulb, Users } from 'lucide-react';

interface Message {
  id: string;
  type: 'student' | 'bot';
  content: string;
  timestamp: Date;
  studentLevel?: 'middle' | 'high' | 'university';
  sections?: {
    explanation: string;
    example?: string;
    keyTakeaway: string;
    nextStep: string;
  };
}

const SAMPLE_RESPONSES: { [key: string]: any } = {
  'photosynthesis': {
    explanation: "Photosynthesis is the process plants use to make their own food using sunlight, water, and carbon dioxide. Think of it like a solar-powered kitchen inside every leaf — sunlight is the energy, the ingredients are water and carbon dioxide, and the 'meal' is sugar (glucose).",
    example: "When you see a green leaf in sunlight, it's literally 'cooking' its food! The green color comes from chlorophyll, which captures sunlight like a solar panel.",
    keyTakeaway: "Plants use sunlight to create food and release oxygen, which we need to breathe.",
    nextStep: "Would you like to learn about the chemical equation of photosynthesis, or explore this with simple experiments you can try?"
  },
  'gravity': {
    explanation: "Gravity is a force that pulls objects toward each other. On Earth, it pulls everything toward the center of our planet. The more massive an object is, the stronger its gravitational pull.",
    example: "When you drop a ball, gravity pulls it down to Earth. The Moon orbits Earth because of gravity's pull, and Earth orbits the Sun for the same reason!",
    keyTakeaway: "Gravity is everywhere in the universe and keeps planets, moons, and stars in their orbits.",
    nextStep: "Want to explore why astronauts float in space, or learn about how gravity affects different objects?"
  },
  'mitosis': {
    explanation: "Mitosis is how cells divide to create two identical copies of themselves. It's like cellular photocopying! This process helps organisms grow, repair injuries, and replace old cells.",
    example: "When you get a cut, your skin heals through mitosis - cells near the wound divide to create new skin cells that fill in the gap.",
    keyTakeaway: "Mitosis allows organisms to grow and repair themselves by creating identical copies of cells.",
    nextStep: "Would you like to see the stages of mitosis, or learn how it differs from meiosis (the cell division for reproduction)?"
  }
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome! I\'m your educational assistant, here to help you learn and explore new concepts.',
      timestamp: new Date(),
      sections: {
        explanation: "I'm designed to help students of all levels understand complex topics through clear explanations, real-world examples, and encouraging guidance.",
        keyTakeaway: "I'm here to support your learning journey with patience and enthusiasm!",
        nextStep: "What topic would you like to explore today? Try asking about photosynthesis, gravity, mitosis, or any subject you're curious about!"
      }
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [studentLevel, setStudentLevel] = useState<'middle' | 'high' | 'university'>('high');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let responseData = null;

    // Check for sample topics
    for (const [topic, data] of Object.entries(SAMPLE_RESPONSES)) {
      if (lowerMessage.includes(topic)) {
        responseData = data;
        break;
      }
    }

    // Default response for other topics
    if (!responseData) {
      responseData = {
        explanation: `Great question about "${userMessage}"! This is an interesting topic that connects to many areas of learning. Let me break this down in a way that's clear and engaging.`,
        example: "Think of this concept like building blocks - each part connects to create a bigger picture that helps us understand the world around us.",
        keyTakeaway: "Every question you ask is a step forward in your learning journey!",
        nextStep: "Would you like me to explain this topic in more detail, or would you prefer to explore a related concept?"
      };
    }

    // Adapt response based on student level
    let adaptedResponse = { ...responseData };
    if (studentLevel === 'middle') {
      adaptedResponse.explanation = adaptedResponse.explanation.replace(/complex/g, 'interesting').replace(/utilize/g, 'use');
    } else if (studentLevel === 'university') {
      adaptedResponse.explanation += " This concept has broader implications in advanced studies and research applications.";
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: 'Here\'s what I found for you:',
      timestamp: new Date(),
      studentLevel,
      sections: adaptedResponse
    };
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'student',
      content: currentMessage,
      timestamp: new Date(),
      studentLevel
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(currentMessage);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EduBot Assistant
                </h1>
                <p className="text-sm text-gray-600">Your personal learning companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <select 
                  value={studentLevel} 
                  onChange={(e) => setStudentLevel(e.target.value as any)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                >
                  <option value="middle">Middle School</option>
                  <option value="high">High School</option>
                  <option value="university">University</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'student' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl shadow-sm`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center space-x-2 p-4 pb-2 border-b border-gray-100">
                      <Brain className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold text-gray-700">EduBot Assistant</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {message.studentLevel?.charAt(0).toUpperCase() + message.studentLevel?.slice(1)} Level
                      </span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <p className={`${message.type === 'student' ? 'text-white' : 'text-gray-800'} leading-relaxed`}>
                      {message.content}
                    </p>
                    
                    {message.sections && (
                      <div className="mt-4 space-y-4">
                        {/* Explanation */}
                        <div className="bg-blue-50 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Explanation
                          </h4>
                          <p className="text-blue-700 leading-relaxed">{message.sections.explanation}</p>
                        </div>
                        
                        {/* Example */}
                        {message.sections.example && (
                          <div className="bg-green-50 rounded-xl p-4">
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                              <Lightbulb className="w-4 h-4 mr-2" />
                              Example
                            </h4>
                            <p className="text-green-700 leading-relaxed">{message.sections.example}</p>
                          </div>
                        )}
                        
                        {/* Key Takeaway */}
                        <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
                          <h4 className="font-semibold text-yellow-800 mb-2">🔑 Key Takeaway</h4>
                          <p className="text-yellow-700 leading-relaxed font-medium">{message.sections.keyTakeaway}</p>
                        </div>
                        
                        {/* Next Step */}
                        <div className="bg-purple-50 rounded-xl p-4">
                          <h4 className="font-semibold text-purple-800 mb-2">🚀 Next Step</h4>
                          <p className="text-purple-700 leading-relaxed">{message.sections.nextStep}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`px-4 pb-3 text-xs ${message.type === 'student' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white/80 p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your studies..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all bg-white/90"
                  rows={2}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Questions */}
        <div className="mt-8 bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="font-semibold text-gray-700 mb-4">Try asking about:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(SAMPLE_RESPONSES).map((topic) => (
              <button
                key={topic}
                onClick={() => setCurrentMessage(`What is ${topic}?`)}
                className="p-3 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-xl text-left transition-all hover:shadow-md hover:scale-105 group"
              >
                <span className="text-gray-700 font-medium capitalize group-hover:text-indigo-600 transition-colors">
                  {topic}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;