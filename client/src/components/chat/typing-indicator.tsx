import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function TypingIndicator() {
  return (
    <div className='flex w-full gap-4'>
      <Avatar className='size-8 border shrink-0'>
        <AvatarImage src='/avatars/ai.png' alt='AI' />
        <AvatarFallback>
          <Bot className='size-4' />
        </AvatarFallback>
      </Avatar>
      <div className='flex items-center gap-1 rounded-lg bg-muted px-4 py-3'>
        <div className='flex gap-1'>
          <div className='size-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.3s]' />
          <div className='size-2 animate-bounce rounded-full bg-foreground/60 [animation-delay:-0.15s]' />
          <div className='size-2 animate-bounce rounded-full bg-foreground/60' />
        </div>
      </div>
    </div>
  );
}
