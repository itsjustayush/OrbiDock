import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface VNotchShapeProps {
  width: number;
  height: number;
  borderRadius: number;
  earRadius?: number;
  elevated?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onWheel?: (e: React.WheelEvent) => void;
}

export const VNotchShape: React.FC<VNotchShapeProps> = ({
  width,
  height,
  borderRadius,
  earRadius = 6,
  elevated = false,
  children,
  className = '',
  onClick,
  onContextMenu,
  onWheel,
}) => {
  return (
    <motion.div
      onClick={onClick}
      onContextMenu={onContextMenu}
      onWheel={onWheel}
      layout
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 32,
        mass: 0.8,
      }}
      style={{
        width,
        height,
      }}
      className={`relative select-none ${className}`}
    >
      {/* Left Concave Curved Ear (blends into screen top edge) */}
      <div
        aria-hidden
        className="absolute top-0 pointer-events-none"
        style={{
          left: -earRadius + 0.5,
          width: earRadius,
          height: earRadius,
          background:
            'radial-gradient(circle farthest-side at 0% 100%, transparent calc(100% - 0.75px), #000000 100%)',
        }}
      />

      {/* Right Concave Curved Ear */}
      <div
        aria-hidden
        className="absolute top-0 pointer-events-none"
        style={{
          right: -earRadius + 0.5,
          width: earRadius,
          height: earRadius,
          background:
            'radial-gradient(circle farthest-side at 100% 100%, transparent calc(100% - 0.75px), #000000 100%)',
        }}
      />

      {/* Optical rim (top highlight reflection from V-Notch) */}
      <div className="absolute top-0 inset-x-4 h-[1px] optical-rim z-30 pointer-events-none" />

      {/* Ambient shadow when elevated / open */}
      {elevated && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            boxShadow:
              '0 28px 60px -10px rgba(0, 0, 0, 0.85), 0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* Inner body content container */}
      <div
        className="absolute inset-0 overflow-hidden bg-black text-white"
        style={{
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
