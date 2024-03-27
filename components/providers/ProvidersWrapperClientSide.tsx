"use client";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function ProvidersWrapperClientSide({
    children,
}: {
    children: ReactNode;
}) {

    const resolvedTheme = useTheme();
    // console.log(config.theme.extend.colors.primary.DEFAULT)

    const themeSelected = resolvedTheme.theme === "dark" || (resolvedTheme.theme === "system" && resolvedTheme.systemTheme !== "light") ? dark : undefined

    // console.log(resolvedTheme.theme, /* === "system" && */ resolvedTheme.systemTheme /* !== "light" */)

    if (resolvedTheme === undefined) throw Error()

    return (
        <ClerkProvider
            appearance={{
                baseTheme: themeSelected,
                // variables: { colorPrimary: `${fullConfig.theme.colors.primary.DEFAULT}`, colorTextOnPrimaryBackground: `${fullConfig.theme.colors.primary.foreground}`}
                // variables: { colorPrimary: 'hsl(210 40% 98%)'}
            }}
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            {children}
        </ClerkProvider>
    )
}