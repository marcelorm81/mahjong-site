import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
  onLogin: (username: string) => void;
}

const BG_IMAGE = "https://raw.githubusercontent.com/marcelorm81/Mahjongtest/4fc239b0d3cda3435e374ac7b6e7307603371273/img%20-%20background.jpg";
const CHARACTERS_IMAGE = "https://raw.githubusercontent.com/marcelorm81/Mahjongtest/3149293f5ccaff19c1a4dd0c716c9a8080a8c46f/img%20-%20characters.webp";

// Loading text messages
const LOADING_MESSAGES = [
  "Loading characters...",
  "Loading game styles...",
  "Preparing intros...",
  "Syncing assets..."
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  
  // Animation States
  // 0: Init, 1: BG, 2: Chars, 3: Tiles (Skipped), 4: Logo, 5: UI Transition
  const [animStage, setAnimStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Orchestrate the Intro Sequence
  useEffect(() => {
    // 1. Background Establishment (0.8s)
    const t1 = setTimeout(() => setAnimStage(1), 100);
    
    // 2. Characters Entrance (1.5s)
    const t2 = setTimeout(() => setAnimStage(2), 1000);
    
    // 3. Tiles (Skipped) (2.2s)
    const t3 = setTimeout(() => setAnimStage(3), 1800);
    
    // 4. Logo Reveal (2.8s)
    const t4 = setTimeout(() => setAnimStage(4), 2500);

    // 5. World Transition to UI (5s) - Wait for logo glow to finish
    const t5 = setTimeout(() => setAnimStage(5), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Fake Loading Progress Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slow down as we get closer to 100 if animation isn't done
        const increment = animStage < 5 ? 0.5 : 2; 
        return Math.min(prev + increment, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [animStage]);

  // Rotating Loading Messages
  useEffect(() => {
    if (loadingProgress >= 100) return;
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loadingProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) onLogin(email.split('@')[0]);
    else onLogin("Player"); 
  };

  const isUIReady = animStage >= 5;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#2a0505]">
      
      {/* 1. Background Layer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: animStage >= 1 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={BG_IMAGE} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </motion.div>

      {/* 2. Characters Layer - Z-Index 10 (Lower than Logo) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
        animate={{
          opacity: (animStage >= 2 && !isUIReady) ? 1 : 0, // Fade out when UI ready
          scale: animStage >= 2 ? 1 : 0.95,
          left: '50%', // Centered
          x: '-50%'
        }}
        transition={{
          opacity: { duration: 0.7 },
          scale: { duration: 0.7, ease: "easeOut" }
        }}
        className="absolute z-10 bottom-[20vh] md:bottom-0 w-full h-[112%] md:h-[95%] pointer-events-none origin-bottom"
      >
        <img
          src={CHARACTERS_IMAGE}
          alt="Characters"
          className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        />
      </motion.div>

      {/* 4. Logo Layer - Z-Index 30 (Higher than Characters) */}
      <div className="absolute inset-0 z-30 flex flex-col items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: '30vh' }}
          animate={{
            opacity: animStage >= 4 ? 1 : 0,
            scale: animStage >= 4 ? 1 : 0.9,
            // Slight adjustment when UI enters, but mostly staying in "Header" area
            y: isUIReady ? '12vh' : '18vh'
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Logo SVG */}
          <div className="w-[200px] md:w-[300px]">
             <svg viewBox="0 0 375 125" fill="none" className="w-full h-auto drop-shadow-2xl">
              <path d="M16.365 58.9789H0V0H22.1972L32.904 24.4718L38.6492 39.7007H39.7808L45.2648 24.4718L55.4494 0H77.6465V58.9789H61.2816V34.5951L61.8909 24.7359H60.7593L57.4515 34.5951L48.7467 55.4577H28.8998L20.1951 34.5951L16.8872 24.7359H15.7556L16.365 34.5951V58.9789Z" fill="white"/>
              <path d="M97.0711 59.8592C87.1476 59.8592 81.5766 55.2817 81.5766 47.7113C81.5766 41.4613 85.8419 36.9718 95.7654 36.0035L113.61 34.243V33.3627C113.61 28.8732 111.695 28.169 105.863 28.169C100.466 28.169 98.812 29.2253 98.812 32.9225V33.2746H82.4471V33.0986C82.4471 21.3028 92.1964 13.7324 107.082 13.7324C122.402 13.7324 129.801 21.3028 129.801 33.7148V58.9789H114.481V49.6479H113.61C111.956 55.8979 106.559 59.8592 97.0711 59.8592ZM98.0286 46.6549C98.0286 48.0634 99.4214 48.3275 101.946 48.3275C109.867 48.3275 113.088 47.3592 113.523 43.3979L100.118 44.9824C98.6379 45.1584 98.0286 45.6866 98.0286 46.6549Z" fill="white"/>
              <path d="M151.017 58.9789H134.652V0H151.017V28.081H151.887C153.28 20.5986 158.155 13.7324 169.384 13.7324C181.048 13.7324 186.619 21.2148 186.619 31.0739V58.9789H170.254V36.6197C170.254 30.4577 167.904 28.5211 160.418 28.5211C152.845 28.5211 151.017 30.3697 151.017 36.0915V58.9789Z" fill="white"/>
              <path d="M207.887 10.5634H191.522V0H207.887V10.5634ZM188.214 73.9437H186.647V61.7958H188.301C190.477 61.7958 191.522 61.0035 191.522 58.6268V14.6127H207.887V56.162C207.887 70.1585 200.749 73.9437 188.214 73.9437Z" fill="white"/>
              <path d="M237.4 59.8592C222.167 59.8592 211.808 51.1444 211.808 36.7958C211.808 22.3592 222.167 13.7324 237.4 13.7324C252.633 13.7324 262.992 22.3592 262.992 36.7958C262.992 51.1444 252.633 59.8592 237.4 59.8592ZM237.4 45.2465C244.799 45.2465 246.801 43.2218 246.801 36.7958C246.801 30.3697 244.799 28.257 237.4 28.257C230.001 28.257 227.999 30.3697 227.999 36.7958C227.999 43.2218 230.001 45.2465 237.4 45.2465Z" fill="white"/>
              <path d="M283.288 58.9789H266.924V14.6127H282.244V28.081H283.114C284.072 20.6866 288.86 13.7324 300.611 13.7324C312.449 13.7324 318.02 20.9507 318.02 30.5458V58.9789H301.656V36.6197C301.656 30.4577 299.392 28.5211 292.254 28.5211C285.029 28.5211 283.288 30.3697 283.288 36.0915V58.9789Z" fill="white"/>
              <path d="M342.357 54.0493C329.3 54.0493 321.988 46.4789 321.988 33.8028C321.988 21.3028 329.822 13.7324 342.792 13.7324C351.671 13.7324 357.59 17.3415 358.809 25H359.68V14.6127H375V51.4965C375 67.3415 365.686 74.8239 348.799 74.8239C333.478 74.8239 324.599 68.3099 324.599 56.6901H340.964C340.964 60.2993 341.4 61.1796 349.93 61.1796C356.981 61.1796 358.635 60.1232 358.635 52.6408V43.3099H357.765C356.633 49.7359 352.019 54.0493 342.357 54.0493ZM338.527 33.8028C338.527 38.2042 340.616 39.8768 348.276 39.8768C355.588 39.8768 358.635 38.9965 358.635 34.331V33.7148C358.635 28.9613 355.588 27.993 348.276 27.993C340.616 27.993 338.527 29.4894 338.527 33.8028Z" fill="white"/>
              <path d="M98.9708 125C81.126 125 70.2451 118.574 70.2451 103.609V103.081H86.61V104.93C86.61 108.891 88.0028 109.947 98.9708 109.947C108.894 109.947 109.939 109.155 109.939 106.514C109.939 104.401 108.807 103.521 104.02 102.905L85.7396 100.44C74.8586 98.9437 69.3746 93.0458 69.3746 83.5387C69.3746 74.1197 76.5996 64.2606 97.6651 64.2606C116.206 64.2606 125.085 72.4472 125.085 85.6514V86.1796H108.72V84.8592C108.72 80.6338 106.892 79.2253 95.9241 79.2253C87.5676 79.2253 85.7396 80.3697 85.7396 82.9225C85.7396 84.7711 86.7841 85.6514 89.9179 86.0915L108.198 88.8204C122.474 90.9331 126.304 98.3275 126.304 105.898C126.304 116.021 118.644 125 98.9708 125Z" fill="white"/>
              <path d="M161.262 124.12H149.771C138.803 124.12 132.275 118.75 132.275 107.218V93.3099H125.833V79.7535H132.275V72.0951H148.64V79.7535H161.262V93.3099H148.64V104.842C148.64 108.363 149.684 109.243 153.427 109.243H161.262V124.12Z" fill="white"/>
              <path d="M177.616 125C167.692 125 162.121 120.423 162.121 112.852C162.121 106.602 166.387 102.113 176.31 101.144L194.155 99.3838V98.5035C194.155 94.0141 192.24 93.3099 186.407 93.3099C181.011 93.3099 179.357 94.3662 179.357 98.0634V98.4155H162.992V98.2394C162.992 86.4437 172.741 78.8732 187.626 78.8732C202.947 78.8732 210.346 86.4437 210.346 98.8556V124.12H195.025V114.789H194.155C192.501 121.039 187.104 125 177.616 125ZM178.573 111.796C178.573 113.204 179.966 113.468 182.49 113.468C190.412 113.468 193.632 112.5 194.068 108.539L180.662 110.123C179.183 110.299 178.573 110.827 178.573 111.796Z" fill="white"/>
              <path d="M229.82 124.12H213.456V79.7535H228.776V91.3732H229.646C230.865 84.0669 235.392 78.8732 244.096 78.8732C253.759 78.8732 257.589 85.2993 257.589 94.1901V102.993H241.224V97.7993C241.224 94.1021 239.831 92.7817 235.566 92.7817C231.126 92.7817 229.82 94.1021 229.82 97.6232V124.12Z" fill="white"/>
              <path d="M282.909 125C267.414 125 259.145 118.926 259.145 108.715V108.363H275.51V109.243C275.51 111.708 277.076 111.972 282.996 111.972C288.654 111.972 289.524 111.356 289.524 109.859C289.524 108.451 288.828 108.099 284.737 107.658L272.028 106.25C262.975 105.282 258.1 100.968 258.1 93.4859C258.1 85.6514 264.28 78.8732 280.732 78.8732C295.966 78.8732 304.061 84.419 304.061 95.3345V95.6866H287.696V95.1584C287.696 92.8697 286.826 91.8134 280.21 91.8134C274.9 91.8134 274.204 92.5176 274.204 94.1901C274.204 95.4225 274.9 96.0387 280.036 96.5669L288.741 97.5352C301.537 98.9437 305.628 103.257 305.628 110.739C305.628 119.014 297.446 125 282.909 125Z" fill="white"/>
            </svg>
          </div>
          
          {/* Hero Glow Pulse */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.2, delay: 0.5, times: [0, 0.5, 1] }}
            className="absolute inset-0 bg-white blur-[60px] -z-10"
          />
        </motion.div>
      </div>

      {/* 6. Login UI Form */}
      <AnimatePresence>
        {isUIReady && (
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center pt-[140px] md:pt-[160px]"
          >
             <div className="w-full max-w-xs px-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  
                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-bold ml-1">Email</label>
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Value"
                      className="w-full h-10 bg-[#2a0505]/90 backdrop-blur-md border border-white/10 rounded-lg px-4 text-white font-sans text-sm placeholder-white/20 focus:outline-none focus:border-brand-gold/50 transition-all shadow-lg"
                      autoFocus
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-10 bg-[#D00501] hover:bg-[#b00401] rounded-lg shadow-md transition-colors flex items-center justify-center mt-2"
                  >
                    <span className="text-white font-bold text-xs tracking-wider uppercase">LOG IN / REGISTER</span>
                  </motion.button>
                  
                  {/* Divider */}
                  <div className="flex items-center gap-3 my-2 opacity-50">
                    <div className="h-[1px] bg-white/30 flex-1" />
                    <span className="text-[10px] text-white font-medium">or continue with</span>
                    <div className="h-[1px] bg-white/30 flex-1" />
                  </div>

                  {/* Social Icons */}
                  <div className="flex items-center justify-between gap-2">
                     {[
                       // Apple
                       <svg key="apple" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.54 1.25.05 2.64.57 3.32 1.66-1.55.95-1.9 2.5-1.66 3.67.12.58.4 1.13.82 1.56-.66 1.94-1.54 3.66-2.58 4.71-.34.34-.68.67-1.35 2.17zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z"/></svg>,
                       // Discord
                       <svg key="discord" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
                       // Facebook
                       <svg key="facebook" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                       // Google
                       <svg key="google" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>,
                       // Twitch
                       <svg key="twitch" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                     ].map((icon, i) => (
                       <button key={i} className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:scale-110 transition-all">
                         {icon}
                       </button>
                     ))}
                  </div>

                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Loading System (Bottom) */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 z-50 flex flex-col items-center justify-center px-12"
        initial={{ opacity: 1 }}
        animate={{ opacity: isUIReady ? 0 : 1 }} // Fade out when UI is ready
        transition={{ duration: 0.5 }}
      >
        {/* Loading Text */}
        <div className="h-6 mb-3 overflow-hidden">
          <AnimatePresence mode="wait">
             <motion.span 
               key={messageIndex}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="block text-brand-gold text-xs font-bold tracking-widest uppercase text-center"
             >
               {LOADING_MESSAGES[messageIndex]}
             </motion.span>
          </AnimatePresence>
        </div>

        {/* Loading Bar */}
        <div className="w-full max-w-md h-2 bg-black/60 rounded-full border border-white/10 overflow-hidden relative shadow-2xl">
           <motion.div 
             className="h-full bg-brand-gold shadow-[0_0_10px_rgba(244,185,66,0.8)]"
             style={{ width: `${loadingProgress}%` }}
           />
        </div>
        <span className="text-white/30 text-[10px] font-bold mt-2">{Math.round(loadingProgress)}%</span>
      </motion.div>

    </div>
  );
};