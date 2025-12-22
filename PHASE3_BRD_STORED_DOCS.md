# Phase 3 BRD: BoB Single Flow - Stored Documents Integration

**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - Epic #72742
**Status:** Product Backlog
**Owner:** Aza Olival
**Last Updated:** December 15, 2024

---

## Executive Summary

Phase 3 extends the BoB Single Flow MVP by integrating stored document access and management capabilities, allowing users to work with documents from the BytePro database via EPS Document Servicing API. This eliminates the need to switch between BoB and Docs Manager, providing a unified bundling experience.

### Business Value
- **Productivity Enhancement**: Users can access and manage loan documents without leaving the BoB interface
- **Reduced Context Switching**: Eliminates 5-90+ minute workflow disruptions when switching to Docs Manager
- **Enhanced Bundle Quality**: Direct document viewing enables better stacking order verification
- **Familiar UX**: Leverages proven patterns from CMG Docs application (Epic #6169)

---

## Reference Architecture

### Proven Implementations from CMG Docs Team

This Phase 3 BRD builds upon **successfully implemented features** from two proven epics:

#### Epic #6169: CMGDocs - Origination (MVP)
Core document management capabilities that have been battle-tested:

| Feature ID | Feature Name | Status | Relevance to Phase 3 |
|------------|-------------|--------|---------------------|
| 21512 | Doc Storage/Management | Dev In Progress | Document retrieval and storage patterns |
| 14098 | EPS Extensions for Docs | **Closed** ✓ | EPS API integration architecture |
| 9818 | Docs - Infrastructure / Architecture / Endpoints | Dev In Progress | API endpoint design patterns |
| 9819 | Docs - File Processing | Dev In Progress | Document upload/download handling |
| 51114 | Process Background Service Loan/Document Notifications | **Closed** ✓ | Real-time document status updates |
| 15969 | Email Processing | **Closed** ✓ | Document notification patterns |
| 5817 | Pipeline Docs | **Closed** ✓ | Document pipeline integration |
| 6755 | Docs - Business objects / logic | **Closed** ✓ | Business layer architecture |

#### Epic #42268: CLEAR Docs 2.0 Facelift Phase 2
Advanced UI/UX patterns for document operations:

| Feature ID | Feature Name | Status | Relevance to Phase 3 |
|------------|-------------|--------|---------------------|
| 55287 | CLEAR Docs Document Properties | **Closed** ✓ | Document metadata display and editing |
| 49754 | Add Documents and Drop Zone Screen | Dev In Progress | Drag-and-drop upload UX |
| 49753 | Draft/Final Documents | Dev In Progress | Document state management |
| 49755 | Document Needs Review | **Closed** ✓ | Document review workflow |
| 44246 | Review Documents | **Closed** ✓ | Document review interface |
| 55327 | Annotations | Dev In Progress | Document markup capabilities |
| 59284 | Merge Feature Updates | Dev In Progress | PDF merge operations |
| 42269 | Document Request | **Closed** ✓ | Document request workflows |
| 49748 | Email Processing and Notifications | **Closed** ✓ | Email notification system |
| 49752 | Standalone/Browser Version Revamp | **Closed** ✓ | Standalone UI architecture |

---

## Current State: MVP Capabilities

### What Exists Today (Phase 1)
The bob-single-flow MVP already includes foundational document integration:

**File:** `bob-single-flow/src/services/epsDocumentApi.js` (7,225 bytes)
- ✓ EPS Document Servicing API Client fully implemented
- ✓ 6 document operations available:
  1. `getDocumentsByLoan()` - Retrieve all documents for a loan
  2. `getDocumentById()` - Retrieve single document metadata
  3. `downloadDocument()` - Download document file
  4. `getBulkDocuments()` - Bulk document retrieval
  5. `uploadDocument()` - Upload new document
  6. `mergeDocuments()` - Merge multiple PDFs
- ✓ Configuration complete:
  - Base URL: `https://qa.servicing-api.cmgtest.com/docs`
  - API Key: `dd87e724615b4d6988c58fe5b771876a`
  - Test loans: TEST0000081920, TEST0000013271

**File:** `bob-single-flow/src/components/BoBSingleFlow.jsx` (107,956 bytes)
- ✓ Document state management hooks in place
- ✓ Document loading states (`isLoadingDocuments`)
- ✓ Document preview functionality (`previewDocument`, `viewingDocument`)
- ✓ Split pane document viewer (`docViewerSplitPosition`)
- ✓ Active document tracking (`activeDocument`)

### What Phase 3 Adds
Phase 3 builds on this foundation by adding **user-facing UI/UX** for document access and management.

---

## Phase 3: Feature Requirements

### 3.1 Document Library Panel

**User Story 1:** As a bundle creator, I want to see all documents available for the subject loan so I can select which documents to include in my bundle.

**Acceptance Criteria:**
- [ ] Document list panel displays all documents from `epsDocumentApi.getDocumentsByLoan()`
- [ ] Each document shows:
  - Document type/category (from BytePro `dbo.EmbeddedDoc` classification)
  - Document name
  - Upload date
  - File size
  - Page count
  - Status indicator (Draft/Final/Needs Review)
- [ ] Documents are grouped by category (similar to CLEAR Docs taxonomy)
- [ ] Search/filter capability by document type and name
- [ ] Sort options: Name, Date, Type, Size
- [ ] Loading state with skeleton UI while fetching documents
- [ ] Error state handling for API failures

**Technical Notes:**
- Leverage Feature 55287 (CLEAR Docs Document Properties) patterns for metadata display
- Use Feature 21512 (Doc Storage/Management) architecture for data retrieval
- Reference Feature 14098 (EPS Extensions) for EPS integration patterns

**API Integration:**
```javascript
// Already implemented in epsDocumentApi.js
const documents = await getDocumentsByLoan(accountId, {
  includeArchived: false,
  documentTypes: ['Mortgage', 'Title', 'Insurance', 'Appraisal']
});
```

---

### 3.2 Document Viewer with Preview

**User Story 2:** As a bundle creator, I want to preview documents before adding them to my bundle so I can verify I'm selecting the correct documents.

**Acceptance Criteria:**
- [ ] Click on document in library opens preview pane (split view or modal)
- [ ] PDF viewer supports:
  - Page navigation (next/previous, jump to page)
  - Zoom controls (fit width, fit page, custom %)
  - Page thumbnails sidebar
  - Full-screen mode
- [ ] Preview pane shows document properties:
  - Full document name
  - Upload date/time
  - Uploaded by (user)
  - Document classification
  - Page count
  - File size
- [ ] Close button returns to document library
- [ ] Keyboard shortcuts: ESC to close, arrow keys for page navigation

**Technical Notes:**
- Reuse existing `previewDocument` and `viewingDocument` state from MVP
- Leverage Feature 49752 (Standalone/Browser Version Revamp) for viewer architecture
- Implement responsive split-pane using existing `docViewerSplitPosition` state
- Use React PDF viewer library (already in use for bundle preview)

**Component Structure:**
```jsx
<DocumentLibraryPanel>
  <DocumentList documents={documents} onDocumentClick={handlePreview} />
  {viewingDocument && (
    <DocumentPreviewPane
      document={activeDocument}
      splitPosition={docViewerSplitPosition}
      onClose={handleClosePreview}
    />
  )}
</DocumentLibraryPanel>
```

---

### 3.3 Document Upload & Drop Zone

**User Story 3:** As a bundle creator, I want to upload missing documents directly from BoB so I don't have to switch to Docs Manager.

**Acceptance Criteria:**
- [ ] Drag-and-drop zone for file upload
- [ ] Click to browse file picker
- [ ] Support for PDF, TIFF, JPG, PNG file types
- [ ] File type validation before upload
- [ ] File size limit: 50MB per file (configurable)
- [ ] Upload progress indicator
- [ ] Multi-file upload support (batch upload)
- [ ] Document classification dropdown (select document type)
- [ ] Optional document name field (defaults to filename)
- [ ] Success/error toast notifications
- [ ] Newly uploaded documents automatically appear in library

**Technical Notes:**
- Implement Feature 49754 (Add Documents and Drop Zone Screen) patterns
- Use existing `uploadDocument()` API from epsDocumentApi.js
- Validate against BytePro `dbo.EmbeddedDoc` allowed document types
- Store uploaded files in BytePro `dbo.FileData` table via EPS API

**API Integration:**
```javascript
// Already implemented in epsDocumentApi.js
const uploadResult = await uploadDocument({
  accountId: loanNumber,
  fileName: file.name,
  fileData: base64EncodedFile,
  documentType: selectedDocType,
  documentCategory: 'LOS Docs'
});
```

---

### 3.4 Document Properties & Metadata

**User Story 4:** As a bundle creator, I want to view and edit document properties so I can ensure documents are correctly classified for bundling.

**Acceptance Criteria:**
- [ ] Document properties panel accessible from library (info icon/button)
- [ ] Display all metadata fields:
  - Document ID (GUID from BytePro)
  - Document Type
  - Document Category
  - Original File Name
  - Upload Date/Time
  - Uploaded By
  - Last Modified Date/Time
  - Modified By
  - File Size
  - Page Count
  - Status (Draft/Final/Needs Review)
  - Related Loan Number
  - BytePro Stack ID (if assigned to stack)
- [ ] Editable fields:
  - Document Name
  - Document Type (dropdown)
  - Document Category (dropdown)
  - Status (Draft/Final)
- [ ] Save button with validation
- [ ] Cancel button to discard changes
- [ ] Success/error notifications

**Technical Notes:**
- Implement Feature 55287 (CLEAR Docs Document Properties) UI patterns
- Use Feature 6755 (Business objects/logic) for validation rules
- Map to BytePro `dbo.EmbeddedDoc` table fields
- Update via EPS API PUT endpoint

---

### 3.5 Document Selection for Bundle

**User Story 5:** As a bundle creator, I want to select documents from the library and add them to my bundle's stacking order so I can create complete bundles.

**Acceptance Criteria:**
- [ ] Checkbox selection on each document in library
- [ ] Multi-select support (shift-click for range select)
- [ ] "Select All" / "Clear Selection" buttons
- [ ] Selected documents counter (e.g., "5 documents selected")
- [ ] "Add to Bundle" button (only enabled when documents selected)
- [ ] Confirmation dialog showing:
  - List of selected documents
  - Target position in stacking order (append or insert at position)
  - Estimated impact on bundle size/page count
- [ ] Documents added to stacking order in BoB display
- [ ] Integration with existing stacking order management
- [ ] Duplicate detection (warn if document already in bundle)

**Technical Notes:**
- Extend existing bundle state management from MVP
- Link selected documents to `dbo.DocumentStack` entries
- Maintain relationship between documents and stack positions
- Update bundle page count calculation
- Sync with existing investor-specific stacking order rules

**State Integration:**
```javascript
const handleAddToBundle = async (selectedDocs) => {
  // Validate against stacking order rules
  const validatedDocs = validateDocumentSelection(selectedDocs, currentStackingOrder);

  // Add to bundle state
  const updatedBundle = {
    ...currentBundle,
    documents: [...currentBundle.documents, ...validatedDocs]
  };

  // Update stacking order display
  refreshStackingOrder(updatedBundle);
};
```

---

### 3.6 Document Download

**User Story 6:** As a bundle creator, I want to download individual documents so I can review them locally or share them with stakeholders.

**Acceptance Criteria:**
- [ ] Download button on each document in library
- [ ] Download button in document preview pane
- [ ] Bulk download: select multiple documents and download as ZIP
- [ ] Downloaded files use original filename or user-defined name
- [ ] Download progress indicator for large files
- [ ] Browser's default download location or user-selectable folder
- [ ] Success notification with download summary
- [ ] Error handling for failed downloads

**Technical Notes:**
- Use existing `downloadDocument()` API from epsDocumentApi.js
- Implement client-side file download via blob URL
- For bulk download, use JSZip library to create ZIP archive
- Handle BytePro `dbo.FileData` retrieval via EPS API

**API Integration:**
```javascript
// Already implemented in epsDocumentApi.js
const fileBlob = await downloadDocument(documentGuid);
const url = URL.createObjectURL(fileBlob);
const link = document.createElement('a');
link.href = url;
link.download = document.fileName;
link.click();
URL.revokeObjectURL(url);
```

---

### 3.7 Document Merge Capability

**User Story 7:** As a bundle creator, I want to merge multiple documents into a single PDF so I can combine related documents before bundling.

**Acceptance Criteria:**
- [ ] Select 2+ PDF documents from library
- [ ] "Merge Documents" button appears when 2+ PDFs selected
- [ ] Merge dialog shows:
  - List of selected documents in merge order
  - Drag-and-drop to reorder documents
  - Remove button for each document
  - Preview of page count for merged document
  - Name field for merged document
- [ ] Merge progress indicator
- [ ] Merged document automatically added to library
- [ ] Original documents remain in library (non-destructive)
- [ ] Success notification with merged document details
- [ ] Error handling for merge failures

**Technical Notes:**
- Use existing `mergeDocuments()` API from epsDocumentApi.js
- Leverage Feature 59284 (Merge Feature Updates) patterns
- Process server-side via EPS API (don't merge in browser)
- Store merged document in BytePro with reference to source documents

**API Integration:**
```javascript
// Already implemented in epsDocumentApi.js
const mergeResult = await mergeDocuments(
  accountId,
  [doc1Guid, doc2Guid, doc3Guid],
  {
    mergedDocumentName: 'Combined_Mortgage_Docs',
    preserveOriginals: true
  }
);
```

---

### 3.8 Document Status Management

**User Story 8:** As a bundle creator, I want to mark documents as Draft or Final so I know which documents are ready for bundling.

**Acceptance Criteria:**
- [ ] Status indicator badge on each document:
  - Draft (yellow badge)
  - Final (green badge)
  - Needs Review (red badge)
- [ ] Status filter in document library (show only Draft, Final, etc.)
- [ ] Change status action:
  - Right-click context menu
  - Status dropdown in properties panel
- [ ] Confirmation dialog when marking as Final
- [ ] Audit trail: status changes logged with user and timestamp
- [ ] Warning when adding Draft documents to bundle
- [ ] Bundle validation: option to require all documents be Final

**Technical Notes:**
- Implement Feature 49753 (Draft/Final Documents) patterns
- Reference Feature 49755 (Document Needs Review) workflow
- Update BytePro `dbo.EmbeddedDoc` status field via EPS API
- Integrate with existing bundle validation rules

---

### 3.9 Document Search & Filter

**User Story 9:** As a bundle creator, I want to search and filter the document library so I can quickly find the documents I need.

**Acceptance Criteria:**
- [ ] Search bar at top of document library
- [ ] Search by:
  - Document name (partial match)
  - Document type
  - Upload date range
- [ ] Filter panel with:
  - Document Type (multi-select checkboxes)
  - Document Category (multi-select)
  - Status (Draft/Final/Needs Review)
  - Date Range (from/to date pickers)
  - Uploaded By (user dropdown)
- [ ] "Clear Filters" button
- [ ] Results count display (e.g., "Showing 12 of 156 documents")
- [ ] Filters persist during session
- [ ] No results state with helpful message

**Technical Notes:**
- Implement client-side filtering for performance
- Use `getDocumentsByLoan()` with filter parameters
- Debounce search input to reduce API calls
- Cache document list to avoid repeated fetches

---

### 3.10 Document Notifications & Real-Time Updates

**User Story 10:** As a bundle creator, I want to receive notifications when documents are uploaded or modified so I know when new documents are available.

**Acceptance Criteria:**
- [ ] Toast notifications for:
  - New document uploaded
  - Document status changed
  - Document properties updated
  - Document deleted/archived
- [ ] Auto-refresh document library on notification
- [ ] Visual badge/indicator for new documents since last view
- [ ] Notification center (bell icon) showing recent document activity
- [ ] Dismiss notifications individually or all at once
- [ ] Notification sound (optional, user-configurable)

**Technical Notes:**
- Implement Feature 51114 (Process Background Service Loan/Document Notifications) patterns
- Use SignalR or WebSocket for real-time updates
- Integrate with existing EPS notification infrastructure
- Poll EPS API as fallback if real-time not available

---

## Non-Functional Requirements

### Performance
- Document library load time: < 2 seconds for 100 documents
- Document preview load time: < 1 second for 50-page PDF
- Upload responsiveness: Progress visible within 100ms
- API timeout: 30 seconds (consistent with MVP)

### Security
- All document access via EPS API with authentication
- API Key rotation support
- No client-side document caching beyond session
- User permissions enforced at API level
- HTTPS-only communication

### Scalability
- Support up to 500 documents per loan
- Concurrent document operations (upload + preview)
- Optimistic UI updates with server reconciliation
- Pagination for large document libraries (50 documents per page)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all document operations
- Screen reader support for document list and viewer
- High contrast mode support
- Focus management for modals and panels

### Browser Compatibility
- Chrome 90+ (primary)
- Edge 90+
- Firefox 88+
- Safari 14+ (iOS and macOS)

---

## Technical Architecture

### Component Hierarchy
```
BoBSingleFlow
├── BundleControls (existing MVP)
├── StackingOrderDisplay (existing MVP)
├── DocumentLibraryPanel (NEW - Phase 3)
│   ├── DocumentSearch
│   ├── DocumentFilters
│   ├── DocumentList
│   │   └── DocumentCard
│   └── DocumentPreviewPane
│       ├── PDFViewer
│       └── DocumentProperties
├── DocumentUploadZone (NEW - Phase 3)
├── BundlePreview (existing MVP)
└── BundleGeneration (existing MVP)
```

### State Management
Extend existing React state with document-specific slices:

```javascript
const [documentState, setDocumentState] = useState({
  documents: [],              // Fetched from EPS API
  filteredDocuments: [],      // After search/filter
  selectedDocuments: [],      // User selection
  viewingDocument: null,      // Currently previewing
  isLoadingDocuments: false,  // Loading state
  documentError: null,        // Error state
  documentFilters: {          // Active filters
    types: [],
    status: [],
    dateRange: { from: null, to: null }
  }
});
```

### API Integration Points

All document operations use existing `epsDocumentApi.js`:

| Operation | API Method | EPS Endpoint |
|-----------|------------|--------------|
| Load document library | `getDocumentsByLoan()` | GET `/api/v1/documents?AccountId={id}` |
| Preview document | `getDocumentById()` | GET `/api/v1/documents/{id}` |
| Download document | `downloadDocument()` | GET `/api/v1/documents/{id}/download` |
| Upload document | `uploadDocument()` | POST `/api/v1/documents` |
| Merge documents | `mergeDocuments()` | POST `/api/v1/documents/merge` |
| Bulk operations | `getBulkDocuments()` | GET `/api/v1/documents/bulk` |

### Data Model Integration

**BytePro Database Tables:**
- `dbo.Bundle` - Bundle metadata (existing MVP integration)
- `dbo.DocumentStack` - Stacking order positions (existing MVP integration)
- `dbo.EmbeddedDoc` - Document metadata (Phase 3 NEW)
- `dbo.FileData` - Binary document storage (Phase 3 NEW)

**Document Metadata Schema:**
```typescript
interface Document {
  documentGuid: string;           // Primary key from BytePro
  accountId: string;              // Loan number
  documentName: string;
  documentType: string;           // Mortgage, Title, etc.
  documentCategory: string;       // LOS Docs, Post-Close, etc.
  fileName: string;               // Original file name
  fileSize: number;               // Bytes
  pageCount: number;
  status: 'Draft' | 'Final' | 'Needs Review';
  uploadDate: Date;
  uploadedBy: string;
  lastModifiedDate: Date;
  modifiedBy: string;
  stackId?: string;               // If assigned to bundle stack
}
```

---

## Implementation Phases

### Phase 3A: Document Library & Preview (Sprint 1-2)
**Priority: MUST HAVE**
- User Story 1: Document Library Panel
- User Story 2: Document Viewer with Preview
- User Story 9: Document Search & Filter

**Deliverable:** Users can view and search stored documents

### Phase 3B: Document Upload & Management (Sprint 3-4)
**Priority: MUST HAVE**
- User Story 3: Document Upload & Drop Zone
- User Story 4: Document Properties & Metadata
- User Story 6: Document Download

**Deliverable:** Users can upload, download, and manage documents

### Phase 3C: Bundle Integration (Sprint 5-6)
**Priority: MUST HAVE**
- User Story 5: Document Selection for Bundle
- User Story 8: Document Status Management

**Deliverable:** Users can add documents from library to bundles

### Phase 3D: Advanced Operations (Sprint 7-8)
**Priority: SHOULD HAVE**
- User Story 7: Document Merge Capability
- User Story 10: Document Notifications & Real-Time Updates

**Deliverable:** Advanced document operations and real-time updates

---

## Success Metrics

### Adoption Metrics
- % of bundles created using stored docs vs. manual upload: Target 60%+
- % of users adopting document preview feature: Target 80%+
- Time saved per bundle (compared to Docs Manager workflow): Target 15+ minutes

### Performance Metrics
- Document library load time: < 2 seconds
- Document preview load time: < 1 second
- Upload success rate: > 98%
- API error rate: < 1%

### User Satisfaction
- User satisfaction score (post-implementation survey): Target 4.5/5
- Support ticket reduction for document-related issues: Target 30%+
- User-reported time savings: Target 20+ minutes per bundle

---

## Dependencies

### Internal Dependencies
- **Phase 1 MVP Completion** (Feature 72743, 72744): Bundle Engine core functionality
- **Phase 2 Bulk Flow** (Feature 80103, 77474): Multi-loan bundling (parallel development)
- **BytePro Bundle API Integration** (Feature 90154): API layer readiness

### External Dependencies
- **EPS Document Servicing API**: Stable and available in QA/Prod
- **BytePro Database Access**: Read/write permissions to dbo.EmbeddedDoc and dbo.FileData
- **CMG Docs Team Alignment**: Shared API versioning and breaking change coordination

### Technical Dependencies
- React 19 (already in use)
- Vite 7 (already in use)
- Tailwind CSS 4 (already in use)
- PDF viewer library (React-PDF or PDF.js)
- JSZip (for bulk download)
- SignalR (for real-time notifications)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| EPS API performance issues with large document sets | Medium | High | Implement pagination, client-side caching, lazy loading |
| BytePro DB schema changes | Low | High | Maintain close coordination with CMG Docs team, versioned API contracts |
| User adoption lower than expected | Medium | Medium | Comprehensive training, in-app tooltips, gradual rollout with feedback loops |
| Document upload failures | Medium | High | Robust error handling, retry logic, clear error messages, upload queue with resume capability |
| Browser compatibility issues (PDF viewer) | Low | Medium | Test across all supported browsers, fallback to download if viewer fails |
| Real-time notifications infrastructure not available | Medium | Low | Implement polling as fallback, queue notifications for display on next page load |

---

## Testing Strategy

### Unit Testing
- All epsDocumentApi.js functions (already exists)
- Document state management hooks
- Filter/search logic
- Document selection logic

### Integration Testing
- EPS API integration in QA environment
- BytePro database read/write operations
- Bundle generation with stored documents
- Upload and download workflows

### UI Testing
- Document library rendering with various data sets
- PDF viewer across browsers
- Drag-and-drop upload
- Responsive layout on different screen sizes

### User Acceptance Testing
- Pilot group: 5-10 power users from Post-Close team
- Test scenarios:
  1. Create bundle using only stored documents
  2. Upload missing document and add to bundle
  3. Preview and verify document before bundling
  4. Merge multiple documents and bundle
  5. Change document status and filter library

---

## Rollout Plan

### Phase 1: Internal Testing (Week 1-2)
- Dev team dogfooding
- QA team functional testing
- Fix critical bugs

### Phase 2: Pilot Group (Week 3-4)
- 10 users from Post-Close team
- Feedback collection via in-app survey
- Daily standup with pilot users
- Iterate on UX based on feedback

### Phase 3: Gradual Rollout (Week 5-8)
- 25% of users (Week 5)
- 50% of users (Week 6)
- 75% of users (Week 7)
- 100% of users (Week 8)
- Monitor error rates and performance

### Phase 4: Full Production (Week 9+)
- All users migrated
- Docs Manager remains available as fallback
- Success metrics monitoring
- Ongoing optimization based on usage data

---

## Support & Training

### Documentation
- User guide with screenshots
- Video tutorials (3-5 minutes each):
  1. Viewing and previewing documents
  2. Uploading documents
  3. Adding documents to bundles
  4. Document search and filtering
- FAQ document addressing common questions

### Training Sessions
- 1-hour live training for all Post-Close team members
- Recorded session available for new hires
- Office hours: 30-minute weekly sessions for Q&A (first month)

### Support Channels
- Dedicated Slack channel: #bob-single-flow-support
- Email: bob-support@cmgfi.com
- In-app help button with context-sensitive help

---

## Future Enhancements (Phase 4+)

### Potential Features for Consideration
- **Document Annotations** (Feature 55327 pattern): Mark up documents with notes and highlights
- **Document Versioning**: Track document revisions over time
- **OCR Integration**: Extract text from scanned documents for search
- **Document Templates**: Pre-defined document sets for common bundle types
- **Collaborative Bundling**: Multiple users working on same bundle simultaneously
- **Document Compliance Checking**: Validate documents meet investor requirements
- **Automated Document Classification**: AI-powered document type detection
- **Document Comparison**: Side-by-side comparison of two document versions
- **Custom Document Fields**: User-defined metadata fields for organization-specific needs

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **BytePro** | Core database system storing mortgage loan data and documents |
| **EPS (Enterprise Proxy Service)** | API gateway routing layer for all API communications |
| **Document Stack** | Ordered list of documents in a bundle, following investor-specific stacking order rules |
| **Stacking Order** | Investor-defined sequence for arranging documents in a bundle |
| **LOS Docs** | Loan Origination System documents (vs. Post-Close or Servicing documents) |
| **Embedded Doc** | Document stored in BytePro database (dbo.EmbeddedDoc table) |
| **Document GUID** | Globally unique identifier for a document in BytePro |
| **Bundle** | Collection of documents packaged together for investor submission |
| **MVP** | Minimum Viable Product - Phase 1 of BoB Single Flow |

---

## Appendix B: API Endpoints Reference

### EPS Document Servicing API Base URL
**QA Environment:** `https://qa.servicing-api.cmgtest.com/docs`
**Production Environment:** `https://servicing-api.cmgfi.com/docs`

### Authentication
All requests require API Key in header:
```
X-API-Key: dd87e724615b4d6988c58fe5b771876a
```

### Available Endpoints

#### 1. Get Documents by Loan
```
GET /api/v1/documents?AccountId={accountId}
```
**Parameters:**
- `AccountId` (string, required): Loan number
- `includeArchived` (boolean, optional): Include archived documents (default: false)
- `documentTypes` (string[], optional): Filter by document types

**Response:**
```json
{
  "documents": [
    {
      "documentGuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "accountId": "12345678",
      "documentName": "1003_Final.pdf",
      "documentType": "Mortgage Application",
      "fileName": "1003_Final.pdf",
      "fileSize": 2048576,
      "pageCount": 8,
      "uploadDate": "2024-12-01T10:30:00Z",
      "uploadedBy": "jane.doe@cmgfi.com"
    }
  ]
}
```

#### 2. Get Single Document
```
GET /api/v1/documents/{documentGuid}
```

#### 3. Download Document
```
GET /api/v1/documents/{documentGuid}/download
```
Returns binary file stream.

#### 4. Upload Document
```
POST /api/v1/documents
```
**Body:**
```json
{
  "accountId": "12345678",
  "fileName": "Appraisal.pdf",
  "fileData": "<base64-encoded-file>",
  "documentType": "Appraisal",
  "documentCategory": "LOS Docs"
}
```

#### 5. Merge Documents
```
POST /api/v1/documents/merge
```
**Body:**
```json
{
  "accountId": "12345678",
  "documentGuids": ["guid1", "guid2", "guid3"],
  "mergedDocumentName": "Combined_Docs.pdf"
}
```

#### 6. Bulk Get Documents
```
GET /api/v1/documents/bulk?AccountId={accountId}&documentGuids={guid1,guid2}
```

---

## Appendix C: User Flow Diagrams

### Flow 1: View and Preview Stored Documents
```
User logs in to BoB Single Flow
   ↓
Enters loan number and selects investor
   ↓
Clicks "View Stored Documents" button
   ↓
Document Library Panel opens
   ↓
EPS API fetches documents from BytePro
   ↓
Documents displayed in categorized list
   ↓
User clicks on document to preview
   ↓
PDF Viewer opens in split pane
   ↓
User navigates pages, zooms, views properties
   ↓
User closes preview or selects another document
```

### Flow 2: Upload Missing Document
```
User opens Document Library Panel
   ↓
Clicks "Upload Document" button
   ↓
Upload Zone appears with drag-and-drop area
   ↓
User drags file from desktop or clicks to browse
   ↓
File validation (type, size)
   ↓
User selects document type from dropdown
   ↓
User clicks "Upload" button
   ↓
Progress indicator shows upload status
   ↓
EPS API stores document in BytePro
   ↓
Success notification displayed
   ↓
New document appears in library
```

### Flow 3: Add Documents to Bundle
```
User views document library
   ↓
Checks boxes next to desired documents
   ↓
"5 documents selected" counter updates
   ↓
User clicks "Add to Bundle" button
   ↓
Confirmation dialog shows selected docs
   ↓
User confirms insertion point in stacking order
   ↓
Documents added to bundle stack
   ↓
Stacking Order Display updates
   ↓
Bundle page count recalculated
   ↓
Success notification displayed
```

---

## Appendix D: Mockups & Wireframes

### Document Library Panel
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Stored Documents - Loan 12345678                         │
│ ┌─────────────────────────┐ [Upload] [Merge Selected]       │
│ │ 🔍 Search documents...  │                                  │
│ └─────────────────────────┘                                  │
│ ☑ Mortgage (12)  ☐ Title (3)  ☐ Insurance (5)  ☐ Appraisal │
│ ─────────────────────────────────────────────────────────── │
│ ☐ 📄 1003_Mortgage_Application.pdf        [Draft]  👁 ⬇    │
│    Uploaded: Dec 1, 2024 | 8 pages | 2.1 MB                │
│ ☐ 📄 Appraisal_Report_Final.pdf          [Final]  👁 ⬇    │
│    Uploaded: Dec 2, 2024 | 42 pages | 8.5 MB               │
│ ☐ 📄 Title_Insurance_Policy.pdf          [Final]  👁 ⬇    │
│    Uploaded: Dec 1, 2024 | 15 pages | 3.2 MB               │
│                                                              │
│ Showing 3 of 20 documents                [Add to Bundle]   │
└─────────────────────────────────────────────────────────────┘
```

### Document Preview Pane (Split View)
```
┌──────────────────────┬────────────────────────────────────┐
│ 📄 Document Library  │  Document Preview                  │
│                      │  ┌──────────────────────────────┐  │
│ [Back to Bundle]     │  │                              │  │
│                      │  │    [PDF Page Rendered Here]  │  │
│ Selected Doc:        │  │                              │  │
│ 1003 Mortgage App    │  │                              │  │
│                      │  │         Page 1 of 8          │  │
│ Properties:          │  │                              │  │
│ • Type: Mortgage     │  └──────────────────────────────┘  │
│ • Status: Draft      │  [◀] Page 1 of 8 [▶]  [🔍+] [🔍-] │
│ • Pages: 8           │  [Edit Properties] [Download] [✕]  │
│ • Size: 2.1 MB       │                                    │
│ • Uploaded: Dec 1    │                                    │
│                      │                                    │
└──────────────────────┴────────────────────────────────────┘
```

### Document Upload Zone
```
┌─────────────────────────────────────────────────────────────┐
│ Upload Document                                      [✕]    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │          📤 Drag and drop files here                   │ │
│ │                  or                                    │ │
│ │            [Browse Files]                              │ │
│ │                                                         │ │
│ │    Supported: PDF, TIFF, JPG, PNG (Max 50MB)          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Document Type: [Dropdown: Select type ▼]                   │
│ Document Name: [Optional custom name_______________]        │
│                                                             │
│                               [Cancel]  [Upload]            │
└─────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0
**Created By:** Aza Olival
**Review Date:** December 15, 2024
**Next Review:** January 15, 2025 (after Phase 3A completion)

---

*This BRD is a living document and will be updated as requirements evolve during implementation.*
