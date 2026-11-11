import { ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function initTheme() {
    const saved = localStorage.getItem('classroomhub-theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
    } else {
      setDark(false)
    }
  }

  function setDark(val: boolean) {
    isDark.value = val
    if (val) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('classroomhub-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('classroomhub-theme', 'light')
    }
  }

  function toggleTheme() {
    setDark(!isDark.value)
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
    setDark
  }
}
