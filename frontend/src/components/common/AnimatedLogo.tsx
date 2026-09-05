import React from 'react';
import { Link } from 'react-router-dom';

interface AnimatedLogoProps {
  compact?: boolean;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <Link to="/" className={`flex flex-col group ${className}`}>
        <span className="font-headline-lg-mobile text-[18px] tracking-[0.2em] uppercase font-bold text-[#3E2723] transition-colors group-hover:text-[#3E2723]-fixed">
          LEUKOTEX
        </span>
      </Link>
    );
  }

  return (
    <Link to="/" className={`flex flex-col items-center gap-1 group ${className}`}>
      <div className="w-16 h-16 relative flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A0DC" /> {/* Lilac */}
              <stop offset="100%" stopColor="#FF9E9E" /> {/* Coral */}
            </linearGradient>
            <linearGradient id="logoGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B680C9" />
              <stop offset="100%" stopColor="#FA8080" />
            </linearGradient>
          </defs>
          
          <g fill="url(#logoGradient)">
            {/* Top stem of the L */}
            <polygon points="45,10 65,10 45,55 25,55" />
            
            {/* Horizontal bar of the L */}
            <polygon points="25,58 75,58 65,68 15,68" />
            
            {/* Bottom lightning point */}
            <polygon points="35,71 50,71 30,95" fill="url(#logoGradientDark)" opacity="0.8" />
          </g>
        </svg>
      </div>
      <div className="flex flex-col items-center mt-[-4px]">
        <span className="font-headline-lg-mobile text-[14px] tracking-[0.25em] uppercase font-bold text-[#b5a3ac] group-hover:text-[#3E2723] transition-colors">
          LEUKOTEX
        </span>
      </div>
    </Link>
  );
};

