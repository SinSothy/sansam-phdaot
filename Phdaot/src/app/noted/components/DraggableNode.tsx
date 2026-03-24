"use client";

import React, { useState, useRef, useEffect } from 'react';

interface DraggableNodeProps {
  id: string;
  initialX: number;
  initialY: number;
  width?: number;
  height?: number;
  rotation?: number;
  zoom?: number;
  onPositionChange: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onRotate?: (id: string, rotation: number) => void;
  onClick?: () => void;
  children: React.ReactNode;
  isActive?: boolean;
  dragHandleClass?: string;
}

type DragMode = 'none' | 'move' | 'resize' | 'rotate';

export function DraggableNode({
  id,
  initialX,
  initialY,
  width,
  height,
  rotation = 0,
  zoom = 1,
  onPositionChange,
  onResize,
  onRotate,
  onClick,
  children,
  isActive,
  dragHandleClass
}: DraggableNodeProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ w: width, h: height });
  const [rot, setRot] = useState(rotation);
  const [mode, setMode] = useState<DragMode>('none');
  
  const dragState = useRef({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
    startRot: 0,
    startPosX: 0,
    startPosY: 0,
    centerX: 0,
    centerY: 0,
  });
  
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
    setSize({ w: width, h: height });
    setRot(rotation);
  }, [initialX, initialY, width, height, rotation]);

  const handlePointerDown = (e: React.PointerEvent, newMode: DragMode) => {
    if (e.button !== 0) return;
    
    if (newMode === 'move' && dragHandleClass) {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${dragHandleClass}`)) {
        return; 
      }
    }

    e.stopPropagation();
    setMode(newMode);
    
    const rect = nodeRef.current?.getBoundingClientRect();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.w || (rect ? rect.width / zoom : 0) || 0,
      startH: size.h || (rect ? rect.height / zoom : 0) || 0,
      startRot: rot,
      startPosX: position.x,
      startPosY: position.y,
      centerX: rect ? rect.left + rect.width / 2 : 0,
      centerY: rect ? rect.top + rect.height / 2 : 0,
    };
    
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (mode === 'none') return;
    
    const dx = (e.clientX - dragState.current.startX) / zoom;
    const dy = (e.clientY - dragState.current.startY) / zoom;
    
    if (mode === 'move') {
      const newX = dragState.current.startPosX + dx;
      const newY = dragState.current.startPosY + dy;
      setPosition({ x: newX, y: newY });
    } else if (mode === 'resize') {
      // Basic resize (bottom-right). For perfection with rotation matrix math is needed, 
      // but simple dx/dy works fine for non-rotated or roughly.
      const newW = Math.max(100, dragState.current.startW + dx);
      const newH = Math.max(50, dragState.current.startH + dy);
      setSize({ w: newW, h: newH });
    } else if (mode === 'rotate') {
      const angle = Math.atan2(e.clientY - dragState.current.centerY, e.clientX - dragState.current.centerX);
      const angleDeg = angle * (180 / Math.PI) + 90; // +90 because handle is at top
      setRot(angleDeg);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (mode === 'none') return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (mode === 'move') onPositionChange(id, position.x, position.y);
    if (mode === 'resize' && onResize) onResize(id, size.w || 0, size.h || 0);
    if (mode === 'rotate' && onRotate) onRotate(id, rot);
    
    setMode('none');
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute ${isActive ? 'z-20 ring-1 ring-primary/40 rounded-xl shadow-lg' : 'z-10'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: size.w ? `${size.w}px` : undefined,
        height: size.h ? `${size.h}px` : undefined,
        transform: `rotate(${rot}deg)`,
        touchAction: 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Node Content Container */}
      <div className="w-full h-full relative pointer-events-auto">
        {children}
      </div>

      {/* Handles */}
      {isActive && (
        <>
          {/* Rotate Handle */}
          <div 
             className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-surface-container rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm text-secondary hover:text-primary z-30"
             onPointerDown={(e) => handlePointerDown(e, 'rotate')}
             onPointerMove={handlePointerMove}
             onPointerUp={handlePointerUp}
             onPointerCancel={handlePointerUp}
          >
            <span className="material-symbols-outlined text-[14px]">rotate_right</span>
          </div>
          {/* Vertical connecting line to rotate handle */}
          <div className="absolute -top-4 left-1/2 w-px h-4 bg-primary/40 -translate-x-1/2 pointer-events-none" />

          {/* Resize Handle */}
          <div 
             className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border border-surface-container rounded-full flex items-center justify-center cursor-nwse-resize shadow-md text-secondary hover:text-primary z-30"
             onPointerDown={(e) => handlePointerDown(e, 'resize')}
             onPointerMove={handlePointerMove}
             onPointerUp={handlePointerUp}
             onPointerCancel={handlePointerUp}
          >
            <span className="material-symbols-outlined text-[14px]">open_in_full</span>
          </div>
        </>
      )}
    </div>
  );
}
