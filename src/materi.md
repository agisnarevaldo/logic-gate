# Gerbang Logika
## Definisi dan jenis gerbang logika
[/images/Basic-Logic-Gates-300x188.jpg]
Gerbang Logika adalah sirkuit elektronik yang dirancang untuk menjalankan fungsi logika tertentu pada satu atau beberapa masukan (input) dan menghasilkan keluaran (output) tunggal berdasarkan aturan logika tertentu. Gerbang – gebang ini digunakan dalam berbagai perangkat elektronik seperti, komputer, kalkulator, smartphone, dan peralatan digital lainnya. Gerbang logika dibangun menggunakan transistor atau teknologi lainnya seperti diode, relay atau bahkan sirkuit terintegrasi (IC – Integrated Circuit). Gerbang logika hanya menganal dua kondisi, yaitu: logika 1 (TRUE) dan logika 0 (FALSE). Gerbang logika terdiri dari 2 jenis yaitu gerbang logika dasar terdiri dari AND, OR, dan NOT dan gerbang logika turunan yaitu NAND, NOR, EX-OR dan EX-NOR.

## Gerbang Logika Dasar
Gebang logika dasar adalah rangakian digital yang dapat dinyatakan dengan dua keadaan (tagangan/logika tinggi atau tegangan /logika rendah). Gerbnag logika merupakan rangkaian dengan satu atau lebih masukan, tetapi hanya menghasilkan satu sinyal keluaran. Keluaran akan berlogika tinggi (1) atau berlogika rendah (0) tergantung pada sinyal masukan digital yang diberikan. Rangkaian digital di dalam computer digital dan system digital lain yang dirancang dengan menggunakan disiplin matematika, yaitu aljabar Boolean. Nama tersebut diambil dari nama penemunya yaitu George Boole.

1. Gerbang Lgoika AND
Gerbang logika AND merupakan jenis rangkaian digital yang memberi keluaran bernilai 1 apabila semua masukan bernilai satu atau dengan kata lain semua masukan harus dalam keadaan tinggi untuk mendapatkan keluaran yang tinggi. Gerbang logika AND dapat terdiri dari beberapa masukan misalknya 2,3,4dst namun hanya tetap memiliki 1 keluaran.

[public/images/AND-Gate-and-its-Truth-Table.jpg]

Tabel kebenaran menunjukkan bahwa gerbang logika bisa diaktifkan atau tidak. Berdasarkan tabel kebenaran diatas, maka bisa dikatakan bahwa setiap hasil keluaran berupa angka 0 berarti gebang logika AND tidak bisa diaktifkan. Dari tabel kebenaran dapat disimpulakan bahwa gerbang logika hanya bisa terjadi jika masukan sama – sama angka 1. Jika masukan berupa angka 0 dan 0, gebang logika tidak bisa diaktifkan.

2. Gerbang logika OR
Gerbang logika OR merupakan jenis rangkaian digital yang memberin keluaran bernilai 1 apabila salah satu masukan atau semua masukan bernilai  satu. Gerbang logika OR dapat teridiri dari beberapa masukan misalnya 2,3,4 dst namun hanya teteap memiliki 1 keluaran.
yang menghasilkan nilai output true, apabila salah satu atau dua output akan bernilai true. Kedua input bernilai false, maka hasil output akan bernilai false. Gerbang logika ini bisa ditemukan pada salah satu komponen listrik yaitu IC 7432.
[public/images/OR-gate-and-its-truth-table.jpg]
Tabel kebenaran logika OR diatas menjelaskan bahwa setiap dua masukian yang memiliki angka 1 akan mengahsilkan keluaran angka 1. Angak 1 menandakan bahwa gerbang logika OR benar dan bisa diaktifkan.  Gerbang logika OR menjadi tidak aktif ketika salah satu masukan berupa angka 0. Dengan kata lain 0  pada gerbang logika OR akan menghasilkan keluaran yang tidak aktif atau tidak benar.

3. Gerbang logika NOT
Gerbang logika NOT  merupakan gerbang logika dasar dengan karakteristik memiliki satu sinyal masukkan dan satu sinyal keluaran yang mana sinyal masukan nilainya berlawanan dengan sinyal keluaran. Gerbang not juga disebut Inventer(pembalik) inputnya.
[public/images/NOT-gate-and-its-truth-table.jpg]
Tabel kebenaran gerbang logika NOT menggambarkan bahwa masukan berupa angka 0 akan menghasilkan keluaran berupa angka 1 dan jika masukan berupa angka 1 akan menghasilkan keluaran angka 1.

## Gerbang Logika Turunan
Gerbang logika turunan selain gerbang dasar NOT, AND, dan OR pada system digital juga gerbang logika turunan atau kombinasi merupakan pengembangan dari gerbang logika dasar. Umumnya gerbang logika turunan merupakan gabungan dari 2 gerbangg logika atau lebih sehingga membentuk gerbang logika baru. Jenis – jenis gerbnag logika turunan dapat dilihat pada penjelasan berikut.

1. Gerbang Logika NAND
Gerbang Logika NAND  yang menghasilkan nilai output Flase, apabila kedua input bernilai true. Salah satu atau kedua input bernilai false maka hasil output akan bernilai true. Gerbang logika ini bisa ditemukan pada salah satu komponen listrik yaitu IC 7400.
[public/images/NAND-Gate-and-its-Truth-table.jpg]
Tabel kebenaran gerbang logika NAND mejalaskan bahwa masukan berupa angka 1 dengan angka 1 maka menghasilkan keluaran angka 0. Sedangkan masukan angka0 dengan angka 0 akan menghasilkan keluaran angka 1. Tabel kebenaran gebang logika NAND diatas dapat dikatakan bahwa setiap hasil keluaran merupakan kebaikan dari hasil keluaran gebang logika AND. Oleh karena itu, gebang logika NAND bisa dikatakan sebagai keluaran dari gebang logika AND yang dibalik atau dinegasi.

2. Gerbang Logika NOR
Gerbang Logika NOR yang menghasilkan nilai output true, apabila kedua input bernilai false. Salah satu atau kedua input bernilai true maka hasil output akan bernilai false. Gerbang logika ini bisa ditemukan pada salah satu komponen listrik yaitu IC 7436.
[public/images/NOR-gate-and-its-truth-table.jpg]
Dapat dilihat dari tabel kebenaran gebang logika NOR, hasil keluaran gebang logika NOR berupa kebalikan dari keluaran yang berasal dari gebang logika OR. Maka dari itu, gebang logika NOR bisa dikatakan sebangi keluaran dari gebang logika OR yang dibalik.

3. Gerbang Logika XOR
Gerbang Logika XOR yang menghasilkan output true, apabila kedua input miliki nilai data yang berbeda. Kedua input memiliki nilai yang sama maka hasil output akan bernilai false. Gerbang logika ini bisa ditemukan pada salah satu komponen listrik yaitu IC 7486.
[public/images/EXOR-gate-and-its-truth-table.jpg]
Gerbang logika XOR memiliki tabel kebenaran yang menghasilkan keluaran berupa angka 1 sebanyak dua kali dan keluaran angka 0 sebanyak dua kali. Jika masukan berupa angka yang sama, maka akan menghasilkan 0. Sedangkan jika masukan berupa angka yang berbeda, maka hasil keluaran berupa 1. Gebang logika akan mengeluarkan logika rendah jika kedua masukkan memiliki karakteristik yang sama. Sementara itu, gebang logika XOR akan mengeluarkan logika tinggi jika kedua masukan memiliki karakteristik yang berbeda. Pada gerbnag logika XOR 2 input dapat dianalisis kerja sistem dengan sebuah timing diagram seperti gambar di bawah ini. Bentuk real gerbang logika XOR dibentuk dalam IC dengan seri 7486. Dibawah ini merupakan gambar fisik IC gerbang logika NOR dan susunan pin IC.7486

4. Gerbang Logika XNOR
Gerbang Logika XNOR yang menghasilkan niali output true , apabila kedua input bernilai sama. kedua input memiliki nilai data yang berbeda maka hasil output akan bernilai false. Gerbang logika ini bisa ditemukan pada salah satu komponen listrik yaitu IC 7266.
[public/images/EXNOR-Gate-and-its-truth-table.jpg]
Tabel kebenaran gebang logika XNOR menjelaskan bahwa masukan yang sama akan menghasilkan keluaran angka 1. Sedangkan, masukan yang berbeda akan menghasilkan keluaran berupa angka 0. Jadi bisa dikataan tabel kebenaran XNOR kebalikan dari tabel XOR. Gerbang logika XNOR akan menghasilkan keluaran dengan logika tinggi jika kedua karakteristik yang sama. Sementara itu, keluaran logika akan rendah jika masukan pada gebang logika XNOR memiliki karakteristik yang berbeda.