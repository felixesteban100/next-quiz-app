import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

const links = [{
    href: '/',
    title: 'Get quiz 📃'
}, {
    href: '/post-question',
    title: 'Post question ➕'
},
{
    href: '/update-question',
    title: 'Update question ♻'
},
{
    href: '/delete-question',
    title: 'Delete question 🥫'
},
{
    href: '/post-category',
    title: 'Post category ➕'
},
{
    href: '/update-category',
    title: 'Update category ♻'
},
{
    href: '/delete-category',
    title: 'Delete category 🥫'
}
]

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between py-5 px-10 bg-secondary/20 border-b">
            <Link href={"/"}><p className="text-primary hover:underline">next-quiz-app</p></Link>

            <div className="flex justify-end items-center gap-5">
                <Sheet>
                    <SheetTrigger><Button variant={'ghost'} size={"icon"}><MenuIcon /></Button></SheetTrigger>
                    <SheetContent>
                        <SignedIn>
                            <menu className="flex flex-col gap-10">
                                {links.map((link) => (
                                    <SheetClose asChild>
                                        <Link key={link.href} href={link.href}>
                                            <Button variant={"link"} className="text-3xl">{link.title}</Button>
                                        </Link>
                                    </SheetClose>
                                ))}
                            </menu>
                        </SignedIn>
                        <SignedOut>
                            <menu className="flex flex-col gap-10">
                                {[links[0]].map((link) => (
                                    <SheetClose asChild>
                                        <Link key={link.href} href={link.href}>
                                            <Button variant={"link"} className="text-3xl">{link.title}</Button>
                                        </Link>
                                    </SheetClose>
                                ))}
                            </menu>
                        </SignedOut>
                    </SheetContent>
                </Sheet>

                <SignedIn>
                    <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
                <SignedOut>
                    <Button asChild className="button bg-primary bg-cover">
                        <Link href="/sign-in">Login</Link>
                    </Button>
                </SignedOut>
                <ModeToggle />
            </div>
        </nav>
    )
}