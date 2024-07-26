import React, { useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedInputMessage = inputMessage.trim();

    if (!trimmedInputMessage || isLoading) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('/api/chat', { prompt: trimmedInputMessage });

      let botResponseText = response.data.outputs.output.value.trim();
      botResponseText = botResponseText.replace(/\n/g, '<br />');

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
      };

      setMessages(prevMessages => [...prevMessages, botResponse]);

    } catch (error) {
      console.error('Error calling API:', error);
      setErrorMessage('Sorry, something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>Chat Interface</p>

      {messages.map((message, index) => (
        <p key={index}>{`Message from ${message.sender}: `}{message.text}</p>
      ))}

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <button disabled={isLoading} type="submit">
          {isLoading ? (
            <div>
              Sending...
            </div>
          ) : (
            <div>
              Send
            </div>
          )}
        </button>
      </form>

      <p style={{ color: 'red' }}>{errorMessage}</p>
    </div>
  );
};

export default ChatInterface;