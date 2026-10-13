import Link from 'next/link';
import {notFound} from 'next/navigation';
import {COURSES_SEO,findCourse} from '@/lib/seo-courses';
import SeoConsultForm from '@/components/SeoConsultForm';
import {BRANCHES} from '@/lib/seo-regions';
const BASE='https://daylaixequyetthang.vn';
export const dynamicParams=false;
export function generateStaticParams(){return COURSES_SEO.map(x=>({slug:x.slug}));}
export function generateMetadata({params}){
 const c=findCourse(params.slug);if(!c)return {};
 return {title:c.title+' | Quyết Thắng',description:c.intro+' Đăng ký tư vấn online, hướng dẫn hồ sơ và nơi đào tạo thực tế.',alternates:{canonical:BASE+'/khoa-hoc/'+c.slug},
 openGraph:{url:BASE+'/khoa-hoc/'+c.slug,title:c.title+' – Quyết Thắng'}};
}
export default function CourseDetail({params}){
 const c=findCourse(params.slug);if(!c)notFound();
 const schema={'@context':'https://schema.org','@type':'Course',name:c.title,description:c.intro,provider:{'@type':'Organization',name:'Trung Tâm GDNN Quyết Thắng',url:BASE}};
 return <main className="seo-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
  <div className="seo-head"><div className="seo-wrap"><Link className="seo-back" href="/khoa-hoc">← Các khóa học</Link><p className="seo-eyebrow">TƯ VẤN VÀ ĐĂNG KÝ TRỰC TUYẾN</p><h1>{c.title}</h1><p>{c.intro}</p></div></div>
  <div className="seo-wrap"><section className="seo-section seo-grid">
   <div><article className="seo-panel"><h2>Phạm vi phương tiện theo hạng GPLX</h2><p>{c.vehicle}</p><p className="seo-notice">Quyền điều khiển phương tiện, điều kiện và lịch đào tạo cần đối chiếu với văn bản pháp luật đang có hiệu lực. Không có hình thức mua bằng hoặc cấp GPLX trực tuyến.</p></article>
    <article className="seo-panel" style={{marginTop:18}}><h2>Nội dung cần trao đổi trước khi đăng ký</h2><ol>{c.focus.map(x=><li key={x}>{x}</li>)}</ol><h3>Các bước ghi danh online</h3><p>Điền biểu mẫu → nhân viên gọi tư vấn → xác minh hồ sơ và khóa → hoàn tất đăng ký theo hướng dẫn chính thức.</p><div className="seo-inline"><Link href="/thi-thu">Thi thử GPLX</Link><Link href="/hoc-lai-xe">Khu vực hỗ trợ</Link><Link href="/dang-ky">Trang ghi danh chính thức</Link></div></article>
   </div><SeoConsultForm area="Tư vấn khóa học từ website" course={c.name} heading={'Tư vấn '+c.name+' miễn phí'}/>
  </section>
  <section className="seo-section"><h2>Liên hệ các văn phòng</h2><div className="seo-links">{BRANCHES.map(r=><Link href={'/hoc-lai-xe/'+r.slug} key={r.slug}>{r.name}<small>{r.address}</small></Link>)}</div></section></div>
  <footer className="seo-bottom"><div className="seo-wrap">Quyết Thắng · <a href="tel:0848751111">084 875 1111</a></div></footer>
 </main>;
}
