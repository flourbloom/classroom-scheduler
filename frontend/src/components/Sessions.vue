<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'
import LoadingPage from '@/components/LoadingPage.vue'

const store = useSessionsStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedType = ref('All')
const selectedGroup = ref('all')
const fromDate = ref('')
const toDate = ref('')
const myScheduleOnly = ref(false)

onMounted(() => {
  store.fetchAll()
})

const filteredSessions = computed(() => {
  return store.enrichedSessions.filter((s) => {
    // 1. Search text filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match =
        s.courseName.toLowerCase().includes(q) ||
        s.teacherName.toLowerCase().includes(q) ||
        s.classroomName.toLowerCase().includes(q) ||
        s.studentGroup.toLowerCase().includes(q)
      if (!match) return false
    }

    // 2. Type filter (FIXED vs MAKEUP)
    if (selectedType.value !== 'All' && s.type.toUpperCase() !== selectedType.value.toUpperCase()) {
      return false
    }

    // 3. Student group filter
    if (selectedGroup.value !== 'all' && s.studentGroup !== selectedGroup.value) {
      return false
    }

    // 4. Date range filter
    if (fromDate.value && s.date < fromDate.value) return false
    if (toDate.value && s.date > toDate.value) return false

    // 5. My schedule only
    if (myScheduleOnly.value && authStore.currentUser) {
      const isMyClass =
        s.createdById === authStore.currentUser.id ||
        s.teacherName.toLowerCase().includes(authStore.currentUser.name.toLowerCase())
      if (!isMyClass) return false
    }

    return true
  })
})
</script>

<template>
  <div class="workspace-layout">
    <!-- Figma Side Pane (node 3:23894) -->
    <aside class="side-pane">
      <h4 class="side-title">Filter</h4>

      <div class="form-field">
        <label for="search-input">Search</label>
        <div class="input-container">
          <input
            id="search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Course, teacher, group"
          />
        </div>
      </div>

      <div class="form-field">
        <label for="type-select">Type</label>
        <div class="input-container select-container">
          <select id="type-select" v-model="selectedType">
            <option value="All">All</option>
            <option value="FIXED">Fixed</option>
            <option value="MAKEUP">Makeup</option>
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="group-select">Student group</label>
        <div class="input-container select-container">
          <select id="group-select" v-model="selectedGroup">
            <option value="all">All groups</option>
            <option value="I3-SE">I3-SE</option>
            <option value="I3-CS">I3-CS</option>
            <option value="I4-SE">I4-SE</option>
          </select>
        </div>
      </div>

      <div class="form-field">
        <label for="from-input">From</label>
        <div class="input-container">
          <input id="from-input" v-model="fromDate" type="date" />
        </div>
      </div>

      <div class="form-field">
        <label for="to-input">To</label>
        <div class="input-container">
          <input id="to-input" v-model="toDate" type="date" />
        </div>
      </div>

      <div class="apply-action">
        <button class="btn-primary full-width" @click="store.fetchAll()">
          Apply
        </button>
      </div>
    </aside>

    <!-- Figma Main Content (node 3:23880) -->
    <section class="main-content">
      <header class="panel-header">
        <h2 class="panel-title">All sessions</h2>
        <div class="ownership-toggle">
          <input id="my-sched-only" v-model="myScheduleOnly" type="checkbox" />
          <label for="my-sched-only">My schedule only</label>
        </div>
      </header>

      <!-- Loading / Error states -->
      <LoadingPage v-if="store.status === 'loading'" message="Loading sessions from database..." />

      <div v-else-if="store.status === 'error'" class="state-container error-state">
        <p class="error-msg">{{ store.error }}</p>
        <button class="btn-secondary" @click="store.fetchAll(true)">Try Again</button>
      </div>

      <div
        v-else-if="store.status === 'success' && filteredSessions.length === 0"
        class="state-container"
      >
        <p>No sessions match your filter criteria.</p>
      </div>

      <!-- Records Table loaded from db.json -->
      <div v-else-if="store.status === 'success'" class="records-table">
        <div class="table-header">
          <div class="col-date">Date</div>
          <div class="col-slot">Slot</div>
          <div class="col-course">Course</div>
          <div class="col-teacher">Teacher</div>
          <div class="col-room">Room</div>
          <div class="col-group">Group</div>
          <div class="col-type">Type</div>
          <div class="col-status">Status</div>
        </div>

        <div
          v-for="s in filteredSessions"
          :key="s.id"
          class="record-row"
        >
          <div class="col-date">{{ s.date }}</div>
          <div class="col-slot">Slot {{ s.slotNumber }}</div>
          <div class="col-course course-name">{{ s.courseName }}</div>
          <div class="col-teacher">{{ s.teacherName }}</div>
          <div class="col-room">{{ s.classroomName }}</div>
          <div class="col-group">{{ s.studentGroup }}</div>
          <div class="col-type">
            <span class="badge" :class="s.type.toLowerCase()">{{ s.type }}</span>
          </div>
          <div class="col-status">
            <span class="status-pill" :class="s.status.toLowerCase()">
              {{ s.status }}
            </span>
          </div>
        </div>

        <div class="pagination">
          <span class="page-text">
            Page 1 of 1 · {{ filteredSessions.length }} results (db.json)
          </span>
          <button class="page-btn" disabled>‹</button>
          <button class="page-btn active">1</button>
          <button class="page-btn" disabled>›</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.workspace-layout {
  display: flex;
  align-items: stretch;
  height: calc(100vh - 44px);
  max-height: calc(100vh - 44px);
  width: 100%;
  background-color: var(--color-white);
  overflow: hidden;
}

.side-pane {
  width: 210px;
  background-color: var(--color-athens-gray);
  border-right: 1px solid var(--color-iron);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  overflow-y: auto;
}

.side-title {
  font-size: 12px;
  font-weight: 700;
  line-height: 16.8px;
  color: var(--color-text-secondary);
  margin: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
}

.form-field label {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin: 0;
}

.input-container {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  min-height: 33px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-container input,
.input-container select {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--color-shark);
  padding: 0;
  margin: 0;
}

.apply-action {
  padding-top: 4px;
  width: 100%;
}

.btn-primary {
  background-color: var(--color-lochmara);
  border: 1px solid var(--color-lochmara);
  border-radius: 2px;
  padding: 6px 12px;
  color: var(--color-white);
  font-size: 14px;
  line-height: 19.6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary.full-width {
  width: 100%;
}

.btn-secondary {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 6px 12px;
  color: var(--color-shark);
  font-size: 14px;
  line-height: 19.6px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-shark);
  margin: 0;
}

.ownership-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-shark);
}

.records-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.table-header {
  background-color: var(--color-athens-gray);
  display: flex;
  align-items: flex-start;
  width: 100%;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  line-height: 16.8px;
}

.table-header > div,
.record-row > div {
  padding: 7px 8px;
}

.record-row {
  border-bottom: 1px solid var(--color-iron);
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  line-height: 19.6px;
  color: var(--color-shark);
}

.col-date { width: 110px; flex-shrink: 0; }
.col-slot { width: 80px; flex-shrink: 0; }
.col-course { width: 240px; flex-shrink: 0; }
.col-teacher { width: 120px; flex-shrink: 0; }
.col-room { width: 100px; flex-shrink: 0; }
.col-group { width: 90px; flex-shrink: 0; }
.col-type { width: 90px; flex-shrink: 0; }
.col-status { flex: 1; }

.badge {
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 1px 4px;
  font-size: 10px;
  background-color: var(--color-white);
  color: var(--color-shark);
}

.badge.makeup {
  border-color: var(--color-green);
  color: var(--color-green);
}

.status-pill.missed {
  border: 1px solid var(--color-red);
  color: var(--color-red);
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 700;
}

.status-pill.confirmed {
  color: var(--color-shark);
}

.pagination {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding-top: 8px;
  font-size: 14px;
  line-height: 19.6px;
  color: var(--color-text-secondary);
}

.page-text {
  margin-right: 4px;
}

.page-btn {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 3px 9px;
  font-size: 14px;
  color: var(--color-shark);
  cursor: pointer;
}

.page-btn.active {
  background-color: var(--color-lochmara);
  border-color: var(--color-lochmara);
  color: var(--color-white);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.state-container {
  padding: 40px;
  text-align: center;
  background-color: var(--color-athens-gray);
  border: 1px dashed var(--color-iron);
  border-radius: 2px;
  font-size: 14px;
}

.error-state {
  border-color: #f97583;
  background-color: #ffeef0;
  color: var(--color-red);
}
</style>
