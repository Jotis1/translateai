/**
 * @author Jotis
 * This file is used to define the layout of the application.
 * It is used to define the global styles and the metadata of the application.
 * It is also used to define the global state of the application.
 */
/**
 * We import the `Metadata` type from `next`.
 * Metadata is used to define the metadata of the application.
 * See Next.js docs for more information: https://nextjs.org/docs/api-reference/next/head
 */
import type { Metadata } from 'next';
/**
 * We import the `Inter` font from Google Fonts.
 * We use it to define the global font of the application.
 * See Readme.md for more information about the UI library.
 */
import { Inter } from 'next/font/google';
/**
 * We import the `globals.css` file.
 * We use it to define the global styles of the application.
 * In this project, we will be using Tailwind CSS for the styles.
 * See Readme.md for more information about the UI library.
 */
import '@/app/globals.css';
/**
 * We define the global font of the application.
 * See Readme.md for more information about the UI library.
 */
const inter = Inter({ subsets: ['latin'] });
/**
 * We define the metadata of the application.
 * See Next.js docs for more information: https://nextjs.org/docs/api-reference/next/head
 */
export const metadata: Metadata = {
  title: 'TranslateIA',
  description: 'Translate your audio and video files from english to spanish',
};
/**
 * This is the layout component. It will be rendered in every page.
 * It will render the `children` prop.
 * @param children The children of the component
 * @returns The layout component
 */
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
