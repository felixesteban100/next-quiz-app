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
    const sizeIcon = "h-[2rem] w-[2rem]"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-[4rem] w-[4rem]">
                    <SunIcon className={`${sizeIcon} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
                    <SunIcon className={`absolute ${sizeIcon} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className="capitalize text-2xl">
                    Light {theme === "light" && <Check className={checkClasses} />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="capitalize text-2xl">
                    Dark {theme === "dark" && <Check className={checkClasses} />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="capitalize text-2xl">
                    System {theme === "system" && <Check className={checkClasses} />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
