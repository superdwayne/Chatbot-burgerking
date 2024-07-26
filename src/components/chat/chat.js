import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHamburger } from '@fortawesome/free-solid-svg-icons'; 
import mySvg from './burger-king-9.svg'; // Import SVG file
import { Card, CardContent, CardFooter, Button, ScrollArea, Input } from '../ui/BasicUIComponents';
import './chat.css'; 

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Thinking...');
  const [errorMessage, setErrorMessage] = useState('');

  const loadingWords = ['Thinking...', 'Processing...', 'Generating...', 'Please wait...'];
  let currentWordIndex = 0;

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setLoadingText(loadingWords[currentWordIndex]);
        currentWordIndex = (currentWordIndex + 1) % loadingWords.length;
      }, 500); // Change word every 500ms

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    } else {
      setLoadingText(''); // Clear loading text when not loading
    }
  }, [isLoading]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

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
      const response = await axios.post('/api/chat', {
        prompt: inputMessage
      });

      let botResponseText = response.data.outputs?.output?.value?.trim() || 'No response received';
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
    <Card className="chat-container">
      <img src={mySvg} alt="My Icon" width="100" height="100" />
      <CardContent className="messages-area">
        <ScrollArea>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender}`}
            >
              <FontAwesomeIcon 
                icon={faHamburger} 
                className="icon" 
              />
              <div 
                className="message-text" 
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            </div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <p>{loadingText}</p>
            </div>
          )}
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="input-area">
        <Input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="input-field"
        />
        <Button onClick={handleSendMessage} disabled={isLoading} className="send-button">
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
