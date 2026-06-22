import HomeClient from '@/components/HomeClient';

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'Course', name: 'Khóa học lái xe hạng B (ô tô con)', description: 'Đào tạo lái xe ô tô đến 8 chỗ, học phí trọn gói 15.500.000đ.', provider: { '@type': 'DrivingSchool', name: 'Trung tâm Lái Xe Quyết Thắng' } },
    { '@type': 'Course', name: 'Khóa học lái xe hạng C1 (xe tải nhỏ)', description: 'Đào tạo lái xe tải dưới 7.500kg, học phí 19.000.000đ.', provider: { '@type': 'DrivingSchool', name: 'Trung tâm Lái Xe Quyết Thắng' } },
    { '@type': 'Course', name: 'Khóa học lái xe hạng A1 (xe máy)', description: 'Đào tạo và sát hạch lái xe mô tô hạng A1.', provider: { '@type': 'DrivingSchool', name: 'Trung tâm Lái Xe Quyết Thắng' } },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <HomeClient />
    </>
  );
}
