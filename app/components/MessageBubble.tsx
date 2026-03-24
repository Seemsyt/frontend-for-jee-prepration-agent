import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 w-full`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-lg px-3 md:px-4 py-2 md:py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="font-semibold text-xs mb-1 opacity-75 hidden">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words dark:prose-invert text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { inline, className, children, ...rest } = props as any;
                return inline ? (
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono" {...rest}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto text-sm">
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  </pre>
                );
              },
              a({ node, ...props }) {
                return (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    {...props}
                  />
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}