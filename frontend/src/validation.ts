export interface BookingFormInput {
    courseCode: string
    slotNumber: number
    date: string
    reason: string
}


export function validateBooking(form: BookingFormInput): Record<string, string> {
    const errors: Record<string, string> = {}
    if (!form.courseCode.trim()) {
        errors.courseCode = 'Course code is required'
    }

    if (!form.slotNumber || form.slotNumber < 1 || form.slotNumber > 8) {
        errors.slotNumber = 'Slot number must be between 1-8'
    }

    if (!form.date) {
        errors.date = 'Date is required'
    }

    if (!form.reason.trim() || form.reason.trim().length < 4) {
        errors.reason = 'Reason must be at least 4 characters long'
    }

    return errors
}
