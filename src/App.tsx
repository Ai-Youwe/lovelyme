import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BlurOn, 
  CloudUpload, 
  AutoFixHigh, 
  HomeMax, 
  PermMedia, 
  Settings, 
  ArrowBack, 
  Download, 
  DeployedCode, 
  Refresh, 
  Share, 
  Bolt, 
  Layers, 
  ImageIcon, 
  ViewInAr, 
  Face5,
  Add,
  Camera
} from './components/Icons';
import { IMAGES, AESTHETICS, GALLERY_ITEMS } from './constants';

type View = 'HOME' | 'PROCESSING' | 'GALLERY' | 'PREVIEW';

export default function App() {
  const [view, setView] = useState<View>('HOME');
  const [selectedAesthetic, setSelectedAesthetic] = useState(AESTHETICS[0].id);
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (view === 'PROCESSING') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setView('PREVIEW'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-tertiary/20 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] atmospheric-glow opacity-60" />
        <div className="absolute bottom-[20%] -right-[10%] w-[600px] h-[600px] atmospheric-glow opacity-40" />
        {view === 'PREVIEW' && (
          <>
            <img 
              src={IMAGES.ATMOSPHERE} 
              className="w-full h-full object-cover blur-[80px] opacity-60 scale-110" 
              referrerPolicy="no-referrer"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-transparent to-surface/40" />
          </>
        )}
      </div>

      {/* Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]" 
        style={{ backgroundImage: `url('${IMAGES.GRAIN}')` }} 
      />

      <Header view={view} setView={setView} />

      <main className="relative z-10 pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'HOME' && (
            <HomeView 
              selectedAesthetic={selectedAesthetic} 
              setSelectedAesthetic={setSelectedAesthetic} 
              onGenerate={() => setView('PROCESSING')} 
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
            />
          )}
          {view === 'PROCESSING' && (
            <ProcessingView progress={progress} />
          )}
          {view === 'GALLERY' && (
            <GalleryView onSelect={() => setView('PREVIEW')} />
          )}
          {view === 'PREVIEW' && (
            <PreviewView />
          )}
        </AnimatePresence>
      </main>

      <BottomNav view={view} setView={setView} />
    </div>
  );
}

function Header({ view, setView }: { view: View, setView: (v: View) => void }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/60 backdrop-blur-2xl border-b border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        {view === 'PREVIEW' ? (
          <button 
            onClick={() => setView('HOME')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
          >
            <ArrowBack className="text-on-surface" />
          </button>
        ) : (
          <BlurOn className="text-on-surface text-2xl" />
        )}
        <h1 className="text-xl font-bold tracking-tighter text-on-surface">
          {view === 'PREVIEW' ? 'Preview' : 'MetaFigure'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {view === 'GALLERY' && (
          <span className="text-on-surface-variant font-sans tracking-tight font-semibold text-lg">Gallery</span>
        )}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:opacity-80 transition-opacity active:scale-95 cursor-pointer">
          <img 
            src={IMAGES.USER_PROFILE} 
            alt="User Profile" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

function BottomNav({ view, setView }: { view: View, setView: (v: View) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-8 pointer-events-none">
      <div className="rounded-full mx-auto mb-8 w-[90%] max-w-md bg-white/70 backdrop-blur-3xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-around items-center p-2 pointer-events-auto">
        <NavItem 
          active={view === 'HOME' || view === 'PROCESSING'} 
          onClick={() => setView('HOME')} 
          icon={<HomeMax />} 
          label="Home" 
        />
        <NavItem 
          active={view === 'GALLERY' || view === 'PREVIEW'} 
          onClick={() => setView('GALLERY')} 
          icon={<PermMedia />} 
          label="Gallery" 
        />
        <NavItem 
          active={false} 
          onClick={() => {}} 
          icon={<Settings />} 
          label="Settings" 
        />
      </div>
    </nav>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 transition-all duration-300 ease-out active:scale-90 ${
        active 
          ? 'text-tertiary bg-white/50 rounded-full shadow-inner' 
          : 'text-outline hover:text-on-surface'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="font-sans text-[10px] font-medium uppercase tracking-widest">{label}</span>
    </button>
  );
}

function CameraCapture({ onCapture, onCancel }: { onCapture: (img: string) => void, onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden glass-card specular-edge">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="mt-8 flex gap-6">
        <button 
          onClick={onCancel}
          className="px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={capture}
          className="w-16 h-16 rounded-full bg-tertiary text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Camera className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

function HomeView({ 
  selectedAesthetic, 
  setSelectedAesthetic, 
  onGenerate,
  capturedImage,
  setCapturedImage
}: { 
  selectedAesthetic: string, 
  setSelectedAesthetic: (id: string) => void, 
  onGenerate: () => void,
  capturedImage: string | null,
  setCapturedImage: (img: string | null) => void
}) {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary">Create Your Identity</span>
        <h2 className="text-4xl font-bold tracking-tight text-on-surface">Dimensionalize Yourself</h2>
      </div>

      <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 specular-edge shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
        {capturedImage ? (
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-tertiary shadow-lg">
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
            <button 
              onClick={() => setCapturedImage(null)}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <Refresh className="text-white" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center group cursor-pointer hover:bg-surface-container-high transition-colors">
            <CloudUpload className="text-4xl text-primary" />
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-xl font-semibold text-on-surface">
            {capturedImage ? "Photo captured successfully!" : "Upload or take a photo to generate your 3D avatar"}
          </p>
          <p className="text-sm text-on-surface-variant max-w-xs mx-auto">High-resolution portrait recommended for the best geometric accuracy.</p>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface text-sm font-medium hover:bg-surface-dim transition-colors">
            Browse Files
          </button>
          <button 
            onClick={() => setShowCamera(true)}
            className="px-6 py-2.5 rounded-full bg-tertiary/10 text-tertiary text-sm font-medium hover:bg-tertiary/20 transition-colors flex items-center gap-2"
          >
            <Camera className="text-lg" />
            Take Photo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Aesthetic</h3>
          <span className="text-xs text-tertiary font-medium cursor-pointer">View All</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6">
          {AESTHETICS.map((style) => (
            <div 
              key={style.id} 
              onClick={() => setSelectedAesthetic(style.id)}
              className="flex-none w-32 space-y-3 group cursor-pointer"
            >
              <div className={`aspect-[3/4] rounded-lg overflow-hidden glass-card specular-edge p-1 transition-all duration-300 ${selectedAesthetic === style.id ? 'ring-2 ring-tertiary' : ''}`}>
                <img 
                  src={style.image} 
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                  alt={style.name}
                />
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-wider text-center ${selectedAesthetic === style.id ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {style.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={onGenerate}
          className="relative w-full py-5 rounded-lg bg-primary text-white font-semibold tracking-tight overflow-hidden shadow-xl active:scale-95 transition-transform group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-tertiary to-primary opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            Generate Avatar
            <AutoFixHigh className="text-lg" />
          </span>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
        </button>
        <p className="text-center mt-4 text-[10px] uppercase tracking-widest text-on-surface-variant">Estimated time: 45 seconds</p>
      </div>

      {showCamera && (
        <CameraCapture 
          onCapture={(img) => {
            setCapturedImage(img);
            setShowCamera(false);
          }}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </motion.section>
  );
}

function ProcessingView({ progress }: { progress: number }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">Refining Reality</h1>
        <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs">We are crafting your digital dimension</p>
      </div>

      <div className="relative w-full max-w-lg aspect-square md:aspect-[4/3] bg-white/40 backdrop-blur-3xl rounded-xl glass-card specular-edge shadow-[0_40px_80px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/5 to-transparent pointer-events-none" />
        
        <div className="relative w-full flex items-center justify-between mb-16">
          <StepIcon icon={<ImageIcon />} label="Source" active={progress > 0} completed={progress > 30} />
          <div className="flex-1 h-[2px] mx-4 bg-gradient-to-r from-surface-variant to-tertiary-container/40" />
          <StepIcon icon={<Face5 />} label="Stylizing" active={progress > 30} completed={progress > 70} focus />
          <div className="flex-1 h-[2px] mx-4 bg-gradient-to-r from-tertiary-container/40 to-surface-variant" />
          <StepIcon icon={<ViewInAr />} label="3D Mesh" active={progress > 70} completed={progress === 100} />
        </div>

        <div className="w-full space-y-6 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-on-surface font-semibold text-lg">Generating 3D model...</p>
            <p className="text-on-surface-variant text-sm font-medium">This usually takes about 30 seconds</p>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-tertiary to-tertiary-container rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
            <span>Vertex Mapping</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-lg">
        <DetailCard icon={<Bolt />} label="Engine" value="Neural-Mesh v2.4" />
        <DetailCard icon={<Layers />} label="Layers" value="HD Texture Mapping" />
      </div>

      <footer className="mt-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
          Encrypted Processing • Cloud Compute Active
        </p>
      </footer>
    </motion.section>
  );
}

function StepIcon({ icon, label, active, completed, focus }: { icon: React.ReactNode, label: string, active: boolean, completed: boolean, focus?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-4 transition-opacity duration-500 ${!active && !completed ? 'opacity-20' : active && !completed ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${focus && active && !completed ? 'w-24 h-24 bg-white shadow-[0_12px_24px_rgba(141,34,192,0.15)] glass-card' : 'bg-surface-container-lowest'}`}>
        {focus && active && !completed && <div className="absolute -inset-4 bg-tertiary/10 blur-xl rounded-full animate-pulse" />}
        <div className={focus && active && !completed ? 'text-tertiary scale-150' : 'text-primary'}>{icon}</div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${focus && active && !completed ? 'text-tertiary' : 'text-on-surface-variant'}`}>{label}</span>
    </div>
  );
}

function DetailCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-lg glass-card specular-edge flex flex-col gap-2">
      <div className="text-tertiary">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
      <p className="text-on-surface font-semibold">{value}</p>
    </div>
  );
}

function GalleryView({ onSelect }: { onSelect: () => void }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-12">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-tertiary mb-3 block">Digital Archive</span>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">Your Creations</h2>
        <p className="text-on-surface-variant max-w-md">Browse your generated 3D models and curated figures from the MetaFigure engine.</p>
      </div>

      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {['All Figures', 'Chibi', 'Realistic', 'Cyberpunk'].map((filter, i) => (
          <button 
            key={filter}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-primary text-on-primary shadow-lg shadow-primary/10' : 'glass-card specular-edge text-on-surface-variant hover:bg-white/80'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {GALLERY_ITEMS.map((item) => (
          <div 
            key={item.id}
            onClick={onSelect}
            className="group relative flex flex-col glass-card specular-edge rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            <div className="aspect-[3/4] overflow-hidden bg-surface-container-low">
              <img 
                src={item.image} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                alt={item.name}
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-on-surface text-sm">{item.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{item.style}</span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="group relative flex flex-col border-2 border-dashed border-outline-variant/50 rounded-xl overflow-hidden transition-all duration-300 hover:bg-surface-container hover:border-tertiary/30 cursor-pointer flex items-center justify-center p-8 text-center min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Add className="text-tertiary text-3xl" />
          </div>
          <p className="text-sm font-bold text-on-surface">Generate New</p>
          <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">Expansion Pack Available</p>
        </div>
      </div>
    </motion.section>
  );
}

function PreviewView() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center p-8 group">
        <div className="absolute w-[120%] h-[120%] bg-tertiary/5 rounded-full blur-[100px] -z-10" />
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={IMAGES.PREVIEW_MODEL} 
            className="max-w-full max-h-full object-contain drop-shadow-[0_32px_64px_rgba(141,34,192,0.15)] animate-pulse-slow" 
            referrerPolicy="no-referrer"
            alt="Preview Model"
          />
          <div className="absolute bottom-4 flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-xl rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Refresh className="text-[18px] text-tertiary" />
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-on-surface">Rotate View</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-8 mb-12">
        <div className="flex items-center gap-2 p-1.5 bg-white/30 backdrop-blur-2xl rounded-full glass-card specular-edge">
          {['Original', 'Holographic', 'Clay', 'Outline'].map((tab, i) => (
            <button 
              key={tab}
              className={`px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all ${i === 0 ? 'bg-white shadow-sm text-tertiary' : 'text-on-surface-variant hover:bg-white/40'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-20 w-full max-w-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionButton icon={<Download />} label="Download Image" />
          <ActionButton icon={<DeployedCode />} label="Export 3D" />
          <ActionButton icon={<Refresh />} label="Regenerate" />
          <ActionButton icon={<Share />} label="Share" />
        </div>
      </div>
    </motion.section>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-white/40 backdrop-blur-xl glass-card specular-edge hover:bg-white/60 transition-all active:scale-95">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm">
        <div className="text-tertiary">{icon}</div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface">{label}</span>
    </button>
  );
}
