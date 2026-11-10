import { request } from './http'
import type { Classroom } from '@/types'

export const classroomApi = {
    list: () => request<Classroom[]>('/classrooms'),
    getById: (id: string | number) => request<Classroom>(`/classroom/${id}`),
}