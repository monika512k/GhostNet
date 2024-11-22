/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { pusherClient } from "@/lib/pusher";
import { Clock, Crosshair, Loader, Send, Shield } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface ChatComponentProps {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
}

export default function ChatComponent({
  senderId,
  receiverId,
  senderName,
  receiverName,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Existing useEffect hooks and functions remain the same...
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?senderId=${senderId}&receiverId=${receiverId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      // Subscribe to both channel combinations to receive messages in both directions
      const channel1 = pusherClient.subscribe(`chat-${senderId}-${receiverId}`);
      const channel2 = pusherClient.subscribe(`chat-${receiverId}-${senderId}`);

      const handleNewMessage = (data: Message) => {
        setMessages((prevMessages) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prevMessages.some((msg) => msg.id === data.id);
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, data];
        });
      };

      channel1.bind("new-message", handleNewMessage);
      channel2.bind("new-message", handleNewMessage);

      return () => {
        channel1.unbind("new-message");
        channel2.unbind("new-message");
        pusherClient.unsubscribe(`chat-${senderId}-${receiverId}`);
        pusherClient.unsubscribe(`chat-${receiverId}-${senderId}`);
      };
    }
  }, [senderId, receiverId, isLoading]);

  const formatMessageTime = (dateString: string) => {
    return new Intl.DateTimeFormat("default", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Create a temporary message object for optimistic UI update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageInput,
      senderId,
      receiverId,
      createdAt: new Date().toISOString(),
    };

    // Optimistically add the message to the UI
    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageInput,
          senderId,
          receiverId,
        }),
      });

      if (!response.ok) {
        // If the request failed, remove the temporary message
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        // Optionally show an error message to the user
        console.error("Failed to send message");
      }
    } catch (error) {
      // If there was an error, remove the temporary message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      console.error("Failed to send message:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <div className="backdrop-blur-xl bg-black/40 rounded-3xl shadow-2xl border border-cyan-500/20 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-['Orbitron'] font-bold flex items-center gap-3">
                <Shield className="w-8 h-8 text-cyan-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  SECURE COMMS
                </span>
              </h2>
              <div className="flex items-center gap-3">
                <Crosshair className="w-5 h-5 text-cyan-400" />
                <span className="font-['Rajdhani'] text-xl text-cyan-300">
                  Target: {receiverName}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/60 to-purple-900/20">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-8 h-8 text-cyan-500 animate-spin" />
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-cyan-300 font-['Rajdhani'] text-xl">
                      Secure channel established. Commence transmission.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === senderId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl p-4 backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-105 ${
                          message.senderId === senderId
                            ? "bg-gradient-to-r from-blue-600/50 to-purple-600/50 border border-cyan-500/30"
                            : "bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30"
                        }`}
                      >
                        <p className="font-['Rajdhani'] text-lg">
                          {message.content}
                        </p>
                        <div className="text-sm mt-2 flex items-center gap-2 text-cyan-300">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-t border-cyan-500/20">
            <form onSubmit={sendMessage} className="flex gap-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-grow p-4 bg-black/50 border border-cyan-500/30 rounded-xl text-cyan-300 placeholder-cyan-700 font-['Rajdhani'] focus:outline-none focus:border-cyan-400 transition-all duration-300"
                placeholder="Enter transmission..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`p-4 rounded-xl transition-all duration-300 ease-in-out ${
                  isLoading
                    ? "bg-gray-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transform hover:scale-105 border border-cyan-400/30"
                }`}
                disabled={isLoading}
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
