export type Language = 'id' | 'jv' | 'su' | 'bg';

export const AI_RESPONSES: Record<Language, string> = {
  id: 'Perkalian itu seperti penjumlahan yang diulang! Misalnya, harga 1 kg sawit Rp 2.000, maka 5 kg = 5 × Rp 2.000 = Rp 10.000 😊\n\nMasih ada pertanyaan lain?',
  jv: 'Perkalian kuwi kaya penjumlahan sing diulang! Upamane 5 kg sawit = 5 × Rp 2.000 = Rp 10.000 😊\n\nIsih ana pitakon liyane?',
  su: 'Perkalian teh saperti penjumlahan anu diulang! Upamana, 5 kg sawit = 5 × Rp 2.000 = Rp 10.000 😊\n\nPadahal masih aya patarosan séjénna?',
  bg: 'Perkalian itu pada mabbali-bali pettunna! Contona, 5 kg sawit = 5 × Rp 2.000 = Rp 10.000 😊\n\nMagaaga pertanyaan lainna?',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  id: '🇮🇩 Indonesia',
  jv: '🗣 Jawa',
  su: '🗣 Sunda',
  bg: '🗣 Bugis',
};

export const USER_QUESTION = 'Pak AI, bisa jelaskan cara perkalian dengan mudah? Contohnya dari kehidupan sehari-hari?';

export const QUICK_QUESTIONS = [
  '💡 Gimana cara cepat belajar perkalian?',
  '📚 Beri soal latihan perkalian untuk kelas 4',
  '🌎 Apa itu garis khatulistiwa?',
  '🦖 Kenapa dinosaurus punah?',
  '🌙 Kenapa bulan selalu mengikuti kita?',
  '🧪 Apa fungsi klorofil pada tumbuhan?',
  '🌋 Bagaimana gunung meletus terjadi?',
  '📐 Rumus luas segitiga itu apa?',
  '🇮🇩 Siapa penjahit bendera Merah Putih?',
  '🍎 Kenapa apel jatuh ke bawah?',
  '🦁 Apa hewan tercepat di dunia?',
  '🌌 Apa itu galaksi Bima Sakti?',
  '🦴 Berapa jumlah tulang manusia dewasa?',
  '⚡ Bagaimana petir bisa terjadi?',
  '🌊 Kenapa air laut rasanya asin?',
];

export const QUICK_ANSWERS: Record<string, string> = {
  '💡 Gimana cara cepat belajar perkalian?': 'Cara tercepat adalah memahami konsep penjumlahan berulang! Gunakan tabel perkalian dan cobalah latihan 10 menit setiap hari secara rutin. Kamu juga bisa pakai lagu agar lebih seru! 🎶',
  '📚 Beri soal latihan perkalian untuk kelas 4': 'Tentu! Coba kerjakan ini: "Sebuah truk membawa 12 karung beras. Jika tiap karung beratnya 5 kg, berapa total berat berasnya?" (Jawaban: 60 kg) 🚛🌾',
  '🌎 Apa itu garis khatulistiwa?': 'Garis khatulistiwa adalah garis khayal yang membagi Bumi menjadi dua bagian: Utara dan Selatan. Indonesia dilewati garis ini, makanya kita beriklim tropis! ☀️',
  '🦖 Kenapa dinosaurus punah?': 'Sebagian besar ilmuwan percaya meteor raksasa menabrak Bumi 66 juta tahun lalu, menyebabkan perubahan iklim ekstrem yang membuat dinosaurus tidak bisa bertahan hidup. ☄️',
  '🌙 Kenapa bulan selalu mengikuti kita?': 'Bulan tidak benar-benar mengikutimu! Itu hanya ilusi optik karena Bulan sangat jauh, sehingga sudut pandang kita terhadapnya tidak banyak berubah saat kita bergerak. 🌕',
  '🧪 Apa fungsi klorofil pada tumbuhan?': 'Klorofil berfungsi untuk menyerap energi cahaya matahari yang digunakan dalam proses fotosintesis untuk membuat makanan bagi tumbuhan. 🍃',
  '🌋 Bagaimana gunung meletus terjadi?': 'Gunung meletus terjadi karena adanya desakan magma yang sangat panas dari dalam perut bumi yang didorong keluar oleh gas bertekanan tinggi. 💥',
  '📐 Rumus luas segitiga itu apa?': 'Rumusnya adalah: (Alas × Tinggi) dibagi 2. Ingat ya, alas dan tingginya harus tegak lurus! 📐',
  '🇮🇩 Siapa penjahit bendera Merah Putih?': 'Bendera pusaka Merah Putih dijahit oleh Ibu Fatmawati, istri dari Presiden pertama kita, Ir. Soekarno. 🇮🇩',
  '🍎 Kenapa apel jatuh ke bawah?': 'Itu karena adanya gaya gravitasi Bumi! Gravitasi menarik segala sesuatu yang memiliki massa menuju ke pusat Bumi. 🍎📉',
  '🦁 Apa hewan tercepat di dunia?': 'Di darat, Cheetah adalah juaranya (120 km/jam). Tapi di udara, Elang Peregrine bisa menukik hingga 320 km/jam! 🐆🦅',
  '🌌 Apa itu galaksi Bima Sakti?': 'Bima Sakti (Milky Way) adalah rumah bagi Tata Surya kita. Isinya miliaran bintang, termasuk Matahari, dalam bentuk spiral raksasa. 🌌',
  '🦴 Berapa jumlah tulang manusia dewasa?': 'Manusia dewasa memiliki 206 tulang. Saat bayi kita punya sekitar 270, tapi beberapa akan menyatu seiring pertumbuhan. 🦴',
  '⚡ Bagaimana petir bisa terjadi?': 'Petir terjadi karena adanya perbedaan muatan listrik antara awan dan bumi atau antar awan, yang dilepaskan dalam bentuk kilatan cahaya panas. ⛈️',
  '🌊 Kenapa air laut rasanya asin?': 'Air laut asin karena mineral dari batuan di daratan terkikis oleh air hujan, lalu mengalir ke laut dan menumpuk selama miliaran tahun. 🌊🧂',
};
