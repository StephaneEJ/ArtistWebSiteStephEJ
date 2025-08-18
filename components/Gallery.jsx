'use client';
import { useEffect, useState } from "react";
export default function Gallery(){
  const [items, setItems] = useState([]);
  useEffect(()=>{fetch('/gallery.json').then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:(d.items||[])));},[]);
  if(!items.length) return <p className="text-neutral-500">Ajoutez vos œuvres via le CMS (/admin) ou en éditant <code>public/gallery.json</code>.</p>;
  return (
    <div className="grid-gallery">
      {items.map((it, idx)=>(
        <figure key={idx} className="card">
          <a href={`/oeuvre/${it.slug}`}><img src={it.src} alt={it.alt||it.title||'Œuvre'} loading="lazy" /></a>
          <figcaption className="caption"><div className="font-medium">{it.title||'Sans titre'}</div>{it.caption&&<div className="opacity-80">{it.caption}</div>}</figcaption>
        </figure>
      ))}
    </div>
  );
}
