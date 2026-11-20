import SiteHeader from '@/components/SiteHeader';
export const metadata = {
  title: 'Luyện sa hình tương tác hạng B và C1 miễn phí',
  description: 'Thực hành các bài sa hình ô tô trên trình mô phỏng của Trung Tâm GDNN Quyết Thắng. Có điều khiển xe, tập từng bài, thi liên hoàn, đánh giá tham khảo.',
  alternates: { canonical: 'https://daylaixequyetthang.vn/luyen-sa-hinh' }
};
export default function SaHinhPage() {
  return <><SiteHeader /><main style={{background:'#0b1428',minHeight:'90vh'}}><iframe title="Mô phỏng luyện lái xe sa hình Quyết Thắng" src="/sa-hinh/index.html" style={{display:'block',width:'100%',height:'min(1120px, 100dvh)',minHeight:820,border:0}} allowFullScreen loading="eager" /></main></>;
}
