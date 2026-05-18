import type { Metadata } from "next";
import RepairCalculator from "@/components/calculator/RepairCalculator";

export const metadata: Metadata = {
  title: "Ремонт — Калькулятор",
};

export default function RepairPage() {
  return <RepairCalculator />;
}
