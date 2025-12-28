import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { type Message } from '@/lib/types';
import { EmptyScreen } from '@/components/chat/empty-screen';
import { useChatContext } from '@/lib/chat-context';
import { sendMessage, sendMessageStream } from '@/api/ai';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const {
    chats,
    currentChatId,
    selectChat,
    createNewChat,
    addMessage,
    updateMessage,
  } = useChatContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [streamingMessageId, setStreamingMessageId] = React.useState<
    string | null
  >(null);

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

  // Mutation for sending message (non-streaming fallback)
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
      // TODO: Show error toast/notification to user
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

    // Try to use streaming API first
    try {
      throw new Error('Force fallback'); // TEMP: Force fallback to non-streaming for now
      const aiMessageId = (Date.now() + 1).toString();
      setStreamingMessageId(aiMessageId);

      // Add empty message first
      const aiResponse: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };
      addMessage(aiResponse, targetChatId);

      let accumulatedContent = '';

      await sendMessageStream(
        { 
          model: 'mc_bot:latest',
          prompt: content,
          stream: true
        },
        (chunk) => {
          console.log(chunk)
          // On chunk received
          let aiMessage = ''
          try {
            aiMessage = JSON.parse(chunk).response
          } catch {
            // If parsing fails, keep the original chunk
            aiMessage = chunk
          }
          accumulatedContent += aiMessage;
          updateMessage(aiMessageId, accumulatedContent, targetChatId);
        },
        () => {
          // On complete
          setIsLoading(false);
          setStreamingMessageId(null);
        },
        (error) => {
          // On error - fall back to non-streaming
          console.error('Streaming error, falling back to regular API:', error);
          setStreamingMessageId(null);
          
          // Remove the empty streaming message
          // Fall back to non-streaming API
          sendMessageMutation.mutate({ 
            prompt: content, 
            targetChatId 
          });
        }
      );
    } catch (error) {
      // If streaming fails, use regular mutation
      console.error('Failed to initialize stream:', error);
      setStreamingMessageId(null);
      sendMessageMutation.mutate({ 
        prompt: content, 
        targetChatId 
      });
    }
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
          streamingMessageId={streamingMessageId}
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
