import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, X, Minimize2, Maximize2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi there! I'm your ApnaFreelancer assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested questions for users to quickly get help
  const suggestedQuestions: SuggestedQuestion[] = [
    { id: "q1", text: "How do I hire a freelancer?" },
    { id: "q2", text: "How do I create a service?" },
    { id: "q3", text: "How payments work?" },
    { id: "q4", text: "What is the service fee?" },
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate a delay to make it feel more natural
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const generateBotResponse = (userInput: string): Message => {
    const lowercasedInput = userInput.toLowerCase();
    let response = "";

    // Simple rule-based responses
    if (lowercasedInput.includes("hire") || lowercasedInput.includes("find freelancer")) {
      response = "To hire a freelancer, you can browse through the available services on the 'Hire Talent' page or post a specific job on the 'Post a Job' page. You can filter by skills, ratings, and budget to find the perfect match for your project.";
    } else if (lowercasedInput.includes("create service") || lowercasedInput.includes("offer service")) {
      response = "To create a service, log in to your account, navigate to the 'Create Service' page, and fill out the form with details about what you offer. Be specific about deliverables, pricing, and your expertise to attract clients.";
    } else if (lowercasedInput.includes("payment") || lowercasedInput.includes("pay")) {
      response = "Payments on ApnaFreelancer are securely processed through our platform. Clients make payments upfront, but funds are only released to freelancers once the work is completed and approved. This ensures protection for both parties.";
    } else if (lowercasedInput.includes("fee") || lowercasedInput.includes("commission")) {
      response = "ApnaFreelancer charges a 10% service fee on all transactions. This fee helps us maintain the platform, provide customer support, and ensure secure payment processing.";
    } else if (lowercasedInput.includes("hello") || lowercasedInput.includes("hi") || lowercasedInput.includes("hey")) {
      response = "Hello! How can I assist you with ApnaFreelancer today?";
    } else if (lowercasedInput.includes("thank")) {
      response = "You're welcome! Is there anything else you'd like to know about ApnaFreelancer?";
    } else if (lowercasedInput.includes("account") || lowercasedInput.includes("sign up") || lowercasedInput.includes("register")) {
      response = "Creating an account is easy! Click the 'Join Now' button in the navigation bar and follow the simple registration process. You can sign up as a client, freelancer, or both.";
    } else if (lowercasedInput.includes("profile") || lowercasedInput.includes("portfolio")) {
      response = "To build a strong profile, add a professional photo, detailed bio, and showcase your skills and experience. For freelancers, a well-crafted portfolio can significantly increase your chances of getting hired.";
    } else if (lowercasedInput.includes("review") || lowercasedInput.includes("rating")) {
      response = "Ratings and reviews are crucial on ApnaFreelancer. After completing a project, clients can rate their experience with freelancers, and freelancers can rate clients. This helps build trust in the community.";
    } else if (lowercasedInput.includes("dispute") || lowercasedInput.includes("problem") || lowercasedInput.includes("issue")) {
      response = "If you encounter any issues with a project or payment, you can open a dispute through our Resolution Center. Our support team will review the case and help mediate a fair solution.";
    } else {
      response = "I'm not sure I understand that question. Could you try rephrasing it? Or you can ask about hiring freelancers, creating services, payments, or service fees.";
    }

    return {
      id: `bot-${Date.now()}`,
      text: response,
      sender: "bot",
      timestamp: new Date(),
    };
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleChat}
              size="lg"
              className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
              aria-label="Open chat"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="w-80 sm:w-96 shadow-xl border border-border overflow-hidden">
              {/* Chat header */}
              <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <h3 className="font-medium">ApnaFreelancer Assistant</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
                    onClick={toggleMinimize}
                    aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
                    onClick={toggleChat}
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Messages */}
                    <div className="p-3 h-80 overflow-y-auto bg-muted/30">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                              "flex items-start gap-2 max-w-[85%]",
                              message.sender === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                          >
                            <Avatar className={cn(
                              "h-8 w-8",
                              message.sender === "bot" ? "bg-primary" : "bg-muted-foreground"
                            )}>
                              {message.sender === "bot" ? (
                                <Bot className="h-4 w-4 text-primary-foreground" />
                              ) : (
                                <User className="h-4 w-4 text-muted" />
                              )}
                            </Avatar>
                            <div
                              className={cn(
                                "rounded-lg py-2 px-3 text-sm",
                                message.sender === "bot"
                                  ? "bg-muted text-foreground"
                                  : "bg-primary text-primary-foreground"
                              )}
                            >
                              {message.text}
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start gap-2 max-w-[85%]"
                          >
                            <Avatar className="h-8 w-8 bg-primary">
                              <Bot className="h-4 w-4 text-primary-foreground" />
                            </Avatar>
                            <div className="bg-muted rounded-lg py-2 px-3 text-sm flex items-center space-x-1">
                              <span className="animate-bounce">•</span>
                              <span className="animate-bounce delay-150">•</span>
                              <span className="animate-bounce delay-300">•</span>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Suggested questions */}
                    <div className="px-3 py-2 flex overflow-x-auto space-x-2 bg-background border-t">
                      {suggestedQuestions.map((question) => (
                        <Button
                          key={question.id}
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap text-xs h-7"
                          onClick={() => handleSuggestedQuestion(question.text)}
                        >
                          {question.text}
                        </Button>
                      ))}
                    </div>

                    {/* Input area */}
                    <div className="p-3 border-t flex items-center gap-2 bg-background">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={inputValue.trim() === "" || isTyping}
                        size="icon"
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;