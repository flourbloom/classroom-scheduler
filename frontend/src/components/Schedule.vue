<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'
import LoadingPage from '@/components/LoadingPage.vue'

const store = useSessionsStore()
const authStore = useAuthStore()

const selectedGroup = ref('I3-SE')
const selectedRoom = ref('all')
const myScheduleOnly = ref(false)
const flippedSessionId = ref<string | null>(null)

const timeSlots = [
  { slot: 1, time: '07:00-07:55' },
  { slot: 2, time: '08:00-08:55' },
  { slot: 3, time: '09:10-10:05' },
  { slot: 4, time: '10:10-11:05' },
  { slot: 5, time: '13:00-13:55' },
  { slot: 6, time: '14:00-14:55' },
  { slot: 7, time: '15:10-16:05' },
  { slot: 8, time: '16:10-17:05' },
]   

// Dates matching db.json sessions
const weekDays = [
  { date: '2026-11-09', label: 'Mon 09 (Today)' },
  { date: '2026-11-10', label: 'Tue 10' },
  { date: '2026-11-11', label: 'Wed 11' },
  { date: '2026-11-12', label: 'Thu 12' },
  { date: '2026-11-13', label: 'Fri 13' },
  { date: '2026-11-14', label: 'Sat 14' },
]

onMounted(() => {
  store.fetchAll()
})

function getSession(date: string, slotNumber: number) {
  return store.enrichedSessions.find((s) => {
    if (s.date !== date || s.slotNumber !== slotNumber) return false
    if (selectedGroup.value !== 'all' && s.studentGroup !== selectedGroup.value) return false
    if (selectedRoom.value !== 'all' && s.classroomName !== selectedRoom.value) return false
    if (myScheduleOnly.value && authStore.currentUser) {
      if (!s.teacherName.toLowerCase().includes(authStore.currentUser.name.toLowerCase())) return false
    }
    return true
  })
}

function getCourseColorClass(courseCode: string) {
  const code = courseCode.toUpperCase()
  if (code.includes('IP')) return 'color-ip'
  if (code.includes('NSD')) return 'color-nsd'
  if (code.includes('ITPM')) return 'color-itpm'
  if (code.includes('SEC')) return 'color-sec'
  if (code.includes('SSA')) return 'color-ssa'
  return 'color-default'
}

function flipCard(id: string) {
  flippedSessionId.value = flippedSessionId.value === id ? null : id
}

function isCardFlipped(id: string) {
  return flippedSessionId.value === id
}

function flagAsMissed(session: any) {
  session.status = 'MISSED'
  flippedSessionId.value = null
}

const missedSessions = computed(() => {
  return store.enrichedSessions.filter((s) => s.status === 'MISSED')
})
</script>

<template>
  <div class="workspace-layout">
    <!-- Figma Side Pane (node 3:23140) -->
    <aside class="side-pane">
      <div class="filters-container">
        <h4 class="section-heading">View</h4>

        <div class="field-group">
          <label>Student group</label>
          <div class="input-container select-container">
            <select v-model="selectedGroup">
              <option value="I3-SE">I3-SE · Semester 1</option>
              <option value="all">All groups</option>
            </select>
          </div>
        </div>

        <div class="field-group">
          <label>Classroom</label>
          <div class="input-container select-container">
            <select v-model="selectedRoom">
              <option value="all">All rooms</option>
              <option value="A-420">A-420</option>
              <option value="J-602">J-602</option>
              <option value="A-417">A-417</option>
              <option value="J-603">J-603</option>
            </select>
          </div>
        </div>

        <div class="ownership-filter">
          <input id="my-sched" v-model="myScheduleOnly" type="checkbox" />
          <label for="my-sched">My schedule only</label>
        </div>

        <!-- Session status legend (node 3:23156) -->
        <div class="legend-group">
          <h4 class="section-heading">Session status</h4>
          <div class="legend-item">
            <div class="legend-swatch"><div class="marker marker-fixed"></div></div>
            <span class="legend-label">Fixed (regular)</span>
          </div>
          <div class="legend-item">
            <div class="legend-swatch dashed"><div class="marker marker-fixed"></div></div>
            <span class="legend-label">Makeup</span>
            <span class="status-badge-makeup">MAKEUP</span>
          </div>
          <p class="legend-note">Missed classes free slot & move to tray</p>
        </div>

        <!-- Ownership legend (node 3:23170) -->
        <div class="legend-group">
          <h4 class="section-heading">Ownership</h4>
          <div class="legend-item">
            <div class="legend-swatch swatch-mine"><div class="marker marker-mine"></div></div>
            <span class="legend-label">My class (editable)</span>
          </div>
          <div class="legend-item">
            <div class="legend-swatch"><div class="marker marker-other"></div></div>
            <span class="legend-label">Other faculty (view)</span>
          </div>
        </div>

        <!-- Course colors (node 3:23180) -->
        <div class="legend-group">
          <h4 class="section-heading">Course colors</h4>
          <div class="legend-item">
            <div class="legend-swatch"><div class="marker marker-ip"></div></div>
            <span class="legend-label">Internet Prog.</span>
          </div>
          <div class="legend-item">
            <div class="legend-swatch"><div class="marker marker-db"></div></div>
            <span class="legend-label">Database Systems</span>
          </div>
          <div class="legend-item">
            <div class="legend-swatch"><div class="marker marker-algo"></div></div>
            <span class="legend-label">Algorithms</span>
          </div>
          <div class="legend-item">
            <div class="legend-swatch"><div class="marker marker-net"></div></div>
            <span class="legend-label">Networks / Web</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Figma Main Content (node 3:23125) -->
    <section class="main-content">
      <!-- Top toolbar (node 3:23126) -->
      <header class="toolbar">
        <div class="controls-left">
          <button class="btn-tool" @click="store.fetchAll()">Today</button>
          <button class="btn-tool">‹</button>
          <button class="btn-tool">›</button>
          <span class="week-heading">09 – 14 November 2026</span>
        </div>
        <div class="term-info">
          Semester 1 term: 19 Oct 2026 – 27 Feb 2027 · Week 4 · Current Week
        </div>
      </header>

      <!-- Loading / Error states -->
      <LoadingPage v-if="store.status === 'loading'" message="Loading weekly timetable from database..." />
      <div v-else-if="store.status === 'error'" class="state-container error-state">
        <p>{{ store.error }}</p>
        <button class="btn-secondary" @click="store.fetchAll(true)">Try Again</button>
      </div>

      <!-- Weekly Grid -->
      <div v-else class="grid-table">
        <div class="grid-header">
          <div class="col-slot">Slot</div>
          <div v-for="d in weekDays" :key="d.date" class="col-day">
            {{ d.label }}
          </div>
        </div>

        <div class="grid-body">
          <div v-for="slotItem in timeSlots" :key="slotItem.slot" class="grid-row">
            <!-- Slot Cell -->
            <div class="col-slot slot-info-cell">
              <strong>Slot {{ slotItem.slot }}</strong>
              <small>{{ slotItem.time }}</small>
            </div>

            <!-- Day Columns -->
            <div
              v-for="d in weekDays"
              :key="d.date"
              class="col-day day-cell"
            >
              <div
                v-if="getSession(d.date, slotItem.slot)"
                class="card-flip-scene"
              >
                <div
                  class="card-flip-inner"
                  :class="{ 'is-flipped': isCardFlipped(getSession(d.date, slotItem.slot)!.id) }"
                >
                  <!-- Front of Card: Class Overview -->
                  <div
                    class="card-flip-front session-card"
                    :class="[
                      getCourseColorClass(getSession(d.date, slotItem.slot)!.courseCode),
                      { selected: isCardFlipped(getSession(d.date, slotItem.slot)!.id) }
                    ]"
                    @click="flipCard(getSession(d.date, slotItem.slot)!.id)"
                  >
                    <div class="card-header-row">
                      <div class="card-title">
                        {{ getSession(d.date, slotItem.slot)!.courseName }}
                      </div>
                      <span class="flip-icon" title="Click to flip card">↺</span>
                    </div>
                    <div class="card-meta">
                      {{ getSession(d.date, slotItem.slot)!.teacherName }} · {{ getSession(d.date, slotItem.slot)!.classroomName }}
                    </div>
                    <div class="card-badges">
                      <span
                        v-if="getSession(d.date, slotItem.slot)!.type === 'MAKEUP'"
                        class="status-badge-makeup"
                      >
                        MAKEUP
                      </span>
                      <span class="delivery-badge">
                        {{ getSession(d.date, slotItem.slot)!.deliveryMode }}
                      </span>
                    </div>
                  </div>

                  <!-- Back of Card: Flipped State with Contextual Action Controls -->
                  <div
                    class="card-flip-back session-card-back"
                    :class="getCourseColorClass(getSession(d.date, slotItem.slot)!.courseCode)"
                    @click.stop="flipCard(getSession(d.date, slotItem.slot)!.id)"
                  >
                    <div class="card-back-header">
                      <span class="back-course-code">{{ getSession(d.date, slotItem.slot)!.courseCode }}</span>
                    </div>
                    <div class="back-details">
                      <div class="back-line">Group: <strong>{{ getSession(d.date, slotItem.slot)!.studentGroup }}</strong></div>
                      <div class="back-line">Room: <strong>{{ getSession(d.date, slotItem.slot)!.classroomName }}</strong></div>
                    </div>
                    <div class="back-actions">
                      <button
                        type="button"
                        class="card-btn flag"
                        @click.stop="flagAsMissed(getSession(d.date, slotItem.slot))"
                      >
                        Flag missed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Missed Classes Tray (node 3:23416) -->
      <footer class="missed-tray">
        <h4 class="tray-heading">
          Pending missed classes ({{ missedSessions.length }})
        </h4>
        <div v-if="missedSessions.length === 0" class="no-missed">
          <p>No missed classes pending makeup assignment.</p>
        </div>
        <div v-else class="missed-cards-list">
          <div
            v-for="m in missedSessions"
            :key="m.id"
            class="missed-card"
          >
            <div class="missed-title">{{ m.courseName }}</div>
            <div class="missed-meta">{{ m.date }} · Slot {{ m.slotNumber }} · {{ m.deliveryMode }}</div>
            <span class="status-badge-missed">MISSED</span>
            <div class="missed-actions">
              <button class="btn-primary-sm">This week</button>
              <button class="btn-secondary-sm">Future date</button>
            </div>
          </div>
        </div>
      </footer>
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

/* Side pane matching Figma 3:23140 */
.side-pane {
  width: 210px;
  background-color: var(--color-athens-gray);
  border-right: 1px solid var(--color-iron);
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.section-heading {
  font-size: 12px;
  font-weight: 700;
  line-height: 16.8px;
  color: var(--color-text-secondary);
  margin: 0 0 2px 0;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.field-group label {
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

.ownership-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
}

.ownership-filter label {
  font-size: 12px;
  color: var(--color-shark);
  cursor: pointer;
}

.legend-group {
  padding-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.legend-swatch {
  width: 18px;
  height: 12px;
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  display: flex;
  flex-shrink: 0;
}

.legend-swatch.dashed {
  border-style: dashed;
}

.legend-swatch.swatch-mine {
  background-color: var(--color-blue-bg);
}

.marker {
  width: 4px;
  height: 12px;
  flex-shrink: 0;
}

.marker-fixed { background-color: var(--color-text-secondary); }
.marker-mine { background-color: var(--color-lochmara); }
.marker-other { background-color: var(--color-iron); }
.marker-ip { background-color: var(--color-lochmara); }
.marker-db { background-color: var(--color-violet); }
.marker-algo { background-color: var(--color-orange); }
.marker-net { background-color: var(--color-green); }

.legend-label {
  font-size: 11.5px;
  color: var(--color-shark);
  line-height: 1.4;
}

.status-badge-makeup {
  border: 1px solid var(--color-green);
  border-radius: 2px;
  padding: 0 4px;
  font-size: 10px;
  color: var(--color-green);
  line-height: 1.4;
  font-weight: 700;
}

.status-badge-missed {
  border: 1px solid var(--color-red);
  border-radius: 2px;
  padding: 0 4px;
  font-size: 10px;
  color: var(--color-red);
  line-height: 1.4;
  font-weight: 700;
}

.legend-note {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin: 2px 0 0 0;
}

/* Main Content: zero-scroll dynamic grid fits page at any zoom level */
.main-content {
  flex: 1;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  flex-shrink: 0;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-tool {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 3px 9px;
  font-size: 14px;
  line-height: 19.6px;
  color: var(--color-shark);
  cursor: pointer;
}

.btn-tool:hover {
  background-color: #f7f9fa;
}

.week-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-shark);
  margin-left: 6px;
}

.term-info {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Zero-Scroll Dynamic Grid Table: uses minmax(0, 1fr) for rows & columns */
.grid-table {
  flex: 1;
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.grid-header {
  display: grid;
  grid-template-columns: minmax(70px, 85px) repeat(6, minmax(0, 1fr));
  background-color: var(--color-athens-gray);
  border-bottom: 1px solid var(--color-iron);
  flex-shrink: 0;
}

.col-slot,
.col-day {
  padding: 5px 8px;
  border-right: 1px solid var(--color-iron);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  line-height: 1.2;
}

.col-day:last-child {
  border-right: none;
}

.grid-body {
  flex: 1;
  display: grid;
  grid-template-rows: repeat(8, minmax(0, 1fr));
  min-height: 0;
}

.grid-row {
  display: grid;
  grid-template-columns: minmax(70px, 85px) repeat(6, minmax(0, 1fr));
  min-height: 0;
  border-bottom: 1px solid var(--color-iron);
}

.grid-row:last-child {
  border-bottom: none;
}

.slot-info-cell {
  background-color: var(--color-athens-gray);
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 11px;
}

.slot-info-cell small {
  color: var(--color-text-secondary);
}

.day-cell {
  background-color: var(--color-white);
  padding: 2px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

/* 3D Card Flip System */
.card-flip-scene {
  perspective: 1000px;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-flip-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-flip-front,
.card-flip-back {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 2px;
  overflow: hidden;
}

/* Front: Session Card */
.session-card {
  padding: 3px 6px;
  border-radius: 2px;
  border: 1px solid var(--color-iron);
  border-left-width: 4px;
  font-size: 11.5px;
  cursor: pointer;
  background-color: var(--color-card-bg);
  transition: box-shadow 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.session-card:hover {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.session-card.selected {
  outline: 2px solid var(--color-lochmara);
}

/* Back: Flipped Details and Contextual Actions */
.card-flip-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 6px;
  border: 1px solid var(--color-iron);
  border-left-width: 4px;
  background-color: var(--color-card-bg);
  font-size: 11px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.card-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2px;
}

.flip-icon {
  font-size: 10px;
  color: var(--color-text-secondary);
  opacity: 0.6;
  cursor: pointer;
  line-height: 1;
}

.card-back-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-course-code {
  font-weight: 700;
  font-size: 11px;
  color: var(--color-shark);
}

.btn-flip-back {
  background: none;
  border: none;
  padding: 0 2px;
  font-size: 11px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.btn-flip-back:hover {
  color: var(--color-shark);
}

.back-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 10px;
  color: var(--color-text-secondary);
}

.back-line strong {
  color: var(--color-shark);
}

.back-actions {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}

.session-card.color-ip,
.session-card-back.color-ip {
  border-left-color: var(--color-lochmara);
  background-color: var(--color-course-ip-bg);
}

.session-card.color-nsd,
.session-card-back.color-nsd {
  border-left-color: var(--color-green);
  background-color: var(--color-course-nsd-bg);
}

.session-card.color-itpm,
.session-card-back.color-itpm {
  border-left-color: var(--color-violet);
  background-color: var(--color-course-itpm-bg);
}

.session-card.color-sec,
.session-card-back.color-sec {
  border-left-color: var(--color-orange);
  background-color: var(--color-course-sec-bg);
}

.session-card.color-ssa,
.session-card-back.color-ssa {
  border-left-color: var(--color-lochmara);
  background-color: var(--color-course-ssa-bg);
}

.card-title {
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-shark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  font-size: 10.5px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 4px;
}

.delivery-badge {
  font-size: 9.5px;
  color: var(--color-text-secondary);
  background: rgba(125, 125, 125, 0.12);
  padding: 0 3px;
  border-radius: 2px;
}

.card-btn {
  font-size: 10px;
  padding: 2px 4px;
  border: 1px solid var(--color-iron);
  background: var(--color-card-bg);
  color: var(--color-shark);
  border-radius: 2px;
  cursor: pointer;
  line-height: 1.2;
}

.card-btn:hover {
  background: var(--color-athens-gray);
}

.card-btn.flag {
  color: var(--color-red);
  font-weight: 600;
}

/* Missed Tray: pinned cleanly at bottom without forcing scroll */
.missed-tray {
  border-top: 1px solid var(--color-iron);
  padding-top: 6px;
  flex-shrink: 0;
}

.tray-heading {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-shark);
  margin: 0 0 8px 0;
}

.no-missed {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.missed-cards-list {
  display: flex;
  gap: 10px;
}

.missed-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 8px 10px;
  min-width: 200px;
}

.missed-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-shark);
}

.missed-meta {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin: 2px 0 4px 0;
}

.missed-actions {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.btn-primary-sm {
  background-color: var(--color-lochmara);
  color: var(--color-white);
  border: 1px solid var(--color-lochmara);
  border-radius: 2px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
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
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary-sm {
  background-color: var(--color-white);
  color: var(--color-shark);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
}

.state-container {
  padding: 30px;
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
