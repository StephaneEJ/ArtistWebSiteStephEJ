'use client';
import { useEffect, useState } from "react";
export default function SiteVideo(){
  const [site,setSite]=useState(null);
  useEffect(()=>{fetch('/site.json').then(r=>r.json()).then(setSite);},[]);
  const url = site?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";
  return (<div className="w-full aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
    <iframe width="100%" height="100%" src={url} title="Vidéo d’exposition" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
  </div>);
}
