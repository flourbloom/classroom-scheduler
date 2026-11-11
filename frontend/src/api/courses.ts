import { request } from './http'
import type { Course } from '@/types'

export const courseApi = {
  list: () => request<Course[]>('/courses'),
  getById: (id: string | number) => request<Course>(`/courses/${id}`),
}

