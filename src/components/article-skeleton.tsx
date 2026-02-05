export function ArticleSkeleton() {
  return (
    <div className="px-4 py-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-elevated flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2 items-center">
            <div className="h-3.5 w-24 bg-surface-elevated rounded-md" />
            <div className="h-3.5 w-20 bg-surface-elevated rounded-md" />
            <div className="h-3.5 w-10 bg-surface-elevated rounded-md" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-surface-elevated rounded-md" />
            <div className="h-4 w-2/3 bg-surface-elevated rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-surface-elevated rounded-full" />
            <div className="h-5 w-14 bg-surface-elevated rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
