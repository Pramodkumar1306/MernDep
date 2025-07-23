    import React, { useState, useRef, useEffect } from "react";

    const ChatBotUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi there! 👋 How can I assist you today?" },
    ]);
    const [input, setInput] = useState("");
    const chatRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { from: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            { from: "bot", text: "🤖 I received your message!" },
        ]);
        }, 1000);
    };

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Window */}
        {isOpen && (
            <div className="w-80 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                <h2 className="font-semibold text-lg">ChatBot</h2>
                <button
                onClick={() => setIsOpen(false)}
                className="text-xl hover:text-red-300"
                >
                ×
                </button>
            </div>

            {/* Messages */}
            <div
                ref={chatRef}
                className="flex-1 px-4 py-2 space-y-2 overflow-y-auto bg-gray-50"
            >
                {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`max-w-[75%] p-2 rounded-lg text-sm ${
                    msg.from === "user"
                        ? "bg-blue-100 text-right ml-auto"
                        : "bg-gray-200 text-left mr-auto"
                    }`}
                >
                    {msg.text}
                </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
                <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
                />
                <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                Send
                </button>
            </div>
            </div>
        )}

        {/* Floating Button */}
        {!isOpen && (
            <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            title="Chat with us"
            >
            💬
            </button>
        )}
        </div>
    );
    };

    export default ChatBotUI;
