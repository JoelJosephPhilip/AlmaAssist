# AlmaAssist — UI Component Library

## Design System

### Colors (Tailwind)
- **Primary**: `blue-600` / `blue-700` (buttons, links, accents)
- **Background**: `white` / `gray-50` (page backgrounds)
- **Surface**: `white` with `border-gray-200` (cards, panels)
- **Text Primary**: `gray-900`
- **Text Secondary**: `gray-600`
- **Success**: `green-500` (high confidence)
- **Warning**: `yellow-500` (medium confidence)
- **Danger**: `red-500` (low confidence, errors)

### Typography
- **Headings**: `font-bold`, sizes from `text-3xl` (h1) to `text-lg` (h3)
- **Body**: `text-base text-gray-700`
- **Small**: `text-sm text-gray-500`

### Spacing
- Page padding: `px-4 sm:px-6 lg:px-8`
- Section gaps: `space-y-8`
- Card padding: `p-6`
- Max content width: `max-w-7xl mx-auto`

---

## Components

### Header
- Fixed top navigation bar
- Logo ("AlmaAssist") left-aligned
- User email + logout button right-aligned (when authenticated)
- Mobile: hamburger menu or stacked layout

### Button
Variants:
- **Primary**: `bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-3`
- **Secondary**: `bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg px-6 py-3`
- **Danger**: `bg-red-600 text-white hover:bg-red-700 rounded-lg px-6 py-3`
- Disabled state: `opacity-50 cursor-not-allowed`
- Loading state: spinner icon + "Loading..." text

### FileUpload
- Dashed border dropzone: `border-2 border-dashed border-gray-300 rounded-lg p-8`
- Drag hover: `border-blue-500 bg-blue-50`
- Shows file name after selection
- Accept filter for PDF files only

### QuestionCard
- White card with border
- Question text (bold)
- Answer (editable textarea when clicked)
- Citation badge: `bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded`
- Confidence badge: color-coded (green/yellow/red)
- Evidence snippet: collapsible section with gray background
- Edited indicator: small badge when user has modified answer

### CoverageSummary
- Horizontal bar or card at top of review page
- Three stats: Total Questions, Answered, Not Found
- Color-coded counters

### LoadingSpinner
- Centered spinner animation
- Optional text below: "Loading..." or custom message

### EmptyState
- Centered illustration/icon
- Heading: "No [items] yet"
- Subtext: "Get started by..."
- CTA button

---

## Page Layouts

### Landing Page (`/`)
- Full-width hero section with centered content
- Features section: 3-column grid (responsive to single column on mobile)
- Footer: centered, minimal

### Auth Pages (`/login`, `/signup`)
- Centered card layout: `max-w-md mx-auto mt-20`
- Form with email/password fields
- Submit button with loading state
- Link to alternate auth page
- Error message area

### Dashboard (`/dashboard`)
- Header (fixed)
- Main content: `max-w-7xl mx-auto py-8`
- Questionnaire list as cards or table rows
- FAB or prominent "New Questionnaire" button

### Upload Page (`/dashboard/new`)
- Two-section layout
- Step-by-step: questionnaire first, then reference docs
- Process button at bottom

### Review Page (`/dashboard/questionnaire/[id]`)
- Coverage summary at top
- Question cards stacked vertically
- Action bar: "Generate Answers" + "Export PDF" buttons
- Sticky header with questionnaire title
