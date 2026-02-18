import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-display font-bold rounded-xl transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-to-b from-brand-yellow to-brand-gold text-brand-dark shadow-[0_4px_0_0_#B48624] active:shadow-none active:translate-y-[4px]",
    secondary: "bg-brand-crimson text-white shadow-[0_4px_0_0_#4A0A0A] active:shadow-none active:translate-y-[4px]",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg w-full"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={variant !== 'glass' ? { scale: 1.05 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};