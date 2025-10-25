import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function ChatPanel({ eventId, userId }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", eventId],
    queryFn: () => base44.entities.Message.filter(
      { thread_id: eventId, thread_type: "event" },
      "-created_date"
    ),
    enabled: !!eventId,
    refetchInterval: 3000 // Poll every 3 seconds
  });

  const { data: users = {} } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: async () => {
      const allUsers = await base44.entities.User.list();
      return allUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data) => base44.entities.Message.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", eventId]);
      setMessage("");
    }
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !userId) return;

    await sendMessageMutation.mutateAsync({
      thread_id: eventId,
      thread_type: "event",
      sender_id: userId,
      body: message.trim()
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userId) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
          <h3 className="text-lg font-semibold mb-2">Login to chat</h3>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-red-600 hover:bg-red-700 mt-4"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-0">
        <div className="h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              <>
                {messages.slice().reverse().map((msg) => {
                  const sender = users[msg.sender_id];
                  const isMe = msg.sender_id === userId;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isMe ? "bg-red-600" : "bg-zinc-700"}>
                          {sender?.full_name?.[0] || sender?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-zinc-400">
                            {sender?.full_name || sender?.email || "User"}
                          </span>
                          <span className="text-xs text-zinc-600">
                            {format(new Date(msg.created_date), "h:mm a")}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isMe
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-800 text-zinc-100'
                          }`}
                        >
                          {msg.body}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-zinc-800">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-800 border-zinc-700"
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
