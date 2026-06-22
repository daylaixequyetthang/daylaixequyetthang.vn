import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');
const COOKIE = 'qt_session';

export async function createSession(user) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.full_name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload; // { sub, email, name, role }
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete(COOKIE);
}

// Dùng trong API route để bắt buộc đăng nhập / kiểm role.
export async function requireRole(roles = ['admin', 'editor']) {
  const s = await getSession();
  if (!s) return { ok: false, status: 401, error: 'Chưa đăng nhập' };
  if (!roles.includes(s.role)) return { ok: false, status: 403, error: 'Không đủ quyền' };
  return { ok: true, session: s };
}
