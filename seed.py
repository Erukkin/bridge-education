import uuid

SUBPROGRAMS_BY_PROGRAM = {
    'GE': ['Pre-A1', 'A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2'],
    'AE': ['B1', 'B1+', 'B2', 'C1', 'C2'],
    'Foundation': ['JHS B1', 'JHS B1+', 'JHS B2', 'JHS C1'],
    'ESP': ['Business', 'Medical', 'Hospitality'],
    'IELTS': ['Foundation', '1', '2', '3'],
    'TOEFL': ['Foundation', '1', '2', '3'],
}
ESP_LEVELS = ['B1', 'B1+', 'B2', 'C1', 'C2']

rows = []

for program, subs in SUBPROGRAMS_BY_PROGRAM.items():
    if program == 'ESP':
        for prof in subs:
            for level in ESP_LEVELS:
                rows.append({
                    'id': str(uuid.uuid4()),
                    'program': 'ESP',
                    'sub_program': None,
                    'esp_profession': prof,
                    'esp_level': level,
                    'label': f'ESP - {prof} {level}'
                })
    else:
        for sp in subs:
            rows.append({
                'id': str(uuid.uuid4()),
                'program': program,
                'sub_program': sp,
                'esp_profession': None,
                'esp_level': None,
                'label': f'{program} - {sp}'
            })

for p in ['U-Prep', 'U-Assist']:
    rows.append({
        'id': str(uuid.uuid4()),
        'program': p,
        'sub_program': p,
        'esp_profession': None,
        'esp_level': None,
        'label': p
    })

lines = []
for r in rows:
    sub = 'NULL' if r['sub_program'] is None else f"'{r['sub_program']}'"
    prof = 'NULL' if r['esp_profession'] is None else f"'{r['esp_profession']}'"
    lvl = 'NULL' if r['esp_level'] is None else f"'{r['esp_level']}'"
    lines.append(
        f"('{r['id']}', '{r['program']}', {sub}, {prof}, {lvl}, '{r['label']}')"
    )

print("INSERT INTO syllabus (id, program, sub_program, esp_profession, esp_level, label) VALUES")
print(",\n".join(lines) + ";")