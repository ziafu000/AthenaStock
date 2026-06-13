"use client";

import React, { useState, useEffect, useRef } from "react";

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
    subtitle: "Phân bổ danh mục tối ưu, hướng tới lợi nhuận bền vững.",
    videoSrc: "/videos/advisory.mp4",
  },
];

export function ContentCarousel() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with center card (Frameworks) active
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Function to calculate relative offset from center active card
  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    // Circular wrapping for 5 items
    if (offset < -2) offset += 5;
    if (offset > 2) offset -= 5;
    return offset;
  };

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

  // Autoplay interval every 2.5 seconds (2500ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto py-10 flex flex-col items-center justify-center select-none"
    >
      {/* 3D Coverflow Container */}
      <div 
        className="relative w-full h-[320px] md:h-[480px] flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {carouselItems.map((item, index) => {
          const offset = getOffset(index);
          const isActive = offset === 0;

          // Calculate visual transformations based on offset
          let translateX = "0px";
          let scale = 1;
          let rotateY = 0;
          let zIndex = 30;
          let opacity = 1;

          if (offset === 1) {
            translateX = "var(--coverflow-translate-x-1)";
            scale = 0.82;
            rotateY = -28;
            zIndex = 20;
            opacity = 0.65;
          } else if (offset === -1) {
            translateX = "calc(-1 * var(--coverflow-translate-x-1))";
            scale = 0.82;
            rotateY = 28;
            zIndex = 20;
            opacity = 0.65;
          } else if (offset === 2) {
            translateX = "var(--coverflow-translate-x-2)";
            scale = 0.65;
            rotateY = -35;
            zIndex = 10;
            opacity = 0.2;
          } else if (offset === -2) {
            translateX = "calc(-1 * var(--coverflow-translate-x-2))";
            scale = 0.65;
            rotateY = 35;
            zIndex = 10;
            opacity = 0.2;
          }

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className="absolute w-[200px] md:w-[320px] h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#090d16]/80 backdrop-blur-md cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col group/card"
              style={{
                transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex: zIndex,
                opacity: opacity,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Category Header (Visible on active center card or slightly faded) */}
              <div 
                className={`p-5 pb-3 flex flex-col gap-1 z-10 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
              >
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#e61c5c]">
                  {item.category}
                </span>
                <h3 className="font-serif font-bold text-base md:text-xl text-white leading-snug">
                  {item.title}
                </h3>
              </div>

              {/* Video Preview Container */}
              <div className="relative flex-grow w-full bg-black/40 overflow-hidden flex items-center justify-center">
                {/* Inner relative wrapper matching the video size */}
                <div className="relative w-[95%] h-auto flex items-center justify-center rounded-2xl overflow-hidden">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={item.videoSrc}
                    className="w-full h-full object-cover opacity-85 group-hover/card:opacity-100 transition-opacity duration-500"
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                  
                  {/* Dark overlay gradient for text legibility - fits the video exactly */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} 
                  />
                </div>
              </div>

              {/* Bottom Info text overlay */}
              <div 
                className={`p-5 pt-4 absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
              >
                <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-sans">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>


      {/* Dot Indicators */}
      <div className="flex gap-2.5 mt-6 z-40">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "bg-[#e61c5c] w-6" : "bg-gray-300/60 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
