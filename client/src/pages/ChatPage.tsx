import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { type Message } from '@/lib/types';
import { EmptyScreen } from '@/components/chat/empty-screen';
import { useChatContext } from '@/lib/chat-context';
import { sendMessage } from '@/api/ai';
import { toast } from 'sonner';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const {
    chats,
    currentChatId,
    selectedModel,
    selectChat,
    createNewChat,
    addMessage,
  } = useChatContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState('');
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Sync URL chatId with context
  React.useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      const chatExists = chats.find((chat) => chat.id === chatId);
      if (chatExists) {
        selectChat(chatId);
      } else {
        // Chat doesn't exist, redirect to home
        navigate('/', { replace: true });
      }
    } else if (!chatId && currentChatId) {
      // Clear current chat when navigating to home
      selectChat('');
    }
  }, [chatId, currentChatId, chats, selectChat, navigate]);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  // Mutation for sending message
  const sendMessageMutation = useMutation({
    mutationFn: (variables: { prompt: string; targetChatId: string; model?: string }) => {
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      return sendMessage(
        { 
          model: selectedModel || import.meta.env.VITE_DEFAULT_MODEL || 'llama3:3b',
          prompt: variables.prompt,
          stream: false
        },
        abortControllerRef.current.signal
      );
    },
    onSuccess: (data, variables) => {
      abortControllerRef.current = null;
      const aiMessageId = (Date.now() + 1).toString();
      const aiResponse: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
      };
      addMessage(aiResponse, variables.targetChatId);
      setIsLoading(false);
    },
    onError: (error) => {
      abortControllerRef.current = null;
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // Don't show error toast if request was cancelled
      if (error instanceof Error && error.name === 'CanceledError') {
        toast.info('Message cancelled');
        return;
      }
      
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    },
  });

  const handleSend = async (content: string) => {
    let targetChatId = currentChatId;

    // Create a new chat if we don't have one
    if (!targetChatId) {
      targetChatId = createNewChat();
      selectChat(targetChatId);
      navigate(`/chat/${targetChatId}`, { replace: true });
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date(),
    };
    addMessage(newMessage, targetChatId);
    setIsLoading(true);

    // Send message to AI
    sendMessageMutation.mutate({ 
      prompt: content, 
      targetChatId 
    });
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  return (
    <div className='relative flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto'>
        {messages.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center'>
            <EmptyScreen setInput={setInput} />
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className='shrink-0 border-t bg-background p-4'>
        <ChatInput
          isLoading={isLoading}
          onSend={handleSend}
          onStop={handleStop}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  );
}
