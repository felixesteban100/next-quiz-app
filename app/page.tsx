import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createUser, getUserById } from "@/lib/actions/user.actions";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {

  async function getUser() {
    return await getUserById('user_2VfDQOvDwv9ITt1PStsk037dtjX')
  }

  console.log("user", await getUser())

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
