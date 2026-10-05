import React from 'react';

export const OrbVisual: React.FC<{ size?: number }> = ({ size = 84 }) => {
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Outer ambient glow - calm cyan & soft blue */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, rgba(59, 130, 246, 0.25) 50%, transparent 70%)',
          animationDuration: '5s',
        }}
      />

      {/* Secondary soft aurora ring */}
      <div
        className="absolute -inset-2 rounded-full blur-xl opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.4), rgba(99, 102, 241, 0.3), transparent 70%)',
        }}
      />

      {/* Main 3D Orb sphere: clean sapphire & slate pearl */}
      <div
        className="relative w-full h-full rounded-full shadow-2xl transition-transform duration-700 hover:scale-105"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #e0f2fe 0%, #38bdf8 20%, #0284c7 45%, #0369a1 70%, #082f49 95%, #031525 100%)',
          boxShadow: `
            inset 0 4px 10px rgba(255, 255, 255, 0.8),
            inset -4px -6px 14px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(14, 165, 233, 0.3)
          `,
        }}
      >
        {/* Specular highlight crescent */}
        <div
          className="absolute top-2 left-3 w-5 h-3 rounded-full opacity-80 blur-[1px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.15))',
            transform: 'rotate(-25deg)',
          }}
        />

        {/* Inner subtle azure swirl */}
        <div
          className="absolute inset-1 rounded-full opacity-50 mix-blend-overlay pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 60% 70%, rgba(45, 212, 191, 0.5), rgba(59, 130, 246, 0.4), transparent 60%)',
          }}
        />
      </div>
    </div>
  );
};
