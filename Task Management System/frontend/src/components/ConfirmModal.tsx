import { useState } from 'react'
import { Modal } from './Modal'
import './ConfirmModal.css'

interface ConfirmModalProps {
  title: string
  message: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleConfirm() {
    setIsSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button type="button" className="task-form-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="confirm-danger"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
