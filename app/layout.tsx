import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'AoE2 Card',
  description: 'This is a playground for AoE2 stuff made by a bunch of friends playing the game',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* <meta charSet="UTF-8" /> */}
        {/* <link rel="icon" type="image/png" href="/favicon.png" /> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        <title>AoE2 Card</title>
        <style>
          {`
            body {
              opacity: 0;
              background-color: rgb(24 24 27);
            }
            body.ready {
              opacity: 1;
              transition: 0.25s opacity;
            }`
          }
        </style>
      </head>

      <body className="sl-theme-dark text-zinc-800 bg-zinc-200 dark:text-white dark:bg-zinc-900 antialiased bg-cover">
        {/* <script>
          (() => {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          const theme = localStorage.getItem("theme") || "auto";
          const dark = theme === "dark" || (theme === "auto" && prefersDark);
          if (dark) {
            document.documentElement.classList.add("dark");
          document.body.classList.add("sl-theme-dark");
          document.body.classList.remove("sl-theme-light");
            } else {
            document.documentElement.classList.remove("dark");
          document.body.classList.remove("sl-theme-dark");
          document.body.classList.add("sl-theme-light");
            }
          })();
        </script> */}
        <div id="root">{children}</div>
      </body>
    </html>
  )
}