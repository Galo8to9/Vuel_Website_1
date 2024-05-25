import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vuel",
  description: "Vuel App",
};

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
  	return (
    	<ClerkProvider>
      		<html lang="en">
        		<body className={`${inter.className} bg-black`}>
                    {children}
                </body>
      		</html>
    	</ClerkProvider>
  	);
}
