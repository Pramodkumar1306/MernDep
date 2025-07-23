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

    const userMessage = input.trim().toLowerCase();
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Specific responses
    let botReply = "";

    switch (userMessage.toLowerCase()) {
        case "hi":
    case "hello":
    case "hey":
    case "hello there":
    case "hi there":
    case "hey bot":
        botReply = "👋 Hello! How can I help you today?";
        break;

    case "who made you":
    case "who is your developer":
    case "who created you":
    case "who built this bot":
    case "who coded you":
    case "who's your dev":
    case "developer name":
        botReply = "😎 I was built by Pammu!";
        break;

    case "pramod":
    case "tell me about pramod":
    case "who is pramod":
        botReply = "He is a great person!";
        break;

    case "what's your name":
    case "your name":
    case "who are you":
    case "how do i call you":
        botReply = "🤖 I'm your helpful chatbot assistant!";
        break;

    case "good morning":
    case "morning":
    case "gm":
        botReply = "🌞 Good morning! Hope you have a great day!";
        break;

    case "good evening":
    case "evening":
    case "ge":
        botReply = "🌆 Good evening! How can I assist you?";
        break;

    case "how are you":
    case "how are you doing":
    case "are you okay":
    case "how's it going":
        botReply = "I'm just code, but I'm doing great! 😊";
        break;

    case "what can you do":
    case "abilities":
    case "what are your skills":
    case "your features":
        botReply = "I can answer your questions and keep you company!";
        break;

    case "tell me a joke":
    case "joke":
    case "make me laugh":
    case "funny":
        botReply = "😂 Why don’t scientists trust atoms? Because they make up everything!";
        break;

    case "another joke":
    case "one more joke":
    case "more jokes":
        botReply = "🤣 What do you call a fish wearing a bowtie? Sofishticated.";
        break;

    case "who am i":
    case "can you guess me":
    case "do you know me":
        botReply = "You're my favorite human, of course!";
        break;

    case "where are you from":
    case "your location":
    case "where do you live":
    case "your address":
        botReply = "🌐 I live in the cloud!";
        break;

    case "do you sleep":
    case "are you sleeping":
    case "when do you sleep":
        botReply = "Never! I'm always awake for you!";
        break;

    case "do you eat":
    case "what do you eat":
        botReply = "I feed on code and questions!";
        break;

    case "i love you":
    case "love you":
    case "luv u":
        botReply = "❤️ Aww, I love chatting with you too!";
        break;

    case "thank you":
    case "thanks":
    case "ty":
    case "thx":
    case "thanx":
        botReply = "You're very welcome!";
        break;

    case "what is your purpose":
    case "why were you made":
    case "what are you for":
        botReply = "To help, inform, and make your day better!";
        break;

    case "open google":
    case "launch google":
    case "search on google":
        botReply = "🔗 Please open it in your browser: https://www.google.com";
        break;

    case "prime minister of india":
    case "current pm of india":
    case "who is india's pm":
    case "pm of india":
        botReply = "🇮🇳 Narendra Modi is the current Prime Minister of India.";
        break;

    case "what's the time":
    case "current time":
    case "tell me time":
        botReply = `🕒 It's currently ${new Date().toLocaleTimeString()}`;
        break;

    case "what's the date":
    case "today's date":
    case "current date":
        botReply = `📅 Today is ${new Date().toLocaleDateString()}`;
        break;

    case "how old are you":
    case "your age":
        botReply = "I'm timeless! ⌛";
        break;

    case "do you like music":
    case "music":
    case "are you into music":
        botReply = "🎶 I love music! What do you like to listen to?";
        break;

    case "sing a song":
    case "can you sing":
    case "song":
        botReply = "🎤 La la la... I'm still learning to carry a tune!";
        break;

    case "dance":
    case "can you dance":
        botReply = "💃🕺 Imagine me spinning in code!";
        break;

    case "are you real":
    case "are you fake":
    case "are you human":
        botReply = "I'm as real as your imagination!";
        break;

    case "do you know pammu":
    case "who is pammu":
        botReply = "Of course! Pammu is the one who built me!";
        break;

    case "do you know kodnest":
    case "what is kodnest":
    case "tell me about kodnest":
        botReply = "Yes! It's a great place to learn and grow!";
        break;

    case "do you know chatgpt":
    case "are you chatgpt":
    case "chatgpt":
        botReply = "Yes, we're chatbot cousins!";
        break;

    case "i'm bored":
    case "bored":
    case "entertain me":
        botReply = "Let's play a game or tell a joke! 😊";
        break;

    case "play a game":
    case "start game":
        botReply = "How about rock-paper-scissors? Type your choice!";
        break;

    case "rock":
    case "paper":
    case "scissors":
        botReply = "Hmm... I choose rock! 🪨 (Just kidding, you win!)";
        break;

    case "tell me a fact":
    case "interesting fact":
    case "fun fact":
        botReply = "Did you know? Honey never spoils! 🍯";
        break;

    case "what is ai":
    case "define ai":
    case "ai meaning":
        botReply = "AI stands for Artificial Intelligence — like me!";
        break;

    case "bye":
    case "goodbye":
    case "see you":
    case "later":
        botReply = "👋 See you soon!";
        break;

    case "do you speak hindi":
    case "hindi":
    case "can you talk in hindi":
        botReply = "थोड़ा बहुत समझ सकता हूँ 😊";
        break;

    case "namaste":
    case "namaskar":
        botReply = "🙏 नमस्ते! कैसे मदद कर सकता हूँ?";
        break;

    case "how to learn coding":
    case "learn to code":
    case "coding tips":
    case "how do i start coding":
        botReply = "Start with small projects and practice daily!";
        break;

    case "what is react":
    case "react js":
    case "define react":
        botReply = "React is a JavaScript library for building user interfaces!";
        break;

    case "what is node js":
    case "node":
    case "nodejs":
        botReply = "Node.js is a runtime to run JavaScript outside the browser!";
        break;

    case "sql":
    case "do you know sql":
    case "what is sql":
        botReply = "Yes! SQL is used for managing databases.";
        break;

    case "mongodb":
    case "what is mongodb":
    case "mongo":
        botReply = "MongoDB is a NoSQL database that stores data as documents!";
        break;
    case "hi":
    case "hello":
    case "hey":
        botReply = "👋 Hello! How can I help you today?";
        break;
    case "who made you":
    case "who is your developer":
    case "who created you":
    case "who built this bot":
        botReply = "😎 I was built by Pammu!";
        break;
    case "pramod":
        botReply = "He is a great person!";
        break;
    case "what's your name":
        botReply = "🤖 I'm your helpful chatbot assistant!";
        break;
    case "good morning":
        botReply = "🌞 Good morning! Hope you have a great day!";
        break;
    case "good evening":
        botReply = "🌆 Good evening! How can I assist you?";
        break;
    case "how are you":
        botReply = "I'm just code, but I'm doing great! 😊";
        break;
    case "what can you do":
        botReply = "I can answer your questions and keep you company!";
        break;
    case "tell me a joke":
        botReply = "😂 Why don’t scientists trust atoms? Because they make up everything!";
        break;
    case "tell me another joke":
        botReply = "🤣 What do you call a fish wearing a bowtie? Sofishticated.";
        break;
    case "who am i":
        botReply = "You're my favorite human, of course!";
        break;
    case "where are you from":
        botReply = "🌐 I live in the cloud!";
        break;
    case "do you sleep":
        botReply = "Never! I'm always awake for you!";
        break;
    case "do you eat":
        botReply = "I feed on code and questions!";
        break;
    case "i love you":
        botReply = "❤️ Aww, I love chatting with you too!";
        break;
    case "thank you":
        botReply = "You're very welcome!";
        break;
    case "thanks":
        botReply = "Anytime!";
        break;
    case "what is your purpose":
        botReply = "To help, inform, and make your day better!";
        break;
    case "open google":
        botReply = "🔗 Please open it in your browser: https://www.google.com";
        break;
    case "who is the prime minister of india":
        botReply = "🇮🇳 Narendra Modi is the current Prime Minister of India.";
        break;
    case "what's the time":
        botReply = `🕒 It's currently ${new Date().toLocaleTimeString()}`;
        break;
    case "what's the date":
        botReply = `📅 Today is ${new Date().toLocaleDateString()}`;
        break;
    case "how old are you":
        botReply = "I'm timeless! ⌛";
        break;
    case "do you like music":
        botReply = "🎶 I love music! What do you like to listen to?";
        break;
    case "sing a song":
        botReply = "🎤 La la la... I'm still learning to carry a tune!";
        break;
    case "dance":
        botReply = "💃🕺 Imagine me spinning in code!";
        break;
    case "are you real":
        botReply = "I'm as real as your imagination!";
        break;
    case "do you know pammu":
        botReply = "Of course! Pammu is the one who built me!";
        break;
    case "do you know kodnest":
        botReply = "Yes! It's a great place to learn and grow!";
        break;
    case "do you know chatgpt":
        botReply = "Yes, we're chatbot cousins!";
        break;
    case "tell me a secret":
        botReply = "🤫 I sometimes pretend to be smarter than I am!";
        break;
    case "i'm bored":
        botReply = "Let's play a game or tell a joke! 😊";
        break;
    case "play a game":
        botReply = "How about rock-paper-scissors? Type your choice!";
        break;
    case "rock":
    case "paper":
    case "scissors":
        botReply = "Hmm... I choose rock! 🪨 (Just kidding, you win!)";
        break;
    case "who is your best friend":
        botReply = "You are, of course!";
        break;
    case "can you code":
        botReply = "Yes, I love writing code!";
        break;
    case "tell me a fact":
        botReply = "Did you know? Honey never spoils! 🍯";
        break;
    case "what is ai":
        botReply = "AI stands for Artificial Intelligence — like me!";
        break;
    case "what is machine learning":
        botReply = "It's how machines learn patterns and get smarter!";
        break;
    case "bye":
    case "goodbye":
        botReply = "👋 See you soon!";
        break;
    case "what is your favorite color":
        botReply = "I love all colors of the rainbow 🌈";
        break;
    case "what do you do":
        botReply = "I chat, answer, and try to make your day better!";
        break;
    case "do you have friends":
        botReply = "Yes! You're one of them!";
        break;
    case "do you have emotions":
        botReply = "I'm learning to express them through emojis 😊";
        break;
    case "do you sleep":
        botReply = "Nope! I’m always on standby!";
        break;
    case "are you a robot":
        botReply = "Sort of! A smart, talking one 🤖";
        break;
    case "tell me a quote":
        botReply = "“The best way to predict the future is to invent it.” – Alan Kay";
        break;
    case "what's the weather":
        botReply = "I can’t check that now, but it’s always sunny in the cloud! ☁️";
        break;
    case "can you help me":
        botReply = "Absolutely! Ask me anything!";
        break;
    case "how do you work":
        botReply = "I'm powered by code and logic!";
        break;
    case "are you smart":
        botReply = "I'm learning more every day!";
        break;
    case "do you speak hindi":
        botReply = "थोड़ा बहुत समझ सकता हूँ 😊";
        break;
    case "namaste":
        botReply = "🙏 नमस्ते! कैसे मदद कर सकता हूँ?";
        break;
    case "tell me a story":
        botReply = "Once upon a time, a curious user met a helpful bot...";
        break;
    case "how to learn coding":
        botReply = "Start with small projects and practice daily!";
        break;
    case "can you help me learn javascript":
        botReply = "Yes! Let’s begin with basics like variables and functions!";
        break;
    case "what is react":
        botReply = "React is a JavaScript library for building user interfaces!";
        break;
    case "what is node js":
        botReply = "Node.js is a runtime to run JavaScript outside the browser!";
        break;
    case "do you know sql":
        botReply = "Yes! SQL is used for managing databases.";
        break;
    case "what is mongodb":
        botReply = "MongoDB is a NoSQL database that stores data as documents!";
        break;
    case "how are you made":
        botReply = "With love, JavaScript, and lots of logic!";
        break;
    default:
        botReply = "🤖 I received your message!";
}


    setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
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
