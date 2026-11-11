import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Classroom } from '@/types'
import { classroomApi } from '@/api/classrooms'
export type StoreStatus = 'idle' | 'loading' | 'success' | 'error'

export const useClassroomsStore = defineStore('classrooms', () => {
    // 1. State
    const classrooms = ref<Classroom[]>([])
    const status = ref<StoreStatus>('idle')
    const error = ref<string | null>(null)
    // 2. Computed / Getters
    const byId = computed(() => {
        return (id: string | number) =>
            classrooms.value.find(c => String(c.id) === String(id))
    })

    const isLoading = computed(() => status.value === 'loading')
    const isError = computed(() => status.value === 'error')
    const isEmpty = computed(() => status.value === 'success' && classrooms.value.length === 0)

    // 3. Actions
    async function fetchAll(force = false) {
        // Cache: skip fetching if data is already loaded in store
        if (!force && status.value === 'success' && classrooms.value.length > 0) {
            return
        }

        status.value = 'loading'
        error.value = null
        try {
            const [data] = await Promise.all([
                classroomApi.list(),
                new Promise((resolve) => setTimeout(resolve, 2000)),
            ])
            classrooms.value = data
            status.value = 'success'
        } catch (err: unknown) {
            status.value = 'error'
            error.value =
                err instanceof Error ? err.message : 'Failed to fetch classrooms'
        }
    }
    return {
        classrooms,
        status,
        error,
        byId,
        isLoading,
        isError,
        isEmpty,
        fetchAll,
    }
})