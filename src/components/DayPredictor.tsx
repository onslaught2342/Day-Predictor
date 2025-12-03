import { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles, Rocket, Zap } from 'lucide-react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';

export default function DayPredictor() {
  const [selectedDay, setSelectedDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [loadingGif, setLoadingGif] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const floatingRef1 = useRef<HTMLDivElement>(null);
  const floatingRef2 = useRef<HTMLDivElement>(null);

  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'
  ];

  const loadingContent: { text: string; gif: string; delay?: number }[] = [
    { text: "🔮 Consulting ancient astrologers...", gif: "./gif/3o7TKTDn976rzVgky4.webm", delay: 800 },
    { text: "🤖 Deploying AI neural networks...", gif: "./gif/LmNwrBhejkK9EFP504.webm", delay: 1000 },
    { text: "⚛️ Using quantum computing algorithms...", gif: "./gif/xT9IgzoKnwFNmISR8I.webm", delay: 900 },
    { text: "🔗 Scanning via blockchain technology...", gif: "./gif/9FQ89bO3TipLASwmRs.webm", delay: 700 },
    { text: "🛸 Contacting NASA satellites...", gif: "./gif/l0HlQXlQ3nHyLMvte.webm", delay: 800 },
    { text: "🧠 Analyzing with machine learning...", gif: "./gif/l4FGpP4lxGGgK5CBW.webm", delay: 1000 },
    { text: "🌌 Accessing space-time continuum...", gif: "./gif/3oKIPwoeGErMmaI43S.webm", delay: 1200 },
    { text: "💎 Decrypting cosmic algorithms...", gif: "./gif/DHqth0hVQoIzS.webm", delay: 900 },
    { text: "🔬 Running DNA sequence analysis...", gif: "./gif/3oKIPEqDGUULpEU0aQ.webm", delay: 800 },
    { text: "🎯 Applying deep learning models...", gif: "./gif/l0HlHFRbmaZtBRhXG.webm", delay: 700 },
    { text: "🌊 Surfing through data ocean...", gif: "./gif/26tn33aiTi1jkl6H6.webm", delay: 800 },
    { text: "⚡ Charging flux capacitor...", gif: "./gif/3o7qE4opCd6f1NJeuY.webm", delay: 800 },
    { text: "🎪 Performing complex calculations...", gif: "./gif/BmmfETghGOPrW.webm", delay: 900 },
    { text: "🔐 Breaking encryption codes...", gif: "./gif/077i6AULCXc0FKTj9s.webm", delay: 1000 },
    { text: "🌟 Consulting Elon Musk's AI...", gif: "./gif/gTviM5HfTDKapOJ8eL.webm", delay: 900 },
    { text: "📡 Establishing satellite connection...", gif: "./gif/Zy7lVxTwoFE4BJoNUQ.webm", delay: 1000 },
    { text: "🧬 Sequencing temporal DNA...", gif: "./gif/3o7TKSjRrfIPjeiVyM.webm", delay: 900 },
    { text: "🎨 Rendering 4D visualizations...", gif: "./gif/uSzTwQTqBWOuSmgDS9.webm", delay: 1200 },
    { text: "📞 Calling Sung Jin Woo", gif: "./gif/6Ar6K19y0GqOezYJRj.webm", delay: 1500 },
    { text: "... Calling Mr BEAN", gif: "./gif/Uh1ZPq7mA7xa8.webm", delay: 1200 },
    { text: "... Calling ANYA", gif: "./gif/FWAcpJsFT9mvrv0e7a.webm", delay: 1200 },
  ];



  useEffect(() => {
    // Set initial button state so GSAP can animate
    gsap.set(buttonsRef.current?.children, { opacity: 0, scale: 0 });

    const isMobile = window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window;
    const isLowEnd = navigator.hardwareConcurrency <= 2;

    // Entrance animations - simplified on low-end devices
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: isMobile ? 0.6 : 1,
      ease: "back.out(1.7)"
    })
      .from(cardRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: isMobile ? 0.6 : 1,
        ease: "back.out(1.7)"
      }, "-=0.5")
      .to(buttonsRef.current?.children, {
        scale: 1,
        opacity: 1,
        stagger: isMobile ? 0.05 : 0.1,
        duration: isMobile ? 0.3 : 0.5,
        ease: "back.out(2)"
      }, "-=0.3");

    // Floating animation - only on desktop with good performance
    if (!isMobile && !isLowEnd) {
      gsap.to([floatingRef1.current, floatingRef2.current], {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1
      });
    }

    // 3D card tilt effect - only on desktop devices
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      cardRef.current?.addEventListener('mousemove', handleMouseMove);
      cardRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        cardRef.current?.removeEventListener('mousemove', handleMouseMove);
        cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const getNextDay = (day: string) => {
    const index = days.indexOf(day);
    return days[(index + 1) % 7];
  };

  // Haptic feedback helper for mobile
  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30
      };
      navigator.vibrate(patterns[intensity]);
    }
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    triggerHaptic('light');
    gsap.fromTo(
      `#day-${day}`,
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: "back.out(3)" }
    );
  };

  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!loadingGif) return;

    setVideoReady(false);

    const vid = document.createElement("video");
    vid.src = loadingGif;
    vid.preload = "auto";
    vid.oncanplaythrough = () => setVideoReady(true);
  }, [loadingGif]);

  const handlePredict = () => {
    if (!selectedDay) return;
    triggerHaptic('medium');
    setIsLoading(true);
    setShowSuccess(false);
    setResult('');

    gsap.to(buttonsRef.current, { opacity: 0.3, scale: 0.95, duration: 0.3 });

    // Auto-scroll to bottom
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);

    let index = 0;

    const showNextContent = () => {
      if (index < loadingContent.length) {
        const content = loadingContent[index];

        // Force update both text and gif together
        setLoadingText(content.text);
        setLoadingGif(content.gif);

        gsap.fromTo(".loading-text", { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(".loading-gif", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" });

        const delay = content.delay || 800;
        index++;

        setTimeout(showNextContent, delay);
      } else {
        setIsLoading(false);
        setShowSuccess(true);
        triggerHaptic('heavy');
        const nextDay = getNextDay(selectedDay);
        setResult(nextDay);
        gsap.to(buttonsRef.current, { opacity: 1, scale: 1, duration: 0.3 });
        gsap.fromTo(resultRef.current, { scale: 0, rotation: -180, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" });

        setTimeout(() => {
          setShowSuccess(false);
          gsap.to(resultRef.current, { scale: 0.95, duration: 0.3 });
        }, 3000);
      }
    };

    showNextContent();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-background via-muted to-background">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[size:300%_300%] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient-shift" />
        <div ref={floatingRef1} className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div ref={floatingRef2} className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Card */}
      <div ref={cardRef} className="relative z-10 w-full max-w-3xl" style={{ transformStyle: 'preserve-3d' }}>
        <div className="bg-card backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-primary/20 p-4 sm:p-6 md:p-12">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 rounded-full blur-xl animate-glow-pulse" />
                <div className="relative bg-gradient-to-br from-primary to-accent p-3 sm:p-4 md:p-6 rounded-full shadow-[0_0_40px_rgba(0,200,255,0.5)]">
                  <Calendar className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary-foreground" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-2 sm:mb-4 tracking-tight px-2">Day Predictor Pro™</h1>
            <div className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift bg-[size:200%_auto]">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold px-2">Project by Onslaught2342</p>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-4 text-muted-foreground px-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-secondary animate-pulse flex-shrink-0" />
              <p className="text-xs sm:text-sm">Powered by Advanced AI & Quantum Computing</p>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-secondary animate-pulse flex-shrink-0" />
            </div>
          </div>

          {/* Days */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <label className="block text-foreground/90 font-bold mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-center">Select Today's Day:</label>
            <div ref={buttonsRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 relative z-20">
              {days.map(day => (
                <button
                  key={day}
                  id={`day-${day}`}
                  onClick={() => handleDaySelect(day)}
                  className={`group relative py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-xl sm:rounded-2xl font-extrabold text-sm sm:text-base md:text-lg tracking-wide transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 shadow-lg ${selectedDay === day ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_30px_rgba(0,200,255,0.7)] border-2 border-primary' : 'bg-foreground text-background hover:bg-secondary hover:text-secondary-foreground border-2 border-border'}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className="relative z-10 uppercase">{day}</span>
                  {selectedDay === day && <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-40 blur-xl rounded-xl sm:rounded-2xl" />}
                </button>
              ))}
            </div>
          </div>

          {/* Predict Button */}
          <Button onClick={handlePredict} disabled={!selectedDay || isLoading} className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-secondary to-accent text-secondary-foreground rounded-xl sm:rounded-2xl font-black text-base sm:text-xl md:text-2xl shadow-[0_0_40px_rgba(255,100,50,0.4)] hover:shadow-[0_0_60px_rgba(255,100,50,0.6)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 sm:gap-3 group">
            {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 border-b-4 border-secondary-foreground"></div><span className="text-sm sm:text-base md:text-xl">Processing...</span></> : <><Rocket className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" /><span>Predict Next Day</span></>}
          </Button>

          {/* Loading */}
          {isLoading && (
            <div className="mt-4 sm:mt-6 md:mt-8 bg-card backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center border-2 sm:border-4 border-primary shadow-[0_0_60px_rgba(0,200,255,0.5)] animate-scale-in">
              {/* GIF/Image Display Box */}
              {isLoading && videoReady && (
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <div className="bg-muted rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-primary/50 sm:border-2 shadow-lg">
                    <video
                      src={loadingGif}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="loading-gif w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 border-t-4 border-b-4 sm:border-t-6 sm:border-b-6 md:border-t-8 md:border-b-8 border-primary shadow-[0_0_30px_rgba(0,200,255,0.5)]"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary to-accent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-[0_0_30px_rgba(0,200,255,0.3)]">
                <p className="loading-text text-primary-foreground font-black text-sm sm:text-lg md:text-2xl lg:text-3xl tracking-wide uppercase break-words">{loadingText}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div ref={resultRef} className={`mt-4 sm:mt-6 md:mt-8 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 text-center ${showSuccess ? 'bg-gradient-to-br from-secondary to-accent shadow-[0_0_60px_rgba(255,100,50,0.5)] animate-glow-pulse' : 'bg-card backdrop-blur-xl border-2 border-primary'}`}>
              {showSuccess && <><div className="text-4xl sm:text-5xl md:text-7xl mb-3 sm:mb-4 md:mb-6 animate-bounce">🎉</div><h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 md:mb-4">SUCCESS!</h2></>}
              <p className="text-foreground/80 text-sm sm:text-base md:text-xl mb-1 sm:mb-2">{showSuccess ? 'Next day will be:' : 'Prediction Complete! ✅'}</p>
              <p className="text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black my-3 sm:my-4 md:my-5 pb-2 sm:pb-3 md:pb-4 animate-gradient-shift bg-[size:200%_auto]">{result}</p>
              {showSuccess && <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4 md:mt-6 text-3xl sm:text-4xl md:text-5xl"><span className="animate-bounce">🎊</span><span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎈</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span></div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 md:mt-8 text-center text-xs sm:text-sm text-muted-foreground px-2">
          <p className="font-semibold">⚠️ Accuracy: 100% Guaranteed*</p>
          <p className="text-xs mt-1 sm:mt-2 opacity-70">*May use advanced algorithms beyond human understanding</p>
        </div>
      </div>
    </div>
  );
}