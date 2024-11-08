import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
    const [messages, setMessages] = useState([{ role: "user", content: "Hello!" }]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [financialData, setFinancialData] = useState({ profitAndLoss: null, balanceSheet: null });

    // Fetch financial data from the external API
    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                const profitAndLoss = await axios.get('https://growwth-backend-hnhc.onrender.com/Demo Company _Global_ - Balance Sheet 30 Apr 2024.json');
                const balanceSheet = await axios.get('https://growwth-backend-hnhc.onrender.com/Demo Company _Global_ - Profit and Loss 13 May 2024.json');
                
                setFinancialData({
                    profitAndLoss: profitAndLoss.data,
                    balanceSheet: balanceSheet.data,
                });
            } catch (error) {
                console.error('Error loading financial data:', error);
            }
        };

        fetchFinancialData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!financialData.profitAndLoss || !financialData.balanceSheet) {
            console.error('Financial data is not loaded.');
            return;
        }

        setIsLoading(true);

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput("");

        try {
            // Make a POST request to the external API instead of localhost
            const response = await axios.post('https://growwth-backend-hnhc.onrender.com/chat', {
                messages: newMessages,
                data: financialData, // Pass the financial data to the backend
            });
            const assistantMessage = response.data.choices[0].message;

            setMessages([...newMessages, assistantMessage]);
        } catch (error) {
            console.error('Error communicating with backend:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>AI Financial Assistant</h1>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role}>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {isLoading && <p>Assistant is typing...</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default App;
