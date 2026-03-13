import { useState, useRef, useCallback } from "react";
import {
  Button,
  Field,
  MessageBar,
  Spinner,
  Body1,
  Caption1,
  makeStyles,
} from "@fluentui/react-components";
import {
  ArrowUpload24Regular,
  Image24Regular,
  Dismiss24Regular,
  Image24Filled,
} from "@fluentui/react-icons";
import type { Language } from "@/types/invitations";
import type { MediaCategory } from "@/lib/azure-storage";
import { useSession } from "next-auth/react";
import Link from "next/link";

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.8;

/** Compress an image file using Canvas: resizes to MAX_DIMENSION and re-encodes as JPEG */
function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // Skip non-raster formats (e.g. SVG) or already-small files
    if (!file.type.startsWith("image/") || file.size < 200_000) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      // Only resize if larger than max dimension
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file); // fallback to original
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // Compressed is larger — keep original
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, "");
          resolve(new File([blob], `${baseName}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1em",
    padding: "1em",
    width: "100%",
    boxSizing: "border-box",
  },
  dropZone: {
    width: "100%",
    minHeight: "150px",
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#fafafa",
    padding: "1em",
    boxSizing: "border-box",
  },
  dropZoneActive: {
    borderTopColor: "#4C4C4C",
    borderRightColor: "#4C4C4C",
    borderBottomColor: "#4C4C4C",
    borderLeftColor: "#4C4C4C",
    backgroundColor: "#f0f0f0",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "8px",
    width: "100%",
  },
  previewItem: {
    position: "relative" as const,
    borderRadius: "6px",
    overflow: "hidden",
    aspectRatio: "1",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  removeButton: {
    position: "absolute" as const,
    top: "2px",
    right: "2px",
    minWidth: "20px",
    width: "20px",
    height: "20px",
    padding: "0",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    width: "100%",
    fontWeight: "500",
    borderRadius: "4px",
    backgroundColor: "#4C4C4C",
    border: "2px solid #323232",
    color: "white",
  },
  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4C4C4C",
    borderRadius: "3px",
    transition: "width 0.2s ease",
  },
});

type PhotoUploadProps = {
  language?: Language;
};

export default function PhotoUpload({ language = "EN" }: PhotoUploadProps) {
  const { data: clientSession } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [category, setCategory] = useState<MediaCategory | "">("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styles = useStyles();

  const uploaderName = clientSession?.user?.invitation?.Guests?.[0]?.Name || "Guest";

  const isES = language === "ES";
  const labels = {

    dropText: isES
      ? "Toca para seleccionar fotos"
      : "Tap to select photos",
    dropSubtext: isES
      ? "JPEG, PNG, WebP • máx. 10MB • hasta 20 fotos"
      : "JPEG, PNG, WebP • max 10MB • up to 20 photos",
    uploading: isES ? "Subiendo..." : "Uploading...",
    upload: isES ? "Subir fotos" : "Upload photos",
    successMsg: isES
      ? "¡Fotos subidas exitosamente!"
      : "Photos uploaded successfully!",
    errorGeneric: isES
      ? "Error al subir. Intenta de nuevo."
      : "Upload failed. Please try again.",
    noFiles: isES
      ? "Selecciona al menos una foto"
      : "Please select at least one photo",
    compressing: isES ? "Comprimiendo fotos..." : "Compressing photos...",
    categoryLabel: isES ? "Categoría" : "Category",
    categoryPlaceholder: isES ? "Selecciona una categoría" : "Select a category",
    categoryCeremony: isES ? "Ceremonia" : "Ceremony",
    categoryCocktail: "Cocktail",
    categoryParty: isES ? "Fiesta" : "Party",
    noCategory: isES ? "Selecciona una categoría" : "Please select a category",
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imageFiles = Array.from(newFiles).filter((f) =>
      f.type.startsWith("image/")
    );
    const combined = [...files, ...imageFiles];
    if (combined.length > 20) {
      setError(isES ? "Máximo 20 fotos a la vez" : "Maximum 20 photos at a time");
      return;
    }
    setFiles(combined);

    const newPreviews = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError("");
    setSuccess("");
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError(labels.noFiles);
      return;
    }
    if (!category) {
      setError(labels.noCategory);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setProgress(0);

    try {
      // Compress images before uploading
      setCompressing(true);
      const compressed = await Promise.all(files.map(compressImage));
      setCompressing(false);

      const formData = new FormData();
      formData.append("uploaderName", uploaderName);
      formData.append("category", category);

      compressed.forEach((file) => formData.append("photo", file));

      // Use XHR for upload progress tracking
      const { ok, data } = await new Promise<{ ok: boolean; data: any }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          try {
            const json = JSON.parse(xhr.responseText);
            resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: json });
          } catch {
            resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: {} });
          }
        });
        xhr.addEventListener("error", () => reject(new Error(labels.errorGeneric)));
        xhr.addEventListener("abort", () => reject(new Error(labels.errorGeneric)));
        xhr.open("POST", "/api/photos/upload");
        xhr.send(formData);
      });

      if (!ok) {
        throw new Error(data.error || labels.errorGeneric);
      }

      setSuccess(labels.successMsg);
      // Clean up previews
      previews.forEach((p) => URL.revokeObjectURL(p));
      setFiles([]);
      setPreviews([]);

      setCategory("");
    } catch (err: any) {
      setError(err.message || labels.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <Field label={labels.categoryLabel} required style={{ width: "100%" }}>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value as MediaCategory | ""); setError(""); }}
          disabled={loading}
          style={{
            width: "100%",
            fontSize: "16px",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "2px solid #e5e7eb",
            backgroundColor: "#fafafa",
            color: category ? "#242424" : "#9ca3af",
            appearance: "none",
            WebkitAppearance: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          <option value="" disabled>{labels.categoryPlaceholder}</option>
          <option value="ceremony">{labels.categoryCeremony}</option>
          <option value="cocktail">{labels.categoryCocktail}</option>
          <option value="party">{labels.categoryParty}</option>
        </select>
      </Field>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: "none" }}
      />

      <div
        className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Image24Regular style={{ fontSize: "2em", color: "#9ca3af", width: "2em", height: "2em" }} />
        <Body1 style={{ color: "#6b7280", marginTop: "0.5em", textAlign: "center" }}>
          {labels.dropText}
        </Body1>
        <Body1 style={{ color: "#9ca3af", fontSize: "0.85em" }}>
          {labels.dropSubtext}
        </Body1>
      </div>

      {previews.length > 0 && (
        <>
          <div className={styles.previewGrid}>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewItem}>
                <img src={src} alt={`Preview ${i + 1}`} className={styles.previewImage} />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                >
                  <Dismiss24Regular style={{ width: "12px", height: "12px" }} />
                </button>
              </div>
            ))}
          </div>
          <Caption1 style={{ color: "#9ca3af", alignSelf: "flex-start" }}>
            {files.length} {isES ? "foto(s)" : "photo(s)"} •{" "}
            {formatBytes(files.reduce((sum, f) => sum + f.size, 0))}
            {" — "}
            {isES
              ? "se comprimirán automáticamente"
              : "will be auto-compressed"}
          </Caption1>
        </>
      )}

      {error && (
        <MessageBar intent="error" style={{ width: "100%" }}>
          {error}
        </MessageBar>
      )}

      {success && (
        <MessageBar intent="success" style={{ width: "100%" }}>
          {success}
        </MessageBar>
      )}

      {loading && !compressing && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <Caption1 style={{ color: "#6b7280", textAlign: "center" }}>
            {progress}%
          </Caption1>
        </div>
      )}

      <Button
        type="submit"
        appearance="primary"
        size="large"
        disabled={loading || files.length === 0}
        icon={loading ? undefined : <ArrowUpload24Regular />}
        className={styles.submitButton}
        style={{
          backgroundColor:
            loading || files.length === 0
              ? "#d1d5db"
              : "#4C4C4C",
          borderColor:
            loading || files.length === 0
              ? "#6F6F6F"
              : "#323232",
          cursor:
            loading || files.length === 0
              ? "not-allowed"
              : "pointer",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Spinner size="tiny" />
            <span>{compressing ? labels.compressing : labels.uploading}</span>
          </div>
        ) : (
          labels.upload
        )}
      </Button>

      <Link
        href={`/photos?lang=${isES ? "es" : "en"}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#6b7280",
          fontSize: "0.9em",
          textDecoration: "none",
        }}
      >
        <Image24Filled style={{ width: "18px", height: "18px" }} />
        {isES ? "Ver galería" : "View gallery"}
      </Link>
    </form>
  );
}
