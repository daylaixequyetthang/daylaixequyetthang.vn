# Quyết Thắng · Sa hình V5 — nhánh kiểm thử (CHƯA lên production)

Branch: `feature/sa-hinh-v5-camera-steering-dat`.
Main/production vẫn giữ V4 cho đến khi xác nhận nghiệm thu.

## Đã đưa vào bản V5

- Camera góc thứ ba ở vị trí mặc định cách xe 17,8 m, cao 10,8 m; kéo để xoay ngang/nâng hạ camera, pinch hoặc nút ± để thu phóng, ↻ để reset.
- Góc buồng lái bên trái và sơ đồ từ trên cao vẫn là các góc riêng biệt.
- Vô lăng dùng biến mục tiêu riêng, tăng từ từ bằng nút mũi tên, hoặc xoay bánh xe bằng cử chỉ vòng tròn. Thả tay giữ nguyên góc; có nút Trả lái.
- Giảm chạm giữ dẫn đến chọn/copy text trên mobile. Giữ nguyên bố cục cockpit với đường, lái, số, chân ga và phanh trong cùng màn hình.
- Đường vòng quanh co, góc vuông và tuyến DAT demo tạo đường cong nội suy thay vì nối vuông góc bằng những đoạn thẳng cứng.
- Ghép xe chỉ hoàn thành khi tất cả bốn góc thân xe nằm trong ô đỗ, có thực hiện số lùi.
- Giữ riêng 11 bài luyện hạng B và 10 bài hạng C1. Chế độ DAT demo có một đường minh họa riêng, KHÔNG được thêm vào chuỗi bài sát hạch.
- Thay icon QT tự vẽ bằng ảnh logo hiện có của website (`/logo.png`).

## Giới hạn quan trọng

- V5 là Canvas 2D có phép chiếu phối cảnh; chưa phải mô hình 3D vật lý chính xác như xe thật.
- Quỹ đạo, kích thước sân, cọc, biển báo và chấm điểm cần đối chiếu hồ sơ sân thực tế và quy định đang áp dụng trước khi phát hành chính thức. Tuyệt đối không công bố là sơ đồ sân Quyết Thắng chính xác.
- Chế độ DAT là bản chạy minh họa ngắn (không dùng GPS, không có dữ liệu giáo viên, chưa tích hợp thiết bị DAT); **không cộng quãng đường vào DAT chính thức**.
- Góc camera tự do và tương tác mobile cần test trên iPhone Safari và Android Chrome thật.

## Kiểm thử trước khi merge

1. Chạy `node --check public/sa-hinh/simulator.js`.
2. Chạy `node scripts/test-sa-hinh.cjs` để kiểm tra vòng render, wheel, camera và cách ly chế độ DAT.
3. Kiểm thử trực quan cả dọc/ngang với màn hình iPhone 375×667 và 393×852, Android 360×800 và desktop.
4. Kiểm thử đa điểm: giữ ga + xoay vô lăng; ga + phanh; kéo camera; pinch zoom; bấm giữ không chọn văn bản.
5. Kiểm lại 11 bài hạng B, 10 bài C1, độ chính xác biển/vạch và mốc căn bằng giáo viên hoặc bản vẽ sân chuẩn.
6. Chỉ merge khi qua QA và xác minh logo `/logo.png` đúng bản chính thức do Trung tâm cung cấp.

Tham chiếu UX: https://laixedehieu.online/ và https://laixehub.com/mo-phong-sa-hinh (đối chiếu ý tưởng học tương tác, không sao chép source code/thiết kế).
