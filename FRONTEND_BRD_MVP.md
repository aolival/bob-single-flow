# Frontend Requirements Document (BRD)
## Single Flow BoB MVP - BytePro Data Integration

**Document Version:** 1.0
**Date:** December 16, 2025
**Status:** Draft
**Owner:** Frontend Development Team

---

## Executive Summary

This document outlines the frontend integration requirements for the Single Flow BoB (Bundle of Bundles) MVP. The objective is to replace all dummy/hardcoded data in the UI with live data from BytePro database endpoints, ensuring all UI components (dropdowns, loan details, forms, tables) consume real-time data.

### Scope
- **In Scope:** Replace dummy data with real BytePro API endpoint data across all UI components
- **In Scope:** Integrate dropdowns, forms, tables, and detail views with live data
- **In Scope:** Implement loading states, error handling, and data refresh mechanisms
- **In Scope:** Data formatting and display logic for real BytePro data
- **Out of Scope:** Backend API development (covered in Backend BRD)
- **Out of Scope:** Major UI/UX redesign (existing layout remains largely unchanged)

---

## Current State vs. Future State

### Current State
- Single Flow BoB UI using hardcoded/dummy data
- Static dropdown values
- Mock loan details and bundle information
- No API integration layer
- All data defined in frontend constants/mock files

### Future State (MVP)
- All UI components consuming live BytePro data via API
- Dynamic dropdowns populated from real endpoints
- Real-time loan details and bundle information
- Integrated API service layer with proper error handling
- Loading states and data refresh capabilities
- Seamless user experience with live data

---

## UI Component Data Integration Requirements

### 1. Bundle List/Grid View

#### Current Dummy Data
- Hardcoded bundle records with static IDs, names, dates

#### Required Integration
**Endpoint:** `GET /api/v1/bundles`

**UI Elements to Update:**
- Bundle grid/table displaying all bundles
- Bundle ID column
- Bundle Name column (from stacking order algorithm)
- Bundle Status column (Active, Pending, Completed, Cancelled)
- Created Date column
- Created By column
- Last Modified column
- Action buttons (Edit, Delete, View)

**Implementation Requirements:**
- Replace static bundle array with API call on component mount
- Implement pagination controls (50-100 records per page)
- Add loading spinner during data fetch
- Display "No bundles found" message for empty results
- Format dates consistently (MM/DD/YYYY or locale-specific)
- Enable sortable columns
- Add refresh button to reload data

---

### 2. Bundle Details View

#### Current Dummy Data
- Mock bundle header information
- Hardcoded loan list within bundle
- Static stacking order

#### Required Integration
**Endpoints:**
- `GET /api/v1/bundles/{bundleId}`
- `GET /api/v1/bundles/{bundleId}/loans`
- `GET /api/v1/stacking-order/{bundleId}`

**UI Elements to Update:**
- Bundle header section:
  - Bundle ID
  - Bundle Name
  - Status badge
  - Created/Modified timestamps
  - Created/Modified by users
  - Priority indicator
- Loan list table:
  - Loan Number
  - Borrower Name(s)
  - Property Address
  - Loan Amount (formatted as currency)
  - Loan Type
  - Status
  - Position in stack
- Stacking order visualization:
  - Ordered loan sequence
  - Visual indicators of order position

**Implementation Requirements:**
- Load bundle details when bundle is selected
- Display loading skeleton for bundle header
- Fetch loan list and stacking order in parallel
- Format currency values (e.g., $250,000.00)
- Show loan count badge
- Implement drill-down to individual loan details

---

### 3. Loan Details Panel

#### Current Dummy Data
- Mock loan information
- Static borrower data
- Hardcoded document list

#### Required Integration
**Endpoints:**
- `GET /api/v1/loans/{loanNumber}`
- `GET /api/v1/loans/{loanNumber}/documents`

**UI Elements to Update:**
- Loan Information Section:
  - Loan Number
  - Borrower Name(s)
  - Co-Borrower Name(s)
  - Property Address (formatted)
  - Loan Amount (formatted as currency)
  - Loan Type
  - Interest Rate (formatted as percentage)
  - Current Status
  - Closing Date
  - Loan Officer name
- Document List:
  - Document Type
  - Document Name
  - Upload Date
  - Status (Complete, Incomplete, Under Review)
  - Page count
  - Download/View action button

**Implementation Requirements:**
- Load loan details on selection/navigation
- Show loading state for loan information section
- Format address fields (Street, City, State, ZIP)
- Display currency with proper formatting ($XXX,XXX.XX)
- Show percentage with 2-3 decimal places (X.XXX%)
- Enable document preview/download functionality
- Add document status color coding

---

### 4. Dropdowns & Selection Controls

#### Current Dummy Data
- Hardcoded dropdown options for:
  - Bundle Status
  - Loan Types
  - Document Types
  - User Assignments
  - Workflow Stages

#### Required Integration

**Bundle Status Dropdown**
- **Endpoint:** `GET /api/v1/bundles` (derive unique status values) OR dedicated metadata endpoint
- **UI Element:** Status filter dropdown in bundle list
- **Implementation:** Populate with actual status values from BytePro

**Loan Type Dropdown**
- **Endpoint:** Metadata endpoint or `GET /api/v1/loans` (derive unique types)
- **UI Element:** Loan type filter in search/filter panel
- **Implementation:** Dynamic population from real loan types

**Document Type Dropdown**
- **Endpoint:** Metadata endpoint for document types
- **UI Element:** Document filter and upload form
- **Implementation:** Show only valid document types for context

**User Assignment Dropdown**
- **Endpoint:** `GET /api/v1/users` (with role filtering)
- **UI Element:** Assignment dropdown in workflow panel
- **Implementation:** Show active users with appropriate permissions

**Workflow Stage Dropdown**
- **Endpoint:** `GET /api/v1/workflows/{bundleId}` OR metadata endpoint
- **UI Element:** Workflow advancement dropdown
- **Implementation:** Show available next stages based on current state

**Implementation Requirements:**
- Cache dropdown values to minimize API calls
- Show loading indicator while fetching options
- Handle empty dropdown states gracefully
- Implement typeahead/search for long lists
- Refresh dropdown data on demand
- Sort options alphabetically or by business logic

---

### 5. Forms & Data Entry

#### Current Dummy Data
- Mock form submission (no backend integration)
- Client-side validation only

#### Required Integration

**Create Bundle Form**
- **Endpoint:** `POST /api/v1/bundles`
- **Fields:**
  - Bundle Name (manual or auto-generated)
  - Bundle Type dropdown (from metadata)
  - Priority dropdown
  - Assigned User dropdown (from users endpoint)
  - Notes/Comments

**Update Bundle Form**
- **Endpoint:** `PUT /api/v1/bundles/{bundleId}`
- **Fields:** Same as create, pre-populated from GET bundle details

**Stacking Order Form**
- **Endpoint:** `POST /api/v1/stacking-order` OR `PUT /api/v1/stacking-order/{bundleId}`
- **Fields:**
  - Loan selection (multi-select from available loans)
  - Drag-and-drop reordering interface
  - Auto-generate bundle name button (`POST /api/v1/stacking-order/generate-name`)

**Document Upload Form**
- **Endpoint:** `POST /api/v1/documents`
- **Fields:**
  - File upload input
  - Document type dropdown (from metadata)
  - Associated loan number
  - Document description

**Implementation Requirements:**
- Bind form fields to API request payloads
- Show loading spinner on form submission
- Display success/error messages from API response
- Implement client-side validation matching backend rules
- Handle API validation errors and display field-specific messages
- Reset form on successful submission
- Pre-populate form fields when editing existing records
- Implement optimistic UI updates with rollback on failure

---

### 6. Workflow & Status Management

#### Current Dummy Data
- Mock workflow stages
- Static status updates

#### Required Integration
**Endpoints:**
- `GET /api/v1/workflows/{bundleId}`
- `POST /api/v1/workflows/{bundleId}/advance`
- `POST /api/v1/workflows/{bundleId}/assign`
- `GET /api/v1/workflows/history/{bundleId}`

**UI Elements to Update:**
- Workflow status badge/indicator
- Workflow stage timeline/progress bar
- Stage timestamps (start, completion)
- Assigned user display
- Advance to next stage button
- Reassign button
- Workflow history modal/panel:
  - Previous stages
  - Timestamps
  - Users who performed actions
  - Comments/notes

**Implementation Requirements:**
- Load current workflow status on bundle view
- Update UI immediately when workflow advances
- Show confirmation dialog before advancing stage
- Display workflow history in timeline format
- Refresh workflow data after actions
- Show assigned user with avatar/initials
- Enable inline reassignment

---

### 7. Search & Filter Functionality

#### Current Dummy Data
- Client-side filtering of static data

#### Required Integration
**Endpoint:** `GET /api/v1/bundles` with query parameters

**Filter Options:**
- Bundle Status (multi-select)
- Date Range (created, modified)
- Created By user
- Bundle Type
- Priority
- Search by Bundle ID or Name

**Endpoint:** `GET /api/v1/loans` with query parameters

**Filter Options:**
- Loan Number search
- Borrower Name search
- Loan Type
- Status
- Loan Officer
- Date Range (closing date)

**Implementation Requirements:**
- Build query string from filter selections
- Debounce search inputs (300-500ms)
- Show loading indicator during filtered search
- Clear filters button resets to unfiltered view
- Display active filter chips/badges
- Maintain filter state in URL for shareable links
- Show result count after filtering

---

### 8. User Context & Authentication

#### Current Dummy Data
- Hardcoded user information
- No role-based UI adjustments

#### Required Integration
**Endpoint:** `GET /api/v1/users/current`

**UI Elements to Update:**
- User profile display (name, avatar)
- Role-based feature visibility:
  - Admin actions (delete, reassign)
  - Manager actions (approve, advance workflow)
  - User actions (view, comment)
- User's work queue:
  - **Endpoint:** `GET /api/v1/users/{userId}/work-queue`
  - Display assigned bundles/tasks
  - Task count badge
- User's assignments:
  - **Endpoint:** `GET /api/v1/users/{userId}/assignments`
  - Show bundles assigned to user

**Implementation Requirements:**
- Load user context on app initialization
- Store user info in global state (Context API, Redux, Zustand)
- Conditionally render UI elements based on user role
- Show/hide action buttons per permissions
- Fetch user work queue on dashboard load
- Update work queue count in real-time
- Display user-specific notifications

---

## Data Formatting & Display Standards

### Date/Time Formatting
- **Display Format:** MM/DD/YYYY hh:mm AM/PM (or configurable locale)
- **API Format:** ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- **Relative Time:** Show "2 hours ago", "Yesterday" for recent dates
- **Timezone:** Display user's local timezone with UTC conversion info

### Currency Formatting
- **Format:** $XXX,XXX.XX
- **Handle Negatives:** ($XXX,XXX.XX) or -$XXX,XXX.XX
- **Zero Values:** $0.00 (not blank)

### Percentage Formatting
- **Format:** XX.XX%
- **Decimals:** 2-3 places for interest rates

### Phone Numbers
- **Format:** (XXX) XXX-XXXX

### Address Formatting
- **Single Line:** 123 Main St, Anytown, CA 12345
- **Multi-Line:**
  ```
  123 Main St
  Anytown, CA 12345
  ```

### Status Display
- **Active:** Green badge
- **Pending:** Yellow/Amber badge
- **Completed:** Blue badge
- **Cancelled:** Red badge
- **Under Review:** Orange badge

---

## Loading States & User Feedback

### Loading Indicators
- **Full Page Load:** Show skeleton screens or centered spinner
- **Component Load:** Inline spinners for specific sections
- **Button Actions:** Disable button + show inline spinner during submission
- **Table/List Load:** Skeleton rows or shimmer effect

### Empty States
- **No Bundles:** "No bundles found. Create your first bundle to get started."
- **No Loans:** "No loans in this bundle yet. Add loans to begin."
- **No Documents:** "No documents uploaded. Upload documents to proceed."
- **Search No Results:** "No results found for '[search term]'. Try different filters."

### Success Messages
- **Create Success:** "Bundle created successfully!" (toast notification, auto-dismiss 3s)
- **Update Success:** "Changes saved successfully!"
- **Delete Success:** "Bundle deleted successfully!"

### Error Messages
- **General Error:** "Something went wrong. Please try again."
- **Network Error:** "Unable to connect. Check your internet connection."
- **404 Not Found:** "Bundle not found. It may have been deleted."
- **403 Forbidden:** "You don't have permission to perform this action."
- **Validation Error:** Display field-specific messages below input fields

---

## API Integration Layer (Frontend Service)

### Service Architecture
Create API service modules to centralize data fetching:

```
src/services/
  ├── api.js (base API client with axios/fetch)
  ├── bundleService.js
  ├── loanService.js
  ├── documentService.js
  ├── workflowService.js
  └── userService.js
```

### API Client Configuration
- **Base URL:** Configure EPS endpoint (e.g., `https://eps.company.com/bytepro`)
- **Headers:** Set default headers (Content-Type, Authorization)
- **Interceptors:**
  - Request interceptor: Add auth token, correlation ID
  - Response interceptor: Handle errors globally, refresh token
- **Timeout:** 30 seconds for all requests
- **Retry Logic:** Retry failed requests 3 times with exponential backoff

### Error Handling Strategy
- **Network Errors:** Show user-friendly message, enable retry button
- **401 Unauthorized:** Redirect to login page
- **403 Forbidden:** Show permission denied message
- **404 Not Found:** Show "not found" message, option to return to list
- **500 Server Error:** Log error, show generic error message
- **Timeout:** Show timeout message, offer retry option

### Caching Strategy
- **User Context:** Cache for session duration
- **Dropdown Options:** Cache for 15 minutes
- **Bundle List:** Cache for 2 minutes with manual refresh option
- **Bundle Details:** Cache for 1 minute, invalidate on updates
- **Work Queue:** Fetch on demand, no caching

---

## State Management

### Recommended Approach
- **Global State:** User context, authentication state
- **Component State:** Form inputs, UI toggles (modals, panels)
- **Server State:** React Query, SWR, or similar for API data caching

### State Management Options
1. **React Query / TanStack Query** (Recommended)
   - Built-in caching, loading states, error handling
   - Automatic refetching and background updates
   - Optimistic updates support

2. **SWR (Stale-While-Revalidate)**
   - Lightweight, similar features to React Query

3. **Redux Toolkit + RTK Query**
   - If already using Redux for global state

### Key State Slices
- `authState`: Current user, token, permissions
- `bundleState`: Selected bundle, filter state
- `loanState`: Selected loan details
- `workflowState`: Current workflow status
- `uiState`: Modal visibility, loading states

---

## Testing Requirements

### Unit Testing
- Test API service functions (mock API calls)
- Test data formatting utility functions
- Test form validation logic
- Test error handling scenarios

### Integration Testing
- Test component data fetching on mount
- Test form submission and API integration
- Test dropdown population from API
- Test error state rendering
- Test loading state transitions

### E2E Testing
- Test complete user flows:
  - Create bundle → Add loans → Advance workflow
  - Search bundles → View details → Edit bundle
  - Upload document → Verify display
- Test with real API in QA environment
- Validate data displays correctly end-to-end

---

## Accessibility & Usability

### Loading Accessibility
- Use `aria-live` regions for loading announcements
- Announce when data has loaded successfully
- Provide skip links for screen readers

### Error Accessibility
- Use `role="alert"` for error messages
- Ensure error messages have sufficient color contrast
- Provide clear error message text, not just visual indicators

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Maintain logical tab order
- Provide keyboard shortcuts for common actions

---

## Performance Requirements

### Initial Load Time
- **Target:** < 3 seconds for dashboard/bundle list
- **Optimization:** Lazy load components, code splitting

### Data Fetch Time
- **Target:** < 2 seconds for standard data retrieval
- **Strategy:** Show cached data immediately while fetching fresh data

### Bundle List Pagination
- **Page Size:** 50-100 records per page
- **Implementation:** Server-side pagination with page navigation

### Image/Document Optimization
- **Lazy Load:** Only load visible documents
- **Thumbnails:** Use thumbnail URLs for document previews
- **Progressive Loading:** Show low-res preview first

---

## Deployment & Rollout

### Configuration Updates
1. Update API base URL from dummy endpoints to real EPS endpoints
2. Configure authentication token management
3. Update environment variables:
   ```
   VITE_API_BASE_URL=https://eps.company.com/bytepro/api/v1
   VITE_AUTH_ENABLED=true
   VITE_CACHE_TTL=900000
   ```

### Feature Flags (Optional)
- **Feature Flag:** `USE_REAL_DATA`
  - Enable/disable real data integration
  - Fallback to dummy data if API unavailable

### Deployment Steps
1. Deploy updated frontend code to QA environment
2. Verify API connectivity and authentication
3. Test all UI components with real data
4. Conduct smoke testing of critical user flows
5. Perform UAT with business stakeholders
6. Deploy to production after sign-off

### Monitoring
- Track API error rates in frontend logs
- Monitor API response times
- Track user-facing errors (use error tracking service like Sentry)
- Monitor page load performance

---

## Success Criteria

The MVP frontend integration will be considered successful when:

1. ✅ All dummy data replaced with live BytePro data across all UI components
2. ✅ Dropdowns dynamically populated from real API endpoints
3. ✅ Loan details and bundle information display accurately
4. ✅ Forms submit successfully and reflect changes immediately
5. ✅ Loading states provide clear user feedback
6. ✅ Error handling displays user-friendly messages
7. ✅ Search and filter functionality works with real data
8. ✅ User context and permissions properly enforced in UI
9. ✅ No performance degradation compared to dummy data version
10. ✅ All QA test cases passing
11. ✅ UAT sign-off received from business stakeholders

---

## Open Questions & Decisions Needed

| Question | Owner | Target Date | Status |
|----------|-------|-------------|--------|
| Confirm dropdown metadata endpoints availability | Backend Team | TBD | Open |
| Define caching durations for each data type | Frontend Team | TBD | Open |
| Choose state management library (React Query vs Redux) | Frontend Tech Lead | TBD | Open |
| Determine error tracking service integration (Sentry, etc.) | DevOps Team | TBD | Open |
| Confirm date/time formatting preferences | Product Owner | TBD | Open |
| Define role-based UI feature visibility rules | Product Owner | TBD | Open |
| Establish performance benchmarks for QA acceptance | QA Team | TBD | Open |

---

## Appendix

### Glossary
- **BoB:** Bundle of Bundles - Tool for managing loan bundles
- **BytePro:** Core database and API platform
- **EPS:** Enterprise Proxy Service - Routing layer for API calls
- **MVP:** Minimum Viable Product
- **QA:** Quality Assurance environment
- **SWR:** Stale-While-Revalidate caching strategy
- **RTK:** Redux Toolkit

### Component Mapping Reference

| UI Component | Dummy Data Location | API Endpoint(s) | Priority |
|--------------|---------------------|-----------------|----------|
| Bundle List Grid | `src/data/mockBundles.js` | `GET /api/v1/bundles` | P0 |
| Bundle Details | `src/data/mockBundles.js` | `GET /api/v1/bundles/{id}` | P0 |
| Loan Details Panel | `src/data/mockLoans.js` | `GET /api/v1/loans/{loanNumber}` | P0 |
| Document List | `src/data/mockDocuments.js` | `GET /api/v1/loans/{loanNumber}/documents` | P1 |
| Status Dropdown | `src/constants/statuses.js` | Metadata endpoint or derive from data | P0 |
| User Dropdown | `src/data/mockUsers.js` | `GET /api/v1/users` | P1 |
| Workflow Panel | `src/data/mockWorkflows.js` | `GET /api/v1/workflows/{bundleId}` | P1 |
| Work Queue | Static in component | `GET /api/v1/users/{userId}/work-queue` | P2 |

### References
- Backend BRD: `BACKEND_BRD_MVP.md`
- BytePro API Documentation: [Link to be added]
- EPS Integration Guide: [Link to be added]
- Single Flow BoB UI Component Library: [Link to be added]
- State Management Best Practices: [Link to be added]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Initial Draft | Initial Frontend BRD creation for MVP data integration |

---

**Approval Signatures**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Frontend Tech Lead | | | |
| UX/UI Lead | | | |
| QA Manager | | | |
