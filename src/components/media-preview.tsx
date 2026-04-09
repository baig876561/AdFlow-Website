"use client";

import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/utils/media";
import { useState } from "react";

interface MediaPreviewProps {
  url: string;
  sourceType?: "image" | "youtube" | "video";
  alt?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export function MediaPreview({
  url,
  sourceType = "image",
  alt = "Media preview",
  className = "",
  aspectRatio = "video",
}: MediaPreviewProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[2/1]",
  };

  if (hasError || !url) {
    return (
      <div
        className={`${aspectClasses[aspectRatio]} bg-card rounded-lg flex items-center justify-center border border-border ${className}`}
      >
        <div className="text-center text-muted">
          <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    );
  }

  if (sourceType === "youtube") {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return (
        <div className={`${aspectClasses[aspectRatio]} bg-card rounded-lg flex items-center justify-center border border-border ${className}`}>
          <p className="text-muted text-sm">Invalid YouTube URL</p>
        </div>
      );
    }

    return (
      <div className={`${aspectClasses[aspectRatio]} rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={getYouTubeEmbedUrl(videoId)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={alt}
        />
      </div>
    );
  }

  return (
    <div className={`${aspectClasses[aspectRatio]} rounded-lg overflow-hidden relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-card animate-pulse" />
      )}
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
