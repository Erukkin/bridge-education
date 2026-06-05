from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
import json

router = APIRouter()

# ── STUDENTS ──────────────────────────────────────────

@router.get("/students", response_model=list[schemas.StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@router.post("/students", response_model=schemas.StudentResponse)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.put("/students/{student_id}", response_model=schemas.StudentResponse)
def update_student(student_id: str, student: schemas.StudentBase, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.delete("/students/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return { "message": "Student deleted" }

# ── CLASSES ───────────────────────────────────────────

@router.get("/classes", response_model=list[schemas.ClassResponse])
def get_classes(db: Session = Depends(get_db)):
    classes = db.query(models.Class).all()
    result = []
    for c in classes:
        c_dict = {
            "name": c.name,
            "program": c.program,
            "class_type": c.class_type,
            "age_group": c.age_group,
            "mode": c.mode,
            "student_ids": json.loads(c.student_ids) if c.student_ids else []
        }
        result.append(c_dict)
    return result

@router.post("/classes", response_model=schemas.ClassResponse)
def create_class(kelas: schemas.ClassBase, db: Session = Depends(get_db)):
    db_class = models.Class(
        name=kelas.name,
        program=kelas.program,
        class_type=kelas.class_type,
        age_group=kelas.age_group,
        mode=kelas.mode,
        student_ids=json.dumps(kelas.student_ids)
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return {**kelas.dict()}

@router.put("/classes/{class_name}", response_model=schemas.ClassResponse)
def update_class(class_name: str, kelas: schemas.ClassBase, db: Session = Depends(get_db)):
    db_class = db.query(models.Class).filter(models.Class.name == class_name).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db_class.program = kelas.program
    db_class.class_type = kelas.class_type
    db_class.age_group = kelas.age_group
    db_class.mode = kelas.mode
    db_class.student_ids = json.dumps(kelas.student_ids)
    db.commit()
    db.refresh(db_class)
    return {**kelas.dict()}

@router.delete("/classes/{class_name}")
def delete_class(class_name: str, db: Session = Depends(get_db)):
    db_class = db.query(models.Class).filter(models.Class.name == class_name).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(db_class)
    db.commit()
    return { "message": "Class deleted" }