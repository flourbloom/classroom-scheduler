import { request } from './http'
import type { User } from '@/types'

export const userApi = {
  list: () => request<User[]>('/users'),
  getById: (id: string | number) => request<User>(`/users/${id}`),
}

