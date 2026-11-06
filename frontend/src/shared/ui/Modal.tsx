import { useEffect, useId, useRef, useState } from 'react';
import type { AnimationEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { cx } from '@/shared/lib';

interface ModalProps {
  isOpen: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Модальное окно с анимацией появления и закрытия.
 * Закрывается крестиком, клавишей Esc и кликом по затемнению.
 * При каждом открытии содержимое создаётся заново — формы внутри начинают с чистого листа.
 */
export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Отслеживаем смену isOpen прямо во время рендера (так React советует
  // вычислять состояние, зависящее от изменения пропсов).
  const [wasOpen, setWasOpen] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setIsClosing(false);
      setOpenCount((n) => n + 1);
    } else {
      setIsClosing(true); // окно ещё на экране, пока идёт анимация закрытия
    }
  }

  // Переводим фокус в окно, чтобы Esc и Tab работали внутри него.
  // Если внутри уже есть поле с autoFocus — фокус не трогаем.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.contains(document.activeElement)) {
      dialog.focus();
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  // Анимация закрытия затемнения закончилась — убираем окно из DOM
  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isClosing) setIsClosing(false);
  };

  return (
    <div
      className={cx('modal-overlay', isClosing && 'is-closing')}
      onMouseDown={handleOverlayMouseDown}
      onKeyDown={handleKeyDown}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        ref={dialogRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h3 id={titleId}>{title}</h3>
          <button type="button" onClick={onClose} className="close-btn" aria-label="Закрыть">
            ✕
          </button>
        </div>
        <div key={openCount}>{children}</div>
      </div>
    </div>
  );
}
