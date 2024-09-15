import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Chatbox({advice, audio}) {

  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');       
  const [isLoading, setIsLoading] = useState(false);

  const facts = `After the user has told you 
    ${advice} and told the user:
    ${audio}
  `;

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are going to assist a program called CrossDash. You will be generating text to aid the user
                in a time of an emergency. In addition to this, CrossDash has already contacted 911 and other emergency services,
                please do not ask the user to contact any services. We want the user to be taking any steps to ensure safety as the 
                emergency services are on their way. Please make sure you keep it professional, but also brief as it is a life or death
                scenario. You also have access to this information from a previous conversation to aid you in your talk with the user.
                ${facts}` },
            ...messages,
            userMessage,
          ], 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>CrossDash AI Helper</h2>
      <div style={{ 
        maxHeight: '500px',    // Set a maximum height of 500px
        overflowY: 'auto',     // Make it scrollable when content exceeds 500px
        marginBottom: '20px', 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '5px'    // Added to match the outer container
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your fitness coach..."
          style={{ width: '80%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px', marginLeft: '10px' }}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
