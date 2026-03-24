"use client";

import React, { useRef, useEffect } from 'react';

interface TextNodeProps {
  id: string;
  initialContent: string;
  onChange: (id: string, content: string) => void;
  onRemove?: (id: string) => void;
  isActive: boolean;
}

export function TextNode({ id, initialContent, onChange, onRemove, isActive }: TextNodeProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = initialContent || '';
      isInitializedRef.current = true;
      
      // Auto-focus if it's empty (just created)
      if (isActive && !initialContent) {
        editorRef.current.focus();
      }
    }
  }, [initialContent, isActive]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(id, e.currentTarget.innerHTML);
  };

  const handleBlur = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText.trim();
      const html = editorRef.current.innerHTML.trim();
      if (!text && (!html || html === '<br>')) {
        if (onRemove) onRemove(id);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const selection = window.getSelection();
      if (!selection || !selection.focusNode) return;
      
      const node = selection.focusNode;
      // Get text specifically up to the cursor to correctly identify start-of-line commands
      const text = node.textContent?.slice(0, selection.focusOffset) || '';
      
      if (e.key === ' ') {
        if (text === '-' || text === '*' || text === '+') {
          e.preventDefault();
          document.execCommand('delete', false);
          document.execCommand('insertUnorderedList', false);
        } else if (text.match(/^\d+\.$/)) {
          e.preventDefault();
          for (let i = 0; i < text.length; i++) {
            document.execCommand('delete', false);
          }
          document.execCommand('insertOrderedList', false);
        }
      }
    }
  };

  return (
    <div className={`group relative w-full h-full bg-white rounded-xl shadow-sm border transition-colors p-4 mt-4 ${isActive ? 'border-primary/20 ring-1 ring-primary/10' : 'border-transparent hover:border-surface-container'}`}>
      
      {/* Top Drag Handle Bar (only visible when hovering or active) */}
      <div className={`absolute top-0 left-0 right-0 h-4 -mt-4 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <div className="drag-handle w-16 h-2 bg-surface-container-high hover:bg-primary/50 cursor-grab active:cursor-grabbing rounded-t-lg shadow-sm" title="Drag frame" />
      </div>

      <div
        ref={editorRef}
        className="prose prose-slate max-w-none w-full h-full focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-secondary empty:before:pointer-events-none cursor-text overflow-hidden"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-placeholder="Type something..."
      />
    </div>
  );
}
