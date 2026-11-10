import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Classroom } from '@/types'
import { classroomApi } from '@/api/classrooms'
export type StoreStatus = 'idle' | 'loading' | 'success' | 'error'

export const useClassroomsStore = defineStore('classrooms', () => {
    const classrooms = ref<Classroom[]>([])
    const status = ref<StoreStatus>('idle')
    const error = ref<string | null>(null)

    const byId = computed(() => {
        return (id: string | number) => classrooms.value.find(c => String(c.id) === String(id))
    })

    async function fetchAll() {
        status.value = 'loading'
        error.value = null
        try {
            classrooms.value = await classroomApi.list()
            status.value = 'success'
        } catch (err: unknown) {
            status.value = 'error'
            error.value = err instanceof Error ? err.message : 'Failed to fetch classrooms'
        }
    }

    return { classrooms, status, error, byId, fetchAll }
})