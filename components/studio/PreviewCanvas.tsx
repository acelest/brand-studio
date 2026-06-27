"use client";

import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "motion/react";
import { drawOverlay } from "@/lib/branding/engine";
import type { BrandKit, MediaFile, OverlayConfig } from "@/types/brandkit";

export interface PreviewCanvasHandle {
  canvas: HTMLCanvasElement | null;
}

interface PreviewCanvasProps {
  media: MediaFile;
  brandKit: BrandKit;
  config: OverlayConfig;
}

export const PreviewCanvas = forwardRef<PreviewCanvasHandle, PreviewCanvasProps>(
  function PreviewCanvas({ media, brandKit, config }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sourceRef = useRef<HTMLImageElement | null>(null);

    useImperativeHandle(ref, () => ({ canvas: canvasRef.current }), []);

    // Render canvas on image load and config/format changes
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const runDraw = (img: HTMLImageElement) => {
        if (config.format === "vertical") {
          // Standard vertical HD format (Shorts/TikTok size)
          canvas.width = 1080;
          canvas.height = 1920;
        } else {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        drawOverlay(canvas, img, brandKit, config);
      };

      if (sourceRef.current && sourceRef.current.src === media.objectUrl) {
        runDraw(sourceRef.current);
      } else {
        const img = new Image();
        img.onload = () => {
          sourceRef.current = img;
          runDraw(img);
        };
        img.src = media.objectUrl;
      }
    }, [media.objectUrl, brandKit, config]);

    return (
      <motion.div
        className="w-full h-full flex items-center justify-center bg-[#0d0d0d] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain"
          style={{ imageRendering: "auto" }}
        />
      </motion.div>
    );
  }
);
PreviewCanvas.displayName = "PreviewCanvas";
