// Tạo bcrypt hash cho mật khẩu admin.
// Dùng:  node scripts/hash.js "@dmin#7Up"
const bcrypt = require('bcryptjs');
const pw = process.argv[2];
if (!pw) { console.log('Cú pháp: node scripts/hash.js "MatKhau"'); process.exit(1); }
bcrypt.hash(pw, 10).then((h) => {
  console.log('\nMật khẩu:', pw);
  console.log('Hash (dán vào schema.sql):\n' + h + '\n');
});
