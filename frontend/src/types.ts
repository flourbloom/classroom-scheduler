/*
======================
    ENTITIES
======================
*/

export enum Role {
    Admin = 'Admin',
    Teacher = 'Teacher'
}

export enum Semester {
    Semester1 = 'SEMESTER_1',
    Semester2 = 'SEMESTER_2',
}

export enum SessionType {
    Fixed = 'FIXED',
    Makeup = 'MAKEUP',
}

export enum SessionStatus {
    Confirmed = 'CONFIRMED',
    Missed = 'MISSED',
    Cancelled = 'CANCELLED'
}

export enum DeliveryMode {
    Lecture = 'Lecture',
    Practical = 'Practical',
}


export interface User {
    id: string //uuid
    name: string
    email: string
    password: string //hashed
    role: Role
}

export interface Classroom {
    id: string
    name: string
    building: string
    capacity: number
}

export interface Course {
    id: string
    code: string
    name: string
    teacherId: string
    semester: Semester
}


export interface Session {
    id: string
    type: SessionType
    status: SessionStatus
    studentGroup: string
    academicYear: string
    deliveryMode: DeliveryMode
    date: string // ISO date YYYY-MM-DD
    slotNumber: number // 1-8
    reason?: string | null
    courseId: string
    classroomId: string
    createdById: string
}
