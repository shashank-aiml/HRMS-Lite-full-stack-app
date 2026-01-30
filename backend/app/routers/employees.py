from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from app.database import get_database
from app.models import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/api/employees", tags=["employees"])


def _employee_to_response(doc: dict) -> EmployeeResponse:
    return EmployeeResponse(
        id=str(doc["_id"]),
        employee_id=doc["employee_id"],
        full_name=doc["full_name"],
        email=doc["email"],
        department=doc["department"],
    )


@router.get("", response_model=list[EmployeeResponse])
def list_employees():
    """Get all employees."""
    db = get_database()
    employees = list(db.employees.find())
    return [_employee_to_response(e) for e in employees]


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def add_employee(payload: EmployeeCreate):
    """Add a new employee. Employee ID must be unique."""
    db = get_database()
    existing = db.employees.find_one({"employee_id": payload.employee_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with ID '{payload.employee_id}' already exists.",
        )
    doc = {
        "employee_id": payload.employee_id,
        "full_name": payload.full_name,
        "email": payload.email,
        "department": payload.department,
    }
    result = db.employees.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _employee_to_response(doc)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str):
    """Delete an employee by their unique Employee ID."""
    db = get_database()
    result = db.employees.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found.",
        )
    db.attendance.delete_many({"employee_id": employee_id})
    return None
