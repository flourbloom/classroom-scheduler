# Project Milestones Defense & Design Reflections

> **Course:** Internet Programming 
> **Author:** Chea Seavhong
> **Repository:** `https://github.com/flourbloom/classroom-scheduler`

---

## Milestone 0: Proposal (Week 3) — Tag: `m0`

### Checklist

- [X] `PROPOSAL.md` follows the template in Appendix A
- [X] Problem stated in two sentences; target users and at least 2 roles named
- [X] 6–10 user stories, with acceptance criteria for the 3 most important
- [X] MVP scope split into must-have and nice-to-have
- [X] Entity list with main attributes and relations; at least 3 entities
- [X] Chosen stretch feature named

### Design Reflection

> **Question:** Which story did you cut from the MVP, and why?
> **Answer:**
> We cut **automated recurring makeup schedule suggestion bots and external calendar synchronization (Google Calendar / Outlook iCal sync)** from the initial MVP scope.
>
> While syncing sessions with third-party calendar providers (Google Calendar, Microsoft Outlook) and automated algorithm-driven makeup slot recommendations would be convenient for faculty, implementing OAuth 2.0 token refresh lifecycles and relying on external cloud APIs introduces external failure vectors and unnecessary complexity during offline testability and live code defense evaluations.

---

## Milestone 1: Frontend Prototype (Week 5) — Tag: `m1`

### Checklist

- [ ] Wireframes (photo or tool) of the main screens in `docs/`
- [ ] Vue 3 + TypeScript app created with Vite; strict mode on; ESLint passes
- [ ] At least 4 routes, including a detail page with a route parameter
- [ ] At least one form with client-side validation
- [ ] A Pinia store and a service layer calling a mock API (`json-server` or local JSON)
- [ ] Loading, empty and error states visible

### Design Reflection

> **Question:** What state lives in the store and what stays inside a component? Why?
> **Answer:**
> *[Answer here]*

---

## Milestone 2: Backend API (Week 7) — Tag: `m2`

### Checklist

- [ ] API contract (`docs/api.md`) and ERD in `docs/`
- [ ] NestJS API with one module per resource (controller, service, DTOs)
- [ ] Prisma schema, migrations and a seed script; PostgreSQL runs in Docker
- [ ] CRUD endpoints for at least 3 entities, with server-side validation
- [ ] Correct status codes (200, 201, 204, 400, 404) and consistent error JSON

### Design Reflection

> **Question:** Why did you choose this relation (1-N or N-N) between two of your entities?
> **Answer:**
> *[Answer here]*

---

## Milestone 3: Integrated App (Week 9) — Tag: `m3`

### Checklist

- [ ] Frontend calls the real API; the mock is gone
- [ ] Registration, login, logout; passwords hashed
- [ ] Guards on the API for authentication, roles and ownership
- [ ] Route guards in Vue; the UI hides what a role cannot do
- [ ] Security checklist from week 9 run on your app; findings fixed or listed
- [ ] 3-minute demo in the practice session

### Design Reflection

> **Question:** Where is the token stored in the browser, and what attack does that choice protect against or expose?
> **Answer:**
> *[Answer here]*

---

## Milestone 4: Feature Complete (Week 12) — Tag: `m4`

### Checklist

- [ ] Every MVP user story works end to end
- [ ] Stretch feature implemented
- [ ] Unit tests for core services; e2e tests for the main endpoints; all green
- [ ] Swagger documentation available

### Design Reflection

> **Question:** Pick one test. What bug would it catch?
> **Answer:**
> *[Answer here]*

---

## Milestone 5: Deployed (Week 14) — Tag: `m5`

### Checklist

- [ ] Dockerfiles for frontend and backend; `docker-compose.yml` for the whole stack
- [ ] Running on the school server with HTTPS, or starting locally with one `docker compose up`
- [ ] GitHub Actions workflow runs lint, tests and build on every push
- [ ] README complete (Appendix B); no secrets in the repository

### Design Reflection

> **Question:** What happens, step by step, between `git push` and your change being live?
> **Answer:**
> *[Answer here]*
