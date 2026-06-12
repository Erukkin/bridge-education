from sqlalchemy import Column, String, Boolean
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    nama_lengkap = Column(String)
    jenis_kelamin = Column(String)
    no_telp = Column(String)

    program = Column(String)
    # GE/AE/Foundation/IELTS/TOEFL sub-program / level (mis: "JHS B1", "B1+", "1", etc.)
    sub_program = Column(String, nullable=True)

    # ESP specific
    esp_profession = Column(String, nullable=True)  # Business/Medical/Hospitality
    esp_level = Column(String, nullable=True)        # B1, B1+, B2, C1, C2

    class_type = Column(String)
    age_group = Column(String, nullable=True)  # only for GE in the current UI
    mode = Column(String)
    class_id = Column(String)


class Class(Base):
    __tablename__ = "classes"

    name = Column(String, primary_key=True, index=True)
    program = Column(String)

    # mirrors Student.sub_program for GE/AE/Foundation/IELTS/TOEFL
    sub_program = Column(String, nullable=True)

    # mirrors Student.esp_profession & Student.esp_level for ESP
    esp_profession = Column(String, nullable=True)
    esp_level = Column(String, nullable=True)

    class_type = Column(String)
    age_group = Column(String, nullable=True)
    mode = Column(String)
    student_ids = Column(String)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # 'admin' | 'student'
    student_id = Column(String, nullable=True)  # link ke murid kalau role student
    plain_password = Column(String, nullable=True)  # buat admin liat password murid


class Syllabus(Base):
    __tablename__ = "syllabus"

    id = Column(String, primary_key=True, index=True)

    program = Column(String)  # GE/AE/Foundation/ESP/IELTS/TOEFL/U-Prep/U-Assist

    # GE/AE/Foundation/IELTS/TOEFL sub-program/level label (ex: "Pre-A1", "JHS B1", "1")
    sub_program = Column(String, nullable=True)

    # ESP specific (profession + level)
    esp_profession = Column(String, nullable=True)  # Business/Medical/Hospitality
    esp_level = Column(String, nullable=True)        # B1, B1+, B2, C1, C2

    # Kolom baru untuk kelompok umur khusus GE
    ge_age_group = Column(String, nullable=True)

    # UI convenience label (ex: "GE - Pre-A1" / "ESP - Business B1+")
    label = Column(String)
    # Optional: meetings/capacity not used for tasks UI right now, but can be added later

