import Link from 'next/link';
import {COURSES_SEO} from '@/lib/seo-courses';
import SeoConsultForm from '@/components/SeoConsultForm';
import OfficialEnrollmentNotice from '@/components/OfficialEnrollmentNotice';
const BASE='https://daylaixequyetthang.vn';
export const metadata={title:'Các Khóa Học Lái Xe B, C1, A1, A Và Nâng Hạng',description:'Khóa học lái xe Quyết Thắng: hạng B, C1, A1, A và nâng hạng. Đăng ký tư vấn online từ Bình Thuận, Đồng Nai và TP.HCM.',alternates:{canonical:BASE+'/khoa-hoc'}};
export default function CourseDirectory(){
return <main className="seo-page">
 <section className="seo-head"><div className="seo-wrap"><a className="seo-back" href="/">← Trang chủ</a><h1>Khóa học lái xe Quyết Thắng</h1><p>Lựa chọn hạng bằng phù hợp, khám phá chương trình học và nhận hướng dẫn đăng ký từ đội ngũ Quyết Thắng. Tư vấn miễn phí qua điện thoại hoặc trực tuyến.</p></div></section>
 <div className="seo-wrap"><OfficialEnrollmentNotice /><section className="seo-section"><h2>Lựa chọn khóa học</h2><div className="seo-links">{COURSES_SEO.map(c=><Link key={c.slug} href={'/khoa-hoc/'+c.slug}>{c.title}<small>{c.intro}</small></Link>)}</div></section>
 <section className="seo-section seo-grid"><div className="seo-panel"><h2>Học lái xe thuận tiện cùng Quyết Thắng</h2><p>Đội ngũ Quyết Thắng hỗ trợ bạn tìm hiểu chương trình đào tạo, lịch học lý thuyết, thực hành và các khoản học phí trước khi ghi danh.</p><p>Bạn có thể đăng ký tư vấn trực tuyến để tiết kiệm thời gian. Các buổi học thực hành và kỳ sát hạch được tham gia trực tiếp theo lịch đào tạo.</p><Link href="/hoc-lai-xe">Chọn khu vực nhận tư vấn →</Link></div><SeoConsultForm area="Tư vấn khóa học online"/></section></div>
 <footer className="seo-bottom"><div className="seo-wrap">Trung Tâm GDNN Quyết Thắng · <a href="tel:0848751111">084 875 1111</a></div></footer>
</main>}
