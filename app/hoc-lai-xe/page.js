import Link from 'next/link';
import { BINH_THUAN, REMOTE_REGIONS, BRANCHES } from '@/lib/seo-regions';
import SeoConsultForm from '@/components/SeoConsultForm';
const ROOT='https://daylaixequyetthang.vn';
export const metadata={
 title:'Khu Vực Tư Vấn Học Lái Xe – Bình Thuận, Đồng Nai, TP.HCM',
 description:'Đăng ký tư vấn học lái xe hạng B, C1, A1, A online. Quyết Thắng có văn phòng tiếp nhận tại Phan Thiết, La Gi, Bắc Bình và hướng dẫn người ở các khu vực khác.',
 alternates:{canonical:ROOT+'/hoc-lai-xe'},
 openGraph:{url:ROOT+'/hoc-lai-xe',title:'Khu vực học lái xe – Quyết Thắng'},
};
export default function RegionIndex(){
 return <main className="seo-page">
  <div className="seo-head"><div className="seo-wrap"><a className="seo-back" href="/">← Trang chủ Quyết Thắng</a><p className="seo-eyebrow">TƯ VẤN VÀ ĐĂNG KÝ ONLINE</p><h1>Học lái xe tại khu vực Bình Thuận và đăng ký từ xa</h1><p>Lựa chọn địa phương để xem thông tin tư vấn học bằng B, C1, A1, A. Đăng ký online trước để xác nhận nơi học thực tế, thời gian và hồ sơ.</p></div></div>
  <div className="seo-wrap">
   <section className="seo-section"><h2>Văn phòng tiếp nhận trực tiếp</h2><div className="seo-links">{BRANCHES.map(a=><Link key={a.slug} href={'/hoc-lai-xe/'+a.slug}>{a.name}<small>{a.address}</small></Link>)}</div></section>
   <section className="seo-section"><h2>Các địa danh khác trong khu vực Bình Thuận</h2><p>Đây là các tên địa danh được người học sử dụng khi tìm kiếm. Một số đơn vị hành chính đã được sắp xếp từ năm 2025. Không phải mọi địa điểm đều có văn phòng Quyết Thắng.</p><div className="seo-links">{BINH_THUAN.filter(x=>x.kind!=='office').map(a=><Link key={a.slug} href={'/hoc-lai-xe/'+a.slug}>{a.name}<small>Yêu cầu tư vấn online; xác nhận nơi học khi liên hệ</small></Link>)}</div></section>
   <section className="seo-section"><h2>Tư vấn từ Đồng Nai và TP.HCM</h2><div className="seo-links">{REMOTE_REGIONS.map(a=><Link key={a.slug} href={'/hoc-lai-xe/'+a.slug}>{a.name}<small>Đăng ký thông tin online, chưa có cơ sở tại địa phương được xác nhận</small></Link>)}</div></section>
   <section className="seo-section seo-grid"><div className="seo-panel"><h2>Cách đăng ký</h2><ol><li>Chọn hạng bằng B, C1, A1, A hoặc nâng hạng.</li><li>Gửi tên, số điện thoại và địa phương hiện tại.</li><li>Nhân viên tư vấn hồ sơ, học phí và lịch học thực tế.</li><li>Chỉ hoàn tất thủ tục và thanh toán theo hướng dẫn chính thức sau khi xác minh thông tin.</li></ol><p className="seo-notice">Học lý thuyết có thể có nội dung trực tuyến; học thực hành và sát hạch vẫn phải tham gia tại địa điểm được trung tâm/cơ quan có thẩm quyền xác nhận. Không có dịch vụ cấp bằng online.</p><Link href="/khoa-hoc">Xem các khóa học →</Link></div><SeoConsultForm area="Bình Thuận / Đồng Nai / TP.HCM" /></section>
  </div>
  <footer className="seo-bottom"><div className="seo-wrap">Trung Tâm GDNN Quyết Thắng · <a href="tel:0848751111">084 875 1111</a> · <a href="/">Trang chủ</a></div></footer>
 </main>
}
