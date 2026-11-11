import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, Course, Classroom, User } from '@/types'
import { sessionApi } from '@/api/sessions'
import { courseApi } from '@/api/courses'
import { classroomApi } from '@/api/classrooms'
import { userApi } from '@/api/users'

export interface EnrichedSession extends Session {
  courseName: string
  courseCode: string
  classroomName: string
  building: string
  teacherName: string
}

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<Session[]>([])
  const courses = ref<Course[]>([])
  const classrooms = ref<Classroom[]>([])
  const users = ref<User[]>([])
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const error = ref<string | null>(null)

  const coursesById = computed(() => new Map(courses.value.map((c) => [String(c.id), c])))
  const classroomsById = computed(() => new Map(classrooms.value.map((r) => [String(r.id), r])))
  const usersById = computed(() => new Map(users.value.map((u) => [String(u.id), u])))

  function getCourse(courseId: string | number) {
    return coursesById.value.get(String(courseId))
  }

  function getClassroom(classroomId: string | number) {
    return classroomsById.value.get(String(classroomId))
  }

  function getTeacher(teacherId: string | number) {
    return usersById.value.get(String(teacherId))
  }

  const enrichedSessions = computed<EnrichedSession[]>(() => {
    return sessions.value.map((s) => {
      const course = getCourse(s.courseId)
      const classroom = getClassroom(s.classroomId)
      const teacher = course ? getTeacher(course.teacherId) : null

      return {
        ...s,
        courseName: course?.name ?? `Course #${s.courseId}`,
        courseCode: course?.code ?? '',
        classroomName: classroom?.name ?? `Room #${s.classroomId}`,
        building: classroom?.building ?? '',
        teacherName: teacher?.name ?? 'Instructor',
      }
    })
  })

  async function fetchAll(force = false) {
    // Cache: skip fetching if data is already loaded in store
    if (!force && status.value === 'success' && sessions.value.length > 0) {
      return
    }

    status.value = 'loading'
    error.value = null
    try {
      const [fetchedSessions, fetchedCourses, fetchedClassrooms, fetchedUsers] =
        await Promise.all([
          sessionApi.list(),
          courseApi.list(),
          classroomApi.list(),
          userApi.list(),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ])
      sessions.value = fetchedSessions
      courses.value = fetchedCourses
      classrooms.value = fetchedClassrooms
      users.value = fetchedUsers
      status.value = 'success'
    } catch (err: unknown) {
      status.value = 'error'
      error.value = err instanceof Error ? err.message : 'Failed to load sessions data'
    }
  }

  return {
    sessions,
    courses,
    classrooms,
    users,
    status,
    error,
    enrichedSessions,
    getCourse,
    getClassroom,
    getTeacher,
    fetchAll,
  }
})

