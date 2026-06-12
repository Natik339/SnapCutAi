import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string) => void;
}

export function ImageUploader({ isOpen, onClose, onImageSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle SSR - only run client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!isMounted) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [isMounted]);
  
  const confirmImage = () => {
    if (preview && onImageSelect) {
      onImageSelect(preview);
      onClose();
      setPreview(null);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    if (!isMounted) return;
    e.preventDefault();
    setIsDragging(true);
  }, [isMounted]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!isMounted) return;
    e.preventDefault();
    setIsDragging(false);
  }, [isMounted]);

  const onDrop = useCallback((e: React.DragEvent) => {
    if (!isMounted) return;
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile, isMounted]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted) return;
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile, isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const handlePaste = (e: ClipboardEvent) => {
      if (!isOpen) return;
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          handleFile(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen, handleFile, isMounted]);

  if (!isOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-background rounded-3xl shadow-2xl border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted hover:text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Upload your image</h2>
          <p className="text-muted-foreground text-center mb-8">
            Drag & drop, click to browse, or paste (Ctrl+V / Cmd+V)
          </p>

          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-96 object-contain rounded-2xl border border-border mb-6"
              />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setPreview(null)}
                  className="px-6 py-2 bg-background border border-border rounded-full hover:bg-muted transition-colors"
                >
                  Choose another image
                </button>
                <button
                  onClick={confirmImage}
                  className="px-6 py-2 bg-brand-gradient text-primary-foreground rounded-full border-0 shadow-glow hover:opacity-95 transition-opacity"
                >
                  Use this image
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={dropZoneRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                ${isDragging ? "border-brand-foreground bg-brand-soft/50" : "border-border hover:border-brand-foreground/50"}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileSelect}
                className="sr-only"
              />
              <div className="mx-auto w-16 h-16 rounded-full bg-brand-soft/30 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-brand-gradient" />
              </div>
              <p className="font-medium mb-1">Drop image here or click to browse</p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WEBP up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
