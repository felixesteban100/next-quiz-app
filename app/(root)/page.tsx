import SelectQuiz from "@/components/shared/SelectQuiz";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { headers } from 'next/headers';
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    api?: string,
  }
}) {
  const api = searchParams?.api ?? "native"

  return (
    <main className="w-full flex flex-col justify-center items-center gap-5">
      <Image
        src="https://viralsolutions.net/wp-content/uploads/2019/06/shutterstock_749036344.jpg"
        alt="Quiz"
        width={300}
        height={50}
        className="rounded-md"
      />
      <div className="flex flex-col justify-center items-center">
        <p>Choose the API source:</p>
        <div className="flex">
          <Link href={`/?api=native`}>
            <Button variant={"link"} className={`${api === "native" ? "underline" : ""}`}>Native</Button>
          </Link>

          <Link href={`/?api=external`}>
            <Button variant={"link"} className={`${api === "external" ? "underline" : ""}`}>External</Button>
          </Link>
        </div>
      </div>
      <Suspense fallback={<div className="text-center">Loading quiz form...</div>}>
        <SelectQuiz api={api} />
      </Suspense>
    </main>
  );
}
