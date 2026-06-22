import { POSTS } from '@/lib/posts';

const BASE = 'https://daylaixequyetthang.vn';

export default function sitemap() {
  const now = new Date();
  const routes = ['', '/thi-thu', '/tra-cuu', '/dang-ky', '/cap-nhat-quy-dinh', '/tin-tuc', '/chinh-sach-bao-mat'];
  const staticUrls = routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: r === '/cap-nhat-quy-dinh' ? 'weekly' : 'monthly',
    priority: r === '' ? 1 : r === '/cap-nhat-quy-dinh' ? 0.9 : 0.8,
  }));
  const postUrls = POSTS.map((p) => ({
    url: `${BASE}/tin-tuc/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...staticUrls, ...postUrls];
}
