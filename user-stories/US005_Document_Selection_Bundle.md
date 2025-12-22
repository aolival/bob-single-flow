# User Story 5: Document Selection for Bundle

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 13
**Priority:** Must Have
**Sprint:** Phase 3C - Sprint 5

---

## User Story

**As a** bundle creator
**I want to** select documents from the library and add them to my bundle's stacking order
**So that** I can create complete bundles with stored documents

---

## Acceptance Criteria

### Selection Interface
- [ ] Checkbox on each document card in library
- [ ] "Select All" button in library header
- [ ] "Clear Selection" button when documents selected
- [ ] Selected documents counter badge (e.g., "5 selected")
- [ ] Multi-select support:
  - Click: Toggle single selection
  - Shift+Click: Range select
  - Ctrl/Cmd+Click: Multi-select individual

### Selection Feedback
- [ ] Selected documents highlight with blue border/background
- [ ] Floating action bar appears when documents selected:
  - "Add to Bundle" button
  - "Download Selected" button
  - "Merge Selected" button (if all PDFs)
  - Selection count
  - "Clear Selection" button

### Add to Bundle Flow
- [ ] Click "Add to Bundle" opens confirmation dialog
- [ ] Dialog shows:
  - List of selected documents with page counts
  - Current position in stacking order (default: append to end)
  - Option to insert at specific position (dropdown)
  - Total pages impact calculation
  - Duplicate detection warnings
  - Investor stacking order compliance check
- [ ] Confirm button adds documents to bundle
- [ ] Cancel button closes dialog without changes

### Bundle Integration
- [ ] Documents added to existing stacking order display
- [ ] New documents marked with "NEW" badge temporarily
- [ ] Bundle page count updates automatically
- [ ] Stacking order position numbers recalculate
- [ ] Documents link to BytePro `dbo.DocumentStack` records
- [ ] Bundle state persists to localStorage (draft mode)

### Validation Rules
- [ ] Duplicate detection: Warn if document already in bundle
- [ ] Required document check: Validate against investor requirements
- [ ] Document status check: Warn if Draft documents included
- [ ] Page limit check: Warn if bundle exceeds maximum pages
- [ ] Stacking order compliance: Validate document types in correct order

---

## Technical Notes

### Component Structure
```jsx
<DocumentLibrary>
  <DocumentList>
    {documents.map(doc => (
      <DocumentCard
        key={doc.documentGuid}
        document={doc}
        isSelected={selectedDocuments.includes(doc.documentGuid)}
        onSelect={handleSelectDocument}
      />
    ))}
  </DocumentList>

  {selectedDocuments.length > 0 && (
    <FloatingActionBar
      selectedCount={selectedDocuments.length}
      onAddToBundle={handleOpenConfirmDialog}
      onClearSelection={handleClearSelection}
    />
  )}
</DocumentLibrary>

<AddToBundleDialog
  isOpen={showConfirmDialog}
  selectedDocuments={selectedDocuments}
  currentBundle={currentBundle}
  onConfirm={handleConfirmAddToBundle}
  onCancel={handleCancelDialog}
/>
```

### Selection State Management
```javascript
const [selectionState, setSelectionState] = useState({
  selectedDocuments: [],
  selectionMode: 'idle', // 'idle' | 'selecting' | 'range'
  lastSelectedIndex: null
});

const handleSelectDocument = (documentGuid, event) => {
  if (event.shiftKey && selectionState.lastSelectedIndex !== null) {
    // Range select
    handleRangeSelect(documentGuid);
  } else if (event.ctrlKey || event.metaKey) {
    // Multi-select
    handleMultiSelect(documentGuid);
  } else {
    // Single toggle
    handleToggleSelect(documentGuid);
  }
};
```

### Add to Bundle Logic
```javascript
const handleConfirmAddToBundle = async (selectedDocs, insertPosition) => {
  // Validate documents
  const validation = validateDocumentSelection(selectedDocs, currentBundle);

  if (!validation.isValid) {
    toast.warning(validation.warnings.join(', '));
    // Still allow if only warnings (not errors)
  }

  // Add to bundle state
  const updatedBundle = {
    ...currentBundle,
    documents: [
      ...currentBundle.documents.slice(0, insertPosition),
      ...selectedDocs,
      ...currentBundle.documents.slice(insertPosition)
    ]
  };

  // Update stacking order
  const updatedStackingOrder = recalculateStackingOrder(updatedBundle);

  // Update bundle display
  setBundleState({
    bundle: updatedBundle,
    stackingOrder: updatedStackingOrder
  });

  // Persist to BytePro (create dbo.DocumentStack entries)
  await saveDocumentStackEntries(selectedDocs, insertPosition);

  toast.success(`${selectedDocs.length} documents added to bundle`);
  handleClearSelection();
};
```

### Validation Functions
```javascript
const validateDocumentSelection = (selectedDocs, currentBundle) => {
  const warnings = [];
  const errors = [];

  // Check for duplicates
  const existingGuids = new Set(currentBundle.documents.map(d => d.documentGuid));
  const duplicates = selectedDocs.filter(d => existingGuids.has(d.documentGuid));
  if (duplicates.length > 0) {
    warnings.push(`${duplicates.length} documents already in bundle`);
  }

  // Check document status
  const draftDocs = selectedDocs.filter(d => d.status === 'Draft');
  if (draftDocs.length > 0) {
    warnings.push(`${draftDocs.length} documents are still in Draft status`);
  }

  // Check page limit
  const totalPages = currentBundle.documents.reduce((sum, d) => sum + d.pageCount, 0);
  const newPages = selectedDocs.reduce((sum, d) => sum + d.pageCount, 0);
  if (totalPages + newPages > 500) { // Configurable limit
    errors.push('Bundle would exceed maximum page limit (500 pages)');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};
```

### Reference Implementations
- **Feature 72744** (BoB - FE Bundle Engine): Stacking order management
- **Feature 21512** (Doc Storage/Management): Document-bundle linking
- **BytePro dbo.DocumentStack** table for persistence

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides document list
- **Phase 1 MVP**: Stacking order display and bundle state management

### Related Stories
- **US008** (Document Status Management): Validate document status
- **US004** (Document Properties): Display document metadata in dialog

---

## Definition of Done

- [ ] Multi-select functionality implemented (click, shift, ctrl)
- [ ] Floating action bar appears on selection
- [ ] Add to Bundle dialog with validation
- [ ] Duplicate detection working
- [ ] Stacking order integration complete
- [ ] Bundle page count updates correctly
- [ ] Unit tests for validation logic
- [ ] Integration test for full add-to-bundle flow
- [ ] Code review approved
- [ ] QA tested all selection scenarios
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path
1. User views document library with 20 documents
2. User clicks checkboxes on 3 documents
3. Floating action bar appears showing "3 selected"
4. User clicks "Add to Bundle"
5. Confirmation dialog shows 3 documents, total 24 pages
6. User confirms
7. Documents appear in stacking order
8. Bundle page count updates from 150 to 174 pages
9. Success notification appears

### Error Scenarios
1. **Duplicate Document**: Warning in dialog, allow proceed
2. **Page Limit Exceeded**: Error in dialog, prevent add
3. **Draft Status**: Warning in dialog, allow proceed
4. **Invalid Position**: Error, default to append

### Edge Cases
1. **Select All 500 Documents**: Performance remains smooth
2. **Shift-Select Across Pages**: Handle pagination correctly
3. **Network Failure During Save**: Rollback bundle state, show error
4. **Concurrent Bundle Edits**: Last-write-wins with conflict detection

---

## Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Stored Documents                                         │
│ [Select All]  [Clear Selection]                             │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ☑ 📄 1003_Mortgage_Application.pdf    [Draft]  👁 ⬇  │   │
│ │    Dec 1, 2024 | 8 pages | 2.1 MB                    │   │
│ └──────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ☐ 📄 Appraisal_Report_Final.pdf        [Final]  👁 ⬇  │   │
│ │    Dec 2, 2024 | 42 pages | 8.5 MB                   │   │
│ └──────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ☑ 📄 Title_Insurance_Policy.pdf        [Final]  👁 ⬇  │   │
│ │    Dec 1, 2024 | 15 pages | 3.2 MB                   │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 2 documents selected                                   │ │
│ │ [Add to Bundle] [Download] [Clear Selection]          │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Add to Bundle Confirmation Dialog:
┌─────────────────────────────────────────────────────────────┐
│ Add Documents to Bundle                              [✕]    │
│                                                              │
│ You are adding 2 documents (23 pages total):                │
│ • 1003_Mortgage_Application.pdf (8 pages) 🟡 Draft          │
│ • Title_Insurance_Policy.pdf (15 pages) 🟢 Final            │
│                                                              │
│ ⚠ Warning: 1 document is in Draft status                   │
│                                                              │
│ Insert Position:                                            │
│ ( ) Append to end of bundle (default)                      │
│ ( ) Insert at position: [Dropdown: Select position ▼]      │
│                                                              │
│ Current Bundle: 150 pages → New Total: 173 pages           │
│                                                              │
│                               [Cancel]  [Confirm Add]       │
└─────────────────────────────────────────────────────────────┘
```

---

## Notes
- Consider bulk validation API endpoint to check all documents at once
- Implement undo/redo for bundle modifications (future enhancement)
- Add keyboard shortcut: Ctrl+A to select all visible documents
