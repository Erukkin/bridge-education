from sqlalchemy import Column, String, Boolean
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    nama_lengkap = Column(String)
    jenis_kelamin = Column(String)
    no_telp = Column(String)
    program = Column(String)
    class_type = Column(String)
    age_group = Column(String, nullable=True)
    mode = Column(String)
    class_id = Column(String)

class Class(Base):
    __tablename__ = "classes"

    name = Column(String, primary_key=True, index=True)
    program = Column(String)
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