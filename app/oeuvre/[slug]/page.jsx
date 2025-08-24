import fs from 'fs'; import path from 'path';
import ProductCarousel from '../../../components/ProductCarousel';
import { trackEtsyClick } from '../../../utils/analytics';
import BuyEtsyButton from './BuyEtsyButton';

function readJSON(p){ const raw=fs.readFileSync(p,'utf-8'); return JSON.parse(raw); }
function getWorks(){ const p=path.join(process.cwd(),'data','works.json'); try{ return readJSON(p);}catch(e){ return []; } }
function getManifest(){ const p=path.join(process.cwd(),'data','images.manifest.json'); try{ return readJSON(p);}catch(e){ return {}; } }
export function generateStaticParams(){ return getWorks().map(it=>({slug: it.slug})); }
export function generateMetadata({params}){
  const works=getWorks(); const it=works.find(i=>i.slug===params.slug);
  const title=it?.title?`${it.title} – AuraOnCanvas`:'Œuvre – AuraOnCanvas';
  const description=it?.alt||'Œuvre du portfolio';
  const url='https://auraoncanvas.art';
  return { title, description, openGraph:{title,description,url:`${url}/oeuvre/${params.slug}`,type:'article'}, twitter:{card:'summary_large_image',title,description} };
}
export default function Page({params}){
  const works=getWorks(); const manifest=getManifest();
  const it=works.find(i=>i.slug===params.slug);
  if(!it) return <div className="py-10">Œuvre introuvable.</div>;
  const entry = manifest[params.slug];
  const title = it.title || params.slug;
  const etsyId = it.etsyId || '';
  const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : (it.buyUrl||'');
  const hasVariants = entry && Array.isArray(entry.variants) && entry.variants.length>0;
  const fallbackImg = it.images && it.images[0] ? it.images[0] : null;
  return (
    <article className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          {hasVariants ? (
            <ProductCarousel slug={params.slug} title={title} />
          ) : (
            fallbackImg ? (
              <div className="flex justify-center">
                <img src={fallbackImg} alt={it.alt||title} className="h-[600px] w-auto object-contain rounded-lg border border-neutral-200 dark:border-neutral-800" />
              </div>
            ) : (
              <div className="text-neutral-500">Aucune image disponible.</div>
            )
          )}
        </div>
        <div className="space-y-3 lg:sticky lg:top-20">
          <h1 className="text-3xl font-semibold">{title}</h1>
          {it.alt && <p className="text-neutral-600 dark:text-neutral-300">{it.alt}</p>}
          <div className="flex gap-3 pt-2">
            <a href="/" className="btn">← Retour</a>
            {buyUrl && <BuyEtsyButton href={buyUrl} slug={params.slug} />}
          </div>
        </div>
      </div>
    </article>
  );
}
