from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token, generate_random_password
import uuid

router = APIRouter()

ADMIN_REGISTRATION_PASSWORD = "Bridge2026Digital"

# ── LOGIN ──────────────────────────────────────────────
@router.post("/login", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({
        "sub": user.id,
        "role": user.role,
        "student_id": user.student_id
    })

    return {
        "access_token": token,
        "role": user.role,
        "student_id": user.student_id
    }

# ── REGISTER ADMIN ─────────────────────────────────────
@router.post("/register-admin", response_model=schemas.UserResponse)
def register_admin(request: schemas.UserCreate, db: Session = Depends(get_db)):
    # Cek password khusus admin
    if request.password != ADMIN_REGISTRATION_PASSWORD:
        raise HTTPException(status_code=403, detail="Invalid admin registration password")

    # Cek username sudah ada
    existing = db.query(models.User).filter(models.User.username == request.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Generate password untuk admin
    plain_pass = generate_random_password(10)

    db_user = models.User(
        id=str(uuid.uuid4()),
        username=request.username,
        hashed_password=hash_password(plain_pass),
        role="admin",
        student_id=None,
        plain_password=plain_pass
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ── CREATE STUDENT USER ────────────────────────────────
@router.post("/create-student-user", response_model=schemas.UserResponse)
def create_student_user(student_id: str, db: Session = Depends(get_db)):
    # Ambil data murid
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Cek apakah sudah punya akun
    existing = db.query(models.User).filter(models.User.student_id == student_id).first()
    if existing:
        return existing

    # Generate credentials
    username = f"{student.nama_lengkap} {student.id}"
    plain_pass = generate_random_password(8)

    db_user = models.User(
        id=str(uuid.uuid4()),
        username=username,
        hashed_password=hash_password(plain_pass),
        role="student",
        student_id=student_id,
        plain_password=plain_pass
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ── GET STUDENT USER (buat admin liat password) ────────
@router.get("/student-user/{student_id}", response_model=schemas.UserResponse)
def get_student_user(student_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.student_id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ── CHANGE PASSWORD ────────────────────────────────────
@router.post("/change-password")
def change_password(user_id: str, request: schemas.ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(request.old_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Old password is incorrect")
    user.hashed_password = hash_password(request.new_password)
    user.plain_password = request.new_password
    db.commit()
    return {"message": "Password changed successfully"}

# ── GET ALL ADMINS ─────────────────────────────────────
@router.get("/admins", response_model=list[schemas.UserResponse])
def get_admins(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "admin").all()

# ── DELETE USER ────────────────────────────────────────
@router.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

@router.post("/reset-student-password/{student_id}")
def reset_student_password(student_id: str, new_password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.student_id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = hash_password(new_password)
    user.plain_password = new_password
    db.commit()
    return {"message": "Password reset successfully"}

@router.post("/change-admin-password")
def change_admin_password(user_id: str, request: schemas.ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(request.old_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Old password is incorrect")
    user.hashed_password = hash_password(request.new_password)
    user.plain_password = request.new_password
    db.commit()
    return {"message": "Password changed successfully"}