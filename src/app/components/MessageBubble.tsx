import ReactMarkdown from 'react-markdown';
import TokenBadge from './TokenBadge';

export default function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-4 ${
        isUser 
          ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm' 
          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm'
      }`}>
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.content}</div>
        ) : (
          <div className="prose prose-sm prose-slate max-w-none break-words">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        
        {!isUser && message.agent && (
          <TokenBadge agent={message.agent} tokens={message.usage?.totalTokens || message.total_tokens} />
        )}
      </div>
    </div>
  );
}
