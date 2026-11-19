import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div"> & {
  /** Adds a gentle lift + teal edge on hover (use for clickable cards). */
  interactive?: boolean;
};

/**
 * The base surface of FixMate: a frosted glass panel.
 * h-full makes cards in the same grid row equal height (assignment requirement).
 */
export function GlassCard({ className, interactive = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass h-full rounded-2xl p-6",
        interactive &&
          "transition duration-300 hover:-translate-y-1 hover:border-primary/40 focus-within:border-primary/40",
        className
      )}
      {...props}
    />
  );
}