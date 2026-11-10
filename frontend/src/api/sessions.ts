import { request } from './http'
import type { Session } from '@/types'

export const sessionApi = {
    list: () => request<Session[]>('/sessions'),
    create: (session: Partial<Session>) => request<Session>(
        '/sessions',
        {
            method: 'POST',
            body: JSON.stringify(session),
        }),
    patch: (id: string | number, data: Partial<Session>) => request<Session>(
        `/sessions/${id}`,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
}
