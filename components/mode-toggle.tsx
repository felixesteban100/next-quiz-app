"use client"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    // const classNamesFor = "flex justify-between items-center gap-2"
    const checkClasses = "text-primary"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all block dark:hidden  dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all hidden dark:block dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light {theme === "light" && <Check className={checkClasses} />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark {theme === "dark" && <Check className={checkClasses} />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System {theme === "system" && <Check className={checkClasses} />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
