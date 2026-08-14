"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  category: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: "biz",
    category: "Pillar I • Doanh nghiệp",
    title: "Business Mindset",
    subtitle: "Xác định giá trị nội tại & đòi hỏi biên an toàn rõ ràng.",
    videoSrc: "/videos/biz.mp4",
  },
  {
    id: "psy",
    category: "Pillar III • Tâm lý",
    title: "Behavioral Control",
    subtitle: "Kiểm soát cảm xúc, đứng vững trước biến động FOMO/FUD.",
    videoSrc: "/videos/psy.mp4",
  },
  {
    id: "frameworks",
    category: "Pillar II • Bộ khung tư duy",
    title: "Frameworks & Checklist",
    subtitle: "Quy trình phân tích chuyên sâu tích chọn từng hạng mục.",
    videoSrc: "/videos/frameworks.mp4",
  },
  {
    id: "series",
    category: "Học tập • Lộ trình",
    title: "Series Lộ Trình Học",
    subtitle: "Từ cơ bản đến chuyên sâu, xây dựng nền tảng vững chắc.",
    videoSrc: "/videos/series.mp4",
  },
  {
    id: "advisory",
    category: "Dịch vụ • Advisory",
    title: "Đồng Hành Tư Vấn",
    subtitle: "Đồng hành xây dựng quy trình ra quyết định độc lập, có nguyên tắc và dựa trên bằng chứng.",
    videoSrc: "/videos/advisory.mp4",
  },
];

export function ContentCarousel() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with center card active
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Mobile viewport detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Play only the active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  // Autoplay interval (paused on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered]);

  // Swipe gesture detection
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset < -2) offset += 5;
    if (offset > 2) offset -= 5;
    return offset;
  };

  const getCardStyles = (index: number) => {
    const offset = getOffset(index);
    let translateX = "0px";
    let scale = 1;
    let rotateY = 0;
    let zIndex = 30;
    let opacity = 1;

    if (isMobile) {
      if (offset === 1) {
        translateX = "115px";
        scale = 0.82;
        rotateY = -12;
        zIndex = 20;
        opacity = 0.45;
      } else if (offset === -1) {
        translateX = "-115px";
        scale = 0.82;
        rotateY = 12;
        zIndex = 20;
        opacity = 0.45;
      } else if (Math.abs(offset) >= 2) {
        translateX = "0px";
        scale = 0.6;
        zIndex = 10;
        opacity = 0;
      }
    } else {
      if (offset === 1) {
        translateX = "310px";
        scale = 0.82;
        rotateY = -28;
        zIndex = 20;
        opacity = 0.65;
      } else if (offset === -1) {
        translateX = "-310px";
        scale = 0.82;
        rotateY = 28;
        zIndex = 20;
        opacity = 0.65;
      } else if (offset === 2) {
        translateX = "560px";
        scale = 0.65;
        rotateY = -35;
        zIndex = 10;
        opacity = 0.2;
      } else if (offset === -2) {
        translateX = "-560px";
        scale = 0.65;
        rotateY = 35;
        zIndex = 10;
        opacity = 0.2;
      }
    }

    return {
      transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      transformStyle: "preserve-3d" as const,
      pointerEvents: (isMobile && Math.abs(offset) >= 2) ? ("none" as const) : ("auto" as const),
    };
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-5xl mx-auto py-10 flex flex-col items-center justify-center select-none"
    >
      {/* Active Card Glow (Backdrop glow) */}
      <div 
        className="absolute w-[280px] md:w-[420px] h-[280px] md:h-[420px] rounded-full bg-[#e61c5c]/8 blur-[100px] pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"
        style={{
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%"
        }}
      />

      {/* Desktop Left Action Chevron */}
      <button
        onClick={handlePrev}
        className="absolute left-[-40px] lg:left-[-70px] top-[50%] -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hidden md:flex items-center justify-center text-white hover:bg-[#e61c5c] hover:border-[#e61c5c] hover:shadow-[0_0_20px_rgba(230,28,92,0.3)] active:scale-[0.95] transition-all z-50 group/btn"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-[2px] transition-transform" />
      </button>

      {/* 3D Coverflow Container */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[380px] md:h-[480px] flex items-center justify-center z-10"
        style={{ perspective: "1000px" }}
      >
        {carouselItems.map((item, index) => {
          const offset = getOffset(index);
          const isActive = offset === 0;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`absolute bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-[2rem] p-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none group/card ${
                isActive ? "shadow-[0_20px_50px_rgba(230,28,92,0.12)]" : "shadow-xl"
              }`}
              style={{
                width: isMobile ? "230px" : "320px",
                height: isMobile ? "360px" : "450px",
                ...getCardStyles(index)
              }}
            >
              {/* Double-Bezel Inner Core */}
              <div className="w-full h-full bg-[#0b0f19]/90 rounded-[calc(2rem-0.5rem)] border border-white/[0.03] overflow-hidden flex flex-col justify-between">
                
                {/* Header (Category & Title) */}
                <div 
                  className={`p-4 md:p-5 pb-3 flex flex-col gap-1.5 z-10 transition-opacity duration-500 border-b border-white/[0.04] bg-[#0c101c]/50 ${
                    isActive ? "opacity-100" : "opacity-30 group-hover/card:opacity-75"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#e61c5c] bg-[#e61c5c]/10 border border-[#e61c5c]/15 px-2.5 py-0.5 rounded-full w-fit">
                    {item.category}
                  </span>
                  <h3 className="font-serif font-bold text-base md:text-xl text-white leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Body (Video Clip Preview) */}
                <div className="relative flex-grow w-full bg-black/20 overflow-hidden flex items-center justify-center p-3 md:p-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={item.videoSrc}
                      className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                      loop
                      muted
                      playsInline
                      preload="auto"
                    />
                    
                    {/* Shadow Scrim overlay */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-40"
                      }`} 
                    />
                  </div>
                </div>

                {/* Footer (Explainer subtext) */}
                <div 
                  className={`p-4 md:p-5 pt-3 z-10 transition-opacity duration-500 border-t border-white/[0.04] bg-[#0c101c]/50 ${
                    isActive ? "opacity-100" : "opacity-30 group-hover/card:opacity-70"
                  }`}
                >
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                    {item.subtitle}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Right Action Chevron */}
      <button
        onClick={handleNext}
        className="absolute right-[-40px] lg:right-[-70px] top-[50%] -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hidden md:flex items-center justify-center text-white hover:bg-[#e61c5c] hover:border-[#e61c5c] hover:shadow-[0_0_20px_rgba(230,28,92,0.3)] active:scale-[0.95] transition-all z-50 group/btn"
        aria-label="Slide sau"
      >
        <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-[2px] transition-transform" />
      </button>

      {/* Slide Navigation Dot Indicators */}
      <div className="flex gap-2.5 mt-6 z-40">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "bg-[#e61c5c] w-6" : "bg-gray-300/40 hover:bg-gray-300/70"
            }`}
            aria-label={`Đi tới slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
