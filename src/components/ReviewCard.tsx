import { Star } from "lucide-react";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6">
      <div className="flex items-center gap-1" aria-label={`Рейтинг ${review.rating} из 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < review.rating
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--border-strong)]"
            }
          />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-[var(--foreground)]">
        “{review.text}”
      </p>
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
        <div>
          <p className="font-medium text-[var(--foreground)]">{review.author}</p>
          <p className="text-xs text-[var(--foreground-muted)]">{review.service}</p>
        </div>
        <span className="text-xs text-[var(--foreground-muted)]">{review.date}</span>
      </div>
    </article>
  );
}
