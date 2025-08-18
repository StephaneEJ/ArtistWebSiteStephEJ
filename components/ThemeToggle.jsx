
'use client';
import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setMounted(true);
    try{
      const ls = localStorage.getItem('theme');
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      setDark(ls === 'dark' || (!ls && mql.matches));
    }catch(e){}
  }, []);
  if(!mounted) return null;
  function toggle(){
    const next = !dark; setDark(next);
    try{
      localStorage.setItem('theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
    }catch(e){}
  }
  return (
    <button onClick={toggle} className="px-3 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm">
      {dark ? 'Mode clair' : 'Mode sombre'}
    </button>
  );
}
