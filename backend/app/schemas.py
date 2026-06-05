from pydantic import BaseModel
from typing import Optional, List

class StudentBase(BaseModel):
    nama_lengkap: str
    jenis_kelamin: str
    no_telp: str
    program: str
    class_type: str
    age_group: Optional[str] = None
    mode: str
    class_id: str

class StudentCreate(StudentBase):
    id: str

class StudentResponse(StudentBase):
    id: str

    class Config:
        from_attributes = True

class ClassBase(BaseModel):
    name: str
    program: str
    class_type: str
    age_group: Optional[str] = None
    mode: str
    student_ids: List[str] = []

class ClassResponse(ClassBase):
    class Config:
        from_attributes = True