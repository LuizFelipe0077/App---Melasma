import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// A drag past ~28% of the sheet's own height (within the native 25-30%
// convention) closes it; a fast flick closes it regardless of distance,
// same as iOS/Android bottom sheets.
const CLOSE_HEIGHT_RATIO = 0.28;
const CLOSE_VELOCITY = 500;

/**
 * Bottom sheet — replaces the old centered Modal. Slides up from the
 * bottom on every viewport width (docks as a centered sheet on >=640px).
 *
 * Drag-to-dismiss: only the grabber and header (title/description) start
 * the gesture — dragListener is off on the sheet itself, so every tap
 * inside `children` (inputs, buttons, scrollable lists) behaves exactly as
 * before, untouched. Releasing past the threshold calls the same `onClose`
 * ESC and the backdrop already use, so a consumer's own discard-vs-save
 * logic (e.g. ManagePatientModal's "descartar alterações?" guard) applies
 * identically no matter which of the three the user picks.
 */
export default function Sheet({ open, onClose, title, description, children }) {
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);
  const dragControls = useDragControls();
  const scaleProgress = useMotionValue(0);
  const sheetScale = useTransform(scaleProgress, [0, 1], [1, 0.97]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    // Every fresh open starts from a clean slate — a drag left mid-gesture
    // by a previous session of this same Sheet must never carry over.
    if (open) {
      scaleProgress.set(0);
      if (overlayRef.current) {
        overlayRef.current.style.transition = '';
        overlayRef.current.style.opacity = '';
      }
    }
  }, [open, scaleProgress]);

  const startDrag = (e) => dragControls.start(e);

  const handleDrag = (event, info) => {
    const height = sheetRef.current?.offsetHeight || 400;
    const progress = Math.min(1, Math.max(0, info.offset.y) / (height * 0.6));
    scaleProgress.set(progress);
    if (overlayRef.current) {
      // No transition while actively dragging — the backdrop must track
      // the finger 1:1 with zero lag, same as the panel itself.
      overlayRef.current.style.transition = 'none';
      overlayRef.current.style.opacity = String(1 - progress * 0.5);
    }
  };

  const handleDragEnd = (event, info) => {
    const height = sheetRef.current?.offsetHeight || 400;
    const shouldClose = info.offset.y > height * CLOSE_HEIGHT_RATIO || info.velocity.y > CLOSE_VELOCITY;

    if (overlayRef.current) overlayRef.current.style.transition = ''; // hand back to the CSS transition for a smooth settle

    if (shouldClose) {
      onClose?.();
    }

    // Short of the threshold — Framer hands the panel's own y back to the
    // `animate={{ y: 0 }}` target automatically once the gesture ends; this
    // just springs the paired scale/backdrop echo back the same way.
    animate(scaleProgress, 0, { type: 'spring', stiffness: 420, damping: 40 });
    if (overlayRef.current) overlayRef.current.style.opacity = '';
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
        >
          <motion.div
            ref={sheetRef}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.9 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.2, bottom: 1 }}
            dragMomentum={false}
            style={{ scale: sheetScale }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {/* Only the grabber starts the gesture — it's the one element
                already hidden by CSS on desktop (>=640px, where the Sheet
                docks as a centered modal instead), so drag-to-dismiss is
                naturally mobile-only with no extra viewport detection. */}
            <div className="sheet-grabber" onPointerDown={startDrag} style={{ touchAction: 'none', cursor: 'grab' }} />
            {title && <h2 className="display-sm mb-2" style={{ marginBottom: 'var(--space-2)' }}>{title}</h2>}
            {description && <p className="body-md" style={{ marginBottom: 'var(--space-5)' }}>{description}</p>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
