import { supabasePublic } from '@/lib/supabase';
import { POSTS } from '@/lib/posts';
import './tintuc.css';

export const metadata = {
  title: 'Tin tức & kinh nghiệm lái xe | Lái Xe Quyết Thắng',
  description: 'Cập nhật tin tức, luật giao thông mới, kinh nghiệm thi và lái xe an toàn từ Trung tâm Đào tạo Lái Xe Quyết Thắng Bình Thuận.',
};
export const revalidate = 60;

async function getPosts() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return POSTS;
    const sb = supabasePublic();
    const { data } = await sb
      .from('posts')
      .select('id,title,slug,excerpt,cover_url,category,author_name,published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(60);
    return data && data.length ? data : POSTS;
  } catch {
    return POSTS;
  }
}

export default async function TinTuc() {
  const posts = await getPosts();
  return (
    <div className="tn">
      <header className="tn-hdr">
        <div className="wrap tn-hdr-in">
          <a href="/" className="tn-back">← Trang chủ</a>
          <b>Tin tức & Kinh nghiệm</b>
          <a href="/#dangky" className="btn btn-cta" style={{ padding: '10px 18px' }}>Đăng ký học</a>
        </div>
      </header>

      <section className="tn-hero">
        <div className="wrap">
          <span className="eyebrow on-dark">Blog Quyết Thắng</span>
          <h1>Tin tức, luật mới & kinh nghiệm lái xe</h1>
          <p>Cập nhật quy định GPLX, mẹo thi đậu và kỹ năng lái xe an toàn.</p>
        </div>
      </section>

      <section className="wrap tn-list">
        {posts.length === 0 ? (
          <div className="tn-empty">
            <p>Nội dung đang được cập nhật.</p>
            <p className="tn-empty-sub">Mời bạn quay lại sau để xem tin tức và kinh nghiệm lái xe mới nhất, hoặc <a href="/dang-ky">đăng ký học ngay</a>.</p>
          </div>
        ) : (
          <div className="tn-grid">
            {posts.map((p) => (
              <a key={p.id} href={`/tin-tuc/${p.slug}`} className="tn-card">
                <div className="tn-cover" style={{ backgroundImage: p.cover_url ? `url(${p.cover_url})` : 'var(--grad-hero)' }}>
                  {!p.cover_url && <span>QT</span>}
                </div>
                <div className="tn-body">
                  <span className="tn-cat">{p.categoryLabel || p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="tn-meta">{p.author_name} · {p.published_at ? new Date(p.published_at).toLocaleDateString('vi-VN') : ''}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
