/**
 * Fixed page background: a faint blueprint grid that fades out at the edges,
 * plus two soft colour glows (teal + amber) for the glass panels to blur.
 * Static on purpose — motion is saved for user actions and the hero.
 */
export function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-[var(--glow-1)] blur-3xl" />
      <div className="absolute -right-40 bottom-[-12rem] size-[30rem] rounded-full bg-[var(--glow-2)] blur-3xl" />
    </div>
  );
}