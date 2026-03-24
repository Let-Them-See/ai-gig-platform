export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-200 rounded-xl ${className}`} />
  );
}

export function GigCardSkeleton() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-6 w-3/4" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-3">
            <LoadingSkeleton className="h-6 w-16" />
            <LoadingSkeleton className="h-6 w-20" />
            <LoadingSkeleton className="h-6 w-14" />
          </div>
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-8 w-20" />
          <LoadingSkeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="flex gap-4 mt-4 pt-4 border-t border-surface-100">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-4">
        <LoadingSkeleton className="w-14 h-14 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-32" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <LoadingSkeleton className="h-6 w-16" />
        <LoadingSkeleton className="h-6 w-20" />
      </div>
      <LoadingSkeleton className="h-10 w-full" />
    </div>
  );
}
