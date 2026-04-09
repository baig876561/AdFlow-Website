// ============================================================
// Media Normalization Utility
// ============================================================

import type { MediaSourceType } from "@/lib/types";

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif",
];

const ALLOWED_PROTOCOLS = ["https:", "http:"];

/**
 * Extract YouTube video ID from a URL
 */
export function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

/**
 * Generate YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: "default" | "medium" | "high" | "maxres" = "high"
): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Generate YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Detect media source type from URL
 */
export function detectMediaType(url: string): MediaSourceType {
  if (YOUTUBE_REGEX.test(url)) return "youtube";
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  const lower = url.toLowerCase();
  if (videoExtensions.some((ext) => lower.includes(ext))) return "video";
  return "image";
}

/**
 * Validate a media URL
 */
export function validateMediaUrl(url: string): {
  valid: boolean;
  reason?: string;
} {
  try {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { valid: false, reason: "Only http and https URLs are allowed" };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: "Invalid URL format" };
  }
}

/**
 * Validate image URL extension
 */
export function validateImageUrl(url: string): {
  valid: boolean;
  reason?: string;
} {
  const base = validateMediaUrl(url);
  if (!base.valid) return base;

  const lower = url.toLowerCase().split("?")[0];
  // Allow URLs without obvious extensions (CDN links, GitHub raw, etc.)
  const hasExtension = lower.lastIndexOf(".") > lower.lastIndexOf("/");
  if (
    hasExtension &&
    !ALLOWED_IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))
  ) {
    return { valid: false, reason: "Unsupported image format" };
  }
  return { valid: true };
}

/**
 * Normalize a media entry — extracts thumbnails for YouTube, validates URLs
 */
export function normalizeMedia(url: string): {
  source_type: MediaSourceType;
  original_url: string;
  thumbnail_url: string | null;
  validation_status: "valid" | "invalid" | "pending";
} {
  const type = detectMediaType(url);
  const validation = validateMediaUrl(url);

  if (type === "youtube") {
    const videoId = extractYouTubeId(url);
    return {
      source_type: "youtube",
      original_url: url,
      thumbnail_url: videoId ? getYouTubeThumbnail(videoId) : null,
      validation_status: videoId && validation.valid ? "valid" : "invalid",
    };
  }

  if (type === "image") {
    const imgValidation = validateImageUrl(url);
    return {
      source_type: "image",
      original_url: url,
      thumbnail_url: url,
      validation_status: imgValidation.valid ? "valid" : "invalid",
    };
  }

  return {
    source_type: "video",
    original_url: url,
    thumbnail_url: null,
    validation_status: validation.valid ? "valid" : "invalid",
  };
}
