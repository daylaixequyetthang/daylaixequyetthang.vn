import Link from 'next/link';
import {COURSES_SEO} from '@/lib/seo-courses';
import SeoConsultForm from '@/components/SeoConsultForm';
const BASE='https://daylaixequyetthang.vn';
export const metadata={title:'Các Khóa Học Lái Xe B, C1, A1, A Và Nâng Hạng',description:'Khóa học lái xe Quyết Thắng: hạng B, C1, A1, A và nâng hạng. Đăng ký tư vấn online từ Bình Thuận, Đồng Nai và TP.HCM.',alternates:{canonical:BASE+'/khoa-hoc'}};
export default function CourseDirectory(){
return <main className="seo-page">
 <section className="seo-head"><div className="seo-wrap"><a className="seo-back" href="/">← Trang chủ</a><h1>Khóa học lái xe Quyết Thắng</h1><p>Tìm hiểu các hạng bằng hiện hành. Tiếp nhận yêu cầu tư vấn online từ khu vực Bình Thuận, Đồng Nai và TP.HCM; nơi học thực hành được xác nhận khi tư vấn.</p></div></section>
 <div className="seo-wrap"><section className="seo-section"><h2>Lựa chọn khóa học</h2><div className="seo-links">{COURSES_SEO.map(c=><Link key={c.slug} href={'/khoa-hoc/'+c.slug}>{c.title}<small>{c.intro}</small></Link>)}</div></section>
 <section className="seo-section seo-grid"><div className="seo-panel"><h2>Tư vấn minh bạch</h2><p>Thời gian đào tạo, điều kiện nhập học, các khoản phí và lịch thi được xác nhận theo khóa và quy định có hiệu lực. Trung tâm không cam kết chắc chắn thi đỗ hoặc có GPLX cấp tốc.</p><p>Khách hàng có thể đăng ký yêu cầu tư vấn từ xa, nhưng học thực hành và sát hạch không được thực hiện hoàn toàn online.</p><Link href="/hoc-lai-xe">Xem danh sách các khu vực hỗ trợ →</Link></div><SeoConsultForm area="Tư vấn khóa học online"/></section></div>
 <footer className="seo-bottom"><div className="seo-wrap">Trung Tâm GDNN Quyết Thắng · <a href="tel:0848751111">084 875 1111</a></div></footer>
</main>}
