import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TypeAnimation } from 'react-type-animation';
import './index.css';

type HeartState = 'closed' | 'opening' | 'revealed';

function App() {
  const [heartState, setHeartState] = useState<HeartState>('closed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleHeartClick = () => {
    if (heartState !== 'closed') return;
    
    setHeartState('opening');
    
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => console.log("Автовоспроизведение заблокировано:", e));
    }
    
    // Конфетти в момент, когда крышка уже наполовину открыта
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff6b9d', '#ffa8cc', '#ff4757', '#ffd32a', '#ff9ff3']
      });
    }, 1000);
    
    // Показываем послания после полного открытия
    setTimeout(() => {
      setHeartState('revealed');
    }, 2200);
  };

  const handleReset = () => {
    setHeartState('closed');
    setIsMusicPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => console.log("Ошибка:", e));
    }
  };

  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 10,
  }));

  const sparkles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 10 + 5,
    delay: Math.random() * 3,
  }));

  return (
    <div className="app-container">
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}music.mp3`} loop />
      
      {/* SVG маска для фото в форме сердца */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5 0.9 C0.3 0.7, 0.05 0.6, 0.05 0.4 C0.05 0.2, 0.25 0.1, 0.375 0.2 C0.425 0.24, 0.475 0.3, 0.5 0.35 C0.525 0.3, 0.575 0.24, 0.625 0.2 C0.75 0.1, 0.95 0.2, 0.95 0.4 C0.95 0.6, 0.7 0.7, 0.5 0.9Z" />
          </clipPath>
        </defs>
      </svg>
      
      <div className="bg-glow"></div>
      
      {heartState === 'revealed' && (
        <button onClick={toggleMusic} className="music-button" aria-label="Музыка">
          {isMusicPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
      
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

      <div className="content-wrapper">
        {heartState === 'closed' && (
          <h1 className="title">
            <span className="shimmer-text">Нажми на сердечко 💝</span>
          </h1>
        )}

        {/* МЕДАЛЬОН */}
        <div className="locket-container">
          <div 
            className={`locket ${heartState !== 'closed' ? 'open' : ''}`}
            onClick={heartState === 'closed' ? handleHeartClick : undefined}
          >
            {/* Внутренняя часть — фото */}
            <div className="locket-inside">
              <div className="locket-photo-frame">
                <img
                  src={`${import.meta.env.BASE_URL}images/love-photo.jpg`}
                  alt="Наша любовь"
                  className="locket-photo"
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
            </div>
            
            {/* Крышка медальона — сердце */}
            <div className="locket-lid">
              <div className="heart-glow"></div>
              <svg viewBox="0 0 200 200" className="heart-svg">
                <defs>
                  <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b9d" />
                    <stop offset="50%" stopColor="#ff4757" />
                    <stop offset="100%" stopColor="#c44569" />
                  </linearGradient>
                  <radialGradient id="locketSheen" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
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
                  fill="url(#locketSheen)"
                />
                <path
                  d="M100 180 C60 140, 10 120, 10 80 C10 40, 50 20, 75 40 C85 48, 95 60, 100 70 C105 60, 115 48, 125 40 C150 20, 190 40, 190 80 C190 120, 140 140, 100 180Z"
                  fill="none"
                  stroke="rgba(255,215,0,0.7)"
                  strokeWidth="2.5"
                />
                {/* Декоративный замок-орнамент */}
                <circle cx="100" cy="98" r="11" fill="rgba(255,215,0,0.85)" stroke="rgba(139,90,43,0.9)" strokeWidth="1.5" />
                <circle cx="100" cy="98" r="5" fill="rgba(139,90,43,0.95)" />
              </svg>
              {heartState === 'closed' && (
                <div className="click-hint">👆 Нажми на меня!</div>
              )}
            </div>
          </div>
        </div>

        {heartState === 'revealed' && (
          <div className="revealed-content">
            <h2 className="love-title shimmer-text">Моя любимая! 💕</h2>

            <TypeAnimation
              sequence={['Ты — самое прекрасное, что случилось в моей жизни ✨']}
              wrapper="p"
              speed={50}
              className="love-message"
              repeat={0}
              cursor={false}
              startDelay={500}
            />

            <TypeAnimation
              sequence={['Каждый день с тобой — это подарок 🎁']}
              wrapper="p"
              speed={50}
              className="love-message"
              repeat={0}
              cursor={false}
              startDelay={2200}
            />

            <TypeAnimation
              sequence={['Люблю тебя бесконечно! ❤️']}
              wrapper="p"
              speed={50}
              className="love-message-final"
              repeat={0}
              cursor={false}
              startDelay={4000}
            />

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
