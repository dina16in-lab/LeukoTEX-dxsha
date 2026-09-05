import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  { text: "artist", color: "#ffffff" },
  { text: "creator", color: "#ff8ad4" },
  { text: "designer", color: "#ffe86a" },
  { text: "illustrator", color: "#7dffb2" },
  { text: "dreamer", color: "#b18cff" }
];

export const WordWheelSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-40 bg-[#F5F5DC] flex flex-col md:flex-row justify-center items-center gap-4 overflow-hidden">
      
      <h2 className="font-display text-5xl md:text-8xl text-[#3E2723]">
        everyone's an
      </h2>
      
      <div className="h-[60px] md:h-[100px] overflow-hidden relative w-64 text-center md:text-left">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "anticipate" }}
            className="absolute w-full font-display text-5xl md:text-8xl drop-shadow-lg"
            style={{ color: words[index].color }}
          >
            {words[index].text}
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
};

