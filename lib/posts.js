// 30 bài viết nạp sẵn cho website Quyết Thắng (tin tức / kinh nghiệm / kiến thức).
// Hiển thị ngay không cần Supabase. Khi có Supabase, dữ liệu DB được ưu tiên.
// content dùng Markdown đơn giản. Các số liệu học phí/luật mang tính tham khảo tại thời điểm viết.

export const POSTS = [
  {
    id: 'p01',
    slug: 'meo-thi-ly-thuyet-gplx-600-cau-de-dau',
    title: `Mẹo thi lý thuyết GPLX 600 câu dễ đậu cho người mới`,
    excerpt: `Tổng hợp cách ôn 600 câu hỏi lý thuyết hiệu quả, ghi nhớ nhanh và tránh các lỗi khiến thí sinh trượt oan.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['mẹo thi', 'lý thuyết', '600 câu'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-06-15',
    cover_url: '',
    content: `## Học đúng cách thay vì học vẹt

Bộ 600 câu hỏi lý thuyết mới của Bộ Công an (áp dụng từ 01/6/2025) được thiết kế để hạn chế học tủ. Vì vậy, cách ôn hiệu quả nhất là **hiểu bản chất** thay vì cố nhớ máy móc.

## Chia nhỏ theo từng chương

Bộ đề chia thành 6 chương. Bạn nên ôn lần lượt, chắc chương này mới sang chương khác:

- Khái niệm và quy tắc giao thông (180 câu)
- Văn hóa, đạo đức người lái xe (25 câu)
- Kỹ thuật lái xe (58 câu)
- Cấu tạo và sửa chữa (37 câu)
- Biển báo đường bộ (185 câu)
- Sa hình (115 câu)

## Ưu tiên 60 câu điểm liệt

Trong đề thi luôn có 1 câu điểm liệt — sai là trượt ngay dù các câu khác đúng hết. Hãy học thật kỹ nhóm câu về nồng độ cồn, ma túy, tốc độ, nhường đường và các hành vi bị nghiêm cấm.

## Luyện đề thử nhiều lần

Làm đi làm lại các đề thi thử cho đến khi quen áp lực thời gian. Bạn có thể luyện miễn phí ngay trên website của trung tâm với đầy đủ 600 câu kèm hình ảnh.

## Lưu ý khi đi thi

- Đọc kỹ câu hỏi, đặc biệt các câu có chữ "không", "bị cấm".
- Với câu biển báo, nhìn kỹ hình trước khi chọn.
- Không bỏ trống câu nào; còn thời gian nên rà soát lại.

Chúc bạn ôn tập tốt và thi đậu ngay lần đầu!`,
  },
  {
    id: 'p02',
    slug: 'ho-so-can-gi-de-hoc-lai-xe',
    title: `Hồ sơ cần chuẩn bị gì để đăng ký học lái xe?`,
    excerpt: `Danh sách giấy tờ cần chuẩn bị khi đăng ký học lái xe ô tô, xe máy và những lưu ý để hồ sơ được duyệt nhanh.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['hồ sơ', 'thủ tục', 'đăng ký'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-06-12',
    cover_url: '',
    content: `## Giấy tờ cơ bản cần có

Để đăng ký học lái xe, bạn cần chuẩn bị:

- **CMND/CCCD** (bản photo hoặc bản gốc để đối chiếu).
- **Ảnh thẻ** theo quy định (trung tâm hướng dẫn kích thước cụ thể).
- **Giấy khám sức khỏe** do cơ sở y tế đủ điều kiện cấp.

## Về giấy khám sức khỏe

Đây là giấy bắt buộc, xác nhận bạn đủ điều kiện sức khỏe lái xe. Trung tâm sẽ hướng dẫn bạn khám ở đâu cho thuận tiện và đúng quy định.

## Điều kiện về độ tuổi

Tùy hạng bằng sẽ có yêu cầu độ tuổi khác nhau. Ví dụ hạng B (ô tô con) yêu cầu đủ 18 tuổi. Bạn nên hỏi trung tâm để biết chính xác cho hạng mình muốn học.

## Quy trình tại Quyết Thắng

Bạn chỉ cần mang CCCD đến, các bước còn lại trung tâm hỗ trợ trọn gói: chụp ảnh, hướng dẫn khám sức khỏe, hoàn thiện hồ sơ. Liên hệ 084 875 1111 để được tư vấn chi tiết.

*Lưu ý: quy định về hồ sơ có thể thay đổi, vui lòng liên hệ trung tâm để có thông tin mới nhất.*`,
  },
  {
    id: 'p03',
    slug: 'phan-biet-cac-loai-bien-bao-giao-thong',
    title: `Phân biệt 4 nhóm biển báo giao thông đường bộ`,
    excerpt: `Biển báo giao thông chia thành các nhóm chính. Hiểu rõ ý nghĩa từng nhóm giúp bạn lái xe đúng luật và an toàn.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['biển báo', 'luật giao thông', 'kiến thức'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-06-09',
    cover_url: '',
    content: `## Vì sao cần hiểu biển báo?

Biển báo là "ngôn ngữ" của đường bộ. Hiểu đúng biển báo giúp bạn đi đúng luật, tránh bị phạt và lái an toàn.

## 4 nhóm biển báo chính

**1. Biển báo cấm** — hình tròn, viền đỏ, nền trắng. Báo điều không được làm (cấm rẽ, cấm dừng, cấm xe tải...).

**2. Biển báo nguy hiểm và cảnh báo** — hình tam giác, viền đỏ, nền vàng. Cảnh báo nguy hiểm phía trước (chỗ ngoặt, trẻ em, đường sắt...).

**3. Biển hiệu lệnh** — hình tròn, nền xanh dương. Bắt buộc phải làm theo (đi thẳng, rẽ phải, tốc độ tối thiểu...).

**4. Biển chỉ dẫn** — hình vuông/chữ nhật, nền xanh. Cung cấp thông tin hướng đi, địa danh, tiện ích.

## Ngoài ra còn có

- Biển phụ (đặt kèm biển chính để bổ sung ý nghĩa).
- Vạch kẻ đường (cũng là một dạng báo hiệu).

Học viên có thể luyện nhận biết biển báo qua phần thi thử có hình ảnh thật trên website Quyết Thắng.`,
  },
  {
    id: 'p04',
    slug: 'kinh-nghiem-thi-sa-hinh-do-xe',
    title: `Kinh nghiệm thi sa hình: 11 bài thi và lỗi thường gặp`,
    excerpt: `Hướng dẫn vượt qua phần thi sa hình tự tin: thứ tự các bài, lỗi hay mắc và cách giữ bình tĩnh trên xe.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['sa hình', 'thi thực hành', 'kinh nghiệm'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-06-06',
    cover_url: '',
    content: `## Sa hình là gì?

Sa hình là phần thi thực hành trong sân, kiểm tra khả năng điều khiển xe qua các bài như xuất phát, dừng và khởi hành ngang dốc, qua vệt bánh xe, ghép xe dọc/ngang, dừng nhường đường cho người đi bộ...

## Những lỗi khiến trượt nhiều nhất

- Quên thắt dây an toàn, quên bật xi-nhan khi xuất phát.
- Chết máy khi khởi hành ngang dốc (đề-pa).
- Cán vạch, chạm vỉa khi ghép xe.
- Không dừng đúng vạch ở bài dừng xe nhường đường.

## Mẹo giữ bình tĩnh

Phần lớn thí sinh trượt sa hình không phải vì không biết lái, mà vì **hồi hộp**. Hãy hít thở sâu, đi chậm và chắc. Tốc độ chậm giúp bạn kiểm soát xe tốt hơn nhiều.

## Luyện tập là chìa khóa

Không có mẹo nào thay được việc luyện đủ giờ trên sân. Học viên Quyết Thắng được bố trí giờ thực hành đầy đủ với xe và sân tập đúng chuẩn sát hạch.`,
  },
  {
    id: 'p05',
    slug: 'hoc-phi-hoc-lai-xe-gom-nhung-gi',
    title: `Học phí học lái xe gồm những gì? Có phát sinh không?`,
    excerpt: `Giải đáp học phí học lái xe bao gồm những khoản nào, có chi phí phát sinh không và cách tránh "học phí ảo".`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['học phí', 'chi phí', 'tư vấn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-06-03',
    cover_url: '',
    content: `## Học phí trọn gói gồm những gì?

Một gói học phí minh bạch thường đã bao gồm:

- Học lý thuyết và phần mềm ôn thi.
- Học thực hành: xe tập, xăng dầu, sân bãi.
- Giờ học đường trường DAT.
- Lệ phí thi tốt nghiệp tại trung tâm.

## Cẩn thận với "học phí ảo"

Một số nơi báo giá rẻ ban đầu nhưng phát sinh nhiều khoản: phí thuê xe theo giờ, phí thi lại, phí xăng... Khi cộng lại có khi đắt hơn. Hãy hỏi rõ **trọn gói đã gồm những gì** trước khi đăng ký.

## Các khoản có thể đóng thêm

Một số khoản theo quy định nhà nước, ví dụ lệ phí thi sát hạch tại sân của cơ quan công an. Trung tâm uy tín sẽ nói rõ khoản này ngay từ đầu.

## Cam kết tại Quyết Thắng

Học phí trọn gói, cam kết không phát sinh — đã gồm xăng, xe, sân bãi, đường trường DAT và lệ phí thi tốt nghiệp. Liên hệ 084 875 1111 để nhận báo giá chi tiết theo từng hạng.`,
  },
  {
    id: 'p06',
    slug: 'quy-tac-nhuong-duong-tai-nga-tu',
    title: `Quy tắc nhường đường tại nơi giao nhau (ngã tư)`,
    excerpt: `Nhường đường sai tại ngã tư là lỗi phổ biến và nguy hiểm. Bài viết giải thích thứ tự ưu tiên dễ nhớ.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['nhường đường', 'sa hình', 'luật'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-31',
    cover_url: '',
    content: `## Vì sao quy tắc nhường đường quan trọng?

Tại nơi giao nhau không có đèn tín hiệu, nếu ai cũng cố đi trước sẽ gây ùn tắc và tai nạn. Quy tắc nhường đường giúp giao thông trật tự, an toàn.

## Thứ tự ưu tiên cơ bản

Nguyên tắc chung về thứ tự được đi (từ ưu tiên cao đến thấp):

1. **Xe ưu tiên** đang làm nhiệm vụ (cứu hỏa, cứu thương, công an, quân sự).
2. Xe trong **vòng xuyến** (theo quy định cụ thể của nút giao).
3. Xe đến từ **bên phải** của mình (nhường đường cho xe bên phải).
4. Xe đi thẳng/rẽ phải thường được ưu tiên hơn xe rẽ trái.

## Mẹo nhớ cho phần sa hình

Trong các câu sa hình, hãy xác định: có xe ưu tiên không → xe nào trong vòng xuyến → xe nào bên phải. Áp dụng thứ tự này sẽ ra đáp án.

## Thực tế khi lái xe

Dù mình có quyền đi trước, vẫn nên quan sát kỹ và nhường khi cần để tránh va chạm. An toàn quan trọng hơn việc giành đường.

Luyện các câu sa hình thực tế trên website trung tâm để thành thạo quy tắc này.`,
  },
  {
    id: 'p07',
    slug: 'cach-de-pa-len-doc-khong-chet-may',
    title: `Cách đề-pa lên dốc không chết máy, không tụt xe`,
    excerpt: `Hướng dẫn chi tiết kỹ thuật khởi hành ngang dốc với xe số sàn và số tự động, tránh chết máy và tụt dốc.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['đề-pa', 'lên dốc', 'kỹ thuật'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-28',
    cover_url: '',
    content: `## Vì sao đề-pa khó?

Khởi hành ngang dốc (đề-pa) là bài làm nhiều thí sinh lo nhất, vì phải phối hợp côn — ga — phanh tay cùng lúc trên xe số sàn.

## Với xe số sàn

1. Dừng xe đúng vạch, kéo phanh tay.
2. Vào số 1, nhả côn từ từ đến khi thấy xe hơi rung (điểm bám côn).
3. Giữ nguyên chân côn, nhẹ nhàng thêm ga.
4. Nhả phanh tay từ từ — xe sẽ tiến lên mà không tụt.

## Với xe số tự động

Đơn giản hơn nhiều: nhả phanh chân, đệm nhẹ ga là xe lên dốc. Đây là một lý do nhiều người chọn học số tự động.

## Lỗi thường gặp

- Nhả côn quá nhanh → chết máy.
- Nhả phanh tay quá sớm → tụt dốc.
- Thiếu ga → xe không đủ lực lên dốc.

Hãy luyện nhiều lần để cảm nhận điểm bám côn — khi đã quen, đề-pa sẽ rất nhẹ nhàng.`,
  },
  {
    id: 'p08',
    slug: 'hoc-truoc-tra-sau-la-gi',
    title: `Học trước trả sau là gì? Có phù hợp với bạn không?`,
    excerpt: `Giải thích hình thức học trước trả sau giúp giảm áp lực tài chính khi học lái xe, điều kiện và cách đăng ký.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['học trước trả sau', 'học phí', 'chính sách'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-25',
    cover_url: '',
    content: `## Học trước trả sau là gì?

Đây là chính sách cho phép bạn **bắt đầu học mà chưa cần đóng đủ học phí ngay**, giảm áp lực tài chính. Bạn đóng trước một khoản giữ chỗ, phần còn lại chia ra đóng dần theo tiến độ.

## Phù hợp với ai?

- Người muốn học ngay nhưng chưa gom đủ học phí một lúc.
- Sinh viên, người mới đi làm muốn chủ động sắp xếp tài chính.

## Cách thức tại Quyết Thắng

- Đóng trước **2.000.000đ** để giữ chỗ vào khóa.
- Đóng đủ 50% là chính thức vào học.
- Phần còn lại chia nhỏ, đóng dần.
- Có thể bảo lưu tối đa 1 năm nếu chưa sắp xếp được lịch học.

## Đăng ký thế nào?

Bạn có thể đặt cọc giữ chỗ online ngay trên website (quét mã QR chuyển khoản) hoặc đến văn phòng. Liên hệ 084 875 1111 để được tư vấn gói phù hợp.`,
  },
  {
    id: 'p09',
    slug: 'nong-do-con-khi-lai-xe-quy-dinh',
    title: `Quy định về nồng độ cồn khi lái xe cần biết`,
    excerpt: `Lái xe khi có nồng độ cồn là hành vi nguy hiểm và bị xử lý nghiêm. Bài viết tổng hợp quy định và lý do nên tuyệt đối tránh.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['nồng độ cồn', 'luật', 'an toàn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-22',
    cover_url: '',
    content: `## Quy định hiện hành

Pháp luật Việt Nam quy định **nghiêm cấm điều khiển phương tiện khi trong máu hoặc hơi thở có nồng độ cồn**. Đây cũng là một trong những nhóm câu điểm liệt trong đề thi lý thuyết.

## Vì sao tuyệt đối không lái khi đã uống?

- Rượu bia làm giảm phản xạ, sai lệch phán đoán khoảng cách, tốc độ.
- Tăng nguy cơ gây tai nạn nghiêm trọng cho mình và người khác.
- Bị xử phạt nặng: phạt tiền, tước giấy phép lái xe, thậm chí xử lý hình sự nếu gây hậu quả.

## Câu điểm liệt liên quan

Trong đề thi sát hạch, các câu về nồng độ cồn thuộc nhóm điểm liệt — chọn sai là trượt ngay. Hãy nhớ nguyên tắc: **đã uống rượu bia thì không lái xe**.

## Giải pháp an toàn

Nếu đã uống, hãy gọi taxi, xe ôm công nghệ hoặc nhờ người khác chở. Đừng đánh đổi an toàn và pháp luật chỉ vì một quãng đường ngắn.

*Mức phạt cụ thể được quy định tại các văn bản pháp luật và có thể thay đổi; vui lòng tham khảo quy định mới nhất.*`,
  },
  {
    id: 'p10',
    slug: 'lai-xe-an-toan-khi-troi-mua',
    title: `7 lưu ý lái xe an toàn khi trời mưa, đường trơn`,
    excerpt: `Trời mưa làm tầm nhìn giảm và đường trơn trượt. Đây là 7 nguyên tắc giúp bạn lái xe an toàn hơn trong mưa.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['lái xe an toàn', 'trời mưa', 'kỹ năng'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-19',
    cover_url: '',
    content: `## Vì sao lái xe trời mưa nguy hiểm?

Mưa làm giảm tầm nhìn, mặt đường trơn khiến quãng đường phanh dài hơn, và xe dễ bị trượt nước (thủy phi).

## 7 lưu ý quan trọng

1. **Giảm tốc độ** — nguyên tắc số một khi trời mưa.
2. **Giữ khoảng cách an toàn** xa hơn bình thường vì phanh ăn chậm hơn.
3. **Bật đèn** để xe khác dễ nhận ra bạn (đèn cốt, không bật đèn pha gây chói).
4. **Không phanh gấp**, đạp phanh nhẹ nhàng nhiều lần.
5. **Tránh vũng nước lớn** — có thể che ổ gà hoặc gây trượt nước.
6. **Bật gạt mưa và sấy kính** để giữ tầm nhìn rõ.
7. **Không vượt ẩu** khi tầm nhìn hạn chế.

## Khi xe bị trượt nước

Giữ vô lăng thẳng, nhả ga từ từ, **không phanh gấp**. Đợi lốp bám lại mặt đường rồi mới điều chỉnh.

Lái xe an toàn không phải đi nhanh, mà là về đến nhà an toàn.`,
  },
  {
    id: 'p11',
    slug: 'cac-hang-bang-lai-xe-2025',
    title: `Các hạng bằng lái xe mới 2025 và loại xe được lái`,
    excerpt: `Từ 2025, hệ thống hạng giấy phép lái xe có thay đổi. Bài viết tổng hợp các hạng phổ biến và loại xe được phép lái.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['hạng bằng', 'GPLX', 'quy định'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-16',
    cover_url: '',
    content: `## Hệ thống hạng GPLX cập nhật

Theo Luật Trật tự, an toàn giao thông đường bộ, hệ thống hạng giấy phép lái xe đã được sắp xếp lại. Dưới đây là các hạng phổ biến (mang tính tham khảo, vui lòng đối chiếu quy định mới nhất):

- **Hạng A1**: xe mô tô hai bánh dung tích nhỏ.
- **Hạng A**: xe mô tô hai bánh phân khối lớn hơn.
- **Hạng B**: xe ô tô chở người đến 8 chỗ (không kể ghế lái); xe tải nhỏ đến 3.500 kg.
- **Hạng C1**: xe tải có khối lượng từ 3.500 kg đến 7.500 kg.
- **Hạng C**: xe tải trên 7.500 kg.

## Chọn hạng nào?

- Lái xe gia đình 4-7 chỗ: hạng **B**.
- Lái xe tải nhỏ: hạng **C1**.
- Lái xe tải lớn: hạng **C**.

## Tư vấn chọn đúng hạng

Chọn sai hạng sẽ mất thời gian và chi phí. Liên hệ Quyết Thắng 084 875 1111 để được tư vấn chọn hạng phù hợp với nhu cầu và công việc của bạn.

*Quy định về hạng GPLX có thể được điều chỉnh; bài viết sẽ cập nhật khi có thay đổi chính thức.*`,
  },
  {
    id: 'p12',
    slug: 'quy-dinh-toc-do-cho-xe-o-to',
    title: `Quy định tốc độ tối đa cho xe ô tô theo từng loại đường`,
    excerpt: `Chạy quá tốc độ là lỗi bị phạt phổ biến. Bài viết tổng hợp nguyên tắc về tốc độ tối đa theo loại đường (tham khảo).`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['tốc độ', 'luật giao thông', 'kiến thức'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-13',
    cover_url: '',
    content: `## Vì sao phải tuân thủ tốc độ?

Tốc độ phù hợp giúp bạn kịp xử lý tình huống, giảm quãng đường phanh và mức độ nghiêm trọng nếu xảy ra va chạm.

## Nguyên tắc chung về tốc độ

Tốc độ tối đa phụ thuộc vào:

- **Loại đường**: trong khu dân cư, ngoài khu dân cư, đường đôi, đường cao tốc.
- **Loại xe**: xe con, xe tải, xe khách có giới hạn khác nhau.
- **Biển báo tốc độ** đặt trên đường (luôn ưu tiên tuân theo biển báo).

## Lưu ý quan trọng

- Trong khu đông dân cư, tốc độ bị giới hạn thấp hơn để bảo đảm an toàn.
- Khi có biển báo tốc độ, phải tuân theo biển dù đường cho phép cao hơn.
- Giữ khoảng cách an toàn tương ứng với tốc độ.

## Khi đi thi

Các câu về tốc độ tối đa và khoảng cách an toàn xuất hiện nhiều trong đề. Hãy nắm chắc các con số theo từng loại đường.

*Các giá trị tốc độ cụ thể được quy định trong văn bản pháp luật hiện hành và có thể thay đổi; nên đối chiếu quy định mới nhất khi ôn thi.*`,
  },
  {
    id: 'p13',
    slug: '5-loi-lai-xe-moi-thuong-mac',
    title: `5 lỗi tài xế mới thường mắc và cách khắc phục`,
    excerpt: `Mới có bằng và bắt đầu lái xe ra đường? Đây là 5 lỗi phổ biến của tài mới và cách sửa để lái tự tin hơn.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['tài mới', 'lỗi lái xe', 'kinh nghiệm'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-10',
    cover_url: '',
    content: `## 1. Ôm vô lăng quá chặt

Tài mới thường căng thẳng, nắm vô lăng rất chặt khiến tay mỏi và phản xạ kém. Hãy thả lỏng, đặt tay ở vị trí 9 giờ và 3 giờ.

## 2. Nhìn quá gần đầu xe

Nhiều người mới chỉ nhìn ngay trước mũi xe. Hãy nhìn xa hơn về phía trước để dự đoán tình huống sớm.

## 3. Quên quan sát gương

Trước khi chuyển làn, rẽ hay lùi, phải liếc gương và quan sát điểm mù. Tập thói quen này ngay từ đầu.

## 4. Đạp nhầm chân ga/phanh

Lỗi nguy hiểm nhất. Luôn đặt gót chân cố định, chỉ xoay mũi chân giữa ga và phanh. Khi không tăng tốc, chân để hờ ở phanh.

## 5. Sợ đường đông, đường lớn

Càng tránh càng không quen. Hãy tập dần từ đường vắng đến đông, có người ngồi cạnh hướng dẫn.

Lái xe là kỹ năng — càng luyện càng tự tin. Đừng nản nếu lúc đầu còn lóng ngóng.`,
  },
  {
    id: 'p14',
    slug: 'quy-trinh-hoc-lai-xe-tu-a-den-z',
    title: `Quy trình học lái xe ô tô từ A đến Z`,
    excerpt: `Bạn chưa biết học lái xe gồm những bước nào? Bài viết mô tả toàn bộ quy trình từ đăng ký đến khi nhận bằng.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['quy trình', 'học lái xe', 'hướng dẫn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-07',
    cover_url: '',
    content: `## Bước 1: Đăng ký và nộp hồ sơ

Chuẩn bị CCCD, ảnh thẻ, khám sức khỏe. Trung tâm hỗ trợ hoàn thiện hồ sơ.

## Bước 2: Học lý thuyết

Học bộ 600 câu hỏi lý thuyết, có thể học tại trung tâm hoặc tự học có hướng dẫn, kết hợp luyện đề thi thử.

## Bước 3: Học thực hành

- Tập sa hình trong sân (các bài thi chuẩn).
- Học lái đường trường DAT (đủ số km, giờ theo quy định).

## Bước 4: Thi tốt nghiệp tại trung tâm

Kiểm tra trước khi đủ điều kiện dự thi sát hạch.

## Bước 5: Thi sát hạch

Thi lý thuyết, mô phỏng (nếu còn áp dụng), sa hình và đường trường tại trung tâm sát hạch của cơ quan chức năng.

## Bước 6: Nhận bằng

Sau khi đậu, khoảng 2-3 ngày bằng được cập nhật trên ứng dụng VNeTraffic để sử dụng; bằng cứng nhận sau theo lịch.

Toàn bộ quá trình thường mất 2-2,5 tháng với hạng B. Liên hệ 084 875 1111 để biết lịch khai giảng gần nhất.`,
  },
  {
    id: 'p15',
    slug: 'y-nghia-vach-ke-duong',
    title: `Ý nghĩa các loại vạch kẻ đường thường gặp`,
    excerpt: `Vạch kẻ đường cũng là báo hiệu giao thông quan trọng. Hiểu vạch giúp bạn đi đúng làn, vượt xe đúng luật.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['vạch kẻ đường', 'luật', 'kiến thức'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-04',
    cover_url: '',
    content: `## Vạch kẻ đường là gì?

Vạch kẻ đường là một dạng báo hiệu giao thông, dùng để phân chia làn, hướng dẫn hướng đi, vị trí dừng và những điều được/không được làm.

## Các loại vạch thường gặp

**Vạch liền** (màu trắng hoặc vàng): không được đè lên, không được lấn làn/vượt qua. Thường phân chia hai chiều xe chạy hoặc giới hạn làn.

**Vạch đứt nét**: được phép cắt qua khi cần (chuyển làn, vượt xe) nếu bảo đảm an toàn.

**Vạch vàng**: thường phân chia hai chiều xe ngược nhau.

**Vạch trắng**: thường phân chia các làn xe cùng chiều.

## Lưu ý khi lái xe

- Vạch liền màu vàng giữa đường: tuyệt đối không lấn sang chiều ngược lại.
- Vạch mắt võng, vạch dừng, vạch người đi bộ: cần chú ý dừng và nhường đúng quy định.

## Khi đi thi

Câu hỏi về vạch kẻ đường xuất hiện trong nhóm biển báo. Hãy phân biệt rõ vạch liền và vạch đứt để trả lời đúng.`,
  },
  {
    id: 'p16',
    slug: 'cach-ghi-nho-bien-bao-nhanh',
    title: `Cách ghi nhớ biển báo giao thông nhanh theo nhóm`,
    excerpt: `185 câu biển báo là phần nhiều nhất trong đề. Đây là cách phân nhóm và ghi nhớ biển báo nhanh, nhớ lâu.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['biển báo', 'mẹo nhớ', 'lý thuyết'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-05-01',
    cover_url: '',
    content: `## Phân loại biển báo theo hình dạng và màu

Nhớ theo quy luật hình — màu sẽ dễ hơn nhớ từng biển:

- **Tròn, viền đỏ, nền trắng**: biển cấm.
- **Tam giác, viền đỏ, nền vàng**: biển báo nguy hiểm, cảnh báo.
- **Tròn, nền xanh dương**: biển hiệu lệnh (bắt buộc làm theo).
- **Vuông/chữ nhật, nền xanh**: biển chỉ dẫn.

## Mẹo cho nhóm biển cấm

Biển cấm thường có hình vẽ thứ bị cấm bên trong vòng tròn đỏ. Ví dụ vẽ xe tải gạch chéo là cấm xe tải.

## Mẹo cho biển nguy hiểm

Hình tam giác vàng luôn là "cảnh báo phía trước có…": chỗ ngoặt, dốc, trẻ em, đường sắt...

## Luyện bằng hình thật

Lý thuyết suông khó nhớ. Hãy luyện phần thi thử có hình ảnh biển báo thật trên website trung tâm để vừa học vừa nhìn, nhớ lâu hơn nhiều.`,
  },
  {
    id: 'p17',
    slug: 'thoi-gian-hoc-lai-xe-bao-lau',
    title: `Học lái xe mất bao lâu thì thi và có bằng?`,
    excerpt: `Thời gian học lái xe phụ thuộc vào hạng bằng và lịch học. Bài viết giúp bạn ước lượng thời gian cho từng hạng.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['thời gian học', 'tiến độ', 'tư vấn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-28',
    cover_url: '',
    content: `## Thời gian học theo hạng

Thời gian học phụ thuộc vào hạng bằng và mức độ chuyên cần:

- **Hạng B (ô tô con)**: khoảng 2 - 2,5 tháng.
- **Hạng C1 (xe tải nhỏ)**: khoảng 3 - 3,5 tháng.
- **Hạng A1 (xe máy)**: nhanh, thường chỉ vài buổi ôn rồi thi.

## Yếu tố ảnh hưởng thời gian

- Lịch khai giảng của khóa.
- Tiến độ học lý thuyết và thực hành của bạn.
- Lịch thi sát hạch do cơ quan chức năng sắp xếp.

## Sau khi thi đậu bao lâu có bằng?

Thông thường sau khi thi đậu khoảng **2-3 ngày**, bằng được cập nhật trên ứng dụng VNeTraffic để bạn sử dụng hợp pháp. Bằng cứng sẽ nhận sau.

## Theo dõi tiến độ

Học viên Quyết Thắng có thể tra cứu lịch khai giảng, lịch thi và tiến độ học của mình ngay trên website bằng CCCD hoặc số điện thoại. Liên hệ 084 875 1111 nếu cần hỗ trợ.`,
  },
  {
    id: 'p18',
    slug: 'xe-uu-tien-gom-nhung-loai-nao',
    title: `Xe ưu tiên gồm những loại nào? Thứ tự ra sao?`,
    excerpt: `Biết các loại xe ưu tiên và thứ tự của chúng giúp bạn nhường đường đúng luật và làm tốt câu hỏi sa hình.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['xe ưu tiên', 'luật', 'nhường đường'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-25',
    cover_url: '',
    content: `## Xe ưu tiên là gì?

Xe ưu tiên là những xe khi đi làm nhiệm vụ khẩn cấp được quyền đi trước, các xe khác phải nhường đường.

## Các loại xe ưu tiên (thứ tự ưu tiên)

Theo quy định, thứ tự ưu tiên thường là:

1. Xe chữa cháy đi làm nhiệm vụ.
2. Xe quân sự, xe công an đi làm nhiệm vụ khẩn cấp.
3. Xe cứu thương đang thực hiện nhiệm vụ cấp cứu.
4. Xe hộ đê, xe đi làm nhiệm vụ khẩn cấp theo quy định.
5. Đoàn xe tang.

## Khi gặp xe ưu tiên

Phải nhanh chóng giảm tốc độ, đi sát lề hoặc dừng lại để nhường đường, **không được cản trở** xe ưu tiên.

## Trong câu hỏi sa hình

Khi có xe ưu tiên trong hình, xe đó luôn được đi trước. Đây là bước đầu tiên cần xác định khi giải các câu thứ tự xe đi.

Luyện các câu sa hình có xe ưu tiên trên website trung tâm để nhớ rõ thứ tự này.`,
  },
  {
    id: 'p19',
    slug: 'chon-hoc-so-san-hay-so-tu-dong',
    title: `Nên học lái số sàn hay số tự động? So sánh chi tiết`,
    excerpt: `Phân vân chọn học bằng số sàn hay số tự động? Bài viết so sánh ưu nhược điểm để bạn chọn đúng nhu cầu.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['số sàn', 'số tự động', 'tư vấn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-22',
    cover_url: '',
    content: `## Khác nhau cơ bản

- **Số sàn (số cơ khí)**: tự điều khiển côn và chuyển số. Khó hơn nhưng lái được mọi loại xe.
- **Số tự động**: xe tự chuyển số, chỉ có ga và phanh. Dễ học, dễ lái.

## Ưu điểm số tự động

- Học nhanh, thi dễ đậu hơn (không lo chết máy, đề-pa nhẹ nhàng).
- Lái trong phố đông nhàn hơn nhiều.
- Phù hợp người chỉ lái xe cá nhân.

## Ưu điểm số sàn

- Lái được cả xe số sàn lẫn số tự động.
- Linh hoạt khi cần thuê/mượn xe.

## Nên chọn loại nào?

Nếu chỉ lái xe gia đình trong phố, **số tự động** là lựa chọn thoải mái. Nếu muốn lái được mọi loại xe hoặc làm nghề liên quan, nên học **số sàn**.

Tại Quyết Thắng, học phí hạng B áp dụng như nhau cho cả số tự động và số cơ khí, nên bạn cứ chọn theo nhu cầu. Liên hệ 084 875 1111 để được tư vấn.`,
  },
  {
    id: 'p20',
    slug: 'nang-hang-bang-lai-xe-can-dieu-kien-gi',
    title: `Nâng hạng bằng lái xe cần điều kiện gì?`,
    excerpt: `Muốn nâng hạng từ B lên C, hay lên D2 để lái xe khách? Bài viết tổng hợp điều kiện và lộ trình nâng hạng.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['nâng hạng', 'điều kiện', 'GPLX'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-19',
    cover_url: '',
    content: `## Vì sao cần nâng hạng?

Nâng hạng giúp bạn lái được loại xe lớn hơn, mở ra cơ hội nghề nghiệp (lái xe tải, xe khách...).

## Các lộ trình nâng hạng phổ biến

- Nâng **B/C1 → C** (lái xe tải lớn).
- Nâng **B → D2** (lái xe khách).
- Nâng **C1/C → D2**.

## Điều kiện chung

Nâng hạng thường yêu cầu:

- Có bằng hạng thấp hơn đủ thời gian theo quy định.
- Đủ số km lái xe an toàn (tùy hạng).
- Đủ điều kiện sức khỏe, độ tuổi cho hạng mới.

## Chi phí tham khảo tại Quyết Thắng

- Nâng B/C1 → C: 10.500.000đ
- Nâng B → D2: 11.500.000đ
- Nâng C1/C → D2: 10.500.000đ

*Mức phí và điều kiện có thể thay đổi. Liên hệ 084 875 1111 để được tư vấn lộ trình cụ thể phù hợp với bằng hiện có của bạn.*`,
  },
  {
    id: 'p21',
    slug: 'khoang-cach-an-toan-giua-hai-xe',
    title: `Khoảng cách an toàn giữa hai xe khi lái trên đường`,
    excerpt: `Giữ khoảng cách an toàn giúp bạn kịp phanh khi xe trước dừng đột ngột. Bài viết giải thích nguyên tắc cần nhớ.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['khoảng cách an toàn', 'luật', 'an toàn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-16',
    cover_url: '',
    content: `## Vì sao cần giữ khoảng cách?

Khi xe trước phanh gấp, bạn cần đủ khoảng cách để phản ứng và dừng lại an toàn. Bám đuôi quá sát là nguyên nhân nhiều vụ va chạm liên hoàn.

## Nguyên tắc về khoảng cách

Khoảng cách an toàn tối thiểu phụ thuộc vào **tốc độ** và **điều kiện mặt đường**:

- Tốc độ càng cao, khoảng cách càng phải lớn.
- Đường trơn, mưa, sương mù: tăng khoảng cách hơn bình thường.

## Cách ước lượng đơn giản

Một mẹo phổ biến là **quy tắc khoảng cách theo giây**: chọn một mốc cố định bên đường, khi xe trước đi qua mốc đó, đếm thời gian đến khi xe bạn tới mốc — nên duy trì tối thiểu vài giây tùy tốc độ.

## Khi gặp biển báo cự ly tối thiểu

Có loại biển báo quy định cự ly tối thiểu giữa hai xe — phải tuân theo. Câu hỏi về biển này xuất hiện trong phần biển báo.

*Các giá trị khoảng cách cụ thể theo tốc độ được quy định trong văn bản pháp luật; tham khảo quy định mới nhất khi ôn thi.*`,
  },
  {
    id: 'p22',
    slug: 'lam-quen-xe-truoc-khi-lai',
    title: `Cách làm quen với xe trước khi bắt đầu lái`,
    excerpt: `Trước khi nổ máy lăn bánh, hãy dành vài phút làm quen với xe. Đây là checklist giúp tài mới tự tin hơn.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['tài mới', 'làm quen xe', 'kỹ năng'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-13',
    cover_url: '',
    content: `## Điều chỉnh trước khi đi

1. **Ghế ngồi**: chỉnh sao cho chân đạp hết phanh vẫn hơi cong, lưng thẳng thoải mái.
2. **Gương chiếu hậu**: chỉnh gương trong và 2 gương ngoài để bao quát tối đa, giảm điểm mù.
3. **Vô lăng**: chỉnh độ cao/xa vừa tầm tay.
4. **Dây an toàn**: luôn thắt trước khi nổ máy.

## Làm quen các nút cơ bản

Tìm vị trí: đèn xi-nhan, đèn pha/cốt, gạt mưa, còi, phanh tay, nút điều hòa. Biết trước để khi cần không phải dò.

## Tập cảm nhận chân ga, phanh

Khi xe đứng yên (số N, phanh tay kéo), đệm nhẹ chân ga để cảm nhận độ nhạy. Làm quen lực đạp phanh.

## Đi chậm ở nơi vắng trước

Buổi đầu nên tập ở sân rộng hoặc đường vắng, có thầy/người có kinh nghiệm ngồi cạnh. Khi đã quen mới ra đường đông.

Sự tự tin đến từ việc hiểu chiếc xe của mình. Đừng vội!`,
  },
  {
    id: 'p23',
    slug: 'vneTraffic-bang-lai-xe-dien-tu',
    title: `VNeTraffic là gì? Bằng lái xe điện tử dùng thế nào?`,
    excerpt: `Sau khi thi đậu, bằng lái được tích hợp trên ứng dụng VNeTraffic. Bài viết hướng dẫn cách dùng bằng lái điện tử.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['VNeTraffic', 'bằng điện tử', 'hướng dẫn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-10',
    cover_url: '',
    content: `## VNeTraffic là gì?

VNeTraffic là ứng dụng tích hợp thông tin giấy phép lái xe và các tiện ích giao thông. Sau khi thi đậu, thông tin bằng lái của bạn được cập nhật lên đây.

## Lợi ích của bằng lái điện tử

- Xuất trình nhanh khi cần, không lo quên bằng cứng.
- Tra cứu thông tin, điểm bằng lái thuận tiện.
- Cập nhật nhanh sau khi thi đậu (thường 2-3 ngày).

## Cách sử dụng

1. Tải ứng dụng VNeTraffic về điện thoại.
2. Đăng ký/đăng nhập theo hướng dẫn.
3. Thông tin bằng lái sẽ hiển thị sau khi được cập nhật.

## Lưu ý

Bằng điện tử là tiện ích, nhưng bạn vẫn nên giữ bằng cứng. Quy định về giá trị pháp lý của bằng điện tử có thể thay đổi — nên cập nhật thông tin chính thức.

Học viên Quyết Thắng được hướng dẫn sử dụng VNeTraffic sau khi thi đậu. Liên hệ 084 875 1111 nếu cần hỗ trợ.`,
  },
  {
    id: 'p24',
    slug: '60-cau-diem-liet-can-luu-y',
    title: `60 câu điểm liệt trong đề thi lý thuyết cần lưu ý`,
    excerpt: `Sai 1 câu điểm liệt là trượt cả bài thi lý thuyết. Bài viết giúp bạn hiểu nhóm câu này và cách không bị mất điểm oan.`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['điểm liệt', 'lý thuyết', 'luật'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-07',
    cover_url: '',
    content: `## Câu điểm liệt là gì?

Trong bộ 600 câu hỏi lý thuyết của Bộ Công an có **60 câu điểm liệt** — là các câu về tình huống mất an toàn giao thông nghiêm trọng. Mỗi đề thi có 1 câu điểm liệt; chọn sai câu này là **trượt ngay**, dù các câu khác đúng hết.

## Các chủ đề điểm liệt thường gặp

- Nồng độ cồn, ma túy khi lái xe.
- Các hành vi bị nghiêm cấm (đua xe, lạng lách, đánh võng).
- Nhường đường cho xe ưu tiên.
- Vượt đèn đỏ, đi ngược chiều.
- Giao xe cho người không đủ điều kiện.
- Xử lý tình huống nguy hiểm (sa hình).

## Cách không mất điểm oan

- Học thuộc nguyên tắc của nhóm câu điểm liệt — chúng thường có logic "an toàn là trên hết".
- Đọc kỹ câu hỏi, đừng vội chọn.
- Luyện riêng nhóm câu điểm liệt nhiều lần.

## Luyện tập tại Quyết Thắng

Phần thi thử trên website đã đánh dấu rõ các câu điểm liệt theo đúng Công văn 2262 của Cục CSGT, giúp bạn nhận biết và ôn kỹ. Hãy luyện đến khi chắc chắn không sai câu nào trong nhóm này.`,
  },
  {
    id: 'p25',
    slug: 'xu-ly-khi-xe-mat-phanh',
    title: `Kỹ năng xử lý khi xe mất phanh hoặc kẹt ga`,
    excerpt: `Mất phanh hay kẹt chân ga là tình huống hiếm nhưng nguy hiểm. Biết cách xử lý có thể cứu mạng bạn.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['xử lý sự cố', 'an toàn', 'kỹ năng'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-04',
    cover_url: '',
    content: `## Khi xe mất phanh

Giữ bình tĩnh và làm theo thứ tự:

1. **Nhả chân ga** ngay lập tức.
2. **Về số thấp dần** (với số sàn) hoặc chuyển về L/số tay (số tự động) để dùng phanh động cơ ghìm xe.
3. **Đạp nhồi phanh chân** nhiều lần — đôi khi áp suất phục hồi.
4. **Kéo phanh tay từ từ** (không giật mạnh kẻo trượt).
5. Quan sát hướng thoát an toàn, dùng còi và đèn cảnh báo.

## Khi kẹt chân ga

1. Đạp phanh thật mạnh và giữ.
2. Về số N (mo) để ngắt lực kéo từ động cơ.
3. Tấp xe vào lề an toàn rồi tắt máy.

## Phòng hơn chống

- Bảo dưỡng phanh, lốp định kỳ.
- Không để vật lạ kẹt dưới chân ga (thảm sàn xô lệch).
- Kiểm tra xe trước mỗi chuyến đi xa.

Những kỹ năng này hiếm khi dùng đến, nhưng biết để không hoảng loạn khi cần.`,
  },
  {
    id: 'p26',
    slug: 'chi-phi-thi-lai-bang-lai-xe',
    title: `Thi rớt phải làm sao? Chi phí thi lại thế nào?`,
    excerpt: `Lỡ thi rớt một phần không phải là dấu chấm hết. Bài viết giải thích quy trình và chi phí thi lại để bạn yên tâm.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['thi lại', 'chi phí', 'tư vấn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-04-01',
    cover_url: '',
    content: `## Thi rớt có phải học lại từ đầu không?

Không. Thông thường bạn chỉ cần **thi lại phần chưa đạt**, không phải học và thi lại toàn bộ. Ví dụ đậu lý thuyết nhưng rớt sa hình thì chỉ thi lại sa hình.

## Vì sao thi rớt?

Lý do phổ biến: hồi hộp, chưa luyện đủ, sai câu điểm liệt phần lý thuyết, hoặc mắc lỗi sa hình (chết máy, cán vạch).

## Chi phí thi lại

Thi lại thường phát sinh một khoản lệ phí theo quy định cho phần thi đó. Trung tâm sẽ hướng dẫn bạn đăng ký thi lại vào kỳ gần nhất.

## Lời khuyên để đậu ngay lần đầu

- Luyện đề thi thử nhiều lần đến khi quen.
- Học kỹ 60 câu điểm liệt.
- Luyện sa hình đủ giờ, giữ tâm lý bình tĩnh.

Tại Quyết Thắng, học viên được hỗ trợ ôn luyện kỹ để hạn chế thi lại. Liên hệ 084 875 1111 nếu cần thêm giờ luyện tập.`,
  },
  {
    id: 'p27',
    slug: 'mo-phong-tinh-huong-giao-thong',
    title: `Phần mô phỏng tình huống giao thông là gì?`,
    excerpt: `Phần thi mô phỏng tình huống giao thông kiểm tra khả năng nhận diện nguy hiểm. Bài viết giải thích cách thức (tham khảo).`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['mô phỏng', 'thi sát hạch', 'kiến thức'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-03-29',
    cover_url: '',
    content: `## Mô phỏng tình huống là gì?

Đây là phần thi trên máy tính, trình chiếu các video tình huống giao thông. Thí sinh phải nhận diện thời điểm xuất hiện nguy hiểm và bấm phản hồi đúng lúc.

## Mục đích

Rèn khả năng **phán đoán và nhận biết nguy hiểm sớm** — kỹ năng quan trọng để phòng tránh tai nạn thực tế.

## Lưu ý khi làm phần này

- Quan sát toàn cảnh video, không chỉ nhìn một điểm.
- Bấm đúng thời điểm nguy hiểm bắt đầu xuất hiện — bấm quá sớm hoặc quá muộn đều bị trừ điểm.
- Luyện nhiều video để quen nhịp.

## Cập nhật quy định

Cấu trúc và việc áp dụng phần thi mô phỏng có thể được điều chỉnh theo quy định mới của cơ quan chức năng. Trung tâm sẽ thông báo và hướng dẫn học viên theo quy định hiện hành tại thời điểm thi.

Liên hệ Quyết Thắng 084 875 1111 để biết phần thi áp dụng cho khóa của bạn.`,
  },
  {
    id: 'p28',
    slug: 'kinh-nghiem-lai-xe-duong-truong-dat',
    title: `Kinh nghiệm lái xe đường trường DAT cho học viên`,
    excerpt: `Phần học lái đường trường DAT giúp bạn quen với giao thông thực tế. Đây là kinh nghiệm để học hiệu quả.`,
    category: 'kinh-nghiem',
    categoryLabel: 'Kinh nghiệm',
    tags: ['DAT', 'đường trường', 'kinh nghiệm'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-03-26',
    cover_url: '',
    content: `## DAT là gì?

DAT là thiết bị giám sát thời gian và quãng đường học lái xe trên đường thực tế. Học viên phải hoàn thành đủ số km và giờ lái đường trường theo quy định.

## Vì sao học đường trường quan trọng?

Lái trong sân khác xa lái thật ngoài đường. Đường trường giúp bạn quen với:

- Xe cộ đông, tình huống bất ngờ.
- Giữ khoảng cách, chuyển làn, vượt xe an toàn.
- Quan sát biển báo, đèn tín hiệu thực tế.

## Mẹo học đường trường hiệu quả

- Tập trung quan sát, đừng chỉ nhìn đầu xe.
- Mạnh dạn hỏi thầy khi gặp tình huống chưa rõ.
- Giữ tâm lý thoải mái, đi đều ga.

## Tại Quyết Thắng

Học phí trọn gói đã bao gồm đầy đủ giờ học đường trường DAT, xăng xe — học viên không phát sinh thêm chi phí. Liên hệ 084 875 1111 để biết lịch học.`,
  },
  {
    id: 'p29',
    slug: 'dia-chi-hoc-lai-xe-uy-tin-binh-thuan',
    title: `Cách chọn trung tâm học lái xe uy tín tại Bình Thuận`,
    excerpt: `Giữa nhiều nơi dạy lái xe, làm sao chọn được trung tâm uy tín? Đây là các tiêu chí giúp bạn không chọn nhầm.`,
    category: 'huong-dan',
    categoryLabel: 'Hướng dẫn',
    tags: ['chọn trung tâm', 'Bình Thuận', 'tư vấn'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-03-23',
    cover_url: '',
    content: `## Vì sao chọn đúng trung tâm quan trọng?

Chọn nhầm nơi kém chất lượng có thể khiến bạn tốn thời gian, phát sinh chi phí, hoặc học không đủ kỹ năng để lái an toàn.

## Tiêu chí chọn trung tâm uy tín

1. **Được cấp phép đào tạo** rõ ràng, có sân bãi đạt chuẩn.
2. **Học phí minh bạch**, cam kết không phát sinh ẩn.
3. **Xe tập và giờ thực hành đầy đủ**, không cắt xén.
4. **Hỗ trợ học viên tận tình**: hồ sơ, lịch học, ôn thi.
5. **Có địa chỉ, hotline rõ ràng** để liên hệ khi cần.

## Tham khảo đánh giá thực tế

Hỏi người quen đã học, xem đánh giá của học viên cũ. Trung tâm tốt thường được giới thiệu qua truyền miệng.

## Về Trung tâm Quyết Thắng

Hơn 18 năm đào tạo tại Bình Thuận với 3 văn phòng (Phan Thiết, La Gi, Bắc Bình), học phí trọn gói minh bạch, hỗ trợ học viên từ hồ sơ đến khi nhận bằng. Liên hệ 084 875 1111 hoặc ghé văn phòng gần nhất để tham khảo.`,
  },
  {
    id: 'p30',
    slug: 'luat-trat-tu-an-toan-giao-thong-2025',
    title: `Những điểm mới của Luật Trật tự, an toàn giao thông đường bộ`,
    excerpt: `Luật Trật tự, an toàn giao thông đường bộ có nhiều điểm mới ảnh hưởng đến người lái xe. Bài viết tổng hợp (tham khảo).`,
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức luật',
    tags: ['luật mới', 'an toàn giao thông', 'kiến thức'],
    author_name: 'Trung tâm Quyết Thắng',
    published_at: '2026-03-20',
    cover_url: '',
    content: `## Bối cảnh

Hệ thống pháp luật về giao thông đường bộ đã được cập nhật với Luật Trật tự, an toàn giao thông đường bộ và Luật Đường bộ, kéo theo nhiều thay đổi về đào tạo, sát hạch và quản lý giấy phép lái xe.

## Một số điểm đáng chú ý (tham khảo)

- **Hệ thống hạng GPLX** được sắp xếp lại (A1, A, B, C1, C, D...).
- **Bộ đề lý thuyết mới 600 câu** của Bộ Công an áp dụng từ 01/6/2025, có 60 câu điểm liệt.
- Quy định về **trừ điểm giấy phép lái xe** đối với một số vi phạm.
- Cập nhật quy định về **nồng độ cồn, tốc độ, an toàn cho trẻ em** trên xe.

## Vì sao người lái xe cần nắm?

Hiểu luật mới giúp bạn lái xe đúng quy định, tránh bị phạt và bảo đảm an toàn. Với người đang học, nắm luật mới giúp ôn thi đúng trọng tâm.

## Cập nhật liên tục

Quy định pháp luật có thể tiếp tục được điều chỉnh. Trung tâm Quyết Thắng luôn cập nhật nội dung đào tạo theo quy định mới nhất. Theo dõi mục "Cập nhật quy định" trên website hoặc liên hệ 084 875 1111 để được tư vấn.

*Bài viết mang tính tổng hợp, tham khảo; vui lòng đối chiếu văn bản pháp luật chính thức.*`,
  },
];

export const POST_CATEGORIES = {
  'kinh-nghiem': 'Kinh nghiệm',
  'huong-dan': 'Hướng dẫn',
  'kien-thuc': 'Kiến thức luật',
};