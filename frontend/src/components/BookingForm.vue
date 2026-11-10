<template>
  <form class="booking-form" @submit.prevent="handleSubmit" novalidate>
    <!-- Course Code Field -->
    <div class="form-group">
      <label for="courseCode">Course Code</label>
      <input
        id="courseCode"
        v-model="form.courseCode"
        type="text"
        placeholder="e.g. CS101"
      />
      <p v-if="submitted && errors.courseCode" class="error-msg">
        {{ errors.courseCode }}
      </p>
    </div>

    <!-- Date Field -->
    <div class="form-group">
      <label for="date">Date</label>
      <input
        id="date"
        v-model="form.date"
        type="date"
      />
      <p v-if="submitted && errors.date" class="error-msg">
        {{ errors.date }}
      </p>
    </div>

    <!-- Slot Number Field (1–8) -->
    <div class="form-group">
      <label for="slotNumber">Slot Number (1-8)</label>
      <input
        id="slotNumber"
        v-model.number="form.slotNumber"
        type="number"
        min="1"
        max="8"
      />
      <p v-if="submitted && errors.slotNumber" class="error-msg">
        {{ errors.slotNumber }}
      </p>
    </div>

    <!-- Reason Field -->
    <div class="form-group">
      <label for="reason">Reason</label>
      <textarea
        id="reason"
        v-model="form.reason"
        rows="3"
        placeholder="Explain reason for booking / makeup..."
      ></textarea>
      <p v-if="submitted && errors.reason" class="error-msg">
        {{ errors.reason }}
      </p>
    </div>

    <!-- Submit Button with Pending State -->
    <button type="submit" class="submit-btn" :disabled="props.pending">
      {{ props.pending ? 'Booking...' : 'Confirm Booking' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { validateBooking, type BookingFormInput } from '@/validation'

const props = withDefaults(
  defineProps<{
    pending?: boolean
  }>(),
  {
    pending: false,
  }
)

const emit = defineEmits<{
  (e: 'submit', form: BookingFormInput): void
}>()

// 1. Reactive form state
const form = reactive<BookingFormInput>({
  courseCode: '',
  slotNumber: 1,
  date: '',
  reason: '',
})

// 2. submitted flag to only show errors after the first submit attempt
const submitted = ref(false)

// 3. Computed errors calling validateBooking from src/validation.ts
const errors = computed(() => validateBooking(form))
const isValid = computed(() => Object.keys(errors.value).length === 0)

// 4. Form submission handler
function handleSubmit() {
  submitted.value = true

  if (!isValid.value) {
    return
  }

  // Emit the cleaned form object
  emit('submit', {
    courseCode: form.courseCode.trim(),
    slotNumber: form.slotNumber,
    date: form.date,
    reason: form.reason.trim(),
  })
}
</script>


<style scoped>
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}

input,
textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.error-msg {
  margin: 0;
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 500;
}

.submit-btn {
  padding: 0.75rem 1.25rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>