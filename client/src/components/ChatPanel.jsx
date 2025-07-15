import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Languages } from "lucide-react";

export default function ChatPanel({ messages, onSendMessage, currentUser }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Chat</h3>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex flex-col space-y-2">
                <div className={`max-w-xs ${
                  message.senderName === currentUser ? "self-end" : "self-start"
                }`}>
                  <div className={`p-3 rounded-lg ${
                    message.senderName === currentUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-700 text-white rounded-tl-none"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.translation && message.senderName !== currentUser && (
                      <div className="text-xs text-gray-300 mt-2 pt-2 border-t border-gray-600">
                        <Languages className="w-3 h-3 inline mr-1" />
                        <span>{message.translation}</span>
                      </div>
                    )}
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${
                    message.senderName === currentUser ? "text-right" : ""
                  }`}>
                    <span>{message.senderName}</span> • 
                    <span className="ml-1">{formatTime(message.sentAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
