import DangKyClient from './DangKyClient';
export const metadata = {
  alternates: { canonical: 'https://daylaixequyetthang.vn/dang-ky' },
  title: 'Đăng ký học lái xe online & đặt cọc giữ chỗ',
  description: 'Đăng ký khóa học lái xe online, đặt cọc giữ chỗ qua mã QR. Cọc được trừ vào học phí.',
};
export default function Page() {
  return <DangKyClient />;
}
