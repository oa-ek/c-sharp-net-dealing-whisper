import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
    isMine: boolean;
}

export const MarkdownRenderer = ({ content, isMine }: MarkdownRendererProps) => {
    return (
        <div className="break-words overflow-hidden">
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
            p: ({ node, ...props }) => <p className="leading-relaxed whitespace-pre-wrap inline" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-black" {...props} />,
            em: ({ node, ...props }) => <em className="italic opacity-95" {...props} />,
            
            h1: ({ node, ...props }) => (
                <h1 className={`block text-xl font-black tracking-tight mt-2 mb-1 uppercase ${isMine ? 'text-white' : 'text-[#111]'}`} {...props} />
            ),
            h2: ({ node, ...props }) => (
                <h2 className={`block text-lg font-extrabold tracking-tight mt-2 mb-1 ${isMine ? 'text-white/95' : 'text-gray-800'}`} {...props} />
            ),
            h3: ({ node, ...props }) => (
                <h3 className={`block text-base font-bold mt-1.5 mb-0.5 ${isMine ? 'text-white/90' : 'text-gray-700'}`} {...props} />
            ),

            // --- Стилізація таблиць ---
            table: ({ node, ...props }) => (
                <div className="w-full overflow-x-auto my-3 rounded-xl border border-current/10 shadow-xs max-w-full">
                <table className="w-full text-left border-collapse text-xs font-medium" {...props} />
                </div>
            ),
            thead: ({ node, ...props }) => (
                <thead className={`border-b text-xs uppercase font-black tracking-wider ${isMine ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-200'}`} {...props} />
            ),
            tbody: ({ node, ...props }) => <tbody className="divide-y divide-current/5" {...props} />,
            tr: ({ node, ...props }) => <tr className="transition-colors hover:bg-current/5" {...props} />,
            th: ({ node, ...props }) => (
                <th className={`px-4 py-2.5 font-bold border-r last:border-r-0 ${isMine ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700'}`} {...props} />
            ),
            td: ({ node, ...props }) => (
                <td className={`px-4 py-2 border-r last:border-r-0 ${isMine ? 'border-white/10' : 'border-gray-100'}`} {...props} />
            ),
            // ---------------------------

            code: ({ node, className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                <code className={`px-1.5 py-0.5 text-[12px] font-mono rounded ${isMine ? 'bg-white/20 text-teal-100' : 'bg-gray-100 text-pink-600'}`} {...props}>
                    {children}
                </code>
                ) : (
                <pre className={`p-2 my-1 text-[12px] font-mono rounded-lg overflow-x-auto max-w-full ${isMine ? 'bg-black/20 text-emerald-200' : 'bg-gray-900 text-gray-100'}`}>
                    <code className={className} {...props}>{children}</code>
                </pre>
                );
            },
            ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1 space-y-0.5" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1 space-y-0.5" {...props} />,
            li: ({ node, ...props }) => <li className="text-sm" {...props} />,
            a: ({ node, ...props }) => <a className={`underline font-bold ${isMine ? 'text-teal-200 hover:text-teal-100' : 'text-blue-600 hover:text-blue-500'}`} target="_blank" rel="noopener noreferrer" {...props} />
            }}
        >
            {content}
        </ReactMarkdown>
        </div>
    );
};