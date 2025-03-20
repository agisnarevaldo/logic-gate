import type {LearningCategory} from "@/types/learning"

export const learningMaterials: LearningCategory[] = [
    {
        id: "introduction",
        title: "Pengantar",
        slug: "pengantar",
        description: "Pengenalan dasar tentang gerbang logika dan elektronika digital",
        modules: [
            {
                id: "intro-1",
                title: "Apa itu Gerbang Logika?",
                slug: "apa-itu-gerbang-logika",
                order: 1,
                content: `
# Apa itu Gerbang Logika?

Gerbang logika adalah blok bangunan dasar dari sirkuit digital. Mereka melakukan operasi logika pada satu atau lebih input biner dan menghasilkan output biner tunggal.

## Konsep Dasar

Gerbang logika bekerja dengan dua nilai logika:
- **0** (FALSE, LOW, OFF)
- **1** (TRUE, HIGH, ON)

Gerbang logika digunakan untuk membangun sirkuit digital yang lebih kompleks seperti:
- Adder (Penambah)
- Multiplexer
- Demultiplexer
- Flip-flops
- Memori
- Mikroprosesor

## Sejarah Singkat

Gerbang logika pertama kali dikembangkan pada tahun 1930-an dan 1940-an. Mereka awalnya dibuat menggunakan relay elektromekanis dan tabung vakum. Dengan penemuan transistor pada tahun 1947, gerbang logika menjadi lebih kecil, lebih cepat, dan lebih andal.
        `
            },
            {
                id: "intro-2",
                title: "Sistem Bilangan Digital",
                slug: "sistem-bilangan-digital",
                order: 2,
                content: `
# Sistem Bilangan Digital

Dalam elektronika digital, kita bekerja dengan berbagai sistem bilangan. Berikut adalah sistem bilangan yang paling umum digunakan:

## Sistem Bilangan Biner (Basis 2)

Sistem bilangan biner hanya menggunakan dua digit: 0 dan 1. Ini adalah sistem bilangan yang paling dasar dalam elektronika digital.

Contoh: 1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10₁₀

## Sistem Bilangan Desimal (Basis 10)

Sistem bilangan desimal menggunakan sepuluh digit: 0 hingga 9. Ini adalah sistem bilangan yang kita gunakan sehari-hari.

## Sistem Bilangan Heksadesimal (Basis 16)

Sistem bilangan heksadesimal menggunakan enam belas digit: 0-9 dan A-F (di mana A=10, B=11, ..., F=15).

Contoh: 1A₁₆ = 1×16¹ + 10×16⁰ = 16 + 10 = 26₁₀

## Konversi Antar Sistem Bilangan

Konversi antar sistem bilangan adalah keterampilan penting dalam elektronika digital. Berikut adalah beberapa metode konversi:

- **Biner ke Desimal**: Kalikan setiap digit dengan 2 pangkat posisinya (dari kanan ke kiri, dimulai dari 0) dan jumlahkan hasilnya.
- **Desimal ke Biner**: Bagi angka desimal dengan 2 secara berulang dan catat sisanya.
- **Biner ke Heksadesimal**: Kelompokkan digit biner menjadi kelompok 4 digit dari kanan ke kiri dan konversi setiap kelompok ke digit heksadesimal.
        `
            },
            {
                id: "intro-3",
                title: "Aljabar Boolean",
                slug: "aljabar-boolean",
                order: 3,
                content: `
# Aljabar Boolean

Aljabar Boolean adalah sistem matematika yang digunakan untuk menganalisis dan menyederhanakan sirkuit digital. Ini dikembangkan oleh George Boole pada pertengahan abad ke-19.

## Operasi Dasar

Aljabar Boolean memiliki tiga operasi dasar:

1. **NOT (Negasi)**: Dilambangkan dengan garis di atas variabel (Ā) atau tanda seru (!A). Operasi ini membalikkan nilai variabel.
   - NOT 0 = 1
   - NOT 1 = 0

2. **AND (Konjungsi)**: Dilambangkan dengan dot (A·B) atau tanda perkalian (A×B). Operasi ini menghasilkan 1 hanya jika semua input bernilai 1.
   - 0 AND 0 = 0
   - 0 AND 1 = 0
   - 1 AND 0 = 0
   - 1 AND 1 = 1

3. **OR (Disjungsi)**: Dilambangkan dengan plus (A+B). Operasi ini menghasilkan 1 jika setidaknya satu input bernilai 1.
   - 0 OR 0 = 0
   - 0 OR 1 = 1
   - 1 OR 0 = 1
   - 1 OR 1 = 1

## Hukum dan Teorema

Aljabar Boolean memiliki beberapa hukum dan teorema yang berguna untuk menyederhanakan ekspresi Boolean:

1. **Hukum Komutatif**:
   - A + B = B + A
   - A · B = B · A

2. **Hukum Asosiatif**:
   - A + (B + C) = (A + B) + C
   - A · (B · C) = (A · B) · C

3. **Hukum Distributif**:
   - A · (B + C) = A · B + A · C
   - A + (B · C) = (A + B) · (A + C)

4. **Hukum Identitas**:
   - A + 0 = A
   - A · 1 = A

5. **Hukum Komplemen**:
   - A + Ā = 1
   - A · Ā = 0
        `
            }
        ]
    },
    {
        id: "basic-gates",
        title: "Gerbang Logika Dasar",
        slug: "gerbang-dasar",
        description: "Mempelajari gerbang logika dasar seperti AND, OR, dan NOT",
        modules: [
            {
                id: "basic-1",
                title: "Gerbang AND",
                slug: "gerbang-and",
                order: 1,
                content: `
# Gerbang AND

Gerbang AND adalah gerbang logika dasar yang menghasilkan output 1 hanya jika semua inputnya adalah 1.

## Tabel Kebenaran

| A | B | Output |
|---|---|--------|
| 0 | 0 |   0    |
| 0 | 1 |   0    |
| 1 | 0 |   0    |
| 1 | 1 |   1    |

## Simbol

Simbol gerbang AND biasanya digambarkan sebagai setengah lingkaran dengan dua input dan satu output.

## Implementasi

Gerbang AND dapat diimplementasikan menggunakan transistor atau relay dalam sirkuit elektronik.
`
            }
        ]
    },
]