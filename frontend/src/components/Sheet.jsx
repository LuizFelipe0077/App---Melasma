import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// A drag past ~28% of the sheet's own height (within the native 25-30%
// convention) closes it; a fast flick closes it regardless of distance,
// same as iOS/Android bottom sheets.
const CLOSE_HEIGHT_RATIO = 0.28;
const CLOSE_VELOCITY = 500;

function isInteractiveTarget(target) {
  return !!target?.closest?.('button, a, input, textarea, select, [role="button"], [contenteditable]');
}

/**
 * Bottom sheet — replaces the old centered Modal. Slides up from the
 * bottom on every viewport width (docks as a centered sheet on >=640px).
 *
 * Drag-to-dismiss: swipe-down works from anywhere in the sheet (empty
 * space or over content), not just the grabber — matching Apple/Google
 * Maps. The `.sheet` element is simultaneously the drag target and the
 * only scrollable container (no nested overflow wrapper in any consumer),
 * so a gesture is only handed to Framer's drag system when the content is
 * already scrolled to the top (`scrollTop <= 0`): starting a touch mid-list
 * scrolls normally; once the list reaches the top and the same continuous
 * gesture keeps moving downward, `onPointerMove` hands it off to the close
 * drag right there, without needing to lift the finger. Interactive
 * elements (buttons, inputs, links) are excluded from starting a drag so a
 * tap at the very top of a sheet never gets swallowed by gesture capture.
 * The whole-sheet gesture only responds to touch/pen — a desktop mouse drag
 * over sheet content is ordinary text selection, not a dismiss gesture. The
 * grabber keeps its own unconditional (mouse-included) handler — it has
 * nothing to scroll or select, so it's always eligible regardless of
 * content scroll position or input type.
 */
export default function Sheet({ open, onClose, title, description, children }) {
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);
  const dragControls = useDragControls();
  const scaleProgress = useMotionValue(0);
  const sheetScale = useTransform(scaleProgress, [0, 1], [1, 0.97]);
  const pointerActiveRef = useRef(false);
  const dragStartedRef = useRef(false);
  const lastYRef = useRef(0);

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

  // The grabber always starts the gesture, regardless of scroll position —
  // stops propagation so the parent's own pointerdown handler below doesn't
  // re-evaluate (and potentially skip, if content happens to be scrolled)
  // the same event a second time.
  const startDrag = (e) => {
    e.stopPropagation();
    dragControls.start(e);
  };

  // Touch/pen only — a desktop mouse drag anywhere in the sheet is normal
  // text selection, not a dismiss gesture (the grabber's own handler below
  // stays mouse-compatible, since it's a small, unambiguous target with no
  // selectable content of its own).
  const handleSheetPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    pointerActiveRef.current = true;
    dragStartedRef.current = false;
    lastYRef.current = e.clientY;
    if (isInteractiveTarget(e.target)) return;
    if ((sheetRef.current?.scrollTop || 0) <= 0) {
      dragControls.start(e);
      dragStartedRef.current = true;
    }
  };

  // Converts "scrolled a list up to the top, then kept pulling down" into a
  // close-drag mid-gesture, without requiring the finger to lift first.
  const handleSheetPointerMove = (e) => {
    if (e.pointerType === 'mouse' || !pointerActiveRef.current || dragStartedRef.current) return;
    const movingDown = e.clientY > lastYRef.current;
    lastYRef.current = e.clientY;
    if (movingDown && (sheetRef.current?.scrollTop || 0) <= 0 && !isInteractiveTarget(e.target)) {
      dragControls.start(e);
      dragStartedRef.current = true;
    }
  };

  const handleSheetPointerEnd = () => {
    pointerActiveRef.current = false;
    dragStartedRef.current = false;
  };

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
            onPointerDown={handleSheetPointerDown}
            onPointerMove={handleSheetPointerMove}
            onPointerUp={handleSheetPointerEnd}
            onPointerCancel={handleSheetPointerEnd}
          >
            {/* The grabber is hidden by CSS on desktop (>=640px, where the
                Sheet docks as a centered modal instead), so drag-to-dismiss
                is naturally mobile-only with no extra viewport detection —
                it keeps its own always-eligible handler on top of the
                whole-sheet one above. */}
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
