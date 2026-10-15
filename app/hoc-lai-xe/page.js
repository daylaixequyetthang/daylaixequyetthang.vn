import Link from 'next/link';
import { BINH_THUAN, REMOTE_REGIONS, BRANCHES } from '@/lib/seo-regions';
import SeoConsultForm from '@/components/SeoConsultForm';
const ROOT='https://daylaixequyetthang.vn';
export const metadata={
 title:'Học Lái Xe – Văn Phòng Và Khu Vực Tư Vấn',
 description:'Khám phá khóa học lái xe B, C1, A1, A tại Quyết Thắng. Tư vấn miễn phí, lịch học linh hoạt và hỗ trợ đăng ký tại Phan Thiết, La Gi, Bắc Bình hoặc từ xa.',
 alternates:{canonical:ROOT+'/hoc-lai-xe'},
 openGraph:{url:ROOT+'/hoc-lai-xe',title:'Học lái xe Quyết Thắng – Chọn khu vực tư vấn'},
};
export default function RegionIndex(){
 return <main className="seo-page">
  <div className="seo-head"><div className="seo-wrap"><a className="seo-back" href="/">← Trang chủ Quyết Thắng</a><p className="seo-eyebrow">ĐỒNG HÀNH CÙNG BẠN TRÊN MỌI HÀNH TRÌNH</p><h1>Chọn khu vực thuận tiện để bắt đầu học lái xe</h1><p>Quyết Thắng hỗ trợ tư vấn các khóa học lái xe B, C1, A1, A với lịch học phù hợp và hướng dẫn hồ sơ tận tình. Chọn khu vực của bạn để bắt đầu.</p></div></div>
  <div className="seo-wrap">
   <section className="seo-section"><h2>Đến văn phòng Quyết Thắng gần bạn</h2><div className="seo-links">{BRANCHES.map(a=><Link key={a.slug} href={'/hoc-lai-xe/'+a.slug}>{a.name}<small>{a.address}</small></Link>)}</div></section>
   <section className="seo-section"><h2>Tư vấn học lái xe cho học viên các khu vực lân cận</h2><p>Dù ở khu vực nào, bạn vẫn có thể liên hệ Quyết Thắng để được giới thiệu khóa học, lịch học và địa điểm thực hành phù hợp.</p><div className="seo-links">{BINH_THUAN.filter(x=>x.kind!=='office').map(a=><Link key={a.slug} href={'/hoc-lai-xe/'+a.slug}>{a.name}<small>Nhận tư vấn khóa học và hướng dẫn ghi danh</small></Link>)}</div></section>
   <section className="seo-section"><h2>Hỗ trợ học viên tại Đồng Nai và TP. Hồ Chí Minh</h2><div className="seo-links">{REMOTE_REGIONS.map(a=><Link key={a.slug} href={'/hoc-lai-xe/'+a.slug}>{a.name}<small>Tư vấn trực tuyến, hỗ trợ chọn khóa học phù hợp</small></Link>)}</div></section>
   <section className="seo-section seo-grid"><div className="seo-panel"><h2>Bắt đầu khóa học trong 4 bước</h2><ol><li>Chọn hạng bằng bạn muốn học: B, C1, A1, A hoặc nâng hạng.</li><li>Để lại họ tên và số điện thoại để Quyết Thắng liên hệ.</li><li>Nhận tư vấn chi tiết về học phí, lịch học và địa điểm thực hành.</li><li>Chuẩn bị hồ sơ và hoàn tất ghi danh theo hướng dẫn của trung tâm.</li></ol><p className="seo-notice">Hỗ trợ học lý thuyết trực tuyến theo chương trình; các buổi thực hành và kỳ sát hạch được tham gia trực tiếp theo lịch của khóa học.</p><Link href="/khoa-hoc">Khám phá các khóa học →</Link></div><SeoConsultForm area="Bình Thuận / Đồng Nai / TP.HCM" /></section>
  </div>
  <footer className="seo-bottom"><div className="seo-wrap">Trung Tâm GDNN Quyết Thắng · <a href="tel:0848751111">084 875 1111</a> · <a href="/">Trang chủ</a></div></footer>
 </main>
}
