'use client';
import { useEffect, useState } from "react";
export default function SiteBio(){
  const [site,setSite]=useState(null);
  useEffect(()=>{fetch('/site.json').then(r=>r.json()).then(setSite);},[]);
  return (
    <div className="grid sm:grid-cols-[120px,1fr] gap-4 items-start">
      <div className="w-28 h-28 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-700 grid place-items-center text-xs">Portrait</div>
      <div><h3 className="font-semibold mb-2">{site?.artistName||'Nom de l’Artiste'}</h3><p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-line">{site?.bio||'Bio à compléter dans le CMS.'}</p></div>
    </div>
  );
}
