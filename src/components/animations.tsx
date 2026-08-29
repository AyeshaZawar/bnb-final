import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

// Word-by-word Heading Animation
interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

export function AnimatedHeading({ text, className = '', as: Tag = 'h2' }: AnimatedHeadingProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const MotionTag = motion[Tag as keyof typeof motion] as React.ComponentType<HTMLMotionProps<any>>;

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
      style={{ willChange: 'transform, opacity' }}
      className={`flex flex-wrap ${className.includes('text-center') ? 'justify-center' : 'justify-start'} ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          style={{ willChange: 'transform, opacity' }}
          className="mr-[0.25em] inline-block whitespace-nowrap"
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}

// Fade and Lift Paragraph
export function AnimatedParagraph({
  children,
  className = '',
  delay = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-50px' }}
      style={{ willChange: 'transform, opacity' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

// Interactive Scale & Lift Button (With Fixed Sliding Animation & Colors)
export function AnimatedButton({
  children,
  className = '',
  onClick,
  delay = 0.8,
  id,
  href,
  type = 'button',
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  id?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) {
  const backOutEase = [0.34, 1.56, 0.64, 1];
  const Tag = href ? motion.a : motion.button;

  // Clean original className to remove any explicit colors or hover colors that might conflict
  const cleanedClass = className
    .split(' ')
    .filter(c => {
      const isBg = c.startsWith('bg-') || c === 'bg-transparent';
      const isText = c.startsWith('text-');
      const isHoverBg = c.startsWith('hover:bg-');
      const isHoverText = c.startsWith('hover:text-');
      const isTransition = c.startsWith('transition-');
      return !isBg && !isText && !isHoverBg && !isHoverText && !isTransition;
    })
    .join(' ');

  return (
    <Tag
      id={id}
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      disabled={href ? undefined : disabled}
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: false, margin: '-50px' }}
      style={{ willChange: 'transform, opacity' }}
      transition={{
        duration: 0.8,
        ease: backOutEase,
        delay: delay,
      }}
      className={`relative overflow-hidden group select-none cursor-pointer bg-[#052842] border border-[#052842] ${cleanedClass}`}
    >
      {/* Sliding white background layer */}
      <span 
        className="absolute inset-0 h-full w-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0" 
      />
      
      {/* Button Content - Starts White, smoothly changes to #052842 on hover */}
      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none text-white group-hover:text-[#052842] transition-colors duration-300">
        {children}
      </span>
    </Tag>
  );
}

// Top-to-Bottom Masked Reveal for Images
export function ImageReveal({
  src,
  alt,
  className = '',
  delay = 0.1,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: false, margin: '-50px' }}
        style={{ transformOrigin: 'top', willChange: 'transform' }}
        transition={{ duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-[#0a1128] z-10 pointer-events-none"
      />
      <motion.img
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false, margin: '-50px' }}
        style={{ willChange: 'transform' }}
        transition={{ duration: 1.1, delay: delay + 0.1, ease: 'easeOut' }}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// Fade In Container with Staggered Children
export function StaggerContainer({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
      style={{ willChange: 'transform, opacity' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

const slideOffsets = {
  up: { y: 30, x: 0 },
  down: { y: -30, x: 0 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
};

// Slide and Fade In Child
export function StaggerItem({
  children,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: SlideDirection;
  key?: React.Key;
}) {
  const offset = slideOffsets[direction];
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: offset.x, 
      y: offset.y 
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} style={{ willChange: 'transform, opacity' }} className={className}>
      {children}
    </motion.div>
  );
}