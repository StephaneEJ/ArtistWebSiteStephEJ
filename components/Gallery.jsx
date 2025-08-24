'use client';
import WorkCard from "./WorkCard";

export default function Gallery({ works = [], manifest = {} }){
  if(!works.length) return <p className="text-neutral-500">Aucune œuvre trouvée. Ajoutez des entrées dans <code>data/works.json</code> puis lancez <code>npm run ingest:images</code>.</p>;
  
  return (
    <div className="grid-gallery">
      {works.map((work)=> (
        <WorkCard key={work.slug} work={work} manifestEntry={manifest[work.slug]} />
      ))}
    </div>
  );
}
