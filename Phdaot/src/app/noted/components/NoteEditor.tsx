"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DraggableNode } from './DraggableNode';
import { TextNode } from './TextNode';
import { AttachmentNode, AttachmentData } from './AttachmentNode';

export type NodeType = 'text' | 'attachment';

export interface NoteElement {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  content?: string;
  attachmentData?: AttachmentData;
}

interface NoteEditorProps {
  dateKey?: string; // Optional for backward compatibility, but provided from page
}

const initialMockNodes: NoteElement[] = [
  {
    id: 'img-1',
    type: 'attachment',
    x: 0,
    y: 0,
    width: 256,
    height: 192,
    attachmentData: {
      type: 'image',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCum8IupItUAatqnxyizWkVaw3mFOUlp-ouIu5IqyhUsQjCC50h0gdemcS7XTP6pjoav-XwKkfYD09u8fd5CIMP235T0R_6PcYsh-3AKVe8Up-yX3I-dPeUFa0rQAYb6bDBZhAj4LS1peBVV0CfeARdSXazoMKqvBudJMErM7jWoNtLGfmKz2x21BxdlNbKyUqMs4Jc_XBhSsAeQb64sDPwBsm6PgJal5ludUKZZCJHEskUCjw24sh3uDMtrayYrM_ebvxTDR3X',
      name: 'Construction detail'
    }
  },
  {
    id: 'img-2',
    type: 'attachment',
    x: 272,
    y: 0,
    width: 256,
    height: 192,
    attachmentData: {
      type: 'image',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXhzQDOD2iQfZe836gDzlqIJcVvVjUDYa92L8Yvk16TjdSyWo2wMFF5nMClkJLh0nq9ghsuqrmU8w9tyiqUqroce3hcuaJnf2n37PGQjaHx7A_7F1h8FSX9fRKgRZFYbnOlMD_lszEWwObJ9zqFfJ7q363RWw_f3B112FcjIH7g08kxEFaKltawYP1To6jYa5f1F9JI4n3gjidzBSOVOHvrAuP44tvK-DGP9LXFZ-B67SHOprJv3IskL5XCYHTsJUH8ui2BtJj',
      name: 'Site overview'
    }
  },
  {
    id: 'pdf-1',
    type: 'attachment',
    x: 0,
    y: 208,
    width: 280,
    height: 72,
    attachmentData: {
      type: 'file',
      url: '#',
      name: 'Basalt_Specs_V2.pdf',
      size: '1.2 MB',
      addedAt: 'Added today'
    }
  },
  {
    id: 'text-1',
    type: 'text',
    x: 0,
    y: 300,
    width: 600,
    height: 200,
    content: `<h3 class="text-xl font-bold mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary">edit_note</span>Key Observations</h3><ul class="space-y-4"><li class="flex gap-4"><span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span><div><strong class="text-on-surface">Material Textures:</strong> The brushed travertine sample (Ref: #TR-04) holds light better than the polished variant. Recommend switching for the central gallery.</div></li><li class="flex gap-4"><span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span><div><strong class="text-on-surface">Lighting Integration:</strong> Structural beams in the kitchen allow for recessed track lighting without compromising the clean ceiling plane.</div></li><li class="flex gap-4"><span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span><div><strong class="text-on-surface">Timeline Check:</strong> Glass delivery expected on Tuesday. Need to ensure site is clear of debris for installation.</div></li></ul>`
  }
];

export function NoteEditor({ dateKey = new Date().toDateString() }: NoteEditorProps) {
  const [nodesMap, setNodesMap] = useState<Record<string, NoteElement[]>>({
    [new Date('2024-10-12').toDateString()]: initialMockNodes
  });

  const nodes = nodesMap[dateKey] || [];

  const setNodes = (action: React.SetStateAction<NoteElement[]>) => {
    setNodesMap(prev => {
      const currNodes = prev[dateKey] || [];
      const newNodes = typeof action === 'function' ? action(currNodes) : action;
      return { ...prev, [dateKey]: newNodes };
    });
  };

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLElement>(null);
  
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const updateFormatState = () => {
    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateFormatState);
    return () => document.removeEventListener('selectionchange', updateFormatState);
  }, []);

  // Use a non-passive wheel listener on the container to prevent default zooming
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelCtrl = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomFactor = 0.05;
        setZoom(z => {
          const newZoom = e.deltaY < 0 ? z + zoomFactor : z - zoomFactor;
          return Math.min(Math.max(newZoom, 0.5), 3);
        });
      }
    };

    container.addEventListener('wheel', handleWheelCtrl, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelCtrl);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Allow deletion only if a node is active and we are pressing Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeNodeId) {
        // Prevent deleting a text node while the user is actively typing inside it, UNLESS it's empty
        const activeEl = document.activeElement as HTMLElement;
        if (
          activeEl.isContentEditable ||
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA'
        ) {
          // Allow deletion if it's an empty content editable
          if (activeEl.isContentEditable && !activeEl.innerText.trim()) {
            // proceed to delete
          } else {
            return;
          }
        }

        setNodes(curr => curr.filter(n => n.id !== activeNodeId));
        setActiveNodeId(null);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeNodeId, dateKey]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateFormatState();
  };

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    let selectedText = '';
    if (selection && selection.rangeCount > 0) {
      selectedText = selection.toString();
      setSavedRange(selection.getRangeAt(0));
    } else {
      setSavedRange(null);
    }
    
    setLinkData({ text: selectedText, url: '' });
    setLinkDialogOpen(true);
  };

  const submitLink = () => {
    if (linkData.url && savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
      
      const html = `<a href="${linkData.url}" target="_blank" class="text-primary hover:text-primary-container underline underline-offset-2">${linkData.text || linkData.url}</a>`;
      document.execCommand('insertHTML', false, html);
    }
    setLinkDialogOpen(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      const newNodeId = `text-${Date.now()}`;
      setNodes([...nodes, {
        id: newNodeId,
        type: 'text',
        x,
        y,
        width: 300,
        height: 100,
        content: ''
      }]);
      setActiveNodeId(newNodeId);
    } else {
      setActiveNodeId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    const newNodes: NoteElement[] = files.map((file, i) => {
      const isImage = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      return {
        id: `file-${Date.now()}-${i}`,
        type: 'attachment',
        x: startX + (i * 20),
        y: startY + (i * 20),
        width: isImage ? 256 : 280,
        height: isImage ? 192 : 72,
        attachmentData: {
          type: isImage ? 'image' : 'file',
          url,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          addedAt: 'Just now'
        }
      };
    });

    setNodes(curr => [...curr, ...newNodes]);
  };

  const handleNodePositionChange = (id: string, x: number, y: number) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const handleNodeResize = (id: string, width: number, height: number) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, width, height } : n));
  };

  const handleNodeRotate = (id: string, rotation: number) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, rotation } : n));
  };

  const handleTextContentChange = (id: string, content: string) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, content } : n));
  };

  const handleRemoveNode = (id: string) => {
    setNodes(curr => curr.filter(n => n.id !== id));
    if (activeNodeId === id) setActiveNodeId(null);
  };

  return (
    <section
      ref={containerRef as any}
      className="flex-1 overflow-y-auto w-full px-8 pb-8 pt-0 custom-scrollbar flex flex-col h-full bg-[#fcfcfc] transition-all"
      style={{
        backgroundImage: 'linear-gradient(#e5e7ea 1px, transparent 1px), linear-gradient(90deg, #e5e7ea 1px, transparent 1px)',
        backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
        backgroundPosition: '-1px -1px'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-surface-container mb-6 -mx-8 px-8 py-2 flex items-center gap-1 shadow-sm">
        <button onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} className={`p-1.5 hover:bg-surface-container rounded transition-colors ${formatState.bold ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary/30' : 'text-slate-600'}`} title="Bold"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
        <button onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} className={`p-1.5 hover:bg-surface-container rounded transition-colors ${formatState.italic ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary/30' : 'text-slate-600'}`} title="Italic"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
        <button onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }} className={`p-1.5 hover:bg-surface-container rounded transition-colors ${formatState.underline ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary/30' : 'text-slate-600'}`} title="Underline"><span className="material-symbols-outlined text-[20px]">format_underlined</span></button>
        <div className="w-px h-6 bg-surface-container mx-1"></div>
        <button onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }} className={`p-1.5 hover:bg-surface-container rounded transition-colors ${formatState.insertUnorderedList ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary/30' : 'text-slate-600'}`} title="Bullet List"><span className="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
        <button onMouseDown={(e) => { e.preventDefault(); handleFormat('insertOrderedList'); }} className={`p-1.5 hover:bg-surface-container rounded transition-colors ${formatState.insertOrderedList ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary/30' : 'text-slate-600'}`} title="Numbered List"><span className="material-symbols-outlined text-[20px]">format_list_numbered</span></button>
        <div className="w-px h-6 bg-surface-container mx-1"></div>
        <button onMouseDown={handleLink} className="p-1.5 hover:bg-surface-container rounded transition-colors text-slate-600" title="Insert Link"><span className="material-symbols-outlined text-[20px]">link</span></button>
        <div className="w-px h-6 bg-surface-container mx-1"></div>
        <div className="text-xs font-medium text-secondary ml-1 bg-surface-container p-1 px-2 rounded-full">
          {Math.round(zoom * 100)}%
        </div>
        
        {/* Link Dialog Popover */}
        {linkDialogOpen && (
          <div className="absolute top-14 left-64 bg-white rounded-xl shadow-lg border border-surface-container p-4 w-80 flex flex-col gap-3 z-50">
            <h3 className="text-sm font-semibold text-on-surface">Insert Link</h3>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary font-medium">Text to display</label>
              <input 
                type="text" 
                className="w-full text-sm border border-outline-variant rounded p-2 focus:ring-1 focus:ring-primary outline-none" 
                value={linkData.text}
                onChange={e => setLinkData({...linkData, text: e.target.value})}
                placeholder="Text..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary font-medium">Address</label>
              <input 
                type="url" 
                className="w-full text-sm border border-outline-variant rounded p-2 focus:ring-1 focus:ring-primary outline-none" 
                value={linkData.url}
                onChange={e => setLinkData({...linkData, url: e.target.value})}
                placeholder="https://"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitLink();
                  if (e.key === 'Escape') setLinkDialogOpen(false);
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button onClick={() => setLinkDialogOpen(false)} className="px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container rounded transition-colors">Cancel</button>
              <button onClick={submitLink} className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded hover:bg-primary/90 transition-colors shadow-sm">Insert</button>
            </div>
          </div>
        )}
      </div>

      <header className="mb-10 shrink-0 bg-white/80 backdrop-blur p-6 rounded-2xl border border-surface-container shadow-sm w-fit max-w-4xl relative z-20">
        <div className="flex items-center gap-2 text-xs text-secondary mb-4 uppercase tracking-tighter font-semibold">
          <span>Title for {dateKey}</span>
        </div>
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-4 focus:ring-2 focus:ring-primary/20 focus:outline-none p-1 -m-1 rounded transition-all cursor-text outline-none" contentEditable suppressContentEditableWarning>Notes Entry</h1>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <img alt="Collab 1" className="w-6 h-6 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHgiyBis4eKdUPuCOCzyZQu75qSAT4s6oBWnPjfhWniRBEEv0x79Jn4DOjQFa8UogI0aCkH1qe2xvpOMKk-8kO6oLuJ3JaSzIkZrKfjqQ2kmFi5ZygN6m5GDV_KtYWhqCiZ-5TGxjP4XMTkh4QXySy7Zr4Hdq7zdGWjzBRhz8VTRpZMVU1h3AcPI1rhJg2ubB69uNNJaI--jaSmAFJbGyQ7rk10nANrsWS30gZG6ZZQVflCJycEWfYTNHRwgoOWbayN4v5GjCu" />
            <img alt="Collab 2" className="w-6 h-6 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBArfKeSg0Jk5cp9DvJE6GlFjkznXG-lgeJfLrGnsCh5r0zDd57W42h6HCLjjqvrE6EuWF0TAi7sV5G3u84XyERELaswIs8pHc4ehONsKwxpvu658h5rqaVB51o7Khjk5WCtbqzLImoowiYDkw8ShKOoQvH8YZOCvpErqanPGD5O1fYzu94z0HdjCxhD0-HSl0Vtg7ySK5ZpKg5wthenBBK23YtXUoRHRfCta6_eHqv6TdhsXZfcHScEtIqiLp-CT30rI5XvsxD" />
            <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold border-2 border-surface">+3</div>
          </div>
          <span className="text-xs text-secondary font-medium">Last edited today</span>
        </div>
      </header>

      {/* Zoomable Canvas Area */}
      <div
        className="relative flex-1 min-h-[1200px] w-[2000px] origin-top-left"
        onClick={handleCanvasClick}
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s ease-out' }}
      >
        {nodes.map(node => (
          <DraggableNode
            key={node.id}
            id={node.id}
            initialX={node.x}
            initialY={node.y}
            width={node.width}
            height={node.height}
            rotation={node.rotation}
            zoom={zoom}
            onPositionChange={handleNodePositionChange}
            onResize={handleNodeResize}
            onRotate={handleNodeRotate}
            onClick={() => setActiveNodeId(node.id)}
            isActive={activeNodeId === node.id}
            dragHandleClass={node.type === 'text' ? 'drag-handle' : undefined}
          >
            {node.type === 'text' && (
              <TextNode
                id={node.id}
                initialContent={node.content || ''}
                onChange={handleTextContentChange}
                onRemove={handleRemoveNode}
                isActive={activeNodeId === node.id}
              />
            )}
            {node.type === 'attachment' && node.attachmentData && (
              <AttachmentNode
                id={node.id}
                data={node.attachmentData}
                isActive={activeNodeId === node.id}
              />
            )}
          </DraggableNode>
        ))}
      </div>
    </section>
  );
}
