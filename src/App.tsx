import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { TypeAnimation } from 'react-type-animation';
import './index.css';

type AppState = 'closed' | 'opening' | 'revealed';

// ================ 3D СЕРДЦЕ ================
function Heart3D({ state, onOpen }: { state: AppState; onOpen: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const isOpen = state !== 'closed';

  // Создаём объёмное сердце на основе кривых Безье
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 16,
      bevelSize: 0.2,
      bevelThickness: 0.2,
      curveSegments: 32,
    });
    geo.center();
    return geo;
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    if (!isOpen) {
      g.scale.setScalar(1);
      g.visible = true;
      g.rotation.y += delta * 0.7;
    } else {
      g.rotation.y += delta * 10;
      g.scale.multiplyScalar(Math.max(0, 1 - delta * 2.5));
      if (g.scale.x < 0.02) g.visible = false;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh
          geometry={geometry}
          onClick={onOpen}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <meshPhysicalMaterial
            color="#ff2e63"
            emissive="#ff0040"
            emissiveIntensity={0.35}
            metalness={0.5}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            reflectivity={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

// ================ 3D СЦЕНА ================
function Scene({ state, onOpen }: { state: AppState; onOpen: () => void }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffd0e0" />
      <directionalLight position={[-5, -3, 5]} intensity={0.6} color="#ff8ab8" />
      <pointLight position={[0, 0, 3]} intensity={1} color="#ff3060" />
      <Heart3D state={state} onOpen={onOpen} />
      <Environment preset="sunset" />
    </>
  );
}

// ================ ОСНОВНОЙ КОМПОНЕНТ ================
function App() {
  const [state, setState] = useState<AppState>('closed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    if (state !== 'closed') return;
    setState('opening');

    // Музыка
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => console.log("Автовоспроизведение заблокировано:", e));
    }

    // Конфетти через секунду
    setTimeout(() => {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ff6b9d', '#ffa8cc', '#ff4757', '#ffd32a', '#ff9ff3'],
      });
    }, 900);

    // Показываем текст через 1.8 секунды
    setTimeout(() => setState('revealed'), 1800);
  };

  const handleReset = () => {
    setState('closed');
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
      audioRef.current.play().then(() => setIsMusicPlaying(true));
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
      <div className="bg-glow" />

      {state === 'revealed' && (
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
        {hearts.map((h) => (
          <div key={h.id} className="floating-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
            }}
          >💕</div>
        ))}
      </div>

      <div className="sparkles">
        {sparkles.map((s) => (
          <div key={s.id} className="sparkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              fontSize: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          >✨</div>
        ))}
      </div>

      <div className="content-wrapper">
        {state === 'closed' && (
          <h1 className="title">
            <span className="shimmer-text">Нажми на сердечко 💝</span>
          </h1>
        )}

        {/* 3D Сцена */}
        <div className={`canvas-wrapper ${state !== 'closed' ? 'shrunk' : ''}`}>
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <Scene state={state} onOpen={handleOpen} />
          </Canvas>
        </div>

        {state === 'closed' && (
          <div className="click-hint">👆 Нажми на меня!</div>
        )}

        {state === 'revealed' && (
          <div className="revealed-content">
            {/* Фото в форме сердца */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                  <path d="M0.5 0.9 C0.3 0.7, 0.05 0.6, 0.05 0.4 C0.05 0.2, 0.25 0.1, 0.375 0.2 C0.425 0.24, 0.475 0.3, 0.5 0.35 C0.525 0.3, 0.575 0.24, 0.625 0.2 C0.75 0.1, 0.95 0.2, 0.95 0.4 C0.95 0.6, 0.7 0.7, 0.5 0.9Z" />
                </clipPath>
              </defs>
            </svg>

            <div className="photo-heart">
              <img
                src={`${import.meta.env.BASE_URL}images/love-photo.jpg`}
                alt="Наша любовь"
                className="photo-heart-img"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  if (t.parentElement) {
                    t.parentElement.innerHTML = '<div class="photo-fallback-heart">💑</div>';
                  }
                }}
              />
            </div>

            <p className="photo-caption">Наш особенный момент ✨</p>

            <h2 className="love-title shimmer-text">Моя любимая! 💕</h2>

            <TypeAnimation
              sequence={['Ты — самое прекрасное, что случилось в моей жизни ✨']}
              wrapper="p" speed={55} className="love-message" repeat={0}
              cursor={false} startDelay={400}
            />
            <TypeAnimation
              sequence={['Каждый день с тобой — это подарок 🎁']}
              wrapper="p" speed={55} className="love-message" repeat={0}
              cursor={false} startDelay={2200}
            />
            <TypeAnimation
              sequence={['Люблю тебя бесконечно! ❤️']}
              wrapper="p" speed={55} className="love-message-final" repeat={0}
              cursor={false} startDelay={4000}
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
