import type { Metadata } from "next";
import FreelanceCalculator from "@/components/calculator/FreelanceCalculator";

export const metadata: Metadata = {
  title: "Фриланс — Калькулятор",
};

export default function FreelancePage() {
  return <FreelanceCalculator />;
}
