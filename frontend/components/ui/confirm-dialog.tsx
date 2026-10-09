'use client';

import { useEffect, useRef } from 'react';
import { Button } from './button';

/** Modal confirmation built on the native <dialog> element. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog?.open) {
      dialog?.showModal();
    } else if (!open && dialog?.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) cancels
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
      aria-labelledby="confirm-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-neutral-950/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h2 id="confirm-dialog-title" className="text-xl font-semibold">
          {title}
        </h2>
        <p className="mt-2 break-words text-neutral-600">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
