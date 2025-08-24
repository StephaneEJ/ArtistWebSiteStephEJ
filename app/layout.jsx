import ThemeToggle from "../components/ThemeToggle";
import "./globals.css";
import CanonicalLink from "./CanonicalLink";
import Footer from "../components/Footer";
import pkg from "../package.json";

export const metadata = { title: "Portfolio – Artiste", description: "Galerie, bio et vidéo d'exposition", metadataBase: new URL('https://auraoncanvas.art') };

export default function RootLayout({ children }){
  const version = pkg.version || 'dev';
  return (
    <html lang="fr" className="dark">
      <head>
        <script defer data-domain="auraoncanvas.art" src="https://plausible.io/js/script.js"></script>
      </head>
      <body className="min-h-screen">
        <CanonicalLink />
        <div className="header">
          <div className="container flex items-center justify-between py-3">
            <a href="/" className="font-semibold">AuraOnCanvas.art</a>
            <nav className="nav flex items-center gap-4">
              <a href="/#galerie">Galerie</a>
              <a href="/#bio">Bio</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </div>
        <main className="container py-8">{children}</main>
        <Footer version={version} />
      </body>
    </html>
  );
}
