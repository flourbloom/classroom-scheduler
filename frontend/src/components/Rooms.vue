<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClassroomsStore } from '@/stores/classrooms'
import LoadingPage from '@/components/LoadingPage.vue'
import type { Classroom } from '@/types'

const store = useClassroomsStore()
const router = useRouter()

// Filter Form State matching Figma 3:23745
const filterDate = ref('2026-10-30')
const filterSlot = ref(1)
const filterMinCapacity = ref(30)
const filterBuilding = ref('any')

// Active booking drawer state (matches Figma node 3:23859 "Inline makeup booking")
const selectedRoom = ref<Classroom | null>(null)
const bookingGroup = ref('I3-SE')
const bookingReason = ref('')
const bookingError = ref<string | null>(null)
const bookingSuccess = ref<string | null>(null)
const isSubmitting = ref(false)

const timeSlots = [
  { slot: 1, label: 'Slot 1 · 07:00–07:55' },
  { slot: 2, label: 'Slot 2 · 08:00–08:55' },
  { slot: 3, label: 'Slot 3 · 09:10–10:05' },
  { slot: 4, label: 'Slot 4 · 10:10–11:05' },
  { slot: 5, label: 'Slot 5 · 13:00–13:55' },
  { slot: 6, label: 'Slot 6 · 14:00–14:55' },
  { slot: 7, label: 'Slot 7 · 15:10–16:05' },
  { slot: 8, label: 'Slot 8 · 16:10–17:05' },
]

onMounted(() => {
  store.fetchAll()
})

const filteredRooms = computed(() => {
  return store.classrooms.filter((room) => {
    const matchesCapacity =
      !filterMinCapacity.value || room.capacity >= filterMinCapacity.value
    const matchesBuilding =
      filterBuilding.value === 'any' || room.building === filterBuilding.value
    return matchesCapacity && matchesBuilding
  })
})

function onSearch() {
  bookingSuccess.value = null
  selectedRoom.value = null
}

function openBooking(room: Classroom) {
  selectedRoom.value = room
  bookingReason.value = ''
  bookingError.value = null
  bookingSuccess.value = null
}

function cancelBooking() {
  selectedRoom.value = null
  bookingReason.value = ''
  bookingError.value = null
}

function goToDetail(id: string | number) {
  router.push(`/rooms/${id}`)
}

async function confirmBooking() {
  if (!bookingReason.value.trim() || bookingReason.value.trim().length < 4) {
    bookingError.value = 'Reason must be at least 4 characters long'
    return
  }
  isSubmitting.value = true
  bookingError.value = null

  await new Promise((r) => setTimeout(r, 600))
  bookingSuccess.value = `Makeup session booked for ${bookingGroup.value} in ${selectedRoom.value?.name}!`
  isSubmitting.value = false
  selectedRoom.value = null
}
</script>

<template>
  <div class="workspace-layout">
    <!-- Figma Side Pane (node 3:23760) -->
    <aside class="side-pane">
      <div class="room-search-filters">
        <h3 class="side-title">Find an available room</h3>

        <div class="form-field">
          <label for="date-input">Date</label>
          <div class="input-container">
            <input id="date-input" v-model="filterDate" type="date" />
          </div>
        </div>

        <div class="form-field">
          <label for="slot-select">Time slot</label>
          <div class="input-container select-container">
            <select id="slot-select" v-model.number="filterSlot">
              <option
                v-for="s in timeSlots"
                :key="s.slot"
                :value="s.slot"
              >
                {{ s.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="cap-input">Minimum capacity</label>
          <div class="input-container">
            <input
              id="cap-input"
              v-model.number="filterMinCapacity"
              type="number"
              min="1"
            />
          </div>
        </div>

        <div class="form-field">
          <label for="building-select">Building (optional)</label>
          <div class="input-container select-container">
            <select id="building-select" v-model="filterBuilding">
              <option value="any">Any building</option>
              <option value="A">Building A</option>
              <option value="J">Building J</option>
              <option value="STEM">Building STEM</option>
            </select>
          </div>
        </div>

        <div class="search-action">
          <button class="btn-primary full-width" @click="onSearch">
            Search
          </button>
        </div>
      </div>
    </aside>

    <!-- Figma Main Content (node 3:23784) -->
    <section class="main-content">
      <!-- Results toolbar (node 3:23785) -->
      <div class="results-toolbar">
        <h2 class="results-title">
          {{ filteredRooms.length }} rooms free · {{ filterDate }} · Slot {{ filterSlot }}
        </h2>
      </div>

      <!-- Success feedback banner -->
      <div v-if="bookingSuccess" class="success-banner">
        ✅ {{ bookingSuccess }}
      </div>

      <!-- State 1: Loading -->
      <LoadingPage v-if="store.status === 'loading'" message="Loading available rooms from database..." />

      <!-- State 2: Error -->
      <div v-else-if="store.status === 'error'" class="state-container error-state">
        <p class="error-text"> {{ store.error }}</p>
        <button class="btn-secondary" @click="store.fetchAll(true)">Try Again</button>
      </div>

      <!-- State 3: Empty -->
      <div
        v-else-if="store.status === 'success' && filteredRooms.length === 0"
        class="state-container"
      >
        <p>No rooms free matching your criteria on this date and slot.</p>
      </div>

      <!-- State 4: Records table (node 3:23787) -->
      <div v-else-if="store.status === 'success'" class="records-table">
        <!-- Table header (node 3:23788) -->
        <div class="table-header">
          <div class="col-room">Room</div>
          <div class="col-building">Building</div>
          <div class="col-capacity">Capacity</div>
          <div class="col-action"></div>
        </div>

        <!-- Records (node 3:23797) -->
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          class="record-row"
        >
          <div class="col-room">
            <a href="#" class="room-link" @click.prevent="goToDetail(room.id)">
              {{ room.name }}
            </a>
          </div>
          <div class="col-building">Building {{ room.building }}</div>
          <div class="col-capacity">{{ room.capacity }}</div>
          <div class="col-action">
            <button class="btn-primary" @click="openBooking(room)">
              Book makeup
            </button>
          </div>
        </div>

        <!-- Pagination (node 3:23847) -->
        <div class="pagination">
          <span class="page-text">Page 1 of 1</span>
          <button class="page-btn" disabled>‹</button>
          <button class="page-btn active">1</button>
          <button class="page-btn" disabled>›</button>
        </div>

        <!-- Inline makeup booking (node 3:23859) -->
        <div v-if="selectedRoom" class="inline-makeup-booking">
          <p class="inline-title">
            Book makeup · Internet Programming · {{ selectedRoom.name }}
          </p>

          <div class="booking-fields">
            <div class="field">
              <label>Student group</label>
              <div class="input-container">
                <input v-model="bookingGroup" type="text" />
              </div>
            </div>

            <div class="field">
              <label>Date and slot</label>
              <div class="input-container readonly">
                <input :value="`${filterDate} · Slot ${filterSlot}`" readonly />
              </div>
            </div>

            <div class="field field-reason">
              <label>Reason</label>
              <div class="input-container">
                <input
                  v-model="bookingReason"
                  type="text"
                  placeholder="Why is this makeup needed?"
                />
              </div>
              <p v-if="bookingError" class="field-error">{{ bookingError }}</p>
            </div>
          </div>

          <div class="booking-actions">
            <button
              class="btn-primary"
              :disabled="isSubmitting"
              @click="confirmBooking"
            >
              {{ isSubmitting ? 'Booking...' : 'Confirm booking' }}
            </button>
            <button class="btn-secondary" @click="cancelBooking">
              Cancel
            </button>
          </div>
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

/* Side pane (node 3:23760) */
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

.room-search-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.side-title {
  font-size: 12px;
  font-weight: 700;
  line-height: 16.8px;
  color: var(--color-text-secondary);
  margin: 0;
  white-space: nowrap;
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
  line-height: 19.6px;
  color: var(--color-shark);
  padding: 0;
  margin: 0;
}

.search-action {
  padding-top: 4px;
  width: 100%;
}

/* Primary Button (node 3:23782) */
.btn-primary {
  background-color: var(--color-lochmara);
  border: 1px solid var(--color-lochmara);
  border-radius: 2px;
  padding: 6px 12px;
  color: var(--color-white);
  font-size: 14px;
  line-height: 19.6px;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-lochmara-hover);
  border-color: var(--color-lochmara-hover);
}

.btn-primary.full-width {
  width: 100%;
}

/* Secondary Button (node 3:23877) */
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

.btn-secondary:hover {
  background-color: #f7f9fa;
}

/* Main Content (node 3:23784) */
.main-content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.results-toolbar {
  padding: 0 8px;
}

.results-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-shark);
  margin: 0;
  white-space: nowrap;
}

/* Records Table (node 3:23787) */
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

.table-header > div {
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

.record-row > div {
  padding: 7px 8px;
}

.col-room {
  width: 250px;
  flex-shrink: 0;
}

.col-building {
  width: 330px;
  flex-shrink: 0;
}

.col-capacity {
  width: 220px;
  flex-shrink: 0;
}

.col-action {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.room-link {
  color: var(--color-shark);
  text-decoration: none;
}

.room-link:hover {
  color: var(--color-lochmara);
  text-decoration: underline;
}

/* Pagination (node 3:23847) */
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
  line-height: 19.6px;
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

/* Inline makeup booking (node 3:23859) */
.inline-makeup-booking {
  background-color: var(--color-athens-gray);
  border: 1px solid var(--color-iron);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 10px;
}

.inline-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-shark);
  margin: 0;
}

.booking-fields {
  display: flex;
  gap: 12px;
  width: 640px;
  max-width: 100%;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.field label {
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-text-secondary);
  margin: 0;
}

.input-container.readonly {
  background-color: #f6f8fa;
}

.field-reason {
  flex: 1.5;
}

.field-error {
  margin: 2px 0 0 0;
  font-size: 11px;
  color: var(--color-red);
}

.booking-actions {
  display: flex;
  gap: 6px;
  padding-top: 2px;
}

/* State Containers */
.state-container {
  padding: 40px;
  text-align: center;
  background-color: var(--color-athens-gray);
  border: 1px dashed var(--color-iron);
  border-radius: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.error-state {
  border-color: #f97583;
  background-color: #ffeef0;
}

.error-text {
  color: var(--color-red);
  font-weight: 600;
  margin-bottom: 12px;
}

.success-banner {
  padding: 8px 12px;
  background-color: #dcffe4;
  border: 1px solid #85e89d;
  color: #165c26;
  border-radius: 2px;
  font-size: 13px;
}
</style>
