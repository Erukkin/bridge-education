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

# ── AUTH ──────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    role: str
    student_id: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    password: str
    role: str
    student_id: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    role: str
    student_id: Optional[str] = None
    plain_password: Optional[str] = None

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str