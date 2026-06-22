import './uudai.css';
import VoucherClient from './VoucherClient';

export const metadata = {
  title: 'Học Lái Xe Tặng Du Lịch Hè — Voucher Nghỉ Dưỡng Mũi Né | Quyết Thắng',
  description:
    'Đăng ký học lái xe tại Quyết Thắng nhận ngay voucher nghỉ dưỡng 2 ngày 1 đêm tại Resort Mũi Né cho 2 người: hồ bơi, ăn sáng, sát biển. Ưu đãi có hạn!',
  // Trang quảng cáo: không index trên Google, không vào sitemap/menu.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <VoucherClient />;
}
