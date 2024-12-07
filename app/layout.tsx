import { Metadata } from "next";
import { ThemeProvider } from "~/src/components/molecules/ThemeProvider";

export const metadata: Metadata = {
  title: 'AoE2 Card',
  description: 'This is a playground for AoE2 stuff made by a bunch of friends playing the game',
  icons: [
    { rel: "icon", "type": "image/x-icon", url: "/favicon.ico" }, // multi-page
    { rel: "icon", "type": "image/png", url: "/favicon.png", sizes: "128x128" },
    { rel: "icon", "type": "image/png", url: "/icon-512.png", sizes: "512x512" },
    { rel: "icon", "type": "image/png", url: "/icon-192.png", sizes: "192x192" },
    { rel: "icon", "type": "image/png", url: "/apple-icon.png", sizes: "180x180" }, // 24bit
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            body.ready {
              opacity: 1;
              transition: 0.25s opacity;
            }`
          }
        </style>
      </head>

      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div id="root"
            className="text-zinc-800 bg-zinc-200 dark:text-white dark:bg-zinc-900 antialiased bg-cover"
          >
            {children}
          </div>
        </ThemeProvider>

      </body>
    </html>
  )
}