- [ ] Update DB models (backend/app/models.py): add new columns for student: sub_program/subrole and ESP profession+level; add corresponding class columns.
- [ ] Update backend schemas (backend/app/schemas.py) to include new fields.
- [ ] Update backend routes (backend/app/routes.py) for create/update Student and Class to persist new fields.
- [ ] Frontend: update Dashboard.jsx Modal wizard steps with subprogram selection and new form fields.
- [ ] Frontend: update class_id generation (getOrCreateClass) to incorporate subprogram for stable grouping.
- [ ] Frontend: update Student card & confirmation text display to show `Foundation - JHS B1` etc.
- [ ] Frontend: ensure Student update/create payloads include new fields.
- [ ] Run backend start / frontend build to verify compile and API compatibility.

