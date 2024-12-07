import { Metadata } from "next";
import { ThemeProvider } from "~/src/components/theme-provider";

export const metadata: Metadata = {
  title: 'AoE2 Card',
  description: 'This is a playground for AoE2 stuff made by a bunch of friends playing the game',
  icons: [
    { rel: "icon", url: "/favicon.png" },
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