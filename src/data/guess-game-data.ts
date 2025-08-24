import { GuessGameChallenge } from '@/types/guess-game'

export const guessGameChallenges: GuessGameChallenge[] = [
  {
    id: 'easy-digital-devices',
    title: 'Perangkat Digital Dasar',
    description: 'Pilih 3 gambar yang menunjukkan perangkat dengan kontrol digital dan logika',
    targetDescription: 'Cari perangkat yang memiliki layar digital, tombol kontrol, atau sistem otomatis',
    gateType: 'MIXED',
    explanation: 'Perangkat ini menggunakan gerbang logika untuk memproses input dan menghasilkan output yang sesuai. Contoh: smartphone memiliki sistem keamanan, rice cooker memiliki timer otomatis.',
    difficulty: 'easy',
    correctCount: 3,
    totalImages: 9,
    timeLimit: 60
  },
  {
    id: 'security-systems',
    title: 'Sistem Keamanan',
    description: 'Temukan 4 perangkat keamanan yang menggunakan gerbang logika AND/OR',
    targetDescription: 'Sistem yang memerlukan beberapa kondisi untuk aktif (password + biometrik, sensor + waktu)',
    gateType: 'AND',
    explanation: 'Sistem keamanan menggunakan gerbang AND karena semua kondisi keamanan harus terpenuhi sebelum memberikan akses. Contoh: ATM memerlukan kartu DAN PIN yang benar.',
    difficulty: 'medium',
    correctCount: 4,
    totalImages: 12,
    timeLimit: 90
  },
  {
    id: 'smart-automation',
    title: 'Otomasi Pintar',
    description: 'Pilih 5 perangkat yang memiliki sistem otomatis dan kontrol logika',
    targetDescription: 'Perangkat yang dapat membuat keputusan berdasarkan sensor atau kondisi tertentu',
    gateType: 'MIXED',
    explanation: 'Perangkat otomasi menggunakan kombinasi berbagai gerbang logika untuk merespons kondisi lingkungan dan input pengguna secara otomatis.',
    difficulty: 'hard',
    correctCount: 5,
    totalImages: 15,
    timeLimit: 120
  }
]

// Fungsi untuk mendapatkan daftar gambar dari direktori
export const getAvailableImages = () => {
  // Daftar gambar yang tersedia di folder correct
  const correctImages = [
    'atm-machine.jpg',
    'burglar-alrm.jpg', 
    'cctv-system.jpg',
    'conveyor-controll.jpg',
    'copy-machine.jpg',
    'dashboard-electronic.jpg',
    'elevator-panel.jpg',
    'fingerprint-scanner.jpg',
    'gaming-console.png',
    'gto.jpg',
    'home-security-panel.jpg',
    'keycard-access.jpeg',
    'keyless-entry.jpeg',
    'microwave-ovens.jpg',
    'pin-pad.jpg',
    'plc-system.jpg',
    'printer.jpg',
    'smart-thermostat.jpg',
    'smartphone-lock.png',
    'traffic-light.jpg'
  ].map((filename, i) => ({
    id: `correct_${i + 1}`,
    filename,
    category: 'digital-logic-applications',
    isCorrect: true
  }))

  // Daftar gambar distractor yang tersedia di folder distractors
  const distractorImages = [
    'analog-clock.jpeg',
    'backpack.jpg',
    'basic-calculator.jpg',
    'bicycle.jpg',
    'blender.jpg',
    'books.jpg',
    'chair.jpg',
    'compass.jpeg',
    'curatains.png',
    'desk-lamp.png',
    'electric-fan.jpg',
    'electric-iron.jpg',
    'extension-cord.jpg',
    'hammer.jpg',
    'headphone.jpg',
    'light-switch.jpg',
    'manua-gear.jpg',
    'manual-can-opener.jpg',
    'manual-door-lock.jpg',
    'manual-scale.jpg',
    'manual-typewriter.jpg',
    'mirror.jpg',
    'powe-adaptor.jpg',
    'pulley-system.jpeg',
    'radio-analog.jpg',
    'regular-door.jpg',
    'screwdriver.jpg',
    'spring-mechanism.jpg',
    'staplers.jpg',
    'storage-box.jpg',
    'table.jpg',
    'toaster.jpeg',
    'usb-cable.jpg',
    'wall-socket.jpeg',
    'window.jpg'
  ].map((filename, i) => ({
    id: `distractor_${i + 1}`,
    filename,
    category: 'non-logic-items',
    isCorrect: false
  }))

  return [...correctImages, ...distractorImages]
}

// Fungsi untuk mengacak dan memilih gambar untuk challenge
export const generateChallengeImages = (challenge: GuessGameChallenge) => {
  const allImages = getAvailableImages()
  const correctImages = allImages.filter(img => img.isCorrect)
  const distractorImages = allImages.filter(img => !img.isCorrect)

  // Pilih gambar correct sesuai kebutuhan
  const selectedCorrect = correctImages
    .sort(() => Math.random() - 0.5)
    .slice(0, challenge.correctCount)

  // Pilih distractor untuk melengkapi total gambar
  const distractorNeeded = challenge.totalImages - challenge.correctCount
  const selectedDistractors = distractorImages
    .sort(() => Math.random() - 0.5)
    .slice(0, distractorNeeded)

  // Gabung dan acak
  return [...selectedCorrect, ...selectedDistractors]
    .sort(() => Math.random() - 0.5)
}
