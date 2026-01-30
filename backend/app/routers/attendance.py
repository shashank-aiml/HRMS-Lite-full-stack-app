from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, status
from app.database import get_database
from app.models import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


def _attendance_to_response(doc: dict) -> AttendanceResponse:
    d = doc.get("date", "")
    return AttendanceResponse(
        id=str(doc["_id"]),
        employee_id=doc["employee_id"],
        date=str(d)[:10],
        status=doc.get("status", ""),
    )


@router.get("", response_model=list[AttendanceResponse])
def list_attendance(
    employee_id: str | None = Query(None, description="Filter by employee ID"),
    start_date: str | None = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: str | None = Query(None, description="Filter to date (YYYY-MM-DD)"),
):
    db = get_database()
    query = {}
    if employee_id:
        query["employee_id"] = employee_id
    if start_date or end_date:
        query["date"] = {}
        if start_date:
            query["date"]["$gte"] = start_date
        if end_date:
            query["date"]["$lte"] = end_date

    records = list(db.attendance.find(query).sort("date", -1))
    return [_attendance_to_response(r) for r in records]


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(payload: AttendanceCreate):
    db = get_database()

    employee = db.employees.find_one({"employee_id": payload.employee_id})
    if not employee:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID '{payload.employee_id}' not found.",
        )

    date_str = payload.date.isoformat()

    existing = db.attendance.find_one({
        "employee_id": payload.employee_id,
        "date": date_str,
    })
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Attendance already marked for this date.",
        )

    doc = {
        "employee_id": payload.employee_id,
        "date": date_str,
        "status": payload.status.value,
    }

    result = db.attendance.insert_one(doc)
    doc["_id"] = result.inserted_id

    return _attendance_to_response(doc)
