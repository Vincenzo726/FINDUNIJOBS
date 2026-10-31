import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'dark' | 'simple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]} ${className}`}>
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-xs" fill="none">
          <rect width="80" height="80" rx="18" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2" />
          <g transform="translate(10, 10)">
            <path
              d="M8 8 C8 5.79 9.79 4 12 4 H36 C38.21 4 40 5.79 40 8 C40 10.21 38.21 12 36 12 H16 V22 H30 C32.21 22 34 23.79 34 26 C34 28.21 32.21 30 30 30 H16 V48 C16 50.21 14.21 52 12 52 C9.79 52 8 50.21 8 48 V8 Z"
              fill="#059669"
            />
            <path
              d="M28 24 C30.21 24 32 25.79 32 28 V40 C32 45 28 48 23 48 C19 48 16 46 14.5 43 C13.5 41 14.5 38.5 16.5 37.5 C18.5 36.5 21 37.5 22 39.5 C22.4 40.1 22.7 40.5 23 40.5 C23.8 40.5 24.5 39.8 24.5 39 V28 C24.5 25.79 26.29 24 28 24 Z"
              fill="#0F172A"
            />
            <polygon points="46,4 54,10 46,16 48,10" fill="#F59E0B" />
            <circle cx="48" cy="34" r="3.5" fill="#F59E0B" />
          </g>
        </svg>
      </div>
    );
  }

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-xs" fill="none">
          <rect
            width="80"
            height="80"
            rx="18"
            fill={isDark ? '#1E293B' : '#F0FDF4'}
            stroke={isDark ? '#334155' : '#BBF7D0'}
            strokeWidth="2"
          />
          <g transform="translate(10, 10)">
            <path
              d="M8 8 C8 5.79 9.79 4 12 4 H36 C38.21 4 40 5.79 40 8 C40 10.21 38.21 12 36 12 H16 V22 H30 C32.21 22 34 23.79 34 26 C34 28.21 32.21 30 30 30 H16 V48 C16 50.21 14.21 52 12 52 C9.79 52 8 50.21 8 48 V8 Z"
              fill={isDark ? '#34D399' : '#059669'}
            />
            <path
              d="M28 24 C30.21 24 32 25.79 32 28 V40 C32 45 28 48 23 48 C19 48 16 46 14.5 43 C13.5 41 14.5 38.5 16.5 37.5 C18.5 36.5 21 37.5 22 39.5 C22.4 40.1 22.7 40.5 23 40.5 C23.8 40.5 24.5 39.8 24.5 39 V28 C24.5 25.79 26.29 24 28 24 Z"
              fill={isDark ? '#FFFFFF' : '#0F172A'}
            />
            <polygon points="46,4 54,10 46,16 48,10" fill="#F59E0B" />
            <circle cx="48" cy="34" r="3.5" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${textSizes[size]}`}>
            <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>FJ </span>
            <span className={isDark ? 'text-white' : 'text-slate-900'}>FindUniJob</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        </div>

        {showTagline && (
          <span className={`text-[10px] font-semibold tracking-wider mt-1 uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Find Opportunities. Build Your Future.
          </span>
        )}
      </div>
    </div>
  );
};
