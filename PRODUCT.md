# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

University and college students managing their academic workload: tracking assignments (tareas), upcoming exams (exámenes), and their personal schedule (horarios) day-to-day. Used individually, on their own device, in between classes or at home.

## Product Purpose

Dacate is a personal academic assistant that unifies the three things students juggle every day — tasks, exams, and calendar — in a single focused place. Success means a student can open Dacate, immediately understand what needs attention today, and trust that nothing important will slip through the cracks.

## Positioning

Purpose-built for academic life rather than adapted from a generic productivity tool: every concept (tarea, examen, recordatorio, horario) maps directly to student reality, with no work-project metaphors to unlearn.

## Operating Context

- Students check the app during the academic semester, often between classes or the night before deadlines.
- The workflow centers on quick capture (adding a new task or exam date) and daily review (what's due today / this week).
- Mobile web is a primary access pattern; the UI must hold up on small screens.
- The app is in Spanish throughout.

## Capabilities and Constraints

- Core feature areas confirmed by the UI: Tareas, Exámenes, Calendario, Recordatorios.
- Authentication flow in place (login, register, forgot password).
- Backend API integration via Axios; exact endpoints and data model are undecided / in development.
- Stack: React 19, Vite 8, TypeScript 7, Tailwind v4, shadcn/ui (Base UI), React Hook Form + Zod, Zustand, React Router v8, date-fns, React Day Picker.
- No multi-tenancy or institution-level accounts; single-user personal workspace.

## Brand Commitments

- Name: **Dacate** — displayed in Playfair Display, uppercase, tracking-wider.
- Icon: GraduationCap (Lucide) as the logomark.
- Body typeface: Noto Sans Variable.
- Heading typeface: Playfair Display Variable (serif).
- Warm neutral palette (shadcn "stone" hue); primary is a near-black warm tone in light mode.
- Language: Spanish (es) throughout the product.

## Evidence on Hand

- Auth UI: login, register, forgot-password pages built and styled.
- AuthLayout with branded left panel (tagline: "Organiza tu vida académica, alcanza tus metas.") and feature pills.
- Component library (shadcn/ui customized): button, input, field, checkbox, separator, calendar, dialog, popover, select, pagination, table (TanStack), and more.
- No real user testimonials, usage data, or marketing copy on hand; do not fabricate any.

## Product Principles

1. **Academic-first mental model.** Every label, flow, and empty state speaks the language students use — not the language of project management.
2. **Clarity over features.** What's urgent today is always visible; complexity is hidden until needed.
3. **Lightweight and fast.** A student checks this between classes; every screen should load and respond instantly.
4. **Personal and trustworthy.** The student's data is theirs; the app never makes them feel surveilled or overwhelmed.
5. **Spanish throughout.** The product voice is warm, direct, and in the user's language — no mixed-language UI.

