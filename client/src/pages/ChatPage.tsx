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
    selectChat,
    createNewChat,
    addMessage,
  } = useChatContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState('');

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
    mutationFn: (variables: { prompt: string; targetChatId: string; model?: string }) =>
      sendMessage({ 
        model: 'mc_bot:0.1',
        prompt: variables.prompt,
        stream: false
      }),
    onSuccess: (data, variables) => {
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
      console.error('Error sending message:', error);
      setIsLoading(false);
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

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      {messages.length === 0 ? (
        <div className='flex flex-1 flex-col justify-center overflow-y-auto'>
          <EmptyScreen setInput={setInput} />
        </div>
      ) : (
        <MessageList
          messages={messages}
          isLoading={isLoading}
        />
      )}
      <div className='shrink-0 border-t bg-background p-4'>
        <ChatInput
          isLoading={isLoading}
          onSend={handleSend}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  );
}
