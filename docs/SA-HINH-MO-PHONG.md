# Quyết Thắng — Sa hình tương tác (beta)

- Trang tích hợp: `/luyen-sa-hinh`; engine độc lập: `/sa-hinh/index.html`.
- Không thêm thư viện hay thay đổi database. Chạy trực tiếp trên Next.js, qua các file static trong `public/sa-hinh/`.
- Hạng B số tự động/B số sàn: 11 bài; C1: 10 bài (không có ghép ngang).
- Chế độ tập từng bài / thi liên hoàn; điều khiển bằng phím và cảm ứng; góc nhìn sau xe, ghế lái trái, bản đồ; điểm và lỗi mang tính **tham khảo**.
- Bài thi **không** đồng nghĩa với phần thi mô phỏng tình huống giao thông đã bỏ từ 01/07/2026. Đây là trò chơi luyện kỹ năng sa hình, không phải thiết bị sát hạch được chứng nhận.
- Vật lý xe, kích thước đường, điểm dừng, các mô hình xe/địa hình và phương pháp chấm lỗi chưa đạt tiêu chuẩn sát hạch chính thức. Cần giáo viên và chuyên gia thẩm định trước khi dùng để chuẩn bị cho kỳ thi chính thức.
- Không lưu thông tin cá nhân và không ghi dữ liệu vào CRM. Điểm luyện tập chỉ tồn tại trong phiên trình duyệt.
- Để nâng cấp sau beta: chuẩn hóa sân theo bản vẽ thực tế của trường, cảm biến bánh xe/vạch, động cơ/hộp số, chất lượng 3D WebGL, audio, lưu kết quả vào tài khoản học viên có đồng ý, kiểm thử nhiều thiết bị.

**Test thủ công:** vào route, chọn B tự động → dây an toàn → D → W/↑, nhấn/giữ ←/→ để lái; space để phanh; thử các 3 góc nhìn; kiểm tra chế độ thi liên hoàn; điện thoại dùng nút cảm ứng.
