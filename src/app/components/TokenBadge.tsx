export default function TokenBadge({ agent, tokens }: { agent?: string, tokens?: number }) {
  if (!agent && !tokens) return null;
  return (
    <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 font-medium select-none">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 opacity-70">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
      </svg>
      <span>
        {agent ? agent.charAt(0).toUpperCase() + agent.slice(1) : 'Unknown'} &middot; {tokens || 0} tokens
      </span>
    </div>
  );
}
