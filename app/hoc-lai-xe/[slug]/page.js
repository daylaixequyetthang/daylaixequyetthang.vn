import Link from 'next/link';
import { notFound } from 'next/navigation';
import SeoConsultForm from '@/components/SeoConsultForm';
import { REGIONS, regionBySlug, regionIndexable, BRANCHES } from '@/lib/seo-regions';

const BASE='https://daylaixequyetthang.vn';
export const dynamicParams=false;
export function generateStaticParams(){return REGIONS.map(r=>({slug:r.slug}));}
export function generateMetadata({params}){
 const r=regionBySlug(params.slug);
 if(!r) return {};
 const name=r.name;
 return {
  title:'Tư Vấn Học Lái Xe '+name+' – Đăng Ký Online B, C1, A1',
  description:r.kind==='office'
  ? 'Tìm hiểu học lái xe hạng B, C1 tại '+name+'. Văn phòng Quyết Thắng: '+r.address+'. Hướng dẫn hồ sơ và đăng ký tư vấn online.'
  : 'Người ở '+name+' có thể đăng ký tư vấn khóa học lái xe B, C1, A1 từ xa với Quyết Thắng. Xác nhận nơi học thực tế, lịch và hồ sơ trước khi đăng ký.',
  alternates:{canonical:BASE+'/hoc-lai-xe/'+r.slug},
  robots:regionIndexable(r)?{index:true,follow:true}:{index:false,follow:true},
  openGraph:{url:BASE+'/hoc-lai-xe/'+r.slug,title:'Học lái xe – Tư vấn tại '+name+' | Quyết Thắng'},
 };
}
export default function RegionPage({params}){
 const r=regionBySlug(params.slug);
 if(!r) notFound();
 const office=r.kind==='office';
 const schema=office?{
   '@context':'https://schema.org','@type':'DrivingSchool',
   name:'Trung Tâm GDNN Quyết Thắng – Văn phòng '+r.name,
   url:BASE+'/hoc-lai-xe/'+r.slug,telephone:'+84848751111',
   address:{'@type':'PostalAddress',streetAddress:r.address,addressCountry:'VN'},
   hasMap:r.maps,
   parentOrganization:{'@type':'Organization',name:'Trung Tâm GDNN Quyết Thắng',url:BASE},
 }:null;
 return <main className="seo-page">
  {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />}
  <div className="seo-head"><div className="seo-wrap"><Link className="seo-back" href="/hoc-lai-xe">← Các khu vực hỗ trợ</Link><p className="seo-eyebrow">{office?'VĂN PHÒNG TIẾP NHẬN THỰC TẾ':'TIẾP NHẬN TƯ VẤN ONLINE'}</p><h1>Học lái xe tại {r.name} – tư vấn B, C1, A1 online</h1><p>{r.intro}</p></div></div>
  <div className="seo-wrap">
   <section className="seo-section seo-grid">
    <div>
     <article className="seo-panel"><h2>{office?'Thông tin văn phòng '+r.name:'Thông tin đăng ký cho khu vực '+r.name}</h2>
      <p>{r.detail}</p>
      {office?<><p><strong>Địa chỉ tiếp nhận:</strong> {r.address}</p><p><a href={r.maps} target="_blank" rel="noopener noreferrer">Xem vị trí văn phòng trên Google Maps ↗</a></p></>:<p className="seo-notice">Hiện không công bố văn phòng hoặc địa điểm dạy thực hành trực tiếp tại {r.name}. Việc đăng ký online là bước tư vấn, không phải đăng ký khóa học đã được xác nhận.</p>}
      <h3>Những địa danh người học thường tìm kiếm</h3><p>Người quan tâm ở {r.places.join(', ')} có thể gửi câu hỏi và xác nhận kế hoạch học phù hợp.</p>
      <div className="seo-chip-list">{r.places.map(p=><span key={p}>{p}</span>)}</div>
     </article>
     <article className="seo-panel" style={{marginTop:18}}><h2>Đăng ký cần chuẩn bị gì?</h2><ol><li>Chọn khóa B, C1, A1 hoặc A phù hợp nhu cầu.</li><li>Để lại số liên hệ và khu vực sinh sống để được tư vấn lịch.</li><li>Hỏi rõ nơi học thực hành, học phí, giấy tờ và điều kiện trước khi ghi danh.</li></ol><p>Hồ sơ chính thức được hướng dẫn sau khi tư vấn; không cần gửi ảnh CCCD trên trang này.</p><div className="seo-inline"><Link href="/khoa-hoc/hang-b">Tìm hiểu hạng B</Link><Link href="/khoa-hoc/hang-c1">Tìm hiểu hạng C1</Link><Link href="/thi-thu">Thi thử 600 câu</Link></div></article>
    </div>
    <SeoConsultForm area={r.name} heading={'Nhận tư vấn học lái xe '+r.name}/>
   </section>
   <section className="seo-section"><h2>Ba văn phòng hiện có của Quyết Thắng</h2><div className="seo-links">{BRANCHES.map(o=><Link key={o.slug} href={'/hoc-lai-xe/'+o.slug}>{o.name}<small>{o.address}</small></Link>)}</div></section>
  </div>
  <footer className="seo-bottom"><div className="seo-wrap">Quyết Thắng · Tư vấn đăng ký online <a href="tel:0848751111">084 875 1111</a> · <Link href="/">Trang chủ</Link></div></footer>
 </main>
}
