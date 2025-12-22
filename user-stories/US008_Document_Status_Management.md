# User Story 8: Document Status Management

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 5
**Priority:** Must Have
**Sprint:** Phase 3C - Sprint 6

---

## User Story

**As a** bundle creator
**I want to** mark documents as Draft, Final, or Needs Review
**So that** I know which documents are ready for bundling

---

## Acceptance Criteria

### Status Display
- [ ] Status indicator badge on each document card:
  - 🟡 Draft (yellow badge, yellow dot)
  - 🟢 Final (green badge, green dot)
  - 🔴 Needs Review (red badge, red dot)
- [ ] Status visible in:
  - Document library list
  - Document preview pane
  - Document properties panel
  - Bundle stacking order
- [ ] Status badge shows icon + text: "🟡 Draft"

### Status Filter
- [ ] Status filter in document library header
- [ ] Filter options:
  - All Documents
  - Draft Only
  - Final Only
  - Needs Review Only
  - Draft + Needs Review (non-final)
- [ ] Filter persists during session
- [ ] Document count updates based on filter

### Change Status
- [ ] Multiple ways to change status:
  - Right-click context menu → "Change Status"
  - Status dropdown in properties panel
  - Quick action menu on document card
  - Bulk status change for selected documents
- [ ] Status change dropdown shows:
  - Current status (checked)
  - Other status options
  - Last changed date/user

### Status Change Confirmation
- [ ] Changing to "Final" shows confirmation dialog:
  - "Are you sure this document is final and ready for bundling?"
  - Checkbox: "Don't ask me again for this session"
  - Cancel / Confirm buttons
- [ ] Changing to "Needs Review" optionally adds comment/reason
- [ ] Bulk status change shows count: "Change 5 documents to Final?"

### Bundle Integration
- [ ] Warning when adding Draft documents to bundle:
  - Dialog: "3 Draft documents selected. Add anyway?"
  - Checkbox: "Don't warn me again"
  - Cancel / Add Anyway buttons
- [ ] Bundle validation rule (configurable):
  - Require all Final (strict mode)
  - Allow Draft with warning (permissive mode)
  - Mixed (warn but allow)
- [ ] Status summary in bundle header:
  - "20 documents: 18 Final, 2 Draft"

### Audit Trail
- [ ] Status changes logged with:
  - Timestamp
  - User who made change
  - Old status → New status
  - Optional comment/reason
- [ ] Status history visible in document properties
- [ ] Bulk changes recorded individually per document

---

## Technical Notes

### Component Structure
```jsx
<DocumentStatusBadge
  status={document.status}
  onClick={handleStatusClick}
/>

<StatusFilterDropdown
  currentFilter={statusFilter}
  onFilterChange={setStatusFilter}
  documentCounts={{
    all: 50,
    draft: 10,
    final: 35,
    needsReview: 5
  }}
/>

<StatusChangeDialog
  isOpen={showStatusDialog}
  currentStatus={document.status}
  onConfirm={handleStatusChange}
  onCancel={handleCancelStatusChange}
/>

<BulkStatusChangeDialog
  selectedDocuments={selectedDocuments}
  newStatus={newStatus}
  onConfirm={handleBulkStatusChange}
/>
```

### Status State Management
```javascript
const [statusState, setStatusState] = useState({
  statusFilter: 'all',
  documentStatuses: {}, // documentGuid -> status
  statusChangeInProgress: false
});

const handleStatusChange = async (documentGuid, newStatus, comment = '') => {
  try {
    setStatusState(prev => ({ ...prev, statusChangeInProgress: true }));

    // Update via EPS API
    await updateDocumentStatus(documentGuid, newStatus, comment);

    // Update local state
    setStatusState(prev => ({
      ...prev,
      documentStatuses: {
        ...prev.documentStatuses,
        [documentGuid]: newStatus
      },
      statusChangeInProgress: false
    }));

    toast.success(`Document status changed to ${newStatus}`);

    // Refresh library to update filters
    await refreshDocumentLibrary();

  } catch (error) {
    toast.error(`Failed to change status: ${error.message}`);
    setStatusState(prev => ({ ...prev, statusChangeInProgress: false }));
  }
};
```

### API Integration
```javascript
// Add to epsDocumentApi.js
export const updateDocumentStatus = async (documentGuid, newStatus, comment = '') => {
  const response = await fetch(
    `${EPS_BASE_URL}/api/v1/documents/${documentGuid}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': EPS_API_KEY
      },
      body: JSON.stringify({
        status: newStatus,
        comment,
        changedBy: getCurrentUser().email,
        changedAt: new Date().toISOString()
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update document status');
  }

  return await response.json();
};

export const bulkUpdateDocumentStatus = async (documentGuids, newStatus) => {
  const response = await fetch(
    `${EPS_BASE_URL}/api/v1/documents/bulk/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': EPS_API_KEY
      },
      body: JSON.stringify({
        documentGuids,
        status: newStatus
      })
    }
  );

  return await response.json();
};
```

### Status Badge Component
```jsx
const StatusBadge = ({ status, size = 'medium' }) => {
  const statusConfig = {
    Draft: { color: 'yellow', icon: '🟡', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    Final: { color: 'green', icon: '🟢', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    'Needs Review': { color: 'red', icon: '🔴', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.icon} {status}
    </span>
  );
};
```

### Reference Implementations
- **Feature 49753** (Draft/Final Documents): Document state management patterns
- **Feature 49755** (Document Needs Review): Review workflow
- BytePro dbo.EmbeddedDoc.Status field

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides documents to update
- **US004** (Document Properties): Properties panel for status change

### Related Stories
- **US005** (Document Selection): Bulk status changes
- **US009** (Search & Filter): Status filtering

---

## Definition of Done

- [ ] Status badges displayed correctly
- [ ] Status filter working
- [ ] Single and bulk status changes functional
- [ ] Confirmation dialogs for Final status
- [ ] Bundle integration warnings working
- [ ] Audit trail logging status changes
- [ ] Unit tests for status logic
- [ ] Integration test for status updates
- [ ] Code review approved
- [ ] QA tested all status scenarios
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path - Single Status Change
1. User views document with Draft status
2. User right-clicks document
3. Context menu shows "Change Status"
4. Submenu shows: Draft (✓), Final, Needs Review
5. User selects "Final"
6. Confirmation dialog appears
7. User confirms
8. Document status updates to Final
9. Badge changes to green "🟢 Final"
10. Success notification appears

### Happy Path - Bulk Status Change
1. User selects 5 Draft documents
2. User clicks "Change Status" in action bar
3. Dialog shows "Change 5 documents to?"
4. User selects "Final"
5. Confirmation: "Mark 5 documents as Final?"
6. User confirms
7. All 5 documents update to Final
8. Success notification: "5 documents marked as Final"

### Error Scenarios
1. **API Failure**: Show error, rollback status, offer retry
2. **Concurrent Update**: Detect conflict, show refresh prompt
3. **Invalid Status Transition**: Prevent, show validation message
4. **Network Timeout**: Show timeout, queue change for retry

### Edge Cases
1. **Change Status During Bundle Generation**: Queue change, apply after bundle complete
2. **Status Change on Deleted Document**: Show "Document no longer exists"
3. **100 Documents Bulk Change**: Process in batches, show progress
4. **Rapidly Toggling Status**: Debounce, only process final state

---

## Design Mockup

```
Status Badge on Document Card:
┌──────────────────────────────────────────────────────────┐
│ ☐ 📄 1003_Mortgage_Application.pdf    [🟡 Draft]  👁 ⬇  │
│    Dec 1, 2024 | 8 pages | 2.1 MB                       │
└──────────────────────────────────────────────────────────┘

Context Menu:
┌──────────────────┐
│ Preview          │
│ Download         │
│ Edit Properties  │
│ ───────────────  │
│ Change Status ▶  │ ┌─────────────────┐
│ Add to Bundle    │ │ Draft     (✓)   │
│ Delete           │ │ Final           │
└──────────────────┘ │ Needs Review    │
                     └─────────────────┘

Status Change Confirmation:
┌─────────────────────────────────────────────────────────────┐
│ Mark as Final                                        [✕]    │
│                                                              │
│ Are you sure "1003_Mortgage_Application.pdf" is final      │
│ and ready for bundling?                                     │
│                                                              │
│ This document will be marked as approved and ready for      │
│ inclusion in investor bundles.                              │
│                                                              │
│ ☐ Don't ask me again for this session                      │
│                                                              │
│                               [Cancel]  [Mark as Final]     │
└─────────────────────────────────────────────────────────────┘

Status Filter:
┌─────────────────────────────────────────────────────────────┐
│ 📄 Stored Documents                                         │
│ [Status: All Documents ▼]  [🔍 Search...]                   │
│                                                              │
│ Status Dropdown:                                            │
│ ┌──────────────────────┐                                    │
│ │ All Documents (50)   │ ← Selected                         │
│ │ ─────────────────    │                                    │
│ │ Draft (10)           │                                    │
│ │ Final (35)           │                                    │
│ │ Needs Review (5)     │                                    │
│ │ ─────────────────    │                                    │
│ │ Non-Final (15)       │                                    │
│ └──────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘

Bundle Warning:
┌─────────────────────────────────────────────────────────────┐
│ Draft Documents Selected                             [✕]    │
│                                                              │
│ ⚠ You are adding 3 documents that are still in Draft status:│
│ • 1003_Mortgage_Application.pdf                             │
│ • Appraisal_Report_v2.pdf                                  │
│ • Title_Insurance_Draft.pdf                                 │
│                                                              │
│ Draft documents may not be final and could contain errors.  │
│ Are you sure you want to add them to your bundle?          │
│                                                              │
│ ☐ Don't warn me about Draft documents again                │
│                                                              │
│                               [Cancel]  [Add Anyway]        │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

```javascript
const STATUS_VALUES = ['Draft', 'Final', 'Needs Review'];

const validateStatusChange = (currentStatus, newStatus) => {
  if (!STATUS_VALUES.includes(newStatus)) {
    return { valid: false, error: 'Invalid status value' };
  }

  if (currentStatus === newStatus) {
    return { valid: false, error: 'Status is already set to this value' };
  }

  // Add any business rules here
  // e.g., "Can only change to Final after review"

  return { valid: true };
};

const shouldShowConfirmation = (newStatus, userPreferences) => {
  // Always confirm when marking as Final (unless user opted out)
  if (newStatus === 'Final' && !userPreferences.skipFinalConfirmation) {
    return true;
  }

  // Confirm bulk changes
  if (selectedDocuments.length > 10) {
    return true;
  }

  return false;
};
```

---

## Notes
- Consider adding custom statuses per organization (future enhancement)
- Implement status-based permissions (e.g., only admins can mark Final)
- Add status change notifications to document owner
- Track status duration metrics (time spent in each status)
