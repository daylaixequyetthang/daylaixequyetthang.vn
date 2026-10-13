import { POSTS } from '@/lib/posts';
import { COURSES_SEO } from '@/lib/seo-courses';
import { REGIONS, regionIndexable } from '@/lib/seo-regions';
import { supabasePublic } from '@/lib/supabase';

const BASE='https://daylaixequyetthang.vn';
export const revalidate = 3600;

export default async function sitemap() {
 const paths=['','/thi-thu','/tra-cuu','/dang-ky','/cap-nhat-quy-dinh','/tin-tuc','/chinh-sach-bao-mat','/20-11','/khoa-hoc','/hoc-lai-xe'];
 const pages=paths.map(path=>({url:BASE+path}));
 const courses=COURSES_SEO.map(c=>({url:BASE+'/khoa-hoc/'+c.slug}));
 // Only verified locations go into Google sitemap. All other localities remain
 // browseable and accept online consultation, with robots noindex pending unique data.
 const regions=REGIONS.filter(regionIndexable).map(r=>({url:BASE+'/hoc-lai-xe/'+r.slug}));
 const posts=new Map(POSTS.map(p=>[p.slug,p]));
 try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
   const { data, error }=await supabasePublic().from('posts')
     .select('slug,published_at,updated_at').eq('status','published')
     .order('published_at',{ascending:false}).limit(1000);
   if (error) throw error;
   for (const p of data || []) if(p.slug && /^[a-z0-9-]+$/.test(p.slug)) {
     posts.set(p.slug,{...posts.get(p.slug),...p});
   }
  }
 } catch(e){console.warn('[SEO sitemap] dynamic posts unavailable:',e?.message||e);}
 const articles=[...posts.values()].map(p=>{
  const last=p.updated_at||p.published_at;
  const valid=last && !Number.isNaN(Date.parse(last));
  return {url:BASE+'/tin-tuc/'+p.slug,...(valid?{lastModified:new Date(last)}:{})};
 });
 return [...pages,...courses,...regions,...articles];
}
