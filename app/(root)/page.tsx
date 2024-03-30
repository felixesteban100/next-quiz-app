import SelectQuiz from "@/components/shared/SelectQuiz";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  return (
    <main className="w-full">
      <Suspense fallback={<div className="text-center">Loading quiz form...</div>}>
        <SelectQuiz />
      </Suspense>
    </main>
  );
}
