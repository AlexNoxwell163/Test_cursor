import type { Metadata } from "next";
import CleaningCalculator from "@/components/calculator/CleaningCalculator";

export const metadata: Metadata = {
  title: "Клининг — Калькулятор",
};

export default function CleaningPage() {
  return <CleaningCalculator />;
}
