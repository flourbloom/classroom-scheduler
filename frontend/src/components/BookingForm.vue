<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { validateBooking, type BookingFormInput } from '@/validation'

const props = withDefaults(
  defineProps<{
    pending?: boolean
    defaultClassroom?: string
    defaultCourse?: string
    defaultGroup?: string
  }>(),
  {
    pending: false,
    defaultClassroom: 'A-420 (Building A)',
    defaultCourse: 'Internet Programming',
    defaultGroup: 'I3-SE',
  }
)

const emit = defineEmits<{
  (e: 'submit', form: BookingFormInput): void
  (e: 'cancel'): void
}>()

const form = reactive<BookingFormInput>({
  courseCode: props.defaultCourse,
  slotNumber: 1,
  date: '2026-10-30',
  reason: '',
})

const deliveryMode = ref('Lecture')
const submitted = ref(false)

const errors = computed(() => validateBooking(form))
const isValid = computed(() => Object.keys(errors.value).length === 0)

function handleSubmit() {
  submitted.value = true

  if (!isValid.value) {
    return
  }

  emit('submit', {
    courseCode: form.courseCode.trim(),
    slotNumber: form.slotNumber,
    date: form.date,
    reason: form.reason.trim(),
  })
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <!-- Figma node 16:2 "Schedule Makeup (This week)" -->
  <form class="dialog-card" @submit.prevent="handleSubmit" novalidate>
    <!-- Dialog header (node 16:3) -->
    <div class="dialog-header">
      <h3 class="dialog-title">Schedule Makeup</h3>
      <button type="button" class="close-btn" @click="handleCancel">×</button>
    </div>

    <!-- Dialog form (node 16:6) -->
    <div class="dialog-form">
      <!-- Row 1: Course & Delivery mode (node 16:7) -->
      <div class="form-row">
        <div class="field">
          <label>Course</label>
          <div class="input-box readonly">
            <input :value="props.defaultCourse" readonly />
          </div>
        </div>
        <div class="field">
          <label>Delivery mode</label>
          <div class="input-box readonly">
            <input :value="deliveryMode" readonly />
          </div>
        </div>
      </div>

      <!-- Row 2: Group and classroom (node 16:16) -->
      <div class="form-row">
        <div class="field">
          <label>Student group</label>
          <div class="input-box readonly">
            <input :value="props.defaultGroup" readonly />
          </div>
        </div>
        <div class="field">
          <label>Classroom (searchable)</label>
          <div class="input-box readonly">
            <input :value="props.defaultClassroom" readonly />
            <span class="dropdown-arrow">▼</span>
          </div>
        </div>
      </div>

      <!-- Row 3: Target makeup slot (node 16:26) -->
      <div class="form-row">
        <div class="field">
          <label for="slot-input">Target makeup slot (1–8)</label>
          <div class="input-box">
            <input
              id="slot-input"
              v-model.number="form.slotNumber"
              type="number"
              min="1"
              max="8"
            />
          </div>
          <p v-if="submitted && errors.slotNumber" class="error-msg">
            {{ errors.slotNumber }}
          </p>
        </div>

        <div class="field">
          <label for="date-input">Target date</label>
          <div class="input-box">
            <input id="date-input" v-model="form.date" type="date" />
          </div>
          <p v-if="submitted && errors.date" class="error-msg">
            {{ errors.date }}
          </p>
        </div>
      </div>

      <!-- Row 4: Reason (node 16:30) -->
      <div class="field full-width">
        <label for="reason-input">
          Reason for missing original class (Wed 21 Oct · Slot 3) *
        </label>
        <div class="input-box">
          <input
            id="reason-input"
            v-model="form.reason"
            type="text"
            placeholder="e.g. Lecturer flu / medical leave"
          />
        </div>
        <p v-if="submitted && errors.reason" class="error-msg">
          {{ errors.reason }}
        </p>
      </div>
    </div>

    <!-- Dialog actions (node 16:34) -->
    <div class="dialog-actions">
      <button type="button" class="btn-secondary" @click="handleCancel">
        Cancel
      </button>
      <button type="submit" class="btn-primary" :disabled="props.pending">
        {{ props.pending ? 'Booking...' : 'Confirm makeup booking' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.dialog-card {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-iron);
  border-radius: 6px;
  padding: 18px 20px;
  box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.18);
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-header {
  border-bottom: 1px solid var(--color-iron);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
}

.dialog-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-shark);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: var(--color-shark);
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.field.full-width {
  width: 100%;
}

.field label {
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-text-secondary);
  margin: 0;
}

.input-box {
  background-color: var(--color-input-bg, var(--color-white));
  border: 1px solid var(--color-iron);
  border-radius: 4px;
  min-height: 33px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-box.readonly {
  opacity: 0.8;
  background-color: var(--color-athens-gray);
}

.input-box input {
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

.dropdown-arrow {
  font-size: 9px;
  color: var(--color-text-secondary);
  margin-left: 4px;
}

.error-msg {
  margin: 2px 0 0 0;
  font-size: 11px;
  color: var(--color-red);
}

.dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
}

.btn-primary {
  background-color: var(--color-lochmara);
  border: 1px solid var(--color-lochmara);
  border-radius: 4px;
  padding: 6px 14px;
  color: #ffffff;
  font-size: 14px;
  line-height: 19.6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-lochmara-hover);
  border-color: var(--color-lochmara-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 4px;
  padding: 6px 14px;
  color: var(--color-shark);
  font-size: 14px;
  line-height: 19.6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.btn-secondary:hover {
  background-color: var(--color-athens-gray);
}
</style>
