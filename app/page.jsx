import fs from 'fs';
import path from 'path';
import Gallery from "../components/Gallery";
import SiteBio from "../components/SiteBio";

function getWorks() {
  const p = path.join(process.cwd(), 'data', 'works.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function getManifest() {
  const p = path.join(process.cwd(), 'data', 'images.manifest.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (e) {
    return {};
  }
}

export default function Page(){
  const works = getWorks();
  const manifest = getManifest();

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold">Œuvres originales & univers visuel</h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">Découvrez une sélection de mes dernières créations, expositions et projets.</p>
        <a href="#galerie" className="btn">Voir la galerie</a>
      </section>
      <section id="galerie">
        <h2 className="text-2xl font-semibold mb-4">Galerie</h2>
        <Gallery works={works} manifest={manifest} />
      </section>
      <section id="bio">
        <h2 className="text-2xl font-semibold mb-4">Bio</h2>
        <SiteBio />
      </section>
    </div>
  );
}
