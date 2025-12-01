// Menandai PR kecil
const isSmallPR = danger.github.pr.additions < 50;

if (isSmallPR) {
  message("👏 PR ini kecil dan mudah direview. Good job!");
}

// Wajib ada deskripsi PR
if (danger.github.pr.body.length < 10) {
  warn("⚠️ Tolong isi deskripsi PR dengan jelas.");
}

// Cek kalau ada file .env atau credential ikut ke commit
const changedFiles = danger.git.modified_files.concat(danger.git.created_files);

changedFiles.forEach(file => {
  if (file.includes(".env")) {
    fail("⛔ File `.env` tidak boleh masuk PR!");
  }
});

// Pastikan package-lock.json ikut jika ada perubahan dependency
if (
  changedFiles.some(f => f.includes("package.json")) &&
  !changedFiles.some(f => f.includes("package-lock.json"))
) {
  warn("⚠️ Ada perubahan di package.json namun package-lock.json tidak berubah.");
}

// Wajib ada reviewer minimal 1
if (danger.github.requested_reviewers.length === 0) {
  warn("⚠️ Tambahkan minimal 1 reviewer di PR ini.");
}

// Pastikan PR tidak langsung ke branch production
const targetBranch = danger.github.pr.base.ref;
if (targetBranch === "production" || targetBranch === "main") {
  warn("⚠️ Hati-hati commit langsung ke main/production. Pastikan perubahan kritikal.");
}
