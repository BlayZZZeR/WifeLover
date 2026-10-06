import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { TypeAnimation } from 'react-type-animation';
import './index.css';

type AppState = 'closed' | 'opening' | 'revealed';

// ================ ФОРМА СЕРДЦА ================
function createHeartShape() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x + 0.5, y + 0.5);
  shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
  shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
  shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
  shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
  return shape;
}

// ================ 3D МЕДАЛЬОН ================
function HeartLocket({ state, onOpen }: { state: AppState; onOpen: () => void }) {
  const lidRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  
  const heartShape = useMemo(() => createHeartShape(), []);
  
  // Геометрия основы (задняя часть медальона)
  const baseGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 16,
      bevelSize: 0.15,
      bevelThickness: 0.15,
      curveSegments: 32,
    });
    geo.center();
    return geo;
  }, [heartShape]);

  // Геометрия крышки (чуть тоньше)
  const lidGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 16,
      bevelSize: 0.15,
      bevelThickness: 0.15,
      curveSegments: 32,
    });
    geo.center();
    return geo;
  }, [heartShape]);

  // Загружаем фото
  const texture = useTexture(`${import.meta.env.BASE_URL}images/love-photo.jpg`);

  // Анимация
  useFrame((_, delta) => {
    const lid = lidRef.current;
    const content = contentRef.current;
    if (!lid || !content) return;

    const isOpen = state !== 'closed';
    
    // Плавное открытие крышки
    const targetRotation = isOpen ? -Math.PI * 1.15 : 0;
    lid.rotation.y += (targetRotation - lid.rotation.y) * Math.min(1, delta * 3.5);

    // Плавное появление содержимого
    const targetOpacity = isOpen ? 1 : 0;
    const targetScale = isOpen ? 1 : 0.5;
    if (content) {
      content.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), Math.min(1, delta * 3));
      content.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as any).material) {
          (child as any).material.opacity += (targetOpacity - (child as any).material.opacity) * Math.min(1, delta * 3);
          (child as any).material.transparent = true;
        }
      });
    }
  });

  // Маленькие сердечки внутри
  const smallHearts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.3 + 0.15,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.1,
      color: ['#ff2e63', '#ff0040', '#c44569', '#e11d48'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 2 + 1,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const heartsGroupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (heartsGroupRef.current) {
      heartsGroupRef.current.children.forEach((child, i) => {
        const data = smallHearts[i];
        if (data) {
          child.position.y = data.position[1] + Math.sin(clock.elapsedTime * data.speed + data.offset) * 0.05;
        }
      });
    }
  });

  return (
    <group scale={[1.6, 1.6, 1.6]}>
      {/* ЗАДНЯЯ ЧАСТЬ МЕДАЛЬОНА */}
      <mesh geometry={baseGeometry} position={[0, 0, -0.3]}>
        <meshPhysicalMaterial
          color="#b3001b"
          metalness={0.85}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={0.8}
        />
      </mesh>

      {/* ЗЕРКАЛЬНАЯ ВНУТРЕННЯЯ ПОВЕРХНОСТЬ */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>

      {/* СОДЕРЖИМОЕ (ФОТО + СЕРДЕЧКИ) */}
      <group ref={contentRef} position={[0, 0, 0.1]}>
        {/* Фото */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial map={texture} transparent opacity={0} />
        </mesh>
        
        {/* Маленькие 3D сердечки */}
        <group ref={heartsGroupRef}>
          {smallHearts.map((h) => (
            <mesh
              key={h.id}
              geometry={baseGeometry}
              position={h.position}
              scale={h.scale}
            >
              <meshPhysicalMaterial
                color={h.color}
                metalness={0.6}
                roughness={0.2}
                transparent
                opacity={0}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* КРЫШКА (открывается влево) */}
      <group position={[-1.05, 0, 0.3]}>
        <group ref={lidRef}>
          <mesh geometry={lidGeometry} position={[1.05, 0, 0]}>
            <meshPhysicalMaterial
              color="#d90429"
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={1.5}
            />
          </mesh>
          
          {/* Золотая окантовка на крышке */}
          <mesh geometry={lidGeometry} position={[1.05, 0, 0]} scale={[1.02, 1.02, 0.5]}>
            <meshPhysicalMaterial
              color="#ffd700"
              metalness={1}
              roughness={0.2}
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* Замок-замочек */}
          <mesh position={[1.05, -0.7, 0.4]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial color="#ffd700" metalness={1} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ================ СЦЕНА ================
function Scene({ state, onOpen }: { state: AppState; onOpen: () => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 3, 5]} intensity={0.8} color="#ffb3c6" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#ff4757" />
      <pointLight position={[0, 0, -3]} intensity={0.5} color="#ffd700" />
      
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <HeartLocket state={state} onOpen={onOpen} />
      </Float>
      
      <Environment preset="studio" />
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

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => console.log("Автовоспроизведение заблокировано:", e));
    }

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#ff6b9d', '#ffa8cc', '#ff4757', '#ffd32a', '#ff9ff3'],
      });
    }, 1000);

    setTimeout(() => setState('revealed'), 2500);
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

        <div className={`canvas-wrapper ${state !== 'closed' ? 'shrunk' : ''}`}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
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
            <h2 className="love-title shimmer-text">Любовь моя! 💕</h2>

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
