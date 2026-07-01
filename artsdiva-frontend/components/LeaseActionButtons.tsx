interface LeaseActionButtonsProps {
  isSubmitting: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

// Shown contextually next to an artwork's active lease.
export function LeaseActionButtons({ isSubmitting, onComplete, onCancel }: LeaseActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <button onClick={onComplete} disabled={isSubmitting} className="border px-2 py-1 text-sm">
        Complete lease
      </button>
      <button onClick={onCancel} disabled={isSubmitting} className="border px-2 py-1 text-sm">
        Cancel lease
      </button>
    </div>
  );
}
