'use client';
import { useEffect, useState } from "react";
import WorkCard from "./WorkCard";
export default function Gallery(){
  const [works, setWorks] = useState([]);
  const [manifest, setManifest] = useState({});
  useEffect(()=>{
    fetch('/data/works.json').then(r=>r.json()).then(d=>setWorks(Array.isArray(d)?d:[]));
    fetch('/data/images.manifest.json').then(r=>r.json()).then(d=>setManifest(d||{}));
  },[]);
  if(!works.length) return <p className="text-neutral-500">Aucune œuvre trouvée. Ajoutez des entrées dans <code>data/works.map.json</code> puis lancez <code>npm run ingest:images</code>.</p>;
  return (
    <div className="grid-gallery">
      {works.map((work)=> (
        <WorkCard key={work.slug} work={work} manifestEntry={manifest[work.slug]} />
      ))}
    </div>
  );
}
