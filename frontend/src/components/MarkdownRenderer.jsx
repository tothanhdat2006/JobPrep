import React from 'react';

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const parseMarkdown = (text) => {
    let html = text;

    // Headers (h1-h6)
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-800 mt-5 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-800 mt-6 mb-3">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="font-semibold text-slate-900">$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

    // Code blocks (```language)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto my-3"><code class="text-sm font-mono">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Unordered lists
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-4 mb-1">• $1</li>');
    html = html.replace(/^- (.+)$/gim, '<li class="ml-4 mb-1">• $1</li>');
    
    // Ordered lists
    html = html.replace(/^\d+\.\s(.+)$/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>');

    // Wrap consecutive list items in ul
    html = html.replace(/(<li class="ml-4 mb-1">• .+<\/li>\n?)+/g, (match) => {
      return `<ul class="space-y-1 my-2">${match}</ul>`;
    });

    // Wrap consecutive ordered list items in ol
    html = html.replace(/(<li class="ml-4 mb-1 list-decimal">.+<\/li>\n?)+/g, (match) => {
      return `<ol class="list-decimal ml-6 space-y-1 my-2">${match}</ol>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-2">$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-4 border-slate-300" />');
    html = html.replace(/^\*\*\*$/gim, '<hr class="my-4 border-slate-300" />');

    // Line breaks (double newlines to paragraphs)
    html = html.split('\n\n').map(para => {
      if (para.trim() && 
          !para.startsWith('<h') && 
          !para.startsWith('<ul') && 
          !para.startsWith('<ol') && 
          !para.startsWith('<pre') &&
          !para.startsWith('<blockquote') &&
          !para.startsWith('<hr')) {
        return `<p class="mb-3 leading-relaxed">${para.trim()}</p>`;
      }
      return para;
    }).join('\n');

    // Single line breaks to <br>
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  const renderedContent = parseMarkdown(content);

  return (
    <div 
      className="markdown-content text-slate-700"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default MarkdownRenderer;
