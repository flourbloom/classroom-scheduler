# Component Architecture Specification for ClassroomHub

This document details the

- state ownership
- screen component trees
- props down and events up

## 1. Global Application State Architecture

### 1.1 State Ownership

- **Global / Shared Domain State** (User session, cached schedules, courses, classrooms, missed sessions) lives in **Pinia stores**.
- **Short-lived UI State** (search input query, selected filter category, modal open/close flags, active tab) stays **inside the specific component** as local reactive `ref()` / `computed()`.
- **Data Flow:** **Props down, Events up**. Child cards and list rows are purely presentational; they accept data via `defineProps<{ ... }>()` and emit user intents via `defineEmits<{ ... }>()`. The parent view / store owns mutations.

### 1.2 Pinia Stores Overview

1. **`useAuthStore`**

   * **State:** `currentUser: User | null`, `token: string | null`, `isAuthenticated: boolean`
   * **Actions:** `login(email, password)`, `logout()`
2. **`useScheduleStore`**

   * **State:** `sessions: Session[]`, `missedQueue: MissedSessionItem[]`, `activeWeek: number`, `selectedGroup: string`, `selectedRoomId: string | null`
   * **Actions:** `flagAsMissed(sessionId, reason)`, `bookMakeup(payload)`, `rescheduleSession(payload)`, `cancelSession(sessionId)`
3. **`useCatalogStore`**

   * **State:** `classrooms: Classroom[]`, `courses: Course[]`, `teachers: User[]`
   * **Actions:** `addClassroom()`, `updateClassroom()`, `addCourse()`, `updateCourse()`, `addTeacher()`

## 2. Screen Component Trees

### Screen 1: Login (`/login`)

* **Wireframe** [Login](wireframes\1Login.png)
* **Purpose:** Authenticate Admin or Faculty Instructor using admin-provisioned credentials.

#### Component Tree

```text
App
 └── TheNavbar 
 └── LoginView
      └── LoginForm
           ├── FormInput (email)
           ├── FormInput (password)
           └── ErrorBanner (conditional v-if="errorMessage")
```

#### Contract Table

| Component     | Owned State                                                     | Props (Down)                                                  | Events (Up)                                    |
| :------------ | :-------------------------------------------------------------- | :------------------------------------------------------------ | :--------------------------------------------- |
| `LoginView` | `isSubmitting: ref<boolean>`,<br /> `errorMsg: ref<string>` | None                                                          | None (handles route redirect to `/schedule`) |
| `LoginForm` | `email: ref<string>`, <br />`password: ref<string>`         | `isLoading: boolean`, <br />`errorMessage: string \| null` | `@submit({ email, password })`               |

### Screen 2: Teacher Timetable (`/schedule` or `/`)

* **Wireframe:** [Teacher Timetable](wireframes\2.1TeacherTimetable.png), [Teacher Makeup Slot within the current week](wireframes\2.2TeacherMakeup.png), [Schedule Makeup in the future](wireframes\2.3MakeupModal.png),
* **Purpose:** 8-period $\times$ 6-day interactive weekly grid. Shows class sessions with badges, ownership highlights, "My Schedule" filter, card flip / details modal, and bottom "Pending Missed Classes" tray.

#### Component Tree

```text
App
 └── TheNavbar
 └── TimetableMasterView
      ├── TimetableSidebar
      │    ├── GroupFilterSelect
      │    ├── RoomFilterSelect
      │    ├── MyScheduleCheckbox
      │    └── TimetableLegend
      ├── TimetableToolbar
      │    ├── WeekNavigator ("Today", "‹", "›", week range label)
      │    └── MakeupBanner (v-if="isPickingMakeupSlot")
      ├── TimetableGrid
      │    ├── GridHeaderRow (Days Mon–Sat)
      │    └── GridCellSlot (8 periods × 6 days)
      │         ├── ClassSessionCard (when slot has session)
      │         │    ├── FrontSide (Course code, name, teacher, room, mode badge)
      │         │    └── BackSideActions (Flag as missed, Reschedule buttons)
      │         └── EmptySlotPicker (when slot empty & in picking mode)
      ├── MissedClassesTray
      │    └── MissedClassCard (repeated per pending missed item)
      │         ├── MissedInfo (Original date, slot, course, badge)
      │         └── MissedActions ("This week", "Future date" buttons)
      └── ScheduleMakeupModal (v-if="showMakeupModal")
           ├── ModalHeader
           ├── ModalBody (Course, group, target slot info, reason input)
           └── ModalActions (Cancel, Confirm booking)
```

#### Contract Table

| Component               | Owned State                                                                                                                                                                                                                               | Props (Down)                                                                                                                            | Events (Up)                                                                            |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| `TimetableMasterView` | `activeWeek: ref<number>`, `groupFilter: ref<string>`, `roomFilter: ref<string>`, `myScheduleOnly: ref<boolean>`, `pickingSlot: ref<boolean>`, `activeMissedItem: ref<MissedSessionItem \| null>`, `showModal: ref<boolean>` | Consumes `useScheduleStore`, `useAuthStore`                                                                                         | Top-level view orchestrator                                                            |
| `TimetableSidebar`    | None (pure UI inputs)                                                                                                                                                                                                                     | `groups: string[]`, `classrooms: Classroom[]`, `selectedGroup: string`, `selectedRoom: string`, `myScheduleOnly: boolean`     | `@update:group(val)`, `@update:room(val)`, `@update:myScheduleOnly(val)`         |
| `TimetableToolbar`    | None                                                                                                                                                                                                                                      | `currentWeekLabel: string`, `canGoPrev: boolean`, `canGoNext: boolean`, `isPickingSlot: boolean`, `activeCourseName?: string` | `@prevWeek`, `@nextWeek`, `@today`, `@cancelPick`                              |
| `TimetableGrid`       | `flippedCardId: ref<string \| null>`                                                                                                                                                                                                     | `sessions: Session[]`, `weekDays: DayInfo[]`, `currentUserId: string`, `myScheduleOnly: boolean`, `isPickingSlot: boolean`    | `@selectSlot({ day, slot })`, `@flagMissed(sessionId)`, `@reschedule(sessionId)` |
| `ClassSessionCard`    | `isFlipped: ref<boolean>`                                                                                                                                                                                                               | `session: Session`, `isMine: boolean`, `isDimmed: boolean`                                                                        | `@flagMissed(session.id)`, `@reschedule(session.id)`                               |
| `MissedClassesTray`   | None                                                                                                                                                                                                                                      | `missedItems: MissedSessionItem[]`                                                                                                    | `@pickThisWeek(item)`, `@pickFutureDate(item)`                                     |
| `ScheduleMakeupModal` | `selectedRoom: ref<string>`, `reason: ref<string>`, `validationError: ref<string>`                                                                                                                                                  | `isOpen: boolean`, `missedItem: MissedSessionItem`, `targetSlot: SlotInfo`, `availableRooms: Classroom[]`                       | `@close`, `@confirmBooking({ missedId, classroomId, reason })`                     |

### Screen 3: Classroom Availability Finder (`/availability` or `/rooms`)

* **Wireframe:** [Find Room](wireframes\3FindRoom.png)
* **Purpose:** Story 1 & Story 8. Dynamic room search by date, slot (1–8), capacity threshold, and building, with paginated results and direct makeup booking.

#### Component Tree

```text
App
 └── TheNavbar
 └── RoomFinderView
      ├── RoomSearchFilterSidebar
      │    ├── DateInput
      │    ├── SlotSelect (1–8)
      │    ├── MinCapacityInput
      │    ├── BuildingSelect
      │    └── SearchButton
      └── RoomResultsPanel
           ├── ResultsHeader ("N rooms free on Date · Slot X")
           ├── RoomResultsTable
           │    └── RoomResultRow (Room name, building, capacity, "Book makeup" button)
           ├── PaginationControls ("Page X of Y", ‹, 1, 2, 3, ›)
           └── QuickBookDrawer (v-if="selectedRoomForBooking")
```

#### Contract Table

| Component                   | Owned State                                                                                                                                                                  | Props (Down)                                                                      | Events (Up)                                        |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------- |
| `RoomFinderView`          | `date: ref<string>`, `slot: ref<number>`, `minCapacity: ref<number>`, `building: ref<string>`, `currentPage: ref<number>`, `selectedRoom: ref<Classroom \| null>` | None                                                                              | Manages search query and pagination                |
| `RoomSearchFilterSidebar` | Local form state                                                                                                                                                             | `date: string`, `slot: number`, `minCapacity: number`, `building: string` | `@search({ date, slot, minCapacity, building })` |
| `RoomResultsTable`        | None                                                                                                                                                                         | `rooms: Classroom[]`, `isLoading: boolean`                                    | `@bookRoom(classroom)`                           |
| `PaginationControls`      | None                                                                                                                                                                         | `currentPage: number`, `totalPages: number`, `totalItems: number`           | `@changePage(newPage)`                           |

### Screen 4: All Sessions Explorer (`/sessions`)

* **Wireframe:**  [All Sessions](wireframes\4AllSessions.png)
* **Purpose:** Story 8 (Stretch Feature). Full schedule directory with multi-criteria search, filters (type `FIXED` vs `MAKEUP`, group, date range), and pagination.

#### Component Tree

```text
App
 └── TheNavbar
 └── AllSessionsView
      ├── SessionFilterSidebar
      │    ├── SearchTextInput (search course, teacher, room)
      │    ├── SessionTypeSelect ("All", "Fixed", "Makeup")
      │    ├── StudentGroupSelect
      │    ├── DateRangePicker ("From" date, "To" date)
      │    └── ApplyFilterButton
      └── SessionsDirectoryPanel
      	   ├── MyScheduleCheckbox
           ├── ResultsSummaryHeader
           ├── SessionsDataTable
           │    └── SessionTableRow (Date, slot, course, teacher, room, group, type badge, status badge)
           └── PaginationControls
```

#### Contract Table

| Component                | Owned State                                                                                                                                                        | Props (Down)                                                              | Events (Up)                       |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :-------------------------------- |
| `AllSessionsView`      | `searchQuery: ref<string>`, `typeFilter: ref<string>`, `groupFilter: ref<string>`, `fromDate: ref<string>`, `toDate: ref<string>`, `page: ref<number>` | Consumes `useScheduleStore`                                             | Drives filtered & paginated query |
| `SessionFilterSidebar` | Local input drafts                                                                                                                                                 | Filter criteria props                                                     | `@applyFilters(filters)`        |
| `SessionsDataTable`    | None                                                                                                                                                               | `sessions: Session[]`, `visibleCount: number`, `totalCount: number` | `@selectSession(id)`            |
| `PaginationControls`   | None                                                                                                                                                               | `currentPage: number`, `totalPages: number`, `totalCount: number`   | `@changePage(page)`             |

### Screen 5: Administrative Portal (`/admin`)

* **Wireframes:** [Admin](wireframes\5Admin.png)
* **Purpose:** Stories 3 & 4. Admin master setup: recurring fixed schedule grid, missed class audit log, teacher provisioning, course catalog, classroom catalog.

#### Component Tree

```text
App
 └── TheNavbar
 └── AdminPortalView
      ├── AdminSidebarTabs (Fixed schedule, Missed classes, Teachers, Courses, Classrooms)
      └── AdminContentArea
           ├── AdminFixedScheduleTab (v-if="tab === 'Fixed schedule'")
           │    ├── AdminScheduleToolbar (Group filter, Semester filter, Done button)
           │    ├── AdminScheduleGrid (Slot click -> Add/Edit modal)
           │    └── FixedSessionModal (Course, teacher, room, mode, day, slot, 409 conflict detection)
           ├── AdminMissedLogTab (v-if="tab === 'Missed classes'")
           │    ├── ViewToggle ("Timetable view" vs "List view")
           │    ├── AdminMissedGrid (v-if="view === 'timetable'")
           │    └── AdminMissedTable (v-if="view === 'list'")
           ├── AdminTeachersTab (v-if="tab === 'Teachers'")
           │    ├── TeachersTable
           │    └── TeacherModal (Add/Edit teacher)
           ├── AdminCoursesTab (v-if="tab === 'Courses'")
           │    ├── CoursesTable
           │    └── CourseModal (Add/Edit course, assign teacher, semester dates)
           └── AdminClassroomsTab (v-if="tab === 'Classrooms'")
                ├── ClassroomsTable
                └── ClassroomModal (Add/Edit room, building, capacity)
```

#### Contract Table

| Component                 | Owned State                                                                                       | Props (Down)                                     | Events (Up)                                                   |
| :------------------------ | :------------------------------------------------------------------------------------------------ | :----------------------------------------------- | :------------------------------------------------------------ |
| `AdminPortalView`       | `currentTab: ref<AdminTab>`, `showModal: ref<boolean>`, `modalMode: ref<'create' \| 'edit'>` | Role guard (`ADMIN` only)                      | Manages active tab and modals                                 |
| `AdminFixedScheduleTab` | `selectedGroup: ref<string>`, <br />`selectedSemester: ref<string>`                           | `fixedSessions: Session[]`                     | `@openAddModal({ day, slot })`, `@openEditModal(session)` |
| `FixedSessionModal`     | `formState: ref<FixedSessionDTO>`, `conflictError: ref<string>`                               | `isOpen: boolean`, `sessionToEdit?: Session` | `@close`, `@save(data)`                                   |
| `AdminMissedLogTab`     | `displayMode: ref<'timetable' \| 'list'>`                                                        | `missedLogs: MissedLogItem[]`                  | None (Audit view)                                             |
| `AdminTeachersTab`      | None                                                                                              | `teachers: User[]`                             | `@createTeacher`, `@editTeacher(teacher)`                 |
| `AdminCoursesTab`       | None                                                                                              | `courses: Course[]`                            | `@createCourse`, `@editCourse(course)`                    |
| `AdminClassroomsTab`    | None                                                                                              | `classrooms: Classroom[]`                      | `@createClassroom`, `@editClassroom(room)`                |

## 3. Data Flow Patterns (Props Down, Events Up)

* **Cards are Pure Renderers:** `ClassSessionCard` and `MissedClassCard` do not mutate their own props directly. If a user clicks "Flag as Missed", the card emits `@flagMissed(id)`.
* **Parent Orchestration:** `TimetableMasterView` receives the event, triggers the confirmation flow or store action, and updates reactive state.
* **Computed Filters over Watches:** Filtering (e.g. `visibleSessions`, `availableRooms`, `filteredMissedClasses`) is derived using Vue `computed()` properties rather than watchers mutating secondary variables.
