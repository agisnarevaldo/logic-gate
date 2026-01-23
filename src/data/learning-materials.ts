import type { LearningCategory } from "@/types/learning"

export const learningMaterials: LearningCategory[] = [
    {
        id: "introduction",
        title: "Pengantar Gerbang Logika",
        slug: "pengantar",
        description: "Pengenalan dasar tentang gerbang logika dan elektronika digital",
        image: "/vectors/materi1.svg",
        modules: [
            {
                id: "intro-1",
                title: "Sistem Bilangan",
                slug: "sistem-bilangan",
                order: 1,
                content: `
# Sistem Bilangan

## Pengertian
- **Sistem bilangan** atau Number System adalah suatu cara untuk mewakili besaran dari suatu item fisik
- Sistem bilangan menggunakan suatu bilangan dasar atau basis (base / radix) yang tertentu

## Jenis Sistem Bilangan
![Jenis Sistem Bilangan](/images/number-system.png)

- Sistem bilangan desimal (decimal)
- Sistem bilangan biner (binary)
- Sistem bilangan oktal (octal)
- Sistem bilangan heksadesimal (hexadecimal)
        `
            },
            {
                id: "intro-2",
                title: "Desimal (Basis 10)",
                slug: "desimal-basis-10",
                order: 2,
                content: `
# Desimal (Basis 10)
- **Desimal (Basis 10)** adalah Sistem bilangan yang paling umum digunakan dalam kehidupan sehari-hari.
- Sistem bilangan desimal menggunakan basis 10 dan menggunakan 10 macam simbol bilangan yaitu: 0, 1, 2, 3, 4, 5, 6, 7, 8, dan 9.
- Untuk melihat nilai bilangan desimal dapa digunakan perhitungan seperti berikut, misalkan contoh bilangan desimal adalah 8598. Ini dapa diartikan:
![8958](/images/8598.png)
![digit](/images/digit.png)
- dengan begitu maka bilangan desimal 8598 bisa diartikan sebagai berikut:
\`\`\`
8598₁₀ = (8 x 1000) + (5 x 100) + (9 x 10) + (8 x 1)
\`\`\`
- Sistem bilangan desimal juga bisa berupa pecahan desimal (decimal fraction), misalhnya : 183,75 yang dapat diartikan:
![183,75](/images/183_75.png)
        `
            },
            {
                id: "intro-3",
                title: "Biner (Basis 2)",
                slug: "biner-basis-2",
                order: 3,
                content: `
# Biner (Basis 2)
- Biner (Basis 2) adalah Sistem Bilangan yang terdiri dari 2 simbol yaitu 0 dan 1.
- Contoh Bilangan Biner 1001, Ini dapat di artikan (Di konversi ke sistem bilangan desimal) menjadi sebagai berikut:
![1001](/images/1001.png)
- Position Value dalam sistem Bilangan Biner merupakan perpangkatan dari nilai 2 (basis), seperti pada tabel berikut ini :
![position-value](/images/pv-biner.png)
- dengan begitu maka bilangan biner 1001 bisa diartikan sebagai berikut:
\`\`\`
1001₂ = (1 x 8) + (0 x 4) + (0 x 2) + (1 x 1)
\`\`\`
        `
            },
            {
                id: "intro-4",
                title: "Oktal (Basis 8)",
                slug: "oktal-basis-8",
                order: 4,
                content: `
# Oktal (Basis 8)
- Oktal (Basis 8) adalah Sistem Bilangan yang terdiri dari 8 simbol yaitu 0, 1, 2, 3, 4, 5, 6, dan 7.
- Contoh Bilangan Oktal 1022, Ini dapat di artikan (Di konversi ke sistem bilangan desimal) menjadi sebagai berikut:
![1022](/images/1022.png)
- Position Value dalam sistem Bilangan Oktal merupakan perpangkatan dari nilai 8 (basis), seperti pada tabel berikut ini :
![position-value](/images/pv-oktal.png)
- dengan begitu maka bilangan oktal 1022 bisa diartikan sebagai berikut:
\`\`\`
1022₈ = (1 x 512) + (0 x 64) + (2 x 8) + (2 x 1)
\`\`\`
        `
            },
            {
                id: "intro-5",
                title: "Hexadesimal (Basis 16)",
                slug: "hexadesimal-basis-16",
                order: 5,
                content: `
# Hexadesimal (Basis 16)
- Hexadesimal (Basis 16), Hexa berarti 6 dan Desimal berarti 10 adalah Sistem Bilangan yang terdiri dari 16 simbol yaitu 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A(10), B(11), C(12), D(13), E(14), F(15).
- Pada Sistem Bilangan Hexadesimal memadukan 2unsur yaitu angka dan huruf. Huruf A mewakili angka 10, Bmewakili angka 11 dan seterusnya sampai Huruf F mewakili angka 15.
- Contoh Bilangan Hexadesimal F3DA, Ini dapat di artikan (Di konversi ke sistem bilangan desimal) menjadi sebagai berikut:
![F3DA](/images/F3DA.png)
- Position Value dalam sistem Bilangan Hexadesimal merupakan perpangkatan dari nilai 16 (basis), seperti pada tabel berikut ini :
![position-value](/images/pv-hex.png)
- dengan begitu maka bilangan hexadesimal F3DA bisa diartikan sebagai berikut:
\`\`\`
F3DA₁₆ = (15 x 4096) + (3 x 256) + (12 x 16) + (10 x 1)
\`\`\`
        `
            },
            {
                id: "intro-6",
                title: "Definisi dan Jenis Gerbang Logika",
                slug: "definisi-dan-jenis",
                order: 6,
                content: `
# Gerbang Logika

![Basic Logic Gates](/images/Basic-Logic-Gates-300x188.jpg)

## Definisi dan Jenis Gerbang Logika

Gerbang Logika adalah sirkuit elektronik yang dirancang untuk menjalankan fungsi logika tertentu pada satu atau beberapa masukan (input) dan menghasilkan keluaran (output) tunggal berdasarkan aturan logika tertentu. 

Gerbang-gerbang ini digunakan dalam berbagai perangkat elektronik seperti:
- Komputer
- Kalkulator 
- Smartphone
- Peralatan digital lainnya

### Karakteristik Gerbang Logika

Gerbang logika dibangun menggunakan transistor atau teknologi lainnya seperti:
- Diode
- Relay 
- Sirkuit terintegrasi (IC – Integrated Circuit)

**Gerbang logika hanya mengenal dua kondisi:**
- **Logika 1 (TRUE)** - Tegangan tinggi
- **Logika 0 (FALSE)** - Tegangan rendah

### Klasifikasi Gerbang Logika

Gerbang logika terdiri dari 2 jenis:

1. **Gerbang Logika Dasar:**
   - AND
   - OR  
   - NOT

2. **Gerbang Logika Turunan:**
   - NAND
   - NOR
   - XOR (EX-OR)
   - XNOR (EX-NOR)
        `
            },

            {
                id: "intro-7",
                title: "Aljabar Boolean",
                slug: "aljabar-boolean",
                order: 7,
                content: `
# Aljabar Boolean

Rangkaian digital di dalam komputer digital dan sistem digital lain dirancang dengan menggunakan disiplin matematika, yaitu **aljabar Boolean**. Nama tersebut diambil dari nama penemunya yaitu **George Boole**.

## Konsep Dasar

Gerbang logika dasar adalah rangkaian digital yang dapat dinyatakan dengan dua keadaan:
- **Tegangan/logika tinggi** (1)
- **Tegangan/logika rendah** (0)

Gerbang logika merupakan rangkaian dengan satu atau lebih masukan, tetapi hanya menghasilkan satu sinyal keluaran. Keluaran akan berlogika tinggi (1) atau berlogika rendah (0) tergantung pada sinyal masukan digital yang diberikan.

## Operasi Dasar Boolean

1. **NOT (Negasi)**: Membalikkan nilai input
   - NOT 0 = 1
   - NOT 1 = 0

2. **AND (Konjungsi)**: Output 1 hanya jika semua input bernilai 1
   - 0 AND 0 = 0
   - 0 AND 1 = 0  
   - 1 AND 0 = 0
   - 1 AND 1 = 1

3. **OR (Disjungsi)**: Output 1 jika setidaknya satu input bernilai 1
   - 0 OR 0 = 0
   - 0 OR 1 = 1
   - 1 OR 0 = 1
   - 1 OR 1 = 1

## Hukum-Hukum Boolean

1. **Hukum Komutatif**: A + B = B + A, A · B = B · A
2. **Hukum Asosiatif**: A + (B + C) = (A + B) + C
3. **Hukum Distributif**: A · (B + C) = A · B + A · C
4. **Hukum Identitas**: A + 0 = A, A · 1 = A
5. **Hukum Komplemen**: A + Ā = 1, A · Ā = 0
        `
            }
        ]
    },
    {
        id: "basic-gates",
        title: "Gerbang Logika Dasar",
        slug: "gerbang-dasar",
        description: "Mempelajari gerbang logika dasar: AND, OR, dan NOT",
        image: "/vectors/materi2.svg",
        modules: [
            {
                id: "basic-1",
                title: "Gerbang Logika AND",
                slug: "gerbang-and",
                order: 1,
                content: `
# Gerbang Logika AND

![AND Gate](/images/AND-Gate-and-its-Truth-Table.jpg)

Gerbang logika AND merupakan jenis rangkaian digital yang memberi keluaran bernilai **1** apabila **semua masukan bernilai satu**. Dengan kata lain, semua masukan harus dalam keadaan tinggi untuk mendapatkan keluaran yang tinggi.

## Karakteristik Gerbang AND

**Prinsip Kerja:**
- Gerbang AND dapat terdiri dari beberapa masukan (2, 3, 4, dst)
- Namun hanya memiliki **1 keluaran**
- Output akan HIGH (1) **hanya jika SEMUA input HIGH (1)**
- Jika ada satu saja input LOW (0), output akan LOW (0)

## Analisis Tabel Kebenaran

Dari gambar tabel kebenaran di atas, dapat disimpulkan:

- ✅ **Output 1**: Hanya ketika **semua input bernilai 1**
- ❌ **Output 0**: Ketika **ada input yang bernilai 0**

Gerbang AND berfungsi seperti rangkaian seri - semua "saklar" harus tertutup agar arus dapat mengalir.

## Aplikasi Gerbang AND

**Contoh Penggunaan:**
- **Sistem Keamanan**: Semua sensor harus aktif untuk membuka akses
- **Rangkaian Pengaman**: Semua kondisi safety harus terpenuhi
- **Address Decoding**: Dalam sistem memori komputer
- **Enable Circuits**: Mengontrol kapan sinyal boleh lewat

## Simbologi dan Notasi

- **Simbol Logic**: Bentuk D dengan garis lurus di input
- **Notasi Boolean**: A · B atau A ∧ B
- **Persamaan**: Y = A · B (untuk 2 input)
        `
            },
            {
                id: "basic-2",
                title: "Gerbang Logika OR",
                slug: "gerbang-or",
                order: 2,
                content: `
# Gerbang Logika OR

![OR Gate](/images/OR-gate-and-its-truth-table.jpg)

Gerbang logika OR merupakan jenis rangkaian digital yang memberi keluaran bernilai **1** apabila **salah satu masukan atau semua masukan bernilai satu**.

## Karakteristik Gerbang OR

- Gerbang logika OR dapat terdiri dari beberapa masukan misalnya 2, 3, 4 dst
- Namun hanya tetap memiliki **1 keluaran** 
- Menghasilkan nilai output **TRUE**, apabila salah satu atau semua input bernilai **TRUE**
- Kedua input bernilai **FALSE**, maka hasil output akan bernilai **FALSE**

## Analisis Tabel Kebenaran

Berdasarkan simbol dan tabel kebenaran pada gambar di atas:

- Setiap dua masukan yang memiliki angka **1** akan menghasilkan keluaran angka **1**
- Angka 1 menandakan bahwa gerbang logika OR **benar dan bisa diaktifkan**
- Gerbang logika OR menjadi **tidak aktif** ketika **semua masukan berupa angka 0**
- Dengan kata lain, semua input 0 pada gerbang logika OR akan menghasilkan keluaran yang tidak aktif

## Komponen IC

Gerbang logika OR bisa ditemukan pada komponen listrik yaitu **IC 7432**.

## Aplikasi Gerbang OR

Gerbang OR digunakan dalam:
- **Sirkuit alarm** - salah satu sensor aktif akan membunyikan alarm
- **Multiplexer** - memilih salah satu dari beberapa input
- **Adder circuits** - operasi penjumlahan dalam sistem digital
- **Logic gates combination** - membentuk fungsi logika yang lebih kompleks
        `
            },
            {
                id: "basic-3",
                title: "Gerbang Logika NOT",
                slug: "gerbang-not",
                order: 3,
                content: `
# Gerbang Logika NOT

![NOT Gate](/images/NOT-gate-and-its-truth-table.jpg)

Gerbang logika NOT merupakan gerbang logika dasar dengan karakteristik memiliki **satu sinyal masukan** dan **satu sinyal keluaran** yang mana sinyal masukan nilainya **berlawanan** dengan sinyal keluaran.

## Karakteristik Gerbang NOT

- Hanya memiliki **1 input** dan **1 output**
- Gerbang NOT juga disebut **Inverter** (pembalik) inputnya
- Berfungsi untuk **membalikkan** kondisi logika input
- Jika input HIGH (1), output akan LOW (0)
- Jika input LOW (0), output akan HIGH (1)

## Analisis Tabel Kebenaran

Berdasarkan simbol dan tabel kebenaran pada gambar di atas:

- Masukan berupa angka **0** akan menghasilkan keluaran berupa angka **1**
- Masukan berupa angka **1** akan menghasilkan keluaran berupa angka **0**
- Ini menunjukkan fungsi pembalikan (inversi) yang sempurna

## Simbologi

Gerbang NOT dilambangkan dengan:
- **Segitiga** dengan lingkaran kecil di ujung output
- **Lingkaran kecil** menunjukkan fungsi inversi/pembalikan

## Aplikasi Gerbang NOT

Gerbang NOT digunakan dalam:
- **Flip-flop circuits** - elemen memori digital
- **Clock signal inversion** - membalik sinyal clock
- **Signal conditioning** - mengkondisikan sinyal input
- **Logic level conversion** - mengkonversi level logika
- **Kombinasi dengan gerbang lain** untuk membuat fungsi kompleks
        `
            }
        ]
    },
    {
        id: "advanced-gates",
        title: "Gerbang Logika Turunan",
        slug: "gerbang-turunan",
        description: "Mempelajari gerbang logika turunan: NAND, NOR, XOR, dan XNOR",
        image: "/vectors/materi3.svg",
        modules: [
            {
                id: "advanced-1",
                title: "Gerbang Logika NAND",
                slug: "gerbang-nand",
                order: 1,
                content: `
# Gerbang Logika NAND

![NAND Gate](/images/NAND-Gate-and-its-Truth-table.jpg)

Gerbang Logika NAND yang menghasilkan nilai output **FALSE**, apabila **kedua input bernilai TRUE**. Salah satu atau kedua input bernilai FALSE maka hasil output akan bernilai TRUE.

## Karakteristik Gerbang NAND

- NAND = **NOT AND** (kebalikan dari AND)
- Gerbang logika ini bisa ditemukan pada komponen listrik yaitu **IC 7400**
- Output akan LOW (0) hanya jika **SEMUA** input HIGH (1)
- Dalam kondisi lainnya, output akan HIGH (1)

## Analisis Tabel Kebenaran

- Masukan berupa angka **1** dengan angka **1** maka menghasilkan keluaran angka **0**
- Masukan angka **0** dengan angka **0** akan menghasilkan keluaran angka **1**
- Setiap hasil keluaran merupakan **kebalikan** dari hasil keluaran gerbang logika AND
- Gerbang logika NAND bisa dikatakan sebagai keluaran dari gerbang logika AND yang **dibalik atau dinegasi**

## Keistimewaan NAND

Gerbang NAND memiliki sifat **universal**, artinya semua gerbang logika lainnya dapat dibentuk hanya menggunakan gerbang NAND saja.

## Aplikasi

- Universal building block untuk sirkuit digital
- Memory circuits (flip-flops, latches)
- Oscillator circuits
- Logic circuit simplification
        `
            },
            {
                id: "advanced-2",
                title: "Gerbang Logika NOR",
                slug: "gerbang-nor",
                order: 2,
                content: `
# Gerbang Logika NOR

![NOR Gate](/images/NOR-gate-and-its-truth-table.jpg)

Gerbang Logika NOR yang menghasilkan nilai output **TRUE**, apabila **kedua input bernilai FALSE**. Salah satu atau kedua input bernilai TRUE maka hasil output akan bernilai FALSE.

## Karakteristik Gerbang NOR

- NOR = **NOT OR** (kebalikan dari OR)
- Gerbang logika ini bisa ditemukan pada komponen listrik yaitu **IC 7402**
- Output akan HIGH (1) hanya jika **SEMUA** input LOW (0)
- Jika ada input yang HIGH (1), output akan LOW (0)

## Analisis Tabel Kebenaran

- Hasil keluaran gerbang logika NOR berupa **kebalikan** dari keluaran yang berasal dari gerbang logika OR
- Gerbang logika NOR bisa dikatakan sebagai keluaran dari gerbang logika OR yang **dibalik**
- Output 1 hanya ketika **semua input adalah 0**

## Keistimewaan NOR

Seperti NAND, gerbang NOR juga memiliki sifat **universal** - semua gerbang logika lainnya dapat dibentuk hanya menggunakan gerbang NOR saja.

## Aplikasi

- Universal building block (alternatif NAND)
- Set-Reset latches
- Ring oscillators
- Digital comparators
        `
            },
            {
                id: "advanced-3",
                title: "Gerbang Logika XOR",
                slug: "gerbang-xor",
                order: 3,
                content: `
# Gerbang Logika XOR

![XOR Gate](/images/EXOR-gate-and-its-truth-table.jpg)

Gerbang Logika XOR yang menghasilkan output **TRUE**, apabila **kedua input memiliki nilai data yang berbeda**. Kedua input memiliki nilai yang sama maka hasil output akan bernilai FALSE.

## Karakteristik Gerbang XOR

- XOR = **Exclusive OR** (OR eksklusif)
- Gerbang logika ini bisa ditemukan pada komponen listrik yaitu **IC 7486**
- Output akan HIGH (1) jika input **berbeda**
- Output akan LOW (0) jika input **sama**

## Analisis Tabel Kebenaran

- Gerbang logika XOR memiliki keluaran berupa angka **1** sebanyak dua kali dan keluaran angka **0** sebanyak dua kali
- Jika masukan berupa angka yang **sama**, maka akan menghasilkan **0**
- Jika masukan berupa angka yang **berbeda**, maka hasil keluaran berupa **1**
- Gerbang logika akan mengeluarkan logika rendah jika kedua masukan memiliki karakteristik yang sama
- Gerbang logika XOR akan mengeluarkan logika tinggi jika kedua masukan memiliki karakteristik yang berbeda

## Timing Diagram

Pada gerbang logika XOR 2 input dapat dianalisis kerja sistem dengan sebuah timing diagram untuk memahami perilaku gerbang terhadap perubahan sinyal input.

## Aplikasi

XOR sangat berguna dalam:
- **Adder circuits** (penjumlahan biner)
- **Parity generators dan checkers**
- **Comparators** (pembanding)
- **Error detection circuits**
- **Encryption/decryption**
        `
            },
            {
                id: "advanced-4",
                title: "Gerbang Logika XNOR",
                slug: "gerbang-xnor",
                order: 4,
                content: `
# Gerbang Logika XNOR

![XNOR Gate](/images/EXNOR-Gate-and-its-truth-table.jpg)

Gerbang Logika XNOR yang menghasilkan nilai output **TRUE**, apabila **kedua input bernilai sama**. Kedua input memiliki nilai data yang berbeda maka hasil output akan bernilai FALSE.

## Karakteristik Gerbang XNOR

- XNOR = **Exclusive NOR** (NOT XOR)
- Gerbang logika ini bisa ditemukan pada komponen listrik yaitu **IC 7266**
- Output akan HIGH (1) jika input **sama**
- Output akan LOW (0) jika input **berbeda**
- Juga disebut sebagai **Equivalence Gate** (gerbang kesetaraan)

## Analisis Tabel Kebenaran

- Masukan yang **sama** akan menghasilkan keluaran angka **1**
- Masukan yang **berbeda** akan menghasilkan keluaran berupa angka **0**
- Tabel kebenaran XNOR adalah **kebalikan** dari tabel XOR
- Gerbang logika XNOR akan menghasilkan keluaran dengan logika tinggi jika kedua input memiliki karakteristik yang sama
- Keluaran logika akan rendah jika masukan pada gerbang logika XNOR memiliki karakteristik yang berbeda

## Hubungan dengan XOR

XNOR adalah **komplemen** (kebalikan) dari XOR:
- **XOR**: Output 1 jika input berbeda
- **XNOR**: Output 1 jika input sama

## Aplikasi

XNOR digunakan dalam:
- **Equality comparators** (pembanding kesetaraan)
- **Parity checkers**
- **Error detection systems**
- **Digital locks** (kombinasi yang tepat)
- **Phase comparators**
        `
            }
        ]
    },
]