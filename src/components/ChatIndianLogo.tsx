import React from 'react';

interface ChatIndianLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ChatIndianLogo: React.FC<ChatIndianLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`}>
      {/* ChatIndian Dual Bubbles Emblem */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 200 48"
          className={size === 'sm' ? 'w-32 h-8' : size === 'lg' ? 'w-56 h-13' : 'w-44 h-10'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chatindian-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="chatindian-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Left Bubble (Chat) */}
          <path
            d="M 6 12 C 6 6.5, 10.5 2, 16 2 L 26 2 C 31.5 2, 36 6.5, 36 12 L 36 20 C 36 25.5, 31.5 30, 26 30 L 14 30 L 7 36 L 7 28 C 6.3 27, 6 25.5, 6 24 Z"
            fill="url(#chatindian-grad1)"
            opacity="0.95"
          />

          {/* Three dots inside Left Bubble */}
          <circle cx="15" cy="16" r="1.8" fill="#ffffff" />
          <circle cx="21" cy="16" r="1.8" fill="#ffffff" />
          <circle cx="27" cy="16" r="1.8" fill="#ffffff" />

          {/* Right Intersecting Bubble */}
          <path
            d="M 25 15 C 25 10.5, 28.5 7, 33 7 L 41 7 C 45.5 7, 49 10.5, 49 15 L 49 22 C 49 26.5, 45.5 30, 41 30 L 41 35 L 36 30 L 33 30 C 28.5 30, 25 26.5, 25 22 Z"
            fill="url(#chatindian-grad2)"
            opacity="0.92"
          />
          {/* Heart / Sparkle in Bubble */}
          <path
            d="M 37 15.5 C 37 13.5, 39.5 13.5, 40 15 C 40.5 13.5, 43 13.5, 43 15.5 C 43 18, 40 20, 40 20 C 40 20, 37 18, 37 15.5 Z"
            fill="#ffffff"
          />

          {/* ChatIndian Typography */}
          <text
            x="54"
            y="29"
            fontFamily="'Plus Jakarta Sans', 'Segoe UI', Roboto, system-ui, sans-serif"
            fontSize="23"
            letterSpacing="-0.5"
          >
            <tspan fill="#1e293b" className="dark:fill-white font-extrabold" fontWeight="800">
              Chat
            </tspan>
            <tspan fill="#0284c7" className="dark:fill-sky-400" fontWeight="800">
              Indian
            </tspan>
          </text>

          {/* Small live badge / domain dot */}
          <circle cx="188" cy="17" r="3.5" fill="#10b981" />
        </svg>
      </div>
    </div>
  );
};
