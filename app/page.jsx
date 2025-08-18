
import Gallery from "../components/Gallery";
import SiteVideo from "../components/SiteVideo";
import SiteBio from "../components/SiteBio";

export default function Page(){
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold">Œuvres originales & univers visuel</h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">Découvrez une sélection de mes dernières créations, expositions et projets.</p>
        <a href="#galerie" className="btn">Voir la galerie</a>
      </section>

      <section id="galerie">
        <h2 className="text-2xl font-semibold mb-4">Galerie</h2>
        <Gallery />
      </section>

      <section id="expo">
        <h2 className="text-2xl font-semibold mb-4">Expo (vidéo)</h2>
        <SiteVideo />
      </section>

      <section id="bio">
        <h2 className="text-2xl font-semibold mb-4">Bio</h2>
        <SiteBio />
      </section>
    </div>
  );
}
