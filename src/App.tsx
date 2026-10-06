import { useState, useEffect, useCallback } from 'react';

// Floating hearts background component
function FloatingHearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart absolute"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
}

// Sparkles component
function Sparkles() {
  const sparkles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 10 + 5,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}

// Confetti burst on heart open
function ConfettiBurst() {
  const confetti = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360;
    const distance = Math.random() * 300 + 100;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ['#ff6b9d', '#ffa8cc', '#ff4757', '#ff6348', '#ffd32a', '#ff9ff3', '#f368e0'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const delay = Math.random() * 0.3;

    return (
      <div
        key={i}
        className="confetti absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties}
      />
    );
  });

  return <div className="fixed inset-0 pointer-events-none z-50">{confetti}</div>;
}

// Main heart SVG component
function HeartSVG({ isOpening }: { isOpening: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl transition-all duration-300 ${
        isOpening ? 'heart-open' : 'heart-pulse'
      }`}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b9d" />
          <stop offset="50%" stopColor="#ff4757" />
          <stop offset="100%" stopColor="#c44569" />
        </linearGradient>
        <filter id="heartGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M100 180 C60 140, 10 120, 10 80 C10 40, 50 20, 75 40 C85 48, 95 60, 100 70 C105 60, 115 48, 125 40 C150 20, 190 40, 190 80 C190 120, 140 140, 100 180Z"
        fill="url(#heartGradient)"
        filter="url(#heartGlow)"
      />
      <path
        d="M100 180 C60 140, 10 120, 10 80 C10 40, 50 20, 75 40 C85 48, 95 60, 100 70 C105 60, 115 48, 125 40 C150 20, 190 40, 190 80 C190 120, 140 140, 100 180Z"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />
      {/* Shine effect */}
      <ellipse cx="70" cy="65" rx="15" ry="20" fill="rgba(255,255,255,0.2)" transform="rotate(-30 70 65)" />
    </svg>
  );
}

// Revealed content after heart opens
function RevealedContent({ onReset }: { onReset: () => void }) {
  return (
    <div className="content-reveal flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto">
      {/* Photo frame */}
      <div className="relative mb-8">
        <div className="glow-pulse rounded-2xl overflow-hidden border-4 border-pink-200 shadow-2xl">
          <img
            src="https://image.qwenlm.ai/generated-images/9311da62-5664-4c75-a6e1-442b1a066d6e/_result.png"
            alt="Наша любовь"
            className="w-72 h-56 md:w-96 md:h-72 object-cover"
          />
        </div>
        {/* Decorative hearts around photo */}
        <div className="absolute -top-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>💖</div>
        <div className="absolute -top-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💖</div>
        <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>💖</div>
        <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>💖</div>
      </div>

      {/* Love message */}
      <h2
        className="shimmer-text text-3xl md:text-4xl font-bold mb-4"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Моя любимая! 💕
      </h2>

      <p
        className="fade-in-up text-pink-100 text-lg md:text-xl mb-3 leading-relaxed"
        style={{ animationDelay: '0.8s', opacity: 0 }}
      >
        Ты — самое прекрасное, что случилось в моей жизни ✨
      </p>

      <p
        className="fade-in-up text-pink-200 text-base md:text-lg mb-6"
        style={{ animationDelay: '1.2s', opacity: 0 }}
      >
        Каждый день с тобой — это подарок 🎁
      </p>

      <p
        className="fade-in-up text-pink-100 text-lg md:text-xl mb-8"
        style={{ animationDelay: '1.6s', opacity: 0, fontFamily: "'Dancing Script', cursive" }}
      >
        Люблю тебя бесконечно! ❤️
      </p>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="fade-in-up mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full 
                   hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg 
                   hover:shadow-pink-500/50 hover:scale-105 active:scale-95"
        style={{ animationDelay: '2s', opacity: 0 }}
      >
        🔄 Ещё раз
      </button>
    </div>
  );
}

// Main App component
function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const handleHeartClick = useCallback(() => {
    if (isOpened || isOpening) return;

    setIsOpening(true);
    setShowHint(false);

    setTimeout(() => {
      setShowConfetti(true);
      setIsOpened(true);
      setIsOpening(false);
    }, 800);

    setTimeout(() => {
      setShowConfetti(false);
    }, 2500);
  }, [isOpened, isOpening]);

  const handleReset = useCallback(() => {
    setIsOpened(false);
    setIsOpening(false);
    setShowHint(true);
  }, []);

  // Hide hint after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <FloatingHearts />
      <Sparkles />

      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,105,180,0.15)_0%,_transparent_70%)]" />

      {/* Confetti */}
      {showConfetti && <ConfettiBurst />}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {!isOpened ? (
          <>
            {/* Title */}
            <h1
              className="text-white text-2xl md:text-3xl mb-8 text-center px-4"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              <span className="shimmer-text">Нажми на сердечко 💝</span>
            </h1>

            {/* Heart button */}
            <button
              onClick={handleHeartClick}
              className="relative cursor-pointer focus:outline-none group"
              aria-label="Открыть сюрприз"
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />

              <HeartSVG isOpening={isOpening} />

              {/* Click hint */}
              {showHint && !isOpening && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-pink-200 text-sm animate-pulse whitespace-nowrap">
                  👆 Нажми на меня!
                </div>
              )}
            </button>

            {/* Bottom decoration */}
            <div className="mt-12 text-pink-300/60 text-sm text-center">
              <p>С любовью для тебя ❤️</p>
            </div>
          </>
        ) : (
          <RevealedContent onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
