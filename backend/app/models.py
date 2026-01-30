from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, description="Full name of employee")
    email: EmailStr
    department: str = Field(..., min_length=1, description="Department name")


class EmployeeResponse(BaseModel):
    id: str
    employee_id: str
    full_name: str
    email: str
    department: str

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, description="Employee ID")
    date: date
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: str
    status: str

    class Config:
        from_attributes = True
