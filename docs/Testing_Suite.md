# AlmaAssist — Testing Suite

## Testing Strategy

This MVP uses manual E2E testing focused on critical user flows. Automated tests can be added in future iterations.

## Manual Test Cases

### TC-01: User Registration
1. Navigate to /signup
2. Enter valid email and password (min 6 chars)
3. Click "Sign Up"
4. **Expected**: Redirected to /dashboard, user created in Firebase Auth console

### TC-02: User Login
1. Navigate to /login
2. Enter registered email and password
3. Click "Login"
4. **Expected**: Redirected to /dashboard

### TC-03: Auth Error Handling
1. Try login with wrong password
2. **Expected**: Error message "Invalid email or password"
3. Try signup with existing email
4. **Expected**: Error message "Email already in use"

### TC-04: Protected Routes
1. While logged out, navigate to /dashboard
2. **Expected**: Redirected to /login

### TC-05: Questionnaire Upload
1. From dashboard, click "New Questionnaire"
2. Upload a PDF containing questions
3. Upload 1-8 reference document PDFs
4. Click "Process Documents"
5. **Expected**: Questions extracted and listed, documents stored

### TC-06: PDF Parse Error
1. Upload a corrupt/non-PDF file
2. **Expected**: Error message, no crash

### TC-07: Answer Generation
1. On a questionnaire with uploaded reference docs
2. Click "Generate Answers"
3. **Expected**: Progress indicator shows, answers generated with citations
4. Answers should reference the uploaded documents
5. Questions not covered by docs should show "Not found in references."

### TC-08: Answer Editing
1. Click on an answer to edit
2. Modify the text
3. Save
4. **Expected**: Answer updated, "edited" badge appears
5. Refresh page — edit persisted

### TC-09: PDF Export
1. On a completed questionnaire, click "Export PDF"
2. **Expected**: PDF downloaded with all Q&A, citations, and coverage summary

### TC-10: Coverage Summary
1. After generating answers
2. **Expected**: Summary shows total questions, answered count, not found count
3. Counts match actual answer states

### TC-11: Different Questionnaire
1. Upload a completely different questionnaire and different reference docs
2. Generate answers
3. **Expected**: System works correctly — answers are based on the new docs, not previous ones

### TC-12: Mobile Responsiveness
1. View all pages at 375px width
2. **Expected**: All pages are usable, no horizontal scroll, text readable

## Future: Automated Testing

When ready to add automated tests:

- **Unit tests**: Jest + React Testing Library for components
- **API tests**: Jest for API route handlers
- **E2E tests**: Playwright for full user flows
- **CI**: GitHub Actions pipeline
