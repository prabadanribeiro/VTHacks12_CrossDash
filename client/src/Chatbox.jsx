import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Chatbox.css'

const openAIAPIKey = process.env.REACT_APP_OPEN_AI_API_KEY;

export default function Chatbox({advice, audio}) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');

  const facts = `You have told the user: 
    ${advice}, based off what the user told you:
    ${audio}
  `;

  useEffect(() => {
    let intervalId;

    if (isLoading) {
      intervalId = setInterval(() => {
        setThinkingDots((prev) => {
          if (prev.length < 3) {
            return prev + '.';
          }
          return '';
        });
      }, 500);
    } else {
      setThinkingDots('');
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoading]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput('');
    setIsLoading(true);

    const thinkingMessage = { role: 'ai', content: 'Thinking...' };
    setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are going to assist a program called CrossDash. You will be generating text to aid the user
                in a time of an emergency. In addition to this, CrossDash has already contacted 911 and other emergency services,
                please do not ask the user to contact any services. We want the user to be taking any steps to ensure safety as the 
                emergency services are on their way. Please make sure you keep it professional, but also brief as it is a life or death
                scenario. You also have access to this information from a previous conversation to aid you in your talk with the user.
                ${facts}`,
            },
            ...messages,
            userMessage,
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAIAPIKey}`,
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), 
        assistantMessage,
      ]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chatbox">
      <h2 className="chatbox-header">CrossDash AI Helper</h2>
      {messages.length > 0 && (
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chatbox-message">
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>{' '}
              {msg.content}
              {isLoading && index === messages.length - 1 && msg.role === 'ai' && (
                <span>{thinkingDots}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="chatbox-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CrossDash's AI..."
          className="chatbox-input"
        />
        <button type="submit" disabled={isLoading} className="chatbox-button">
          Send
        </button>
      </form>
    </div>
  );
}