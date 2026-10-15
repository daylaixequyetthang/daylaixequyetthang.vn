/**
 * Thông tin địa điểm học, kênh ghi danh và lưu ý phòng tránh giả mạo.
 * Dùng chung cho trang học lái xe theo khu vực và trang khóa học.
 * Không giả định có văn phòng/giáo viên tại Đồng Nai hoặc TP.HCM.
 */
export default function OfficialEnrollmentNotice({ outsideBinhThuan = false, fromPhuQuy = false }) {
  return (
    <section className="seo-registration-guidance" aria-label="Hướng dẫn học và đăng ký đúng kênh">
      <div className="seo-registration-overview">
        <p className="seo-registration-eyebrow">HỌC THUẬN TIỆN · ĐĂNG KÝ AN TÂM</p>
        <h2>{outsideBinhThuan ? 'Tư vấn lộ trình học phù hợp, thi tại Phan Thiết' : fromPhuQuy ? 'Tư vấn học từ Phú Quý, thi tập trung tại Phan Thiết' : 'Học tại địa phương, thi tập trung tại Phan Thiết'}</h2>
        <p>
          Trung Tâm GDNN Quyết Thắng có đội ngũ giáo viên tại nhiều khu vực Bình Thuận.
          Trung tâm trực tiếp phân công giáo viên, sắp xếp lịch và địa điểm học thực hành theo từng khóa.
        </p>
        {outsideBinhThuan ? (
          <p>Với học viên ở Đồng Nai hoặc TP. Hồ Chí Minh, nhân viên sẽ tư vấn địa điểm học tại khu vực đào tạo của Quyết Thắng và phương án di chuyển trước khi ghi danh.</p>
        ) : fromPhuQuy ? (
          <p>Học viên ở Phú Quý sẽ được tư vấn địa điểm học thực hành, lịch tập trung trên đất liền và phương án di chuyển phù hợp trước khi ghi danh.</p>
        ) : (
          <p>Học viên có thể học tại khu vực mình sinh sống theo kế hoạch phân công giáo viên của trường. Nhân viên sẽ thông tin lịch và địa điểm thực hành cụ thể khi tư vấn.</p>
        )}
        <p><strong>Thi sát hạch tập trung tại Phan Thiết</strong> theo lịch được thông báo.</p>
      </div>
      <aside className="seo-registration-alert" aria-label="Lưu ý đăng ký chính thức và cảnh giác giả mạo">
        <div className="seo-registration-alert-heading">
          <span className="seo-registration-alert-icon" aria-hidden="true">!</span>
          <h3>Lưu ý quan trọng: Đăng ký đúng trung tâm để bảo vệ quyền lợi</h3>
        </div>
        <p>
          Học viên nên đăng ký <strong>trực tiếp với Trung Tâm GDNN Quyết Thắng</strong> tại ba văn phòng
          <strong> Phan Thiết, La Gi, Bắc Bình</strong> hoặc qua website chính thức
          <strong> daylaixequyetthang.vn</strong>. Nhân viên trung tâm sẽ hướng dẫn thủ tục nhanh gọn,
          cung cấp thông tin học phí rõ ràng và hợp đồng đào tạo khi hoàn tất ghi danh.
        </p>
        <p>
          <strong>Giáo viên giảng dạy do trung tâm phân công.</strong> Hãy thận trọng với lời mời ghi danh qua
          cá nhân, môi giới hoặc tài khoản chưa được trung tâm xác nhận, nhất là khi báo giá không rõ ràng,
          yêu cầu đóng khoản phát sinh hoặc không cung cấp hợp đồng.
          Hãy kiểm tra thông tin học phí, hợp đồng và kênh thu tiền với trung tâm trước khi thanh toán.
        </p>
        <div className="seo-registration-actions">
          <a className="seo-registration-action-primary" href="#tu-van">Đăng ký tư vấn trên website</a>
          <a className="seo-registration-action-secondary" href="tel:0848751111">Xác minh qua hotline 084 875 1111</a>
        </div>
      </aside>
    </section>
  );
}
