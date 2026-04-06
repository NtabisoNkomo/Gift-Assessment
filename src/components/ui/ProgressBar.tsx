export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-3 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden relative shadow-inner">
      <div 
        className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 transition-all duration-700 ease-out relative shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );
}
