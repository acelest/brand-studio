"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { Plus, Download, Check, Sun, Moon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PreviewCanvas, type PreviewCanvasHandle } from "@/components/studio/PreviewCanvas";
import { useMediaFile } from "@/hooks/useMediaFile";
import { useOverlay } from "@/hooks/useOverlay";
import { useExport } from "@/hooks/useExport";
import { CURRENT_BRAND } from "@/types/brandkit";
import { cn } from "@/lib/utils";

export default function CodexPage() {
  const { media, isDragging, setIsDragging, loadFile, clearMedia } = useMediaFile();
  const { config, update, reset } = useOverlay();
  const canvasRef = useRef<PreviewCanvasHandle>(null);
  const { status: exportStatus, exportPng } = useExport();

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved || "dark";
    setTheme(initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleCustomLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      update({ customLogoUrl: url });
    }
  };

  const handleResetCustomLogo = () => {
    if (config.customLogoUrl) {
      URL.revokeObjectURL(config.customLogoUrl);
    }
    update({ customLogoUrl: undefined });
  };

  const triggerDownload = () => {
    if (!media) return;
    exportPng(canvasRef.current?.canvas ?? null, "mbs-branded.png");
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative transition-colors duration-300">
      {/* Toast Alert */}
      <AnimatePresence>
        {exportStatus === "done" && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/10 bg-[#0f0f0f]/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] select-none pointer-events-none"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <Check className="w-3 h-3 text-black stroke-[3.5px]" />
            </div>
            <span className="text-xs font-semibold tracking-tight text-white/90">
              Enregistré dans Photos
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <header className="h-12 flex items-center justify-center border-b border-foreground/5 flex-shrink-0 relative">
        <div className="text-[10px] font-bold tracking-widest uppercase text-foreground/30 select-none">
          MBS Image Maker
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-full hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle Theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="block"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      {/* ─── MAIN WORKSPACE ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4 md:py-8 max-w-4xl mx-auto w-full overflow-y-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          className="text-xl sm:text-2xl font-light tracking-tight text-center mb-6 md:mb-8 select-none text-foreground/90"
        >
          What's your MBS image?
        </motion.h1>

        {/* Studio Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 md:gap-12 w-full items-center justify-center"
        >
          {/* LEFT: Preview Canvas / Upload Dropzone */}
          <div
            className={cn(
              "rounded-2xl overflow-hidden border border-foreground/10 relative bg-foreground/[0.03] flex items-center justify-center transition-all duration-300 mx-auto w-full",
              !media && "aspect-[4/3] md:aspect-[4/3]",
              media && "max-h-[35vh] sm:max-h-[50vh]"
            )}
            style={media ? {
              aspectRatio: `${media.width} / ${media.height}`,
              height: "480px",
              width: "auto",
              maxWidth: "100%"
            } : undefined}
          >
            <AnimatePresence mode="wait">
              {media ? (
                <motion.div
                  key="canvas"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <PreviewCanvas
                    ref={canvasRef}
                    media={media}
                    brandKit={CURRENT_BRAND}
                    config={config}
                  />
                  {/* Clear media button */}
                  <button
                    type="button"
                    aria-label="Remove media"
                    onClick={clearMedia}
                    className="absolute top-3 right-3 z-10 w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all duration-150 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 rotate-45" />
                  </button>
                </motion.div>
              ) : (
                <motion.label
                  key="dropzone"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center cursor-pointer border border-dashed border-foreground/10 m-3 rounded-xl transition-all duration-200 select-none",
                    isDragging ? "bg-foreground/5 border-foreground/30" : "hover:bg-foreground/[0.02]"
                  )}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center mb-4 bg-foreground/5">
                    <Plus className="w-5 h-5 text-foreground/60" />
                  </div>
                  <span className="text-sm font-medium mb-1">Upload an image</span>
                  <span className="text-[11px] text-foreground/40">
                    PNG or JPG. The exported image will be a PNG.
                  </span>
                </motion.label>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Sidebar Controls */}
          <div className="space-y-5 flex flex-col h-full justify-between py-1">
            <div className="space-y-5">
              {/* Format Selection Control */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground/80">Format</span>
                <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-foreground/5 border border-foreground/5">
                  <button
                    type="button"
                    disabled={!media}
                    onClick={() => update({ format: "original" })}
                    className={cn(
                      "py-2 sm:py-1 text-[11px] font-semibold rounded-md transition-all select-none cursor-pointer",
                      config.format === "original"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-foreground/50 hover:text-foreground/80 disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    disabled={!media}
                    onClick={() => update({ format: "vertical" })}
                    className={cn(
                      "py-2 sm:py-1 text-[11px] font-semibold rounded-md transition-all select-none cursor-pointer",
                      config.format === "vertical"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-foreground/50 hover:text-foreground/80 disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    Vertical (9:16)
                  </button>
                </div>
              </div>

              {/* Custom Branding Control */}
              <div className="space-y-3 pt-1 border-t border-foreground/5">
                <div className="text-[11px] font-semibold text-foreground/80 tracking-wide uppercase">Custom Watermark</div>
                
                {/* Brand Name Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-foreground/50">
                    <span>Brand name</span>
                    <span>{config.customBrandName?.length || 0}/25</span>
                  </div>
                  <input
                    type="text"
                    disabled={!media}
                    placeholder="MyBestSim"
                    maxLength={25}
                    value={config.customBrandName || ""}
                    onChange={(e) => update({ customBrandName: e.target.value })}
                    className="w-full px-3 py-1.5 text-base sm:text-xs rounded-md bg-foreground/5 border border-foreground/5 focus:outline-none focus:border-foreground/20 text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Brand Logo Upload */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-foreground/50 block">Brand logo</span>
                  {config.customLogoUrl ? (
                    <div className="flex items-center justify-between gap-3 p-1.5 rounded-md bg-foreground/5 border border-foreground/5">
                      <div className="flex items-center gap-2">
                        {/* Preview thumbnail */}
                        <img
                          src={config.customLogoUrl}
                          alt="Custom logo"
                          className="w-6 h-6 object-contain rounded bg-foreground/5 p-0.5"
                        />
                        <span className="text-[10px] text-foreground/60 truncate max-w-[120px]">
                          Custom Logo
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetCustomLogo}
                        className="text-[10px] font-semibold text-foreground/50 hover:text-foreground transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-foreground/5"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <label
                      className={cn(
                        "flex items-center justify-center gap-2 py-1.5 px-3 border border-dashed border-foreground/15 rounded-md hover:bg-foreground/[0.02] transition-colors cursor-pointer select-none text-[11px] font-medium text-foreground/70",
                        !media && "opacity-40 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={!media}
                        onChange={handleCustomLogoChange}
                      />
                      <Plus className="w-3.5 h-3.5" />
                      Upload Logo
                    </label>
                  )}
                </div>
              </div>

              {/* Logo Size Control */}
              <div className="space-y-2 pt-1 border-t border-foreground/5">
                <span className="text-xs font-semibold text-foreground/80">Logo size</span>
                <Slider
                  min={5}
                  max={40}
                  step={1}
                  value={[config.logoSize]}
                  disabled={!media}
                  onValueChange={([val]) => update({ logoSize: val })}
                  className={cn("w-full transition-opacity", !media && "opacity-40")}
                />
              </div>

              {/* Vertical Position Control */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground/80">Vertical position</span>
                <Slider
                  min={10}
                  max={90}
                  step={1}
                  value={[config.verticalPosition]}
                  disabled={!media}
                  onValueChange={([val]) => update({ verticalPosition: val })}
                  className={cn("w-full transition-opacity", !media && "opacity-40")}
                />
              </div>

              {/* Photo Zoom Control */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground/80">Photo zoom</span>
                <Slider
                  min={100}
                  max={300}
                  step={1}
                  value={[config.zoom || 100]}
                  disabled={!media}
                  onValueChange={([val]) => update({ zoom: val })}
                  className={cn("w-full transition-opacity", !media && "opacity-40")}
                />
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={triggerDownload}
                  disabled={!media || exportStatus === "exporting"}
                  className={cn(
                    "h-10 rounded-full text-xs font-semibold transition-all duration-200 select-none border border-transparent",
                    media
                      ? "bg-foreground text-background hover:opacity-90 active:scale-95 cursor-pointer"
                      : "bg-foreground text-background cursor-not-allowed opacity-75"
                  )}
                >
                  {exportStatus === "exporting" ? "Exporting…" : "Download"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleResetCustomLogo();
                    clearMedia();
                    reset();
                  }}
                  disabled={!media}
                  className={cn(
                    "h-10 rounded-full text-xs font-semibold transition-all duration-200 select-none border border-transparent",
                    media
                      ? "bg-foreground/10 hover:bg-foreground/15 text-foreground active:scale-95 cursor-pointer"
                      : "bg-foreground/10 text-foreground cursor-not-allowed opacity-75"
                  )}
                >
                  Restart
                </button>
              </div>
            </div>

            {/* Inspired by attribution */}
            <div className="text-center text-[10px] text-foreground/35 pt-12">
              Inspired by{" "}
              <a
                href="https://jessyin.world"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground/50 transition-colors"
              >
                jessyin.world
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
    </MotionConfig>
  );
}
