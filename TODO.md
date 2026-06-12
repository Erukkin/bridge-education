# TODO - Realtime CRUD (SSE)

- [x] Backend: implement SSE broadcaster + endpoint `GET /api/data/stream`

- [x] Backend: broadcast event after CRUD on `students` and `classes` (POST/PUT/DELETE)

- [x] Frontend: add EventSource listener di `src/pages/Dashboard.jsx` untuk refetch `getStudents()` dan `getClasses()` saat event masuk





- [ ] Frontend: add EventSource listener di `src/pages/StudentPage.jsx` untuk update profile (fetch students, cari student by id)
- [ ] Sanity check: ensure CORS supports EventSource (SSE uses normal GET)
- [ ] Test manual: buka 2 device/browser, CRUD di salah satu harus muncul di yang lain tanpa refresh

