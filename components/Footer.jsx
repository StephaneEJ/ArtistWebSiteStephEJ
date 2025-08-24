'use client';
import { useEffect, useState } from "react";

export default function Footer({ version = 'dev' }) {
  const [site, setSite] = useState(null);
  
  useEffect(() => {
    fetch('/site.json').then(r => r.json()).then(setSite);
  }, []);

  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'etsy':
        return (
          <svg className="w-6 h-6 text-orange-600 hover:text-orange-700 transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.559 2.445c0-.325.033-.52.59-.52h7.465c1.3 0 2.02.522 2.02 1.466 0 1.033-.5 1.411-.5 1.411l2.08 2.656v.675h-6.114l-1.85 2.409h4.528c.98 0 1.361.369 1.361 1.207 0 .625-.319.945-.319.945l-1.734 1.287V15.5h-5.986l-3.548-4.953v4.217c0 1.283.487 1.895 1.602 1.895h5.328v-.486h-5.052c-.49 0-.686-.245-.686-.49V9.5l5.404 7.248h4.528V16.5H8.559V2.445z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6 text-pink-600 hover:text-pink-700 transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'pinterest':
        return (
          <svg className="w-6 h-6 text-red-600 hover:text-red-700 transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="container py-8 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-300">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © <span id="year"></span> AuraOnCanvas.art — Tous droits réservés · v{version}
          <script dangerouslySetInnerHTML={{__html:"document.getElementById('year').textContent=new Date().getFullYear()"}} />
        </div>
        
        {/* Liens sociaux */}
        {site?.socials && site.socials.length > 0 && (
          <div className="flex gap-4">
            {site.socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                aria-label={social.name}
              >
                {getSocialIcon(social.icon)}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}