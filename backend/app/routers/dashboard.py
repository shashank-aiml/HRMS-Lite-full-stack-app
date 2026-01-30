from __future__ import annotations

from datetime import date
from fastapi import APIRouter
from pydantic import BaseModel
from app.database import get_database

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


class PresentDaysRow(BaseModel):
    employee_id: str
    full_name: str
    department: str
    present_days: int


class DashboardResponse(BaseModel):
    total_employees: int
    total_attendance_records: int
    today_present_count: int
    present_days_per_employee: list[PresentDaysRow]


@router.get("", response_model=DashboardResponse)
def get_dashboard():
    """Dashboard summary: counts and present days per employee."""
    db = get_database()
    today_str = date.today().isoformat()

    total_employees = db.employees.count_documents({})
    total_attendance_records = db.attendance.count_documents({})
    today_present_count = db.attendance.count_documents(
        {"date": today_str, "status": "Present"}
    )

    # Aggregate present days per employee
    pipeline = [
        {"$match": {"status": "Present"}},
        {"$group": {"_id": "$employee_id", "present_days": {"$sum": 1}}},
    ]
    agg = list(db.attendance.aggregate(pipeline))
    present_by_employee = {r["_id"]: r["present_days"] for r in agg}

    # Merge with all employees so we include those with 0 present days
    employees = list(db.employees.find({}))
    present_days_per_employee = [
        PresentDaysRow(
            employee_id=e["employee_id"],
            full_name=e["full_name"],
            department=e["department"],
            present_days=present_by_employee.get(e["employee_id"], 0),
        )
        for e in employees
    ]
    present_days_per_employee.sort(key=lambda x: (-x.present_days, x.full_name))

    return DashboardResponse(
        total_employees=total_employees,
        total_attendance_records=total_attendance_records,
        today_present_count=today_present_count,
        present_days_per_employee=present_days_per_employee,
    )
