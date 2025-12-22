# User Story 2: Document Viewer with Preview

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 13
**Priority:** Must Have
**Sprint:** Phase 3A - Sprint 1-2

---

## User Story

**As a** bundle creator
**I want to** preview documents before adding them to my bundle
**So that** I can verify I'm selecting the correct documents

---

## Acceptance Criteria

### PDF Viewer Requirements
- [ ] Click on document in library opens preview pane (split view or modal)
- [ ] PDF viewer supports:
  - Page navigation (next/previous, jump to page)
  - Zoom controls (fit width, fit page, 50%, 75%, 100%, 150%, 200%)
  - Page thumbnails sidebar (collapsible)
  - Full-screen mode toggle
  - Print functionality
- [ ] Smooth page rendering without flicker
- [ ] Keyboard shortcuts work:
  - ESC: Close preview
  - Arrow keys: Navigate pages
  - +/- : Zoom in/out
  - F11: Full screen

### Document Properties Display
- [ ] Preview pane shows document properties panel:
  - Full document name
  - Upload date/time
  - Uploaded by (user)
  - Document classification/type
  - Page count
  - File size
  - Status badge (Draft/Final/Needs Review)
  - Document GUID (for troubleshooting)
- [ ] Properties panel is collapsible
- [ ] "Edit Properties" button (connects to US004)

### Interaction Requirements
- [ ] Close button returns to document library
- [ ] "Add to Bundle" quick action button in viewer
- [ ] Download button in viewer
- [ ] Share button (copy link to document)
- [ ] Split-pane resize handle (drag to adjust widths)

### Performance Requirements
- [ ] Document preview loads in < 1 second for 50-page PDF
- [ ] Page rendering is optimized (lazy load pages)
- [ ] No memory leaks on long viewing sessions

---

## Technical Notes

### Component Structure
```jsx
<DocumentPreviewPane
  document={activeDocument}
  splitPosition={docViewerSplitPosition}
  onClose={handleClosePreview}
  onAddToBundle={handleAddToBundle}
>
  <DocumentPropertiesPanel
    document={activeDocument}
    onEdit={handleEditProperties}
  />
  <PDFViewer
    documentUrl={documentUrl}
    currentPage={currentPage}
    zoom={zoomLevel}
    onPageChange={setCurrentPage}
    onZoomChange={setZoomLevel}
  />
  <ViewerControls />
</DocumentPreviewPane>
```

### State Management
```javascript
const [viewerState, setViewerState] = useState({
  viewingDocument: null,
  currentPage: 1,
  totalPages: 0,
  zoomLevel: 100,
  isFullScreen: false,
  showThumbnails: true,
  showProperties: true,
  docViewerSplitPosition: 60 // % width of viewer
});
```

### PDF Library Options
Recommended: **React-PDF** (already in use for bundle preview)
- Lightweight and performant
- Supports lazy loading
- Good TypeScript support
- MIT license

Alternative: **PDF.js** (Mozilla)
- More features but heavier
- Better for complex annotations (future Phase 4)

### API Integration
```javascript
// Use existing epsDocumentApi.js
const loadDocumentPreview = async (documentGuid) => {
  try {
    // Get document metadata
    const docMetadata = await getDocumentById(documentGuid);

    // Get document binary for preview
    const docBlob = await downloadDocument(documentGuid);
    const docUrl = URL.createObjectURL(docBlob);

    setViewerState(prev => ({
      ...prev,
      viewingDocument: docMetadata,
      documentUrl: docUrl,
      totalPages: docMetadata.pageCount
    }));
  } catch (error) {
    toast.error('Failed to load document preview');
  }
};
```

### Reference Implementations
- **Feature 49752** (Standalone/Browser Version Revamp): Viewer architecture
- **Feature 44246** (Review Documents): Document review interface
- **Feature 55287** (Document Properties): Metadata display

---

## Dependencies

### Blockers (Must Complete First)
- **US001** (Document Library Panel): Provides document list to preview from

### Related Stories
- **US004** (Document Properties): Edit properties from viewer
- **US005** (Document Selection): Add to bundle from viewer
- **US006** (Document Download): Download from viewer

### Technical Dependencies
- React-PDF library: `npm install react-pdf`
- PDF worker configuration for better performance

---

## Definition of Done

### Code Complete
- [ ] React component implemented with PDF viewer
- [ ] Keyboard shortcuts implemented and tested
- [ ] Memory management (cleanup blob URLs on unmount)
- [ ] Unit tests for viewer controls
- [ ] Integration test with sample PDF

### Design Complete
- [ ] UI matches Figma mockups for split view
- [ ] Responsive design (collapsible on mobile)
- [ ] Accessibility: keyboard navigation, screen reader support
- [ ] Print dialog styled correctly

### Documentation Complete
- [ ] Viewer controls documented
- [ ] Keyboard shortcuts listed in help
- [ ] Component API documented

### Review Complete
- [ ] Code review approved
- [ ] UX review approved
- [ ] Cross-browser testing passed (Chrome, Edge, Firefox, Safari)
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path
1. User clicks document in library
2. Split view opens with document preview
3. PDF renders first page
4. User navigates through pages smoothly
5. User zooms in/out without lag
6. User closes preview and returns to library

### Error Scenarios
1. **PDF Corrupted**: Display error with download option
2. **Large File (50MB+)**: Show loading progress bar
3. **Unsupported Format**: Fallback to download-only mode
4. **Browser PDF Support Missing**: Show download option

### Edge Cases
1. **Very Large PDF (500+ pages)**: Lazy load pages, smooth scrolling
2. **Portrait and Landscape Mixed**: Handle page rotation
3. **Password-Protected PDF**: Prompt for password (future enhancement)
4. **Non-PDF Files**: Show preview for images, fallback for others

---

## Design Mockup

```
┌──────────────────────┬────────────────────────────────────┐
│ 📄 Document Library  │  Document Preview                  │
│ [< Back]             │  ┌──────────────────────────────┐  │
│                      │  │ ▼ Properties                 │  │
│ Selected:            │  │ Name: 1003_Mortgage_App.pdf  │  │
│ 1003 Mortgage App    │  │ Type: Mortgage Application   │  │
│                      │  │ Status: 🟡 Draft              │  │
│ 📊 Properties:       │  │ Pages: 8 | Size: 2.1 MB      │  │
│ • Type: Mortgage     │  │ Uploaded: Dec 1, 2024        │  │
│ • Status: Draft      │  │ By: jane.doe@cmgfi.com       │  │
│ • Pages: 8           │  │ [Edit Properties]            │  │
│ • Size: 2.1 MB       │  └──────────────────────────────┘  │
│ • Uploaded: Dec 1    │                                    │
│                      │  ┌──────────────────────────────┐  │
│ Quick Actions:       │  │                              │  │
│ [Add to Bundle]      │  │  [PDF Page Rendered Here]    │  │
│ [Download]           │  │                              │  │
│ [Edit Props]         │  │      Page 1 of 8             │  │
│                      │  │                              │  │
│ 🖼 Thumbnails:        │  └──────────────────────────────┘  │
│ [▪][▫][▫][▫]         │                                    │
│ [▫][▫][▫][▫]         │  ┌────────────────────────────┐    │
│                      │  │ [◀] 1/8 [▶] [🔍-] 100% [🔍+]│    │
│                      │  │ [Fit Width] [Full Screen] │    │
│                      │  └────────────────────────────┘    │
└──────────────────────┴────────────────────────────────────┘
```

---

## Performance Optimization

### Lazy Loading Strategy
```javascript
// Load visible pages + 2 pages ahead/behind
const visiblePages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  .filter(page => page > 0 && page <= totalPages);

// Preload only visible pages
visiblePages.forEach(page => preloadPage(page));
```

### Memory Management
```javascript
useEffect(() => {
  // Cleanup blob URL on unmount
  return () => {
    if (documentUrl) {
      URL.revokeObjectURL(documentUrl);
    }
  };
}, [documentUrl]);
```

---

## Notes
- Consider implementing document annotations in Phase 4 (Feature 55327 pattern)
- Print functionality should respect page selection
- Full-screen mode should hide all UI except PDF and minimal controls
