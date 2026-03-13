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
  Play24Filled,
  Delete24Regular,
} from "@fluentui/react-icons";
import type { Language } from "@/types/invitations";
import type { MediaCategory } from "@/lib/azure-storage";
import { useSession } from "next-auth/react";

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
  gridVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  playOverlay: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    pointerEvents: "none" as const,
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
  overlayVideo: {
    maxWidth: "95vw",
    maxHeight: "80vh",
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
  tabBar: {
    display: "flex",
    width: "100%",
    gap: "0",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "0.5em",
  },
  tab: {
    flex: "1",
    padding: "8px 4px",
    textAlign: "center" as const,
    cursor: "pointer",
    fontSize: "0.85em",
    fontWeight: "500",
    color: "#6b7280",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s ease",
  },
  tabActive: {
    color: "#242424",
    borderBottomColor: "#4C4C4C",
  },
  deleteButton: {
    position: "absolute" as const,
    top: "4px",
    right: "4px",
    minWidth: "24px",
    width: "24px",
    height: "24px",
    padding: "0",
    borderRadius: "50%",
    backgroundColor: "rgba(220,38,38,0.85)",
    color: "white",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  overlayDeleteButton: {
    position: "absolute" as const,
    bottom: "1em",
    right: "1em",
    backgroundColor: "rgba(220,38,38,0.85)",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  confirmOverlay: {
    position: "fixed" as const,
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDialog: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5em",
    maxWidth: "300px",
    width: "90%",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "1em",
  },
  confirmActions: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
});

interface PhotoMeta {
  filename: string;
  thumbnailFilename?: string;
  originalName: string;
  uploaderName: string;
  uploaderCode?: string;
  category?: MediaCategory;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

function isVideoFile(photo: PhotoMeta): boolean {
  return photo.mimeType?.startsWith("video/") || false;
}

type PhotoGalleryProps = {
  language?: Language;
};

type CategoryTab = "all" | MediaCategory;

export default function PhotoGallery({ language = "EN" }: PhotoGalleryProps) {
  const { data: clientSession } = useSession();
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lightboxLoading, setLightboxLoading] = useState(false);
  const touchStartX = useRef(0);
  const pageCacheRef = useRef<Map<number, PhotoMeta[]>>(new Map());
  const skipNextFetchRef = useRef(false);
  const styles = useStyles();

  const accessCode = clientSession?.user?.accessCode;
  const isES = language === "ES";
  const labels = {
    loading: isES ? "Cargando fotos..." : "Loading photos...",
    empty: isES
      ? "Aún no hay fotos. ¡Sé el primero en subir una!"
      : "No photos yet. Be the first to upload one!",
    emptyCategory: isES
      ? "No hay fotos en esta categoría aún."
      : "No photos in this category yet.",
    by: isES ? "Por" : "By",
    error: isES
      ? "Error al cargar las fotos"
      : "Failed to load photos",
    loadMore: isES ? "Cargar más" : "Load more",
    page: isES ? "Página" : "Page",
    of: isES ? "de" : "of",
    prev: isES ? "Anterior" : "Previous",
    next: isES ? "Siguiente" : "Next",
    all: isES ? "Todos" : "All",
    ceremony: isES ? "Ceremonia" : "Ceremony",
    cocktail: "Cocktail",
    party: isES ? "Fiesta" : "Party",
    deleteConfirm: isES ? "¿Eliminar este archivo?" : "Delete this file?",
    deleteYes: isES ? "Eliminar" : "Delete",
    deleteNo: isES ? "Cancelar" : "Cancel",
    deleteError: isES ? "Error al eliminar" : "Failed to delete",
  };

  const fetchPhotos = useCallback(async (page = 1, category?: CategoryTab) => {
    try {
      const offset = (page - 1) * PAGE_SIZE;
      let url = `/api/photos?limit=${PAGE_SIZE}&offset=${offset}`;
      if (category && category !== "all") {
        url += `&category=${category}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single page with caching (used for lightbox cross-page nav)
  const fetchPage = useCallback(async (page: number, category: CategoryTab): Promise<PhotoMeta[]> => {
    const cached = pageCacheRef.current.get(page);
    if (cached) return cached;

    const offset = (page - 1) * PAGE_SIZE;
    let url = `/api/photos?limit=${PAGE_SIZE}&offset=${offset}`;
    if (category && category !== "all") url += `&category=${category}`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const pagePhotos: PhotoMeta[] = data.photos || [];
        pageCacheRef.current.set(page, pagePhotos);
        if (data.total != null) setTotal(data.total);
        return pagePhotos;
      }
    } catch (err) {
      console.error("Failed to fetch page:", err);
    }
    return [];
  }, []);

  // Initial load (skipped when lightbox navigation already updated the page)
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    fetchPhotos(currentPage, activeTab);
  }, [fetchPhotos, activeTab, currentPage]);

  // Re-fetch when page becomes visible (cache invalidation after upload)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        pageCacheRef.current.clear();
        fetchPhotos(currentPage, activeTab);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [fetchPhotos, activeTab, currentPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setLoading(true);
    setSelectedIndex(null);
    setCurrentPage(page);
  };

  const handleTabChange = (tab: CategoryTab) => {
    if (tab === activeTab) return;
    pageCacheRef.current.clear();
    setActiveTab(tab);
    setPhotos([]);
    setTotal(0);
    setLoading(true);
    setSelectedIndex(null);
    setCurrentPage(1);
  };

  const handleDelete = async (filename: string) => {
    setDeleting(true);
    try {
      const res = await fetch("/api/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.filename !== filename));
        setTotal((prev) => prev - 1);
        setSelectedIndex(null);
        setConfirmDelete(null);
      } else {
        const data = await res.json();
        alert(data.error || labels.deleteError);
        setConfirmDelete(null);
      }
    } catch {
      alert(labels.deleteError);
      setConfirmDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isES ? "es" : "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Lightbox navigation (seamless cross-page)
  const goNext = useCallback(async () => {
    if (selectedIndex === null) return;

    if (selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      return;
    }

    // At last photo on page — load next page
    if (currentPage >= totalPages) return;

    setLightboxLoading(true);
    try {
      const nextPhotos = await fetchPage(currentPage + 1, activeTab);
      if (nextPhotos.length > 0) {
        pageCacheRef.current.set(currentPage, photos);
        skipNextFetchRef.current = true;
        setPhotos(nextPhotos);
        setCurrentPage(currentPage + 1);
        setSelectedIndex(0);
      }
    } finally {
      setLightboxLoading(false);
    }
  }, [selectedIndex, photos, currentPage, totalPages, activeTab, fetchPage]);

  const goPrev = useCallback(async () => {
    if (selectedIndex === null) return;

    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      return;
    }

    // At first photo on page — load previous page
    if (currentPage <= 1) return;

    setLightboxLoading(true);
    try {
      const prevPhotos = await fetchPage(currentPage - 1, activeTab);
      if (prevPhotos.length > 0) {
        pageCacheRef.current.set(currentPage, photos);
        skipNextFetchRef.current = true;
        setPhotos(prevPhotos);
        setCurrentPage(currentPage - 1);
        setSelectedIndex(prevPhotos.length - 1);
      }
    } finally {
      setLightboxLoading(false);
    }
  }, [selectedIndex, photos, currentPage, activeTab, fetchPage]);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  // Prefetch adjacent pages when browsing near page boundaries in lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    if (selectedIndex >= photos.length - 3 && currentPage < totalPages) {
      fetchPage(currentPage + 1, activeTab);
    }
    if (selectedIndex <= 2 && currentPage > 1) {
      fetchPage(currentPage - 1, activeTab);
    }
  }, [selectedIndex, photos.length, currentPage, totalPages, activeTab, fetchPage]);

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

  if (photos.length === 0 && !loading) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.tabBar}>
            {(["all", "ceremony", "cocktail", "party"] as CategoryTab[]).map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {labels[tab as keyof typeof labels]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.emptyState}>
          <Body1>{activeTab === "all" ? labels.empty : labels.emptyCategory}</Body1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tabBar}>
          {(["all", "ceremony", "cocktail", "party"] as CategoryTab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {labels[tab as keyof typeof labels]}
            </button>
          ))}
        </div>
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <div
              key={photo.filename}
              className={styles.gridItem}
              onClick={() => setSelectedIndex(index)}
            >
              {isVideoFile(photo) ? (
                <>
                  <video
                    src={`/api/photos/${photo.filename}#t=0.1`}
                    className={styles.gridVideo}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className={styles.playOverlay}>
                    <Play24Filled style={{ width: "20px", height: "20px" }} />
                  </div>
                </>
              ) : (
                <img
                  src={`/api/photos/${photo.thumbnailFilename || photo.filename}`}
                  alt={`${labels.by} ${photo.uploaderName}`}
                  className={styles.gridImage}
                  loading="lazy"
                />
              )}
              {accessCode && photo.uploaderCode === accessCode && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(photo.filename); }}
                  title={labels.deleteYes}
                >
                  <Delete24Regular style={{ width: "14px", height: "14px" }} />
                </button>
              )}
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            flexWrap: "wrap",
            width: "100%",
          }}>
            <Button
              appearance="subtle"
              size="small"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              icon={<ChevronLeft24Regular style={{ width: "16px", height: "16px" }} />}
            >
              {labels.prev}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                return Math.abs(page - currentPage) <= 1;
              })
              .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`e${idx}`} style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>
                ) : (
                  <Button
                    key={item}
                    size="small"
                    appearance={item === currentPage ? "primary" : "subtle"}
                    onClick={() => goToPage(item)}
                    style={{
                      minWidth: "32px",
                      ...(item === currentPage
                        ? { backgroundColor: "#4C4C4C", borderColor: "#323232", color: "white" }
                        : {}),
                    }}
                  >
                    {item}
                  </Button>
                )
              )}
            <Button
              appearance="subtle"
              size="small"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
              icon={<ChevronRight24Regular style={{ width: "16px", height: "16px" }} />}
              iconPosition="after"
            >
              {labels.next}
            </Button>
          </div>
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

          {selectedIndex !== null && (selectedIndex > 0 || currentPage > 1) && (
            <button
              className={styles.overlayNav}
              style={{ left: "8px" }}
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft24Regular />
            </button>
          )}

          {lightboxLoading && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}>
              <Spinner size="medium" />
            </div>
          )}

          {isVideoFile(selectedPhoto) ? (
            <video
              src={`/api/photos/${selectedPhoto.filename}`}
              className={styles.overlayVideo}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={`/api/photos/${selectedPhoto.filename}`}
              alt={`${labels.by} ${selectedPhoto.uploaderName}`}
              className={styles.overlayImage}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {selectedIndex !== null && (selectedIndex < photos.length - 1 || currentPage < totalPages) && (
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
              {selectedIndex !== null ? (currentPage - 1) * PAGE_SIZE + selectedIndex + 1 : 0}/{total}
            </Caption1>
          </div>

          {accessCode && selectedPhoto.uploaderCode === accessCode && (
            <button
              className={styles.overlayDeleteButton}
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(selectedPhoto.filename); }}
            >
              <Delete24Regular style={{ width: "18px", height: "18px" }} />
              {labels.deleteYes}
            </button>
          )}
        </div>
      )}

      {confirmDelete && (
        <div className={styles.confirmOverlay} onClick={() => !deleting && setConfirmDelete(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <Body1>{labels.deleteConfirm}</Body1>
            <div className={styles.confirmActions}>
              <Button
                appearance="secondary"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                {labels.deleteNo}
              </Button>
              <Button
                appearance="primary"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                style={{ backgroundColor: "#dc2626", border: "1px solid #dc2626" }}
              >
                {deleting ? <Spinner size="tiny" /> : labels.deleteYes}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
