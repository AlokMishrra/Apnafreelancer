import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Phone, Video, MoreVertical, Paperclip } from "lucide-react";
import type { User, Message } from "@shared/schema";

interface Conversation {
  user: User;
  lastMessage: Message;
}

export default function MessagingInterface() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!currentUser,
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConversation],
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      return await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation,
      content: messageText.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = conversations.filter((conv) =>
    `${conv.user.firstName} ${conv.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const selectedUser = conversations.find((conv) => conv.user.id === selectedConversation)?.user;

  return (
    <Card className="h-[600px] overflow-hidden animate-scale-in" data-testid="card-messaging-interface">
      <div className="grid lg:grid-cols-3 h-full">
        {/* Conversations List */}
        <div className="lg:border-r border-border bg-secondary/50">
          <div className="p-6 border-b border-border">
            <h3 className="font-poppins font-semibold text-charcoal text-lg mb-3">Messages</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                data-testid="input-search-conversations"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(600px-140px)]">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.user.id}
                  onClick={() => setSelectedConversation(conversation.user.id)}
                  className={`p-4 border-b border-border hover:bg-background cursor-pointer transition-colors duration-200 ${
                    selectedConversation === conversation.user.id ? "bg-accent/10" : ""
                  }`}
                  data-testid={`conversation-${conversation.user.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          conversation.user.profileImageUrl ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50"
                        }
                        alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                        data-testid={`img-conversation-${conversation.user.id}`}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-3 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-charcoal text-sm" data-testid={`name-conversation-${conversation.user.id}`}>
                          {conversation.user.firstName} {conversation.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.lastMessage.createdAt ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : ''}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-testid={`last-message-${conversation.user.id}`}>
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {conversation.user.skills?.[0] || "Freelancer"}
                        </span>
                        {!conversation.lastMessage.isRead &&
                          conversation.lastMessage.senderId !== (currentUser as any)?.id && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
          {selectedConversation && selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        selectedUser.profileImageUrl ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50"
                      }
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                      data-testid={`img-chat-header-${selectedUser.id}`}
                    />
                    <div>
                      <h4 className="font-medium text-charcoal" data-testid={`name-chat-header-${selectedUser.id}`}>
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.availability === "available" ? "Online now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="hover:bg-secondary">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-secondary">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-secondary">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Start a conversation with {selectedUser.firstName}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.senderId === (currentUser as any)?.id ? "justify-end" : ""
                      }`}
                      data-testid={`message-${message.id}`}
                    >
                      {message.senderId !== (currentUser as any)?.id && (
                        <img
                          src={
                            selectedUser.profileImageUrl ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
                          }
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div
                        className={`flex-1 ${
                          message.senderId === (currentUser as any)?.id ? "flex flex-col items-end" : ""
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl max-w-xs ${
                            message.senderId === (currentUser as any)?.id
                              ? "bg-primary text-primary-foreground rounded-tr-md"
                              : "bg-secondary text-charcoal rounded-tl-md"
                          }`}
                        >
                          <p className="text-sm" data-testid={`content-message-${message.id}`}>
                            {message.content}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : ''}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-border bg-secondary/30">
                <div className="flex items-end space-x-3">
                  <Button variant="ghost" size="icon" className="hover:bg-secondary">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={1}
                      className="w-full px-4 py-3 rounded-xl resize-none"
                      data-testid="textarea-message-input"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
