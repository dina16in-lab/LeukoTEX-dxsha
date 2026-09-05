import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GlassSquare = ({ src, offset = 0 }: { src: string; offset?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect for the image inside the glass
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-3xl overflow-hidden glass-panel shadow-2xl shrink-0" style={{ transform: `translateY(${offset}px)` }}>
      <div className="absolute inset-0 overflow-hidden rounded-3xl m-2">
        <motion.img 
          src={src} 
          style={{ y, scale: 1.2 }}
          alt="Original" 
          className="absolute inset-0 w-full h-full object-cover toon-filter"
        />
      </div>
    </div>
  );
};

export const DemoSection: React.FC = () => {
  return (
    <section id="demo" className="relative w-full py-32 bg-[#F5F5DC] overflow-hidden flex flex-col items-center">
      
      <div className="text-center mb-16 px-4">
        <h2 className="font-display text-4xl md:text-6xl text-[#3E2723] mb-4">instant. effortless.</h2>
        <div className="flex items-center justify-center gap-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          <span>photo</span>
          <span className="w-8 h-[1px] bg-gray-600"></span>
          <span className="text-neon-green">doodle</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 px-4 justify-center items-center">
        {/* We use the same image but one is toon-filtered by the GlassSquare */}
        <div className="relative group">
          <img src="https://picsum.photos/seed/oodles-neon/1000/1000" alt="Photo 1" className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-3xl object-cover absolute inset-0 opacity-50 blur-sm group-hover:opacity-100 group-hover:blur-none transition-all duration-500" />
          <GlassSquare src="https://picsum.photos/seed/oodles-neon/1000/1000" offset={-40} />
        </div>
        
        <div className="relative group hidden md:block">
           <img src="https://picsum.photos/seed/oodles-bike/1000/1000" alt="Photo 2" className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-3xl object-cover absolute inset-0 opacity-50 blur-sm group-hover:opacity-100 group-hover:blur-none transition-all duration-500" />
          <GlassSquare src="https://picsum.photos/seed/oodles-bike/1000/1000" offset={40} />
        </div>
      </div>

    </section>
  );
};

