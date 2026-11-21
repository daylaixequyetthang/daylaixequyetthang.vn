# QUYẾT THẮNG · Luyện Sa Hình — Phối Cảnh 3D V4 (BETA)

## Bản nâng cấp

Đây là bản nâng cấp cảnh 3D từ Mobile Cockpit V3, **không thay đổi CRM, không thêm thư viện/dịch vụ trả phí**.

### Đồ họa phối cảnh 3D mới
- Mặt đường phân đoạn theo tọa độ sa hình, có vai đường, độ cao, mép vạch trắng liên tục; xử lý hình cắt ở mặt phẳng gần camera (near-plane clipping), hạn chế mất hình ở góc cua.
- **Bỏ vạch vàng đứt tùy ý chạy giữa đường** của bản cũ; mỗi bài sử dụng vạch riêng để tránh hiểu sai hướng đi.
- Dốc cầu được dựng bằng bề mặt lên/dốc xuống và thành bên; camera được nâng theo cao độ. *Đây chỉ là hiệu ứng hình học; chưa có vật lý chống trôi dốc chính xác*.
- Bài người đi bộ: vạch dừng riêng và sọc qua đường; bài đèn đỏ: đèn ba màu theo thời gian; bài đường sắt: hai ray và tà vẹt; bài đỗ xe: ô đỗ có biên và cọc tiêu; bài đường hẹp và cua: các vạch đặc thù.
- Cọc giới hạn, bảng chỉ dẫn khóa học, cây xanh và nhà công trình dựng theo tọa độ 3D cố định, giữ vị trí khi xe chạy.
- Góc ghế lái **bên TRÁI theo xe Việt Nam**, có cột kính lái, gương trong, táp-lô, cụm đồng hồ, vô lăng và đèn xi nhan.
- Góc sau xe: xe B kiểu ô tô con; **xe C1 có khoang lái và thùng tải riêng**. Mô hình chỉ để minh họa tỷ lệ, chưa phải xe đào tạo thật.
- Chế độ sơ đồ trên cao kế thừa cùng tuyến đường và vạch bài học.

### Khung mobile V3 giữ nguyên
- Màn hình lái và vô lăng/ga/phanh/cần số hiện đồng thời trên cả mobile dọc và ngang.
- Mobile cho phép kéo vô lăng, nhấn giữ đồng thời nút ga/phanh; chọn bài trong drawer.
- Hỗ trợ chế độ tập trung, full screen (nếu trình duyệt hỗ trợ), không cuộn trong lúc lái trên các viewport đã thử.

## Kiểm thử

- `node --check public/sa-hinh/simulator.js` — PASS.
- Playwright Chromium: **10/10 kích thước** (320×568, 360×568, 375×667, 390×772, 430×882, 667×300, 844×322, 932×358, 1024×680, 1280×900).
- **32/32 lượt hiển thị bài học** gồm B số tự động (11), B số sàn (11), C1 (10), 0 lỗi JS.
- Kiểm tra hành vi phanh/ga, xe thực sự chuyển động, đổi góc nhìn cabin–bản đồ–sau xe, chọn C1, drawer mobile, vị trí điều khiển trong viewport.

## Phạm vi và giới hạn

- **Đây là renderer phối cảnh 3D bằng Canvas 2D**, không phải mô hình 3D WebGL/Three.js siêu thực. Nó có phép chiếu không gian, chiều cao và chuyển động thật theo vị trí xe, nhưng không cung cấp mô phỏng 3D vật lý đầy đủ.
- Sân/biển báo/vạch kẻ và kích thước được dựng **minh họa** từ tuyến bài của phiên bản V3, chưa đối chiếu với bản vẽ sân thật của Trung Tâm GDNN Quyết Thắng và quy trình sát hạch được cơ quan có thẩm quyền xác nhận.
- Chưa có trọng lực khi khởi hành trên dốc, va chạm vật lý xe/cọc, chuyển số tay thực tế, gương phản xạ động; quy tắc chấm điểm giữ nguyên bản V3 **mang tính tham khảo**.
- Test tự động trên Chromium desktop với viewport giả lập, **chưa test thiết bị iOS/Android thật**.
- Cần giáo viên và bộ phận chuyên môn duyệt từng loại xe, bài, vạch và điểm phạt trước khi công bố là công cụ luyện sát hạch chính xác.

## Cách thử

- Mở file `Quyet-Thang-Sa-Hinh-3D-V4-Interactive-Offline.html` trong Chrome / Edge; không cần máy chủ hoặc kết nối internet.
- Chọn hạng và bài trong menu ☰, cài dây an toàn, vào số D (số 1 với C1/sàn), nhấn giữ ga và đánh lái; nút ◉ đổi góc nhìn.
- Hoặc dùng thư mục `public/sa-hinh/` + `app/luyen-sa-hinh/page.js` trong Next.js 14 đã có sẵn trên repo của trung tâm (không overwrite code cho đến khi nghiệm thu).

## Trạng thái

**V4 được phân phối qua nhánh `main` của repository `daylaixequyetthang/daylaixequyetthang.vn` bằng Vercel.** Đường dẫn: `https://daylaixequyetthang.vn/luyen-sa-hinh`. Luôn ghi rõ BETA, chấm điểm tham khảo và cần đối soát chuyên môn.