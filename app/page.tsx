import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ModeToggle />
      <SignedIn>
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
      <SignedOut>
        <Button asChild className="button bg-primary bg-cover">
          <Link href="/sign-in">Login</Link>
        </Button>
      </SignedOut>
      <Button>JAJAJA</Button>
    </main>
  );
}
