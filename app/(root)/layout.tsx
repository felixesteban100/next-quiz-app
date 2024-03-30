import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner"

// use pretty json when I print a json object (most of them are when I call the toaster function from "sonner")

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="root">
            <Navbar />
            <div className="flex min-h-screen flex-col items-center justify-between p-10 w-full">
                {children}
            </div>
            <Toaster richColors />
        </main>
    )
}
