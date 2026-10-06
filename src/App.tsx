import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleHeartClick = () => {
    if (isOpened || isOpening) return;
    
    setIsOpening(true);
    
    // Запускаем музыку
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Громкость 50%
      audioRef.current.play().catch(e => console.log("Автовоспроизведение заблокировано браузером:", e));
    }
    
    setTimeout(() => {
      setIsOpened(true);
      setIsOpening(false);
      
      // Запускаем красивое конфетти из библиотеки
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b9d', '#ffa8cc', '#ff4757', '#ffd32a', '#ff9ff3']
      });
    }, 800);
  };

  const handleReset = () => {
    setIsOpened(false);
    setIsOpening(false);
    // Останавливаем музыку при сбросе
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Generate floating hearts
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 10,
  }));

  // Generate sparkles
  const sparkles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 10 + 5,
    delay: Math.random() * 3,
  }));

  return (
    <div className="app-container">
      {/* Фоновая музыка (положите файл music.mp3 в папку public) */}
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}music.mp3`} loop />
      
      <div className="bg-glow"></div>
      
      {/* Floating hearts */}
      <div className="floating-hearts">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Sparkles */}
      <div className="sparkles">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="sparkle"
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

      {/* Main content */}
      <div className="content-wrapper">
        {!isOpened ? (
          <>
            <h1 className="title">
              <span className="shimmer-text">Нажми на сердечко 💝</span>
            </h1>

            <button onClick={handleHeartClick} className="heart-button">
              <div className="heart-glow"></div>
              <svg
                viewBox="0 0 200 200"
                className={`heart-svg ${isOpening ? 'heart-open' : 'heart-pulse'}`}
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
                <ellipse cx="70" cy="65" rx="15" ry="20" fill="rgba(255,255,255,0.2)" transform="rotate(-30 70 65)" />
              </svg>
              {!isOpening && <div className="click-hint">👆 Нажми на меня!</div>}
            </button>

            <div className="bottom-text">
              <p>С любовью для тебя ❤️</p>
            </div>
          </>
        ) : (
          <div className="revealed-content">
            <div className="photo-frame">
              <div className="photo-container">
                <img
                  src={`${import.meta.env.BASE_URL}images/love-photo.jpg`}
                  alt="Наша любовь"
                  className="photo-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="photo-fallback">💑</div>';
                    }
                  }}
                />
              </div>
              <div className="deco-heart deco-heart-tl">💖</div>
              <div className="deco-heart deco-heart-tr">💖</div>
              <div className="deco-heart deco-heart-bl">💖</div>
              <div className="deco-heart deco-heart-br">💖</div>
              
              {/* Подпись под фото */}
              <p className="photo-caption">Наш особенный момент ✨</p>
            </div>

            <h2 className="love-title shimmer-text">Моя любимая! 💕</h2>

            <p className="love-message love-message-delay-1">
              Ты — самое прекрасное, что случилось в моей жизни ✨
            </p>

            <p className="love-message love-message-delay-2">
              Каждый день с тобой — это подарок 🎁
            </p>

            <p className="love-message-final">
              Люблю тебя бесконечно! ❤️
            </p>

            <button onClick={handleReset} className="reset-button">
              🔄 Ещё раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
