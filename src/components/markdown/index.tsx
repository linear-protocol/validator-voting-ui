import './index.css';

import { useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useCopyToClipboard } from 'react-use';
import RehypeHighlight from 'rehype-highlight';
import RehypeRaw from 'rehype-raw';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

export interface MarkdownProps {
  content: string;
}

function escapeBrackets(text: string) {
  const pattern = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(pattern, (match, codeBlock, squareBracket, roundBracket) => {
    if (codeBlock) {
      return codeBlock;
    } else if (squareBracket) {
      return `$$${squareBracket}$$`;
    } else if (roundBracket) {
      return `$${roundBracket}$`;
    }
    return match;
  });
}

function tryWrapHtmlCode(text: string) {
  if (text.includes('```')) {
    return text;
  }
  return text
    .replace(/([`]*?)(\w*?)([\n\r]*?)(<!DOCTYPE html>)/g, (match, quoteStart, doctype) => {
      return !quoteStart ? '\n```html\n' + doctype : match;
    })
    .replace(
      /(<\/body>)([\r\n\s]*?)(<\/html>)([\n\r]*)([`]*)([\n\r]*?)/g,
      (match, bodyEnd, space, htmlEnd, quoteEnd) => {
        return !quoteEnd ? bodyEnd + space + htmlEnd + '\n```\n' : match;
      },
    );
}

function CopyButton() {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerRef = useRef<any>(null);

  return (
    <div className="absolute hidden group-hover:flex top-3 right-2 bg-[rgb(41,45,62)]">
      <button
        type="button"
        aria-label="Copy code to clipboard"
        title="Copy"
        className="flex items-center justify-center border border-[#dadde1] p-1.5 rounded transition-opacity ease-linear cursor-pointer"
        onClick={(ev) => {
          ev.stopPropagation();
          try {
            const target = ev.target as HTMLElement;
            const block = target.closest('.markdown-code-block');
            if (!block) return;
            const code = block.querySelector('code');
            if (!code) return;
            const codeText = code.textContent || '';
            if (!codeText) return;
            copy(codeText);
          } catch (error) {
            console.error('Failed to copy code:', error);
          }

          setCopied(true);
          timerRef.current = setTimeout(() => {
            setCopied(false);
            clearTimeout(timerRef.current);
          }, 800);
        }}
      >
        <span className="w-4.5 h-4.5 relative">
          <svg
            viewBox="0 0 24 24"
            className={cn('absolute left-0 top-0 fill-[#dadde1]', {
              'opacity-0': copied,
              'opacity-100': !copied,
            })}
          >
            <path
              fill="#dadde1"
              d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
            ></path>
          </svg>
          <svg
            viewBox="0 0 24 24"
            className={cn('absolute left-0 top-0 fill-[#05df72]', {
              'opacity-0': !copied,
              'opacity-100': copied,
            })}
          >
            <path fill="#05df72" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
          </svg>
        </span>
      </button>
    </div>
  );
}

export default function Markdown({ content }: MarkdownProps) {
  const escapedContent = useMemo(() => {
    return tryWrapHtmlCode(escapeBrackets(content));
  }, [content]);

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeRaw,
          [
            RehypeHighlight,
            {
              detect: false,
              ignoreMissing: true,
            },
          ],
        ]}
        components={{
          code: (cProps) => (
            <div className="markdown-code-block relative group">
              <code
                style={{
                  overflowY: 'hidden',
                }}
                {...cProps}
                className={cn(cProps.className, '!bg-[rgb(41,45,62)] rounded-md')}
              />
              <CopyButton />
            </div>
          ),
          p: (pProps) => <p {...pProps} dir="auto" />,
        }}
      >
        {escapedContent}
      </ReactMarkdown>
    </div>
  );
}
