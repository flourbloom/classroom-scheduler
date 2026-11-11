<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useClassroomsStore } from '@/stores/classrooms'
import BookingForm from '@/components/BookingForm.vue'
import LoadingPage from '@/components/LoadingPage.vue'
import type { BookingFormInput } from '@/validation'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const store = useClassroomsStore()
const isBookingPending = ref(false)
const bookingSuccessMessage = ref<string | null>(null)

// Card Flip State & Logic
const isCardFlipped = ref(false)

function flipCard() {
  isCardFlipped.value = !isCardFlipped.value // convert true to false and false
}

onMounted(() => {
  if (store.classrooms.length === 0) {
    store.fetchAll()
  }
})

const room = computed(() => store.byId(props.id))

async function handleBookingSubmit(formData: BookingFormInput) {
  isBookingPending.value = true
  bookingSuccessMessage.value = null
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    bookingSuccessMessage.value = `Successfully booked makeup for ${formData.courseCode} in Room ${room.value?.name} on ${formData.date} (Slot ${formData.slotNumber})!`
    // Flip back to front room view on success
    setTimeout(() => {
      isCardFlipped.value = false
    }, 1200)
  } finally {
    isBookingPending.value = false
  }
}

function handleCancel() {
  if (isCardFlipped.value) {
    isCardFlipped.value = false
  } else {
    router.push('/rooms')
  }
}
</script>

<template>
  <div class="detail-workspace">
    <div class="top-nav-bar">
      <RouterLink to="/rooms" class="back-link">
        ‹ Back to Find a room
      </RouterLink>
    </div>

    <!-- Loading state -->
    <LoadingPage v-if="store.status === 'loading'" message="Loading room details from database..." />

    <!-- If not found -->
    <div v-else-if="!room && store.status === 'success'" class="not-found-card">
      <h3>Classroom #{{ props.id }} not found</h3>
      <p>Please return to the directory to select an active room.</p>
      <RouterLink to="/rooms" class="btn-primary">View all rooms</RouterLink>
    </div>

    <!-- 3D Flippable Room Detail Card Scene -->
    <div v-else class="content-wrapper">
      <div v-if="bookingSuccessMessage" class="success-banner">
        ✅ {{ bookingSuccessMessage }}
      </div>

      <div class="card-scene">
        <div class="card-flipper" :class="{ 'is-flipped': isCardFlipped }">
          <!-- FRONT FACE: Classroom Specifications Card -->
          <div class="card-face card-front room-specs-card">
            <div class="card-top-header">
              <div class="room-title-area">
                <span class="badge-status">AVAILABLE</span>
                <h2 class="room-name">{{ room?.name ?? `Room #${props.id}` }}</h2>
                <span class="building-tag">Building {{ room?.building ?? 'A' }}</span>
              </div>
              <button
                type="button"
                class="flip-trigger-btn"
                title="Flip to booking form"
                @click="flipCard"
              >
                Book Makeup ↺
              </button>
            </div>

            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-label">Capacity</span>
                <strong class="spec-value">{{ room?.capacity ?? 40 }} seats</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Room Type</span>
                <strong class="spec-value">Lecture & Lab</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Floor</span>
                <strong class="spec-value">Level {{ room?.name?.charAt(2) ?? '4' }}</strong>
              </div>
              <div class="spec-item">
                <span class="spec-label">Status</span>
                <strong class="spec-value text-green">Ready for Makeup</strong>
              </div>
            </div>

            <div class="facilities-section">
              <span class="spec-label">Installed Facilities</span>
              <div class="facilities-tags">
                <span class="facility-badge">Dual Projector</span>
                <span class="facility-badge">Audio PA System</span>
                <span class="facility-badge">Whiteboard</span>
                <span class="facility-badge">Air Conditioning</span>
                <span class="facility-badge">Wi-Fi 6</span>
              </div>
            </div>

            <div class="card-action-bar">
              <button type="button" class="btn-secondary" @click="router.push('/rooms')">
                Cancel
              </button>
              <button type="button" class="btn-primary" @click="flipCard">
                Schedule Makeup Booking (Flip ↻)
              </button>
            </div>
          </div>

          <!-- BACK FACE: Booking Form -->
          <div class="card-face card-back">
            <div class="back-bar">
              <button type="button" class="back-flip-btn" @click="flipCard">
                ‹ Back to Classroom Specs
              </button>
            </div>

            <BookingForm
              :default-classroom="room ? `${room.name} (Building ${room.building})` : 'A-420 (Building A)'"
              :pending="isBookingPending"
              @submit="handleBookingSubmit"
              @cancel="handleCancel"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-workspace {
  padding: 16px 20px;
  background-color: var(--color-athens-gray);
  flex: 1;
  min-height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
}

.top-nav-bar {
  margin-bottom: 12px;
}

.back-link {
  color: var(--color-lochmara);
  text-decoration: none;
  font-size: 14px;
  line-height: 19.6px;
}

.back-link:hover {
  text-decoration: underline;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.success-banner {
  padding: 8px 14px;
  background-color: #dcffe4;
  border: 1px solid #85e89d;
  color: #165c26;
  border-radius: 2px;
  margin-bottom: 14px;
  font-size: 14px;
  max-width: 520px;
  width: 100%;
}

/* 3D Card Scene & Flipper */
.card-scene {
  perspective: 1200px;
  width: 520px;
  max-width: 100%;
}

.card-flipper {
  position: relative;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-flipper.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  width: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 3px;
}

.card-front {
  position: relative;
  background: var(--color-white);
  border: 1px solid var(--color-iron);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
}

.back-bar {
  margin-bottom: 6px;
}

.back-flip-btn {
  background: none;
  border: none;
  color: var(--color-lochmara);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.back-flip-btn:hover {
  text-decoration: underline;
}

/* Room Specs Styles */
.card-top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-iron);
  padding-bottom: 14px;
}

.badge-status {
  font-size: 10px;
  font-weight: 700;
  background-color: rgba(52, 199, 89, 0.15);
  color: var(--color-green);
  border: 1px solid var(--color-green);
  border-radius: 4px;
  padding: 1px 6px;
  display: inline-block;
  margin-bottom: 4px;
}

.room-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--color-shark);
  letter-spacing: -0.015em;
}

.building-tag {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.flip-trigger-btn {
  background-color: var(--color-blue-bg);
  border: 1px solid var(--color-lochmara);
  color: var(--color-lochmara);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.flip-trigger-btn:hover {
  background-color: var(--color-lochmara);
  color: #ffffff;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spec-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.spec-value {
  font-size: 15px;
  color: var(--color-shark);
}

.text-green {
  color: var(--color-green);
}

.facilities-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.facilities-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.facility-badge {
  font-size: 11px;
  background-color: var(--color-athens-gray);
  color: var(--color-shark);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  padding: 2px 8px;
}

.card-action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-iron);
}

.btn-secondary {
  padding: 8px 14px;
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: var(--color-shark);
  transition: all 0.15s;
}

.btn-secondary:hover {
  background-color: var(--color-athens-gray);
}

.btn-primary {
  padding: 8px 16px;
  background-color: var(--color-lochmara);
  border: 1px solid var(--color-lochmara);
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.15s;
}

.btn-primary:hover {
  background-color: var(--color-lochmara-hover);
}

.not-found-card {
  max-width: 480px;
  margin: 40px auto;
  text-align: center;
  background: var(--color-white);
  border: 1px solid var(--color-iron);
  padding: 24px;
  border-radius: 3px;
}

.not-found-card h3 {
  color: var(--color-red);
  margin-top: 0;
}
</style>
