import Link from 'next/link';
import { notFound } from 'next/navigation';
import SeoConsultForm from '@/components/SeoConsultForm';
import OfficialEnrollmentNotice from '@/components/OfficialEnrollmentNotice';
import { REGIONS, regionBySlug, regionIndexable, BRANCHES } from '@/lib/seo-regions';

const BASE='https://daylaixequyetthang.vn';
export const dynamicParams=false;
export function generateStaticParams(){return REGIONS.map(r=>({slug:r.slug}));}
export function generateMetadata({params}){
 const r=regionBySlug(params.slug);
 if(!r) return {};
 const name=r.name;
 return {
  title:r.kind==='office' ? 'Học Lái Xe Tại '+name+' – B, C1, A1' : 'Tư Vấn Học Lái Xe Cho Học Viên '+name,
  description:r.kind==='office'
  ? 'Đăng ký học lái xe B, C1, A1, A tại '+name+' cùng Quyết Thắng. Văn phòng: '+r.address+'. Tư vấn học phí, lịch học và hồ sơ.'
  : 'Quyết Thắng tư vấn học lái xe B, C1, A1, A cho học viên khu vực '+name+'. Hỗ trợ thông tin học phí, lịch học, địa điểm thực hành và ghi danh.',
  alternates:{canonical:BASE+'/hoc-lai-xe/'+r.slug},
  robots:regionIndexable(r)?{index:true,follow:true}:{index:false,follow:true},
  openGraph:{url:BASE+'/hoc-lai-xe/'+r.slug,title:'Khóa học lái xe – Hỗ trợ học viên '+name+' | Quyết Thắng'},
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
  <div className="seo-head"><div className="seo-wrap"><Link className="seo-back" href="/hoc-lai-xe">← Chọn khu vực tư vấn</Link><p className="seo-eyebrow">{office?'QUYẾT THẮNG CHÀO ĐÓN BẠN':'TƯ VẤN KHÓA HỌC MIỄN PHÍ'}</p>{office ? <h1>Học lái xe tại {r.name} cùng Quyết Thắng</h1> : <h1>Tư vấn học lái xe cho học viên khu vực {r.name}</h1>}<p>{r.intro}</p></div></div>
  <div className="seo-wrap">
   <OfficialEnrollmentNotice outsideBinhThuan={r.kind==='regional'} fromPhuQuy={r.slug==='phu-quy'} />
   <section className="seo-section seo-grid">
    <div>
     <article className="seo-panel"><h2>{office?'Hỗ trợ học viên tại văn phòng '+r.name:'Tìm hiểu khóa học lái xe dành cho học viên '+r.name}</h2>
      <p>{r.detail}</p>
      {office?<><p><strong>Địa chỉ tiếp nhận:</strong> {r.address}</p><p><a href={r.maps} target="_blank" rel="noopener noreferrer">Xem vị trí văn phòng trên Google Maps ↗</a></p></>:<p className="seo-kicker">Nhận tư vấn từ xa ngay tại {r.name}. Đội ngũ Quyết Thắng sẽ giới thiệu văn phòng tiếp nhận và hướng dẫn lịch học, địa điểm thực hành phù hợp với khóa bạn chọn.</p>}
      <h3>Khu vực lân cận được hỗ trợ tư vấn</h3><p>Học viên ở {r.places.join(', ')} có thể liên hệ để được tư vấn và lựa chọn khóa học phù hợp.</p>
      <div className="seo-chip-list">{r.places.map(p=><span key={p}>{p}</span>)}</div>
     </article>
     <article className="seo-panel" style={{marginTop:18}}><h2>Ghi danh học lái xe dễ dàng</h2><ol><li>Lựa chọn khóa học B, C1, A1, A hoặc nâng hạng tùy nhu cầu.</li><li>Đăng ký tại ba văn phòng chính hoặc trên website để được nhân viên Quyết Thắng tư vấn học phí và lịch học.</li><li>Nhận hướng dẫn hồ sơ, hợp đồng đào tạo và lịch thực hành theo giáo viên do trung tâm phân công.</li></ol><p>Bạn chỉ cần họ tên và số điện thoại để bắt đầu; nhân viên sẽ hướng dẫn giấy tờ cần thiết khi ghi danh.</p><div className="seo-inline"><Link href="/khoa-hoc/hang-b">Tìm hiểu hạng B</Link><Link href="/khoa-hoc/hang-c1">Tìm hiểu hạng C1</Link><Link href="/thi-thu">Thi thử 600 câu</Link></div></article>
    </div>
    <SeoConsultForm area={r.name} heading={'Nhận tư vấn học lái xe '+r.name}/>
   </section>
   <section id="van-phong" className="seo-section"><h2>Các văn phòng tư vấn và tiếp nhận hồ sơ</h2><div className="seo-links">{BRANCHES.map(o=><Link key={o.slug} href={'/hoc-lai-xe/'+o.slug}>{o.name}<small>{o.address}</small></Link>)}</div></section>
  </div>
  <footer className="seo-bottom"><div className="seo-wrap">Trung Tâm GDNN Quyết Thắng · Tư vấn miễn phí <a href="tel:0848751111">084 875 1111</a> · <Link href="/">Trang chủ</Link></div></footer>
 </main>
}
