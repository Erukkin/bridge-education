# TODO - Fitur Move Student ke Kelas Bebas

## Rencana
1. Tambahkan tombol aksi **“🚚 Move”** di UI Dashboard, posisi di antara Edit dan Delete.
2. Tambahkan state `actionMode === 'move'` dan modifikasi `handleSelect` untuk mengaktifkan flow pindah.
3. Buat komponen modal ringan/inline di `Dashboard.jsx` untuk memilih kelas tujuan dari daftar **kelas available** (tidak full).
4. Saat konfirmasi:
   - Update `classes` lama (hapus studentId dari `student_ids`).
   - Update `classes` baru (tambah studentId ke `student_ids`), sebelum join cek capacity.
   - Update `students.class_id` ke kelas tujuan.
   - Refresh state `students` dan `classes`.
5. Pastikan rule: kelas full tidak bisa dipilih/join.
6. Jalankan build/lint dan test manual.

