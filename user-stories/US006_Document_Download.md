# User Story 6: Document Download

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 5
**Priority:** Must Have
**Sprint:** Phase 3B - Sprint 4

---

## User Story

**As a** bundle creator
**I want to** download individual documents or multiple documents
**So that** I can review them locally or share them with stakeholders

---

## Acceptance Criteria

### Single Document Download
- [ ] Download icon/button on each document card
- [ ] Download button in document preview pane
- [ ] Right-click context menu → "Download"
- [ ] Clicking download initiates file download
- [ ] Downloaded file uses original filename or document name
- [ ] Downloaded file preserves original format (PDF, TIFF, etc.)

### Bulk Download
- [ ] Select multiple documents (2+) enables bulk download
- [ ] "Download Selected" button in floating action bar
- [ ] Bulk download creates ZIP archive
- [ ] ZIP filename format: `Documents_{LoanNumber}_{Timestamp}.zip`
- [ ] ZIP contains all selected documents with proper filenames
- [ ] ZIP preserves folder structure if categorized

### Download Experience
- [ ] Progress indicator for downloads > 5MB
- [ ] Cancel button during download
- [ ] Browser's default download location used (or user-selectable)
- [ ] Success notification with filename and location
- [ ] Error notification for failed downloads with retry button
- [ ] Downloads tracked in browser download manager

### Download Options Dialog (optional)
- [ ] Format selection: Original / Convert to PDF
- [ ] Quality selection for image conversions: High / Medium / Low
- [ ] Rename file before download (text input)
- [ ] Add to download queue for large files

---

## Technical Notes

### Component Structure
```jsx
<DocumentDownloadButton
  document={document}
  onDownloadStart={handleDownloadStart}
  onDownloadComplete={handleDownloadComplete}
  onDownloadError={handleDownloadError}
/>

<BulkDownloadButton
  selectedDocuments={selectedDocuments}
  onDownloadStart={handleBulkDownloadStart}
  disabled={selectedDocuments.length === 0}
/>
```

### Single Download Implementation
```javascript
const handleDownloadDocument = async (documentGuid, fileName) => {
  try {
    // Show progress for large files
    setDownloadProgress({ [documentGuid]: 0 });

    // Download via EPS API (already implemented)
    const fileBlob = await downloadDocument(documentGuid);

    // Create download link
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    setDownloadProgress({ [documentGuid]: 100 });
    toast.success(`Downloaded: ${fileName}`);
  } catch (error) {
    toast.error(`Download failed: ${error.message}`);
  }
};
```

### Bulk Download with ZIP
```javascript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const handleBulkDownload = async (selectedDocs) => {
  try {
    const zip = new JSZip();
    let completedCount = 0;

    // Show progress
    toast.info(`Preparing ${selectedDocs.length} documents...`);

    // Download each document and add to ZIP
    for (const doc of selectedDocs) {
      const fileBlob = await downloadDocument(doc.documentGuid);

      // Add to ZIP with categorized folder structure
      const folderPath = doc.documentCategory || 'Uncategorized';
      zip.file(`${folderPath}/${doc.fileName}`, fileBlob);

      completedCount++;
      setDownloadProgress({
        current: completedCount,
        total: selectedDocs.length
      });
    }

    // Generate ZIP
    toast.info('Creating ZIP archive...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Save ZIP
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const zipFileName = `Documents_${currentLoanNumber}_${timestamp}.zip`;
    saveAs(zipBlob, zipFileName);

    toast.success(`Downloaded ${selectedDocs.length} documents as ${zipFileName}`);
  } catch (error) {
    toast.error(`Bulk download failed: ${error.message}`);
  }
};
```

### Progress Tracking
```javascript
const [downloadState, setDownloadState] = useState({
  activeDownloads: new Map(), // documentGuid -> progress%
  downloadHistory: []
});

const trackDownload = (documentGuid, progress) => {
  setDownloadState(prev => ({
    ...prev,
    activeDownloads: new Map(prev.activeDownloads).set(documentGuid, progress)
  }));
};
```

### Reference Implementations
- Existing `downloadDocument()` from epsDocumentApi.js
- Browser File API for downloads
- JSZip library for bulk downloads

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides documents to download

### Related Stories
- **US005** (Document Selection): Multi-select for bulk download

### Technical Dependencies
- `jszip` library: `npm install jszip`
- `file-saver` library: `npm install file-saver`
- Existing epsDocumentApi.js with `downloadDocument()`

---

## Definition of Done

- [ ] Single download button implemented
- [ ] Bulk download with ZIP creation
- [ ] Progress indicator for large files
- [ ] Cancel functionality working
- [ ] Error handling with retry
- [ ] Unit tests for download logic
- [ ] Integration test with mock blob data
- [ ] Cross-browser testing (Chrome, Edge, Firefox, Safari)
- [ ] Code review approved
- [ ] QA tested download scenarios
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path - Single Download
1. User clicks download icon on document
2. Browser shows download progress
3. File downloads to Downloads folder
4. Success notification appears
5. File opens correctly in PDF viewer

### Happy Path - Bulk Download
1. User selects 5 documents
2. User clicks "Download Selected"
3. Progress shows "Preparing 5 documents..."
4. ZIP creation progress visible
5. ZIP file downloads
6. ZIP contains all 5 documents in correct folders
7. Success notification appears

### Error Scenarios
1. **Network Failure**: Show retry button
2. **Corrupted File**: Download completes but file won't open, show error
3. **Disk Full**: Browser shows disk space error
4. **Large File Timeout**: Show timeout, offer resume (future)
5. **Browser Blocks Download**: Show instruction to allow download

### Edge Cases
1. **Very Large File (100MB+)**: Progress bar shows accurately
2. **500 Documents Bulk**: ZIP creation succeeds, ~1GB file
3. **Special Characters in Filename**: Sanitize for filesystem compatibility
4. **Same Filename Multiple Times**: Auto-append number: file(1).pdf, file(2).pdf
5. **Download During Page Reload**: Queue downloads persist (future)

---

## Design Mockup

```
Single Download:
┌──────────────────────────────────────────────────────────┐
│ ☐ 📄 1003_Mortgage_Application.pdf    [Draft]  👁 [⬇]  │
│    Dec 1, 2024 | 8 pages | 2.1 MB                       │
└──────────────────────────────────────────────────────────┘

Bulk Download Progress:
┌─────────────────────────────────────────────────────────────┐
│ Downloading 5 Documents                               [✕]  │
│                                                              │
│ Preparing documents...                                      │
│ ████████████████████░░░░░░░░  3 of 5 complete              │
│                                                              │
│ ✓ 1003_Mortgage_Application.pdf                            │
│ ✓ Appraisal_Report.pdf                                     │
│ ⏳ Title_Insurance_Policy.pdf  (downloading...)            │
│ ⏳ Homeowners_Insurance.pdf                                 │
│ ⏳ Purchase_Agreement.pdf                                   │
│                                                              │
│ Creating ZIP archive...                                     │
│                                        [Cancel]              │
└─────────────────────────────────────────────────────────────┘

Download Complete Notification:
┌─────────────────────────────────────────────────────────────┐
│ ✓ Success                                            [✕]    │
│ Downloaded 5 documents as Documents_12345678_2024-12-15.zip│
│ Location: C:\Users\aolival\Downloads                       │
│                                        [Open Folder]        │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

### Optimization Strategies
1. **Parallel Downloads**: Download multiple files concurrently (max 3-5)
2. **Chunked Reading**: For very large files, read in chunks to avoid memory issues
3. **Lazy ZIP Generation**: Stream files into ZIP rather than loading all in memory
4. **Download Queue**: For bulk downloads > 20 files, queue and process in batches

### Memory Management
```javascript
// Cleanup blob URLs immediately after download starts
const handleDownload = async (doc) => {
  const blob = await downloadDocument(doc.documentGuid);
  const url = URL.createObjectURL(blob);

  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.fileName;
  link.click();

  // Cleanup immediately
  setTimeout(() => {
    URL.revokeObjectURL(url);
    link.remove();
  }, 100);
};
```

---

## Browser Compatibility

### Download Behavior by Browser
- **Chrome**: Native download UI with progress
- **Edge**: Similar to Chrome
- **Firefox**: Shows download arrow in toolbar
- **Safari**: Downloads to Downloads folder automatically

### Safari Specific Issues
- May require user gesture (click) to initiate download
- Blob URLs have shorter expiration time
- Test extensively on Safari 14+

---

## Notes
- Consider adding "Download All" button for entire loan (future)
- Implement download history/log for audit purposes
- Add option to email documents instead of download (Phase 4)
- Consider integration with OneDrive/SharePoint for team sharing (future)
