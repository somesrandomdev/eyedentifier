// src/components/ui/Stepper.tsx
export default function Stepper({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i + 1 === current ? 'w-8 bg-sen-green' : 'w-2 bg-neutral-300'
          }`}
        />
      ))}
    </div>
  );
}