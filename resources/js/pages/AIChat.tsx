import { router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AppLayout from "@/layouts/app-layout";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    updated_at: string;
}

interface ChatProps {
    initialMessages?: Message[];
    initialConversationId?: string | null;
    conversations?: Conversation[];
}

export default function AIChat({ initialMessages = [], initialConversationId = null, conversations = [] }: ChatProps): JSX.Element {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Update state when props change (e.g., when switching conversations)
    useEffect(() => {
        setMessages(initialMessages);
        setConversationId(initialConversationId);
    }, [initialMessages, initialConversationId]);

    const startNewChat = () => {
        setMessages([]);
        setConversationId(null);
        router.visit('/ai-chat?new=true');
    };

    const loadConversation = (id: string) => {
        router.visit(`/ai-chat/${id}`, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const sendMessage = async (): Promise<void> => {
        if (!message.trim()) {
            return;
        }

        const userMsg: Message = { role: 'user', content: message };
        setMessages(prev => [...prev, userMsg]);
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch("/ask-ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ""
                },
                body: JSON.stringify({
                    message: userMsg.content,
                    conversation_id: conversationId
                })
            });

            if (!res.ok) {
                throw new Error("Request failed");
            }

            const data: { reply: string; conversation_id: string } = await res.json();

            const aiMsg: Message = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, aiMsg]);

            if (!conversationId) {
                setConversationId(data.conversation_id);
                // Refresh conversation list after new chat starts
                router.reload({ only: ['conversations'] });
            }
        } catch (_error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, something went wrong. Please check your connection or try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'AI Chat', href: '/ai-chat' }]}>
            <div className="flex h-[calc(100vh-8rem)] gap-4 p-4">
                {/* Conversations Sidebar */}
                <div className="w-80 flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-sidebar-border/70 overflow-hidden shrink-0">
                    <div className="p-4 border-b border-sidebar-border/70 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-800/50">
                        <h2 className="font-bold text-neutral-700 dark:text-neutral-200">History</h2>
                        <button
                            onClick={startNewChat}
                            className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                            title="New Chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
                        {conversations.length === 0 ? (
                            <div className="text-center py-8 text-neutral-400 text-sm italic">No past conversations</div>
                        ) : (
                            conversations.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => loadConversation(c.id)}
                                    className={`w-full text-left p-3 rounded-xl transition-all ${conversationId === c.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800'
                                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                        }`}
                                >
                                    <div className="font-medium text-sm truncate">{c.title}</div>
                                    <div className="text-[10px] opacity-60 mt-1">{c.updated_at}</div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-sidebar-border/70 flex flex-col overflow-hidden">
                    {/* Chat Body */}
                    <div className="flex-1 p-6 overflow-y-auto scroll-smooth no-scrollbar">
                        {messages.length === 0 && !isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-4">
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-full text-blue-600">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-200">Start a new conversation</h3>
                                    <p className="text-sm mt-2 max-w-xs">Ask me anything and I'll keep track of our conversation history.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto w-full space-y-8 pb-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex items-center space-x-2 mb-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm ${msg.role === 'user' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600' : 'bg-blue-600 text-white'
                                                }`}>
                                                {msg.role === 'user' ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                                                {msg.role === 'user' ? 'You' : 'Assistant'}
                                            </span>
                                        </div>
                                        <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-700 rounded-tl-none prose prose-blue dark:prose-invert prose-sm'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                msg.content
                                            ) : (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ node: _node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                        code: ({ node: _node, ...props }: any) => {
                                                            const { inline, ...rest } = props;

                                                            return inline
                                                                ? <code className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs" {...rest} />
                                                                : <div className="bg-neutral-900 text-neutral-100 p-5 rounded-2xl my-5 overflow-x-auto border border-neutral-800 shadow-inner"><code className="font-mono text-xs leading-relaxed" {...rest} /></div>;
                                                        },
                                                        table: ({ node: _node, ...props }) => <div className="overflow-x-auto my-5 rounded-xl border border-neutral-200 dark:border-neutral-700"><table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700" {...props} /></div>,
                                                        th: ({ node: _node, ...props }) => <th className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-500" {...props} />,
                                                        td: ({ node: _node, ...props }) => <td className="px-4 py-3 text-sm border-t border-neutral-100 dark:border-neutral-800" {...props} />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-start space-x-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-3xl rounded-tl-none border border-neutral-100 dark:border-neutral-700 flex space-x-2 items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            <span className="text-xs font-medium text-neutral-400 ml-2 italic">Generating answer...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <div className="p-6 bg-gray-50/50 dark:bg-neutral-800/50 border-t border-sidebar-border/70 shrink-0">
                        <div className="max-w-4xl mx-auto flex gap-3">
                            <input
                                type="text"
                                placeholder="Message AI Assistant..."
                                className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-neutral-700 dark:text-neutral-200 shadow-sm"
                                value={message}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && sendMessage()}
                                disabled={isLoading}
                            />

                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !message.trim()}
                                className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-md active:transform active:scale-95 disabled:opacity-50 flex items-center justify-center ${isLoading ? 'bg-blue-300 text-white cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200/50'
                                    }`}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}