import React, { useEffect, useRef, useMemo } from 'react';

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      typeset: (elements?: HTMLElement[]) => void;
    };
  }
}

interface MathJaxRendererProps {
  content: string;
}

const MathJaxRenderer: React.FC<MathJaxRendererProps> = ({ content }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Pre-process the content to ensure formatting is respected
  const processedContent = useMemo(() => {
    if (!content) return '';
    // Force a double newline before any '##' that might be inline, ensuring it breaks into a new paragraph
    // safe to use with 'white-space: pre-line' in CSS
    return content.replace(/([^\n])\s*(##)/g, '$1\n\n$2');
  }, [content]);

  useEffect(() => {
    if (ref.current && window.MathJax) {
      try {
        window.MathJax.typesetPromise([ref.current]).catch((err) => {
          console.warn("MathJax typesetting error:", err);
        });
      } catch (e) {
        console.error("Failed to trigger MathJax:", e);
      }
    }
  }, [processedContent]);

  return (
    // Flex center to ensure small SVGs are centered. Padding added for safe scroll spacing.
    <div className="w-full overflow-x-auto p-2 custom-scrollbar flex flex-col items-stretch">
      <div
        ref={ref}
        className="math-content w-full text-right"
        dir="rtl"
        style={{ textAlign: 'right', direction: 'rtl' }}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
};

export default MathJaxRenderer;