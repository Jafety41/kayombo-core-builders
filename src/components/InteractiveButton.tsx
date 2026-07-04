import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

import { HTMLMotionProps } from "motion/react";
interface InteractiveButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  magnetic?: boolean;
}

export function InteractiveButton({ children, className, onClick, magnetic = true, ...props }: InteractiveButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [ripples, setRipples] = useState<{ x: number, y: number, size: number, key: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !ref.current) return;
    
    // Only apply on desktop
    if (window.innerWidth < 768) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = left + width / 2;
    const middleY = top + height / 2;
    
    // Offset calculation
    const offsetX = (clientX - middleX) * 0.2;
    const offsetY = (clientY - middleY) * 0.2;

    // Limit offset to max ~10px
    const maxOffset = 10;
    x.set(Math.max(-maxOffset, Math.min(maxOffset, offsetX)));
    y.set(Math.max(-maxOffset, Math.min(maxOffset, offsetY)));
  };

  const handleMouseLeave = () => {
    if (!magnetic) return;
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const xPos = e.clientX - rect.left - size / 2;
      const yPos = e.clientY - rect.top - size / 2;
      
      const newRipple = { x: xPos, y: yPos, size, key: Date.now() };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const buttonClass = `relative overflow-hidden ${className || ''}`;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={magnetic ? { x: springX, y: springY } : undefined}
      className={buttonClass}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-inherit w-full h-full pointer-events-none">
        {children}
      </span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.key}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: 'currentColor',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
