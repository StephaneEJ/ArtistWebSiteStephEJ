export const metadata = { title: "Portfolio – Artiste", description: "Galerie, bio et vidéo d’exposition", metadataBase: new URL('https://auraoncanvas.art') };

export default function RootLayout({ children }){
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev';
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:`(function(){try{const ls=localStorage.getItem('theme');const m=window.matchMedia('(prefers-color-scheme: dark)');const d=ls==='dark'||(!ls&&m.matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`}} />
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var h=location.hostname;var isCom=h==='auraoncanvas.com'||h==='www.auraoncanvas.com';var isWwwArt=h==='www.auraoncanvas.art';var needsHttps=location.protocol==='http:'&&(h.endsWith('auraoncanvas.art')||h.endsWith('auraoncanvas.com'));if(isCom||isWwwArt||needsHttps){var path=location.pathname+location.search+location.hash;location.replace('https://auraoncanvas.art'+(path||'/'));}}catch(e){}})();`}} />
      </head>
      <body className="min-h-screen">
        <CanonicalLink />
        <div className="header">
          <div className="container flex items-center justify-between py-3">
            <a href="/" className="font-semibold">AuraOnCanvas.art</a>
            <nav className="nav flex items-center gap-4">
              <a href="/#galerie">Galerie</a>
              <a href="/#expo">Expo</a>
              <a href="/#bio">Bio</a>
              <a href="/contact">Contact</a>
              <ThemeToggle />
            </nav>
          </div>
        </div>
        <main className="container py-8">{children}</main>
        <footer className="container py-8 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300">
          © <span id="year"></span> AuraOnCanvas.art — Tous droits réservés · v{version}
          <script dangerouslySetInnerHTML={{__html:"document.getElementById('year').textContent=new Date().getFullYear()"}} />
        </footer>
      </body>
    </html>
  );
}
import ThemeToggle from "../components/ThemeToggle";
import "./globals.css";
import CanonicalLink from "./CanonicalLink";
