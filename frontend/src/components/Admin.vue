<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClassroomsStore } from '@/stores/classrooms'
import { useSessionsStore } from '@/stores/sessions'
import LoadingPage from '@/components/LoadingPage.vue'

const classroomsStore = useClassroomsStore()
const sessionsStore = useSessionsStore()

const activeTab = ref('Fixed schedule')
const selectedGroup = ref('all')
const selectedSemester = ref('Semester 1')

const tabs = ['Fixed schedule', 'Missed classes', 'Teachers', 'Courses', 'Classrooms']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

onMounted(() => {
  classroomsStore.fetchAll()
  sessionsStore.fetchAll()
})
</script>

<template>
  <div class="workspace-layout">
    <aside class="side-pane">
      <h4 class="side-title">Admin navigation</h4>
      <ul class="admin-nav-list">
        <li
          v-for="t in tabs"
          :key="t"
          :class="{ active: activeTab === t }"
          @click="activeTab = t"
        >
          {{ t }}
        </li>
      </ul>

      <div class="conflict-rules">
        <h5>Conflict rules</h5>
        <p>• No room double-booking (409)<br>• No group double-booking<br>• Missed class releases room</p>
      </div>
    </aside>

    <section class="main-content">
      <LoadingPage
        v-if="classroomsStore.status === 'loading' || sessionsStore.status === 'loading'"
        message="Loading administrative records from database..."
      />
      <!-- TAB 1: Fixed Schedule Grid from db.json -->
      <div v-else-if="activeTab === 'Fixed schedule'">
        <header class="section-header">
          <h2 class="section-title">Fixed Weekly Schedule (Recurring)</h2>
          <div class="controls-row">
            <label>Student group:
              <select v-model="selectedGroup">
                <option value="all">All groups</option>
                <option value="I3-SE">I3-SE</option>
              </select>
            </label>

            <label>Semester:
              <select v-model="selectedSemester">
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </label>

            <button class="btn-primary">Done</button>
          </div>
        </header>

        <div class="recurring-grid">
          <div class="grid-header">
            <div class="col-slot">Slot</div>
            <div v-for="d in days" :key="d" class="col-day">{{ d }}</div>
          </div>

          <div v-for="slotNum in [1, 2, 3, 4, 5, 6, 7, 8]" :key="slotNum" class="grid-row">
            <div class="col-slot slot-info-cell">Slot {{ slotNum }}</div>
            <div v-for="d in days" :key="d" class="col-day cell">
              <!-- TODO: data from sessions in db.json-->

            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: Classrooms from db.json (node 3:25199) -->
      <div v-else-if="activeTab === 'Classrooms'">
        <header class="section-header">
          <h2 class="section-title">Classrooms ({{ classroomsStore.classrooms.length }} in db.json)</h2>
          <button>Add Classroom</button>
        </header>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Name</th>
              <th>Building</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in classroomsStore.classrooms" :key="c.id">
              <td>#{{ c.id }}</td>
              <td><strong>{{ c.name }}</strong></td>
              <td>Building {{ c.building }}</td>
              <td>{{ c.capacity }} seats</td>
              <button>Edit</button> <!--TODO-->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB 3: Courses from db.json -->
      <div v-else-if="activeTab === 'Courses'">
        <header class="section-header">
          <h2 class="section-title">Courses ({{ sessionsStore.courses.length }} in db.json)</h2>
          <button>Add Courses</button>
        </header>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Course Name</th>
              <th>Teacher Name</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="crs in sessionsStore.courses" :key="crs.id">
              <td>#{{ crs.id }}</td>
              <td><span class="tag">{{ crs.code }}</span></td>
              <td><strong>{{ crs.name }}</strong></td>
              <td>{{ sessionsStore.users.find(u => u.id === crs.teacherId)?.name }}</td> <!--teacher name-->
              <td>Semester {{ crs.semester }}</td>
              <button>Edit</button> <!--TODO-->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB 4: Teachers from db.json -->
      <div v-else-if="activeTab === 'Teachers'">
        <header class="section-header">
          <h2 class="section-title">Faculty Teachers ({{ sessionsStore.users.length }} in db.json)</h2>
          <button>Add Teacher</button>
        </header>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in sessionsStore.users" :key="u.id">
              <td>#{{ u.id }}</td>
              <td><strong>{{ u.name }}</strong></td>
              <td>{{ u.email }}</td>
              <td><span class="role-badge">{{ u.role }}</span></td>
              <button>Edit</button> <!--TODO-->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB 5: Missed Classes Audit -->
      <div v-else-if="activeTab === 'Missed classes'">
        <header class="section-header">
          <h2 class="section-title">Missed classes audit log</h2>
        </header>
        <p class="empty-note">All 22 recurring sessions are currently active and confirmed.</p>
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
  flex-shrink: 0;
  overflow-y: auto;
}

.side-title {
  font-size: 12px;
  font-weight: 700;
  line-height: 16.8px;
  color: var(--color-text-secondary);
  margin: 0 0 10px 0;
}

.admin-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.admin-nav-list li {
  padding: 5px 8px;
  border-radius: 2px;
  font-size: 13px;
  cursor: pointer;
  color: var(--color-shark);
}

.admin-nav-list li:hover {
  background-color: #e4e7ea;
}

.admin-nav-list li.active {
  font-weight: 700;
  color: var(--color-lochmara);
  background-color: var(--color-blue-bg);
}

.conflict-rules {
  border-top: 1px solid var(--color-iron);
  margin-top: 20px;
  padding-top: 10px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.conflict-rules h5 {
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-shark);
}

.conflict-rules p {
  margin: 0;
  line-height: 1.5;
}

.main-content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Admin Tabs matching Figma 3:25226 */
.admin-tabs {
  height: 34px;
  border-bottom: 1px solid var(--color-iron);
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
}

.tab-item {
  height: 34px;
  background: none;
  border: none;
  padding: 0 14px;
  font-size: 14px;
  line-height: 19.6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
}

.tab-item:hover {
  color: var(--color-shark);
}

.tab-item.active {
  color: var(--color-shark);
  font-weight: 700;
  border-bottom-color: var(--color-lochmara);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding: 0 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-shark);
  margin: 0;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.controls-row select {
  height: 28px;
  padding: 2px 6px;
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  font-size: 12px;
  background-color: var(--color-input-bg, var(--color-white));
  color: var(--color-shark);
}

.btn-primary {
  background-color: var(--color-lochmara);
  color: var(--color-white);
  border: 1px solid var(--color-lochmara);
  border-radius: 2px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.recurring-grid {
  border: 1px solid var(--color-iron);
  border-radius: 2px;
}

.grid-header {
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  background-color: var(--color-athens-gray);
  border-bottom: 1px solid var(--color-iron);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.col-slot, .col-day {
  padding: 7px 8px;
  border-right: 1px solid var(--color-iron);
}

.col-day:last-child {
  border-right: none;
}

.grid-row {
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  min-height: 55px;
  border-bottom: 1px solid var(--color-iron);
}

.grid-row:last-child {
  border-bottom: none;
}

.slot-info-cell {
  background-color: var(--color-athens-gray);
  font-size: 11px;
}

.cell {
  background-color: var(--color-white);
  padding: 4px;
}

.session-box {
  background-color: var(--color-blue-bg);
  border: 1px solid #c8e1ff;
  border-left: 3px solid var(--color-lochmara);
  border-radius: 2px;
  padding: 4px 6px;
  font-size: 11px;
}

.box-head {
  display: flex;
  justify-content: space-between;
}

.box-head .edit {
  color: var(--color-lochmara);
  cursor: pointer;
  font-size: 10px;
}

.tags {
  display: flex;
  gap: 4px;
  margin-top: 3px;
}

.tag {
  background-color: var(--color-white);
  color: var(--color-shark);
  border: 1px solid var(--color-iron);
  padding: 0 4px;
  border-radius: 2px;
  font-size: 9px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background-color: var(--color-athens-gray);
  color: var(--color-text-secondary);
  text-align: left;
  padding: 7px 8px;
  font-size: 12px;
  font-weight: 700;
  border-top: 1px solid var(--color-iron);
  border-bottom: 1px solid var(--color-iron);
}

.data-table td {
  padding: 8px;
  border-bottom: 1px solid var(--color-iron);
  color: var(--color-shark);
}

.role-badge {
  background-color: var(--color-athens-gray);
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
}

.empty-note {
  color: var(--color-text-secondary);
  font-size: 14px;
  padding: 20px 8px;
}
</style>
