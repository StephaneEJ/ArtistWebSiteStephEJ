
export const metadata = {
  title: "Portfolio – Artiste",
  description: "Galerie, bio et vidéo d’exposition",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try{
                const ls = localStorage.getItem('theme');
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                const dark = ls === 'dark' || (!ls && mql.matches);
                document.documentElement.classList.toggle('dark', dark);
              }catch(e){}
            })();`
          }}
        />
      </head>
      <body className="min-h-screen">
        <div className="header">
          <div className="container flex items-center justify-between py-3">
            <a href="/" className="font-semibold">Nom de l’Artiste</a>
            <nav className="nav flex items-center gap-4">
              <a href="#galerie">Galerie</a>
              <a href="#expo">Expo</a>
              <a href="#bio">Bio</a>
              <a href="/contact">Contact</a>
              <ThemeToggle />
            </nav>
          </div>
        </div>
        <main className="container py-8">{children}</main>
        <footer className="container py-8 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300">
          © <span id="year"></span> Nom de l’Artiste — Tous droits réservés
          <script dangerouslySetInnerHTML={{__html: "document.getElementById('year').textContent=new Date().getFullYear()"}} />
        </footer>
      </body>
    </html>
  );
}

import ThemeToggle from "../components/ThemeToggle";
import "./globals.css";
