import uuid

# Kita kembalikan 'GE' ke daftar dan pasangkan dengan sub_program aslinya
SUBPROGRAMS_BY_PROGRAM = {
    'GE': ['Pre-A1', 'A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2'],
    'AE': ['B1', 'B1+', 'B2', 'C1', 'C2'],
    'Foundation': ['JHS B1', 'JHS B1+', 'JHS B2', 'JHS C1'],
    'ESP': ['Business', 'Medical', 'Hospitality'],
    'IELTS': ['Foundation', '1', '2', '3'],
    'TOEFL': ['Foundation', '1', '2', '3'],
}
ESP_LEVELS = ['B1', 'B1+', 'B2', 'C1', 'C2']
GE_AGE_GROUPS = ['Young', 'Teens', 'Adult']

rows = []

for program, subs in SUBPROGRAMS_BY_PROGRAM.items():
    # 1. Logika Khusus untuk GE: Mengkombinasikan sub_program dengan ge_age_group
    if program == 'GE':
        for sp in subs:
            for age in GE_AGE_GROUPS:
                rows.append({
                    'id': str(uuid.uuid4()),
                    'program': 'GE',
                    'sub_program': sp,          # Berisi 'Pre-A1', 'A1', dst
                    'esp_profession': None,
                    'esp_level': None,
                    'ge_age_group': age,        # Berisi 'Young', 'Teens', 'Adult'
                    'label': f'GE - {sp} {age}' # Menghasilkan 'GE - Pre-A1 Young' dst
                })
                
    # 2. Logika Khusus untuk ESP (Sama seperti kodingan lama kamu)
    elif program == 'ESP':
        for prof in subs:
            for level in ESP_LEVELS:
                rows.append({
                    'id': str(uuid.uuid4()),
                    'program': 'ESP',
                    'sub_program': None,
                    'esp_profession': prof,
                    'esp_level': level,
                    'ge_age_group': None,
                    'label': f'ESP - {prof} {level}'
                })
                
    # 3. Logika untuk program lainnya (AE, Foundation, IELTS, TOEFL)
    else:
        for sp in subs:
            rows.append({
                'id': str(uuid.uuid4()),
                'program': program,
                'sub_program': sp,
                'esp_profession': None,
                'esp_level': None,
                'ge_age_group': None,
                'label': f'{program} - {sp}'
            })

# 4. Logika khusus untuk U-Prep dan U-Assist
for p in ['U-Prep', 'U-Assist']:
    rows.append({
        'id': str(uuid.uuid4()),
        'program': p,
        'sub_program': p,
        'esp_profession': None,
        'esp_level': None,
        'ge_age_group': None,
        'label': p
    })

# 5. Proses generate teks SQL string
lines = []
for r in rows:
    sub = 'NULL' if r['sub_program'] is None else f"'{r['sub_program']}'"
    prof = 'NULL' if r['esp_profession'] is None else f"'{r['esp_profession']}'"
    lvl = 'NULL' if r['esp_level'] is None else f"'{r['esp_level']}'"
    ge_age = 'NULL' if r['ge_age_group'] is None else f"'{r['ge_age_group']}'"
    
    lines.append(
        f"('{r['id']}', '{r['program']}', {sub}, {prof}, {lvl}, {ge_age}, '{r['label']}')"
    )

print("INSERT INTO syllabus (id, program, sub_program, esp_profession, esp_level, ge_age_group, label) VALUES")
print(",\n".join(lines) + ";")