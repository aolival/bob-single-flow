# User Story 1: Document Library Panel

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 8
**Priority:** Must Have
**Sprint:** Phase 3A - Sprint 1

---

## User Story

**As a** bundle creator
**I want to** see all documents available for the subject loan
**So that** I can select which documents to include in my bundle

---

## Acceptance Criteria

### Display Requirements
- [ ] Document list panel displays all documents from `epsDocumentApi.getDocumentsByLoan()`
- [ ] Each document shows:
  - Document type/category (from BytePro `dbo.EmbeddedDoc` classification)
  - Document name
  - Upload date
  - File size
  - Page count
  - Status indicator (Draft/Final/Needs Review)
- [ ] Documents are grouped by category (similar to CLEAR Docs taxonomy)

### Interaction Requirements
- [ ] Search/filter capability by document type and name
- [ ] Sort options: Name, Date, Type, Size
- [ ] Click on document triggers preview (connects to US002)
- [ ] Checkbox selection for multi-select (connects to US005)

### Loading & Error States
- [ ] Loading state with skeleton UI while fetching documents
- [ ] Error state handling for API failures with retry button
- [ ] Empty state message when no documents found
- [ ] Display document count (e.g., "Showing 20 documents")

### Performance Requirements
- [ ] Document library loads in < 2 seconds for 100 documents
- [ ] Smooth scrolling with virtual scrolling for 500+ documents
- [ ] No UI blocking during document fetch

---

## Technical Notes

### Component Structure
```jsx
<DocumentLibraryPanel>
  <DocumentLibraryHeader />
  <DocumentSearch />
  <DocumentFilters />
  <DocumentList
    documents={documents}
    onDocumentClick={handlePreview}
    onDocumentSelect={handleSelect}
  />
  {isLoadingDocuments && <LoadingSkeleton />}
  {documentError && <ErrorState onRetry={handleRetry} />}
</DocumentLibraryPanel>
```

### State Management
```javascript
const [documentState, setDocumentState] = useState({
  documents: [],
  filteredDocuments: [],
  isLoadingDocuments: false,
  documentError: null,
  sortBy: 'uploadDate',
  sortOrder: 'desc'
});
```

### API Integration
```javascript
// Use existing epsDocumentApi.js
const fetchDocuments = async (accountId) => {
  setDocumentState(prev => ({ ...prev, isLoadingDocuments: true }));

  try {
    const documents = await getDocumentsByLoan(accountId, {
      includeArchived: false,
      documentTypes: ['Mortgage', 'Title', 'Insurance', 'Appraisal']
    });

    setDocumentState(prev => ({
      ...prev,
      documents,
      filteredDocuments: documents,
      isLoadingDocuments: false
    }));
  } catch (error) {
    setDocumentState(prev => ({
      ...prev,
      documentError: error.message,
      isLoadingDocuments: false
    }));
  }
};
```

### Reference Implementations
- **Feature 21512** (Doc Storage/Management): Document retrieval patterns
- **Feature 14098** (EPS Extensions): EPS integration architecture
- **Feature 55287** (CLEAR Docs Document Properties): Metadata display patterns

---

## Dependencies

### Blockers (Must Complete First)
- ✓ Phase 1 MVP completed (Feature 72743, 72744)
- ✓ epsDocumentApi.js implemented with `getDocumentsByLoan()`
- ✓ EPS Document Servicing API accessible in QA environment

### Related Stories
- **US002** (Document Viewer): Preview triggered from library
- **US005** (Document Selection): Multi-select functionality
- **US009** (Search & Filter): Advanced filtering capabilities

---

## Definition of Done

### Code Complete
- [ ] React component implemented with TypeScript types
- [ ] Unit tests written with >80% coverage
- [ ] Integration test with mock API data
- [ ] Storybook story created for component

### Design Complete
- [ ] UI matches Figma mockups
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Dark mode styling applied

### Documentation Complete
- [ ] Component props documented with JSDoc
- [ ] README updated with usage examples
- [ ] User guide section written

### Review Complete
- [ ] Code review approved by 2 developers
- [ ] UX review approved by design team
- [ ] QA testing passed with zero critical bugs
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path
1. User enters loan number and clicks "View Stored Documents"
2. API returns 20 documents successfully
3. Documents display in categorized list
4. User can scroll through all documents
5. Document count shows "Showing 20 documents"

### Error Scenarios
1. **API Timeout**: Display error with retry button
2. **No Documents Found**: Show empty state message
3. **Network Failure**: Show offline indicator and cache status
4. **Invalid Loan Number**: Display validation error

### Edge Cases
1. **500+ Documents**: Virtual scrolling maintains performance
2. **Very Long Document Names**: Text truncation with tooltip
3. **Missing Metadata**: Gracefully handle null/undefined fields
4. **Concurrent API Calls**: Debounce and cancel previous requests

---

## Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Stored Documents - Loan 12345678          [Upload] [×]   │
│ ┌─────────────────────────┐ Sort by: [Date ▼]              │
│ │ 🔍 Search documents...  │                                  │
│ └─────────────────────────┘                                  │
│                                                              │
│ ▼ Mortgage Documents (12)                                   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ☐ 📄 1003_Mortgage_Application.pdf    [Draft]  👁 ⬇  │   │
│ │    Dec 1, 2024 | 8 pages | 2.1 MB                    │   │
│ └──────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ☐ 📄 Mortgage_Note_Final.pdf          [Final]  👁 ⬇  │   │
│ │    Dec 2, 2024 | 4 pages | 856 KB                    │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ▼ Title Documents (3)                                       │
│ ▼ Insurance Documents (5)                                   │
│                                                              │
│ Showing 20 of 20 documents              [Add to Bundle]    │
└─────────────────────────────────────────────────────────────┘
```

---

## Notes
- Implement pagination if document count exceeds 500
- Cache document list for 5 minutes to reduce API calls
- Consider implementing WebSocket connection for real-time updates (Phase 3D)
