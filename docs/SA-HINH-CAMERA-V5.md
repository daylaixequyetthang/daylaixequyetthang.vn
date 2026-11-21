# Quyết Thắng — Camera 3D V5 (BẢN NHÁP CHƯA ĐƯỢC ĐỐI CHIẾU VỚI WEBSITE THAM CHIẾU)

## Trạng thái
Bản cải tiến nội bộ của camera thứ 3. Website tham chiếu laixedehieu.online/drive?lesson=sa-hinh-b8&mode=easy không truy cập được bằng môi trường trình duyệt hiện có. KHÔNG khẳng định tương đồng với bản gốc. Không triển khai production trước khi người dùng duyệt.

## 4 chế độ góc nhìn
- 1/4 Sau xe 3D, bám theo xe.
- 2/4 Cabin ghế lái trái (xe Việt Nam), giữ logic lái.
- 3/4 Camera 3D từ trên cao, bám theo xe, có thể kéo ngang để xoay quanh xe, kéo dọc thay đổi độ cao; pinch zoom trên mobile, cuộn để zoom trên desktop; nút +, -, đặt lại.
- 4/4 Bản đồ 2D nhìn từ trên cao (chức năng cũ không bị loại bỏ).

## Chi tiết kỹ thuật
- Renderer Canvas thuần dựa trên camera orbital phối cảnh với góc nghiêng, không phụ thuộc thư viện ngoài.
- Camera thứ 3 dùng cùng tọa độ, góc quay, vật lý xe và geometries sa hình, tránh xe bị trôi khỏi mặt đường khi chuyển view.
- Duy trì responsive buồng lái trên mobile dọc/ngang. Hạn chế ngộ nhận: đây là mô phỏng học tập, không phải sân sát hạch chính thức.

## Kiểm thử tự động
- NodeJS `node --check public/sa-hinh/simulator.js` PASS.
- Playwright 10/10 viewport (320x568, 360x568, 375x667, 390x772, 430x882, 667x300, 844x322, 932x358, 1024x680, 1280x900): camera thứ 3 hiện, kéo xoay, nút zoom, reset, không tràn màn hình trên mobile, không lỗi JS.
- 32/32 lượt kiểm thử các bài B tự động / B số sàn / C1: không lỗi JS.
- Chưa thử thiết bị iOS, Android thực tế hoặc đối chiếu thực nghiệm sân.

## Cách thử
Mở Quyet-Thang-Camera-3D-V5-Tuong-Tac.html bằng Chrome hoặc Edge. Trên điện thoại, nút ◉ đổi góc nhìn từ cabin sang Camera 3D (CAM 3/4). Dùng ngón tay kéo trên cảnh để xoay, hai ngón zoom, hoặc nút − / ⟳ / +. Camera 4/4 vẫn là bản đồ.