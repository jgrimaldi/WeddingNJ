import { useState, useEffect, useCallback, useRef } from "react";
import {
  Body1,
  Button,
  Caption1,
  Spinner,
  makeStyles,
} from "@fluentui/react-components";
import {
  Dismiss24Regular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from "@fluentui/react-icons";
import type { Language } from "@/types/invitations";

const PAGE_SIZE = 20;

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "1em",
    boxSizing: "border-box",
    gap: "1em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "4px",
    width: "100%",
  },
  gridItem: {
    position: "relative" as const,
    aspectRatio: "1",
    overflow: "hidden",
    cursor: "pointer",
    borderRadius: "2px",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transition: "transform 0.2s ease",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  overlay: {
    position: "fixed" as const,
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 2000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayImage: {
    maxWidth: "95vw",
    maxHeight: "80vh",
    objectFit: "contain" as const,
  },
  overlayClose: {
    position: "absolute" as const,
    top: "1em",
    right: "1em",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "8px",
  },
  overlayNav: {
    position: "absolute" as const,
    top: "50%",
    backgroundColor: "rgba(255,255,255,0.15)",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "12px",
    borderRadius: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCaption: {
    color: "white",
    marginTop: "1em",
    textAlign: "center" as const,
  },
  emptyState: {
    padding: "3em 1em",
    textAlign: "center" as const,
    color: "#9ca3af",
  },
  loadMoreButton: {
    borderRadius: "4px",
    fontWeight: "500",
  },
});

interface PhotoMeta {
  filename: string;
  thumbnailFilename?: string;
  originalName: string;
  uploaderName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

type PhotoGalleryProps = {
  language?: Language;
};

export default function PhotoGallery({ language = "EN" }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const styles = useStyles();

  const isES = language === "ES";
  const labels = {
    loading: isES ? "Cargando fotos..." : "Loading photos...",
    empty: isES
      ? "Aún no hay fotos. ¡Sé el primero en subir una!"
      : "No photos yet. Be the first to upload one!",
    by: isES ? "Por" : "By",
    error: isES
      ? "Error al cargar las fotos"
      : "Failed to load photos",
    loadMore: isES ? "Cargar más" : "Load more",
  };

  const fetchPhotos = useCallback(async (offset = 0, append = false) => {
    try {
      const res = await fetch(`/api/photos?limit=${PAGE_SIZE}&offset=${offset}`);
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => append ? [...prev, ...(data.photos || [])] : (data.photos || []));
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Re-fetch when page becomes visible (cache invalidation after upload)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchPhotos();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    // Also re-fetch on window focus (covers tab switches and mobile app switching)
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [fetchPhotos]);

  const loadMore = () => {
    setLoadingMore(true);
    fetchPhotos(photos.length, true);
  };

  const hasMore = photos.length < total;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isES ? "es" : "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Lightbox navigation
  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i));
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, closeLightbox, goPrev, goNext]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext(); // swipe left → next
      else goPrev(); // swipe right → prev
    }
  };

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  if (loading) {
    return (
      <div className={styles.container}>
        <Spinner size="medium" label={labels.loading} />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Body1>{labels.empty}</Body1>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <div
              key={photo.filename}
              className={styles.gridItem}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={`/api/photos/${photo.thumbnailFilename || photo.filename}`}
                alt={`${labels.by} ${photo.uploaderName}`}
                className={styles.gridImage}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        {hasMore && (
          <Button
            appearance="outline"
            className={styles.loadMoreButton}
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? <Spinner size="tiny" /> : labels.loadMore}
          </Button>
        )}
      </div>

      {selectedPhoto && (
        <div
          className={styles.overlay}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className={styles.overlayClose}
            onClick={closeLightbox}
          >
            <Dismiss24Regular style={{ width: "28px", height: "28px" }} />
          </button>

          {selectedIndex !== null && selectedIndex > 0 && (
            <button
              className={styles.overlayNav}
              style={{ left: "8px" }}
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft24Regular />
            </button>
          )}

          <img
            src={`/api/photos/${selectedPhoto.filename}`}
            alt={`${labels.by} ${selectedPhoto.uploaderName}`}
            className={styles.overlayImage}
            onClick={(e) => e.stopPropagation()}
          />

          {selectedIndex !== null && selectedIndex < photos.length - 1 && (
            <button
              className={styles.overlayNav}
              style={{ right: "8px" }}
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight24Regular />
            </button>
          )}

          <div className={styles.overlayCaption}>
            <Body1 style={{ color: "white" }}>
              {labels.by} {selectedPhoto.uploaderName}
            </Body1>
            <Caption1 style={{ color: "#9ca3af" }}>
              {formatDate(selectedPhoto.uploadedAt)}
              {" • "}
              {selectedIndex !== null ? selectedIndex + 1 : 0}/{photos.length}
            </Caption1>
          </div>
        </div>
      )}
    </>
  );
}
