import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { POSTS } from '@/lib/posts';
import '../tintuc.css';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

async function getPost(slug) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return POSTS.find((p) => p.slug === slug) || null;
    const sb = supabasePublic();
    const { data } = await sb.from('posts').select('*').eq('slug', slug).eq('status', 'published').single();
    if (data && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabaseAdmin().from('posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id).then(() => {});
    }
    return data || POSTS.find((p) => p.slug === slug) || null;
  } catch {
    return POSTS.find((p) => p.slug === slug) || null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="tn">
      <header className="tn-hdr">
        <div className="wrap tn-hdr-in">
          <a href="/tin-tuc" className="tn-back">← Tất cả bài viết</a>
          <b>Quyết Thắng</b>
          <a href="/#dangky" className="btn btn-cta" style={{ padding: '10px 18px' }}>Đăng ký học</a>
        </div>
      </header>

      <article className="wrap" style={{ maxWidth: 760, padding: '46px 22px 70px' }}>
        <span className="tn-cat">{post.categoryLabel || post.category}</span>
        <h1 style={{ fontSize: 'clamp(1.7rem,3.5vw,2.4rem)', fontWeight: 800, margin: '14px 0 12px', lineHeight: 1.25 }}>{post.title}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
          {post.author_name} · {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : ''} · {post.views || 0} lượt xem
        </p>
        {post.cover_url && <img src={post.cover_url} alt={post.title} style={{ borderRadius: 18, marginBottom: 26 }} />}
        <div className="post-content" dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />

        <div style={{ marginTop: 40, padding: 28, borderRadius: 18, background: 'var(--grad-hero)', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: 10 }}>Sẵn sàng học lái xe?</h3>
          <p style={{ opacity: 0.9, marginBottom: 16 }}>Đăng ký để được tư vấn lịch học và học phí ưu đãi.</p>
          <a href="/#dangky" className="btn btn-light">Đăng ký ngay</a>
        </div>
      </article>

      <style>{`
        .post-content{color:var(--ink-soft);font-size:1.05rem;line-height:1.8}
        .post-content h2{font-family:var(--font-display);color:var(--ink);font-size:1.4rem;margin:28px 0 12px}
        .post-content h3{font-family:var(--font-display);color:var(--ink);font-size:1.15rem;margin:22px 0 10px}
        .post-content p{margin-bottom:16px}
        .post-content ul,.post-content ol{margin:0 0 16px 22px}
        .post-content li{margin-bottom:8px}
        .post-content img{border-radius:14px;margin:18px 0}
        .post-content a{color:var(--blue);text-decoration:underline}
      `}</style>
    </div>
  );
}

// Render markdown nhẹ: tiêu đề, đậm, danh sách gạch đầu dòng và đánh số.
function renderContent(content) {
  if (!content) return '';
  if (/<\/?[a-z][\s\S]*>/i.test(content)) return content; // đã là HTML
  const blocks = content.split(/\n{2,}/);
  return blocks.map((block) => {
    const lines = block.split('\n');
    // tiêu đề
    if (/^## /.test(block)) return `<h2>${block.replace(/^## /, '')}</h2>`;
    if (/^### /.test(block)) return `<h3>${block.replace(/^### /, '')}</h3>`;
    // danh sách gạch đầu dòng
    if (lines.every((l) => /^- /.test(l.trim()))) {
      const items = lines.map((l) => `<li>${inline(l.trim().replace(/^- /, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }
    // danh sách đánh số
    if (lines.every((l) => /^\d+\. /.test(l.trim()))) {
      const items = lines.map((l) => `<li>${inline(l.trim().replace(/^\d+\. /, ''))}</li>`).join('');
      return `<ol>${items}</ol>`;
    }
    // đoạn văn
    return `<p>${inline(block.replace(/\n/g, '<br/>'))}</p>`;
  }).join('');
}

function inline(s) {
  return s
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>');
}
