# User Story 7: Document Merge Capability

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 8
**Priority:** Should Have
**Sprint:** Phase 3D - Sprint 7

---

## User Story

**As a** bundle creator
**I want to** merge multiple PDF documents into a single PDF
**So that** I can combine related documents before bundling

---

## Acceptance Criteria

### Merge Initiation
- [ ] Select 2+ PDF documents from library
- [ ] "Merge Documents" button appears in floating action bar
- [ ] Button only enabled when all selected documents are PDFs
- [ ] Non-PDF files show tooltip: "Only PDF files can be merged"

### Merge Dialog
- [ ] Merge dialog opens showing:
  - List of selected documents in merge order
  - Page count for each document
  - Total page count for merged result
  - Drag-and-drop handles to reorder documents
  - Remove button for each document
  - "Add More Documents" button
  - Name field for merged document (required)
  - Document type dropdown for merged document
- [ ] Preview thumbnails for each document
- [ ] Real-time page count update as documents reordered/removed

### Merge Process
- [ ] "Merge" button initiates server-side merge via EPS API
- [ ] Progress indicator shows:
  - "Preparing documents..."
  - "Merging PDFs..."
  - "Saving merged document..."
- [ ] Cancel button during merge process
- [ ] Estimated time remaining for large merges

### Post-Merge
- [ ] Success notification with merged document name
- [ ] Merged document automatically added to library
- [ ] Merged document marked with "MERGED" badge
- [ ] Original documents remain in library unchanged
- [ ] Option to immediately preview merged document
- [ ] Option to add merged document to bundle

---

## Technical Notes

### Component Structure
```jsx
<MergeDocumentsDialog
  isOpen={showMergeDialog}
  selectedDocuments={selectedPDFDocuments}
  onMerge={handleMergeDocuments}
  onCancel={handleCancelMerge}
>
  <DocumentMergeList
    documents={documentsInMergeOrder}
    onReorder={handleReorderDocuments}
    onRemove={handleRemoveFromMerge}
  />
  <MergeOptions
    mergedName={mergedDocumentName}
    mergedType={mergedDocumentType}
    onNameChange={setMergedDocumentName}
    onTypeChange={setMergedDocumentType}
  />
  <MergeProgress progress={mergeProgress} />
</MergeDocumentsDialog>
```

### Merge State Management
```javascript
const [mergeState, setMergeState] = useState({
  documentsInMergeOrder: [],
  mergedDocumentName: '',
  mergedDocumentType: '',
  mergeProgress: 0,
  isMerging: false,
  mergeError: null
});

const handleMergeDocuments = async () => {
  setMergeState(prev => ({ ...prev, isMerging: true, mergeProgress: 0 }));

  try {
    // Extract document GUIDs in order
    const documentGuids = mergeState.documentsInMergeOrder.map(d => d.documentGuid);

    // Call EPS API (already implemented in epsDocumentApi.js)
    const result = await mergeDocuments(
      currentLoanNumber,
      documentGuids,
      {
        mergedDocumentName: mergeState.mergedDocumentName,
        mergedDocumentType: mergeState.mergedDocumentType,
        preserveOriginals: true
      }
    );

    setMergeState(prev => ({ ...prev, mergeProgress: 100, isMerging: false }));

    // Add merged document to library
    await refreshDocumentLibrary();

    toast.success(`Merged ${documentGuids.length} documents successfully`);

    // Close dialog
    handleCancelMerge();

  } catch (error) {
    setMergeState(prev => ({
      ...prev,
      isMerging: false,
      mergeError: error.message
    }));
    toast.error(`Merge failed: ${error.message}`);
  }
};
```

### Drag-and-Drop Reordering
```javascript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

const handleDragEnd = (event) => {
  const { active, over } = event;

  if (active.id !== over.id) {
    const oldIndex = documentsInMergeOrder.findIndex(d => d.documentGuid === active.id);
    const newIndex = documentsInMergeOrder.findIndex(d => d.documentGuid === over.id);

    const reorderedDocs = arrayMove(documentsInMergeOrder, oldIndex, newIndex);
    setMergeState(prev => ({ ...prev, documentsInMergeOrder: reorderedDocs }));
  }
};
```

### API Integration
```javascript
// Already implemented in epsDocumentApi.js
export const mergeDocuments = async (accountId, documentGuids, options = {}) => {
  const response = await fetch(
    `${EPS_BASE_URL}/api/v1/documents/merge`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': EPS_API_KEY
      },
      body: JSON.stringify({
        accountId,
        documentGuids,
        mergedDocumentName: options.mergedDocumentName,
        mergedDocumentType: options.mergedDocumentType,
        preserveOriginals: options.preserveOriginals !== false
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to merge documents');
  }

  return await response.json();
};
```

### Reference Implementations
- **Feature 59284** (Merge Feature Updates): Merge operation patterns
- Existing `mergeDocuments()` from epsDocumentApi.js
- Server-side PDF merge via EPS API

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides documents to merge
- **US005** (Document Selection): Multi-select functionality

### Related Stories
- **US002** (Document Viewer): Preview merged document

### Technical Dependencies
- `@dnd-kit/core` for drag-and-drop: `npm install @dnd-kit/core @dnd-kit/sortable`
- EPS API merge endpoint
- Server-side PDF merge library (PDFtk or similar on backend)

---

## Definition of Done

- [ ] Merge dialog component implemented
- [ ] Drag-and-drop reordering working
- [ ] PDF-only validation
- [ ] Server-side merge via EPS API
- [ ] Progress indicator functional
- [ ] Error handling with retry
- [ ] Merged document added to library automatically
- [ ] Unit tests for reorder logic
- [ ] Integration test for merge operation
- [ ] Code review approved
- [ ] QA tested merge scenarios
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path
1. User selects 3 PDF documents
2. "Merge Documents" button appears
3. User clicks merge button
4. Merge dialog opens with 3 documents listed
5. User drags second document to first position
6. Order updates (Doc2, Doc1, Doc3)
7. User enters "Combined_Mortgage_Docs" as name
8. User selects "Mortgage Application" as type
9. User clicks "Merge"
10. Progress shows: Preparing → Merging → Saving
11. Success notification appears
12. Merged document (81 pages total) appears in library
13. Original 3 documents still in library

### Error Scenarios
1. **API Merge Failure**: Show error with retry button
2. **Invalid PDF Structure**: Show specific error, suggest individual downloads
3. **Network Timeout**: Show timeout, offer to save merge request
4. **Server Overload**: Show queue position, estimated wait time
5. **Cancel Mid-Merge**: Cancel request, cleanup partial merge

### Edge Cases
1. **Very Large Merge (500+ pages)**: Progress shows accurately, completes successfully
2. **PDF Versions Mismatch**: Server normalizes PDF versions
3. **Password-Protected PDFs**: Show error, exclude from merge
4. **Corrupted PDF in Set**: Skip corrupted file, merge remaining files
5. **Duplicate Document in List**: Warn user, allow proceed

---

## Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Merge PDF Documents                                  [✕]    │
│                                                              │
│ Drag to reorder documents:                [Add More]        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ≡ 📄 1003_Mortgage_Application.pdf         [Remove]    │ │
│ │   8 pages | 2.1 MB                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ≡ 📄 Mortgage_Note_Final.pdf               [Remove]    │ │
│ │   4 pages | 856 KB                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ≡ 📄 Deed_of_Trust.pdf                     [Remove]    │ │
│ │   18 pages | 4.2 MB                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Total Pages: 30 | Total Size: 7.1 MB                       │
│                                                              │
│ Merged Document Name: *                                     │
│ [Combined_Mortgage_Documents_______________________]        │
│                                                              │
│ Document Type: *                                            │
│ [Dropdown: Mortgage Application ▼]                          │
│                                                              │
│ ℹ Original documents will be preserved                      │
│                                                              │
│                               [Cancel]  [Merge]             │
└─────────────────────────────────────────────────────────────┘

Merge Progress:
┌─────────────────────────────────────────────────────────────┐
│ Merging Documents...                                 [✕]    │
│                                                              │
│ ████████████████████████████░░░░  75%                       │
│                                                              │
│ ✓ Preparing documents...                                    │
│ ⏳ Merging PDFs...                                          │
│ ⏳ Saving merged document...                                │
│                                                              │
│ Estimated time remaining: 10 seconds                        │
│                                                              │
│                                        [Cancel Merge]       │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

```javascript
const validateMergeRequest = (documents, mergedName) => {
  const errors = [];

  // Minimum 2 documents
  if (documents.length < 2) {
    errors.push('At least 2 documents required for merge');
  }

  // All must be PDFs
  const nonPDFs = documents.filter(d => !d.fileName.endsWith('.pdf'));
  if (nonPDFs.length > 0) {
    errors.push(`${nonPDFs.length} non-PDF files cannot be merged`);
  }

  // Merged name required
  if (!mergedName || mergedName.trim() === '') {
    errors.push('Merged document name is required');
  }

  // Total page limit (configurable)
  const totalPages = documents.reduce((sum, d) => sum + d.pageCount, 0);
  if (totalPages > 1000) {
    errors.push('Merged document would exceed 1000 page limit');
  }

  // Total size limit (configurable)
  const totalSize = documents.reduce((sum, d) => sum + d.fileSize, 0);
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (totalSize > maxSize) {
    errors.push('Merged document would exceed 100MB size limit');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

---

## Performance Considerations

### Server-Side Merge
- Merge operation happens on server (EPS API)
- Client only sends array of document GUIDs
- Reduces client memory usage
- Enables background processing for large merges

### Progress Updates
- Use polling or WebSocket for progress updates
- Poll every 2 seconds during merge
- Estimate time based on page count and network speed

### Cancellation
- Support merge cancellation on server
- Cleanup partial merge artifacts
- Return user to merge dialog with selections intact

---

## Notes
- Consider split/extract pages feature (inverse of merge) in Phase 4
- Add preview of merged document before saving (future enhancement)
- Implement merge templates for common document combinations
- Track merge operations in audit log
