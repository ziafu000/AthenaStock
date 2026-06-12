"use client";

import React, { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate items to ensure seamless infinite looping
  const items = [...carouselItems, ...carouselItems];

  const handleVideoIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleVideoIntersection, {
      threshold: 0.1,
      rootMargin: "100px 0px 100px 0px", // pre-load
    });

    const videos = containerRef.current?.querySelectorAll("video");
    videos?.forEach((video) => observer.observe(video));

    return () => {
      videos?.forEach((video) => observer.unobserve(video));
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-10 group">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Fade Gradients for edge masking */}
      <div className="absolute left-0 top-0 bottom-0 w-5 md:w-10 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-5 md:w-10 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

      {/* Infinite Marquee Track */}
      <div
        ref={containerRef}
        className="flex w-max gap-4 hover:[animation-play-state:paused] animate-marquee"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="w-[150px] md:w-[280px] shrink-0 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md overflow-hidden hover:border-accent/40 hover:scale-[1.02] hover:bg-card/50 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col group/card"
          >
            {/* Visual Header / Meta */}
            <div className="p-5 pb-3 flex flex-col gap-1.5 z-10">
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-accent">
                {item.category}
              </span>
              <h3 className="font-serif font-bold text-sm md:text-xl text-primary leading-snug">
                {item.title}
              </h3>
            </div>

            {/* Video Preview Container */}
            <div className="relative aspect-square w-full bg-[#020216]/60 border-t border-b border-border/25 overflow-hidden">
              <video
                data-id={`${item.id}-${index}`}
                src={item.videoSrc}
                className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity duration-500"
                loop
                muted
                playsInline
                preload="none"
              />
              {/* Inner shadow/border glow */}
              <div className="absolute inset-0 border border-white/5 pointer-events-none" />
            </div>

            {/* Bottom info */}
            <div className="p-5 pt-4 flex-grow flex flex-col justify-between">
              <p className="text-[9px] md:text-[12px] text-muted-foreground leading-relaxed font-sans">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
