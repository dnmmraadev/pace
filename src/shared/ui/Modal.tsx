import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { es } from '../../i18n/es';
export function Modal({
  title,
  children,
  onClose,
  className,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    const dialog = ref.current;
    dialog?.showModal();
    (
      dialog?.querySelector<HTMLElement>('input,textarea') ||
      dialog?.querySelector<HTMLElement>('select')
    )?.focus();
    return () => {
      dialog?.close();
      old?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{es(title)}</h2>
        <button aria-label={es('Close dialog')} onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="modal-body">{es(children)}</div>
    </dialog>
  );
}
