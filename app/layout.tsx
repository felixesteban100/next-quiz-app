import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import ProvidersWrapperClientSide from "@/components/providers/ProvidersWrapperClientSide";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Quiz Next',
    default: 'Quiz Next',
  },
  description: 'Quiz app.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  // icons: {
  //   icon: '/superhero-alt-svgrepo-com.svg',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProvidersWrapperClientSide>
            {children}
          </ProvidersWrapperClientSide>
        </ThemeProvider>
      </body>
    </html>
  );
}
