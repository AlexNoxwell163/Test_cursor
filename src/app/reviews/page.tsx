import type { Metadata } from "next";
import ReviewCard from "@/components/ReviewCard";
import SectionTitle from "@/components/SectionTitle";
import { reviews } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Отзывы — Lumière",
  description: "Отзывы клиентов парикмахерской Lumière о наших мастерах и услугах.",
};

export default function ReviewsPage() {
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Отзывы"
        title="Что говорят клиенты"
        subtitle={`Средний рейтинг ${averageRating.toFixed(1)} из 5 на основе ${reviews.length} отзывов.`}
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
