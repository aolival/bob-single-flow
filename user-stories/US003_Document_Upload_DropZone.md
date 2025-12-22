# User Story 3: Document Upload & Drop Zone

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 8
**Priority:** Must Have
**Sprint:** Phase 3B - Sprint 3

---

## User Story

**As a** bundle creator
**I want to** upload missing documents directly from BoB
**So that** I don't have to switch to Docs Manager

---

## Acceptance Criteria

### Upload Interface
- [ ] "Upload Document" button in Document Library header
- [ ] Drag-and-drop zone appears when upload initiated
- [ ] Click to browse file picker alternative
- [ ] Support for PDF, TIFF, JPG, PNG file types
- [ ] Visual feedback on drag-over (border highlight)

### File Validation
- [ ] File type validation before upload
- [ ] File size limit: 50MB per file (configurable via env var)
- [ ] Display validation errors with clear messaging
- [ ] Prevent duplicate uploads (check filename hash)

### Upload Experience
- [ ] Upload progress indicator (percentage + progress bar)
- [ ] Multi-file upload support (batch upload up to 10 files)
- [ ] Cancel upload button while in progress
- [ ] Pause/Resume for large files (future enhancement)

### Document Classification
- [ ] Document type dropdown (required field)
  - Mortgage Application
  - Appraisal
  - Title Insurance
  - Homeowners Insurance
  - Purchase Agreement
  - Other (with text input)
- [ ] Document category auto-filled based on type
- [ ] Optional custom document name field (defaults to filename)

### Post-Upload
- [ ] Success toast notification with document name
- [ ] Error toast with retry button on failure
- [ ] Newly uploaded documents automatically appear in library
- [ ] Auto-refresh library view
- [ ] Option to immediately preview uploaded document

---

## Technical Notes

### Component Structure
```jsx
<DocumentUploadZone
  isOpen={showUploadZone}
  onClose={handleCloseUpload}
  onUploadComplete={handleUploadComplete}
>
  <DropZone
    accept=".pdf,.tiff,.tif,.jpg,.jpeg,.png"
    maxSize={50 * 1024 * 1024} // 50MB
    onDrop={handleFilesDrop}
    onDragOver={handleDragOver}
  />
  <FileList files={selectedFiles} onRemove={handleRemoveFile} />
  <DocumentClassificationForm
    onTypeChange={setDocumentType}
    onNameChange={setDocumentName}
  />
  <UploadProgress progress={uploadProgress} />
  <UploadActions
    onCancel={handleCancelUpload}
    onUpload={handleUpload}
    disabled={!selectedFiles.length || !documentType}
  />
</DocumentUploadZone>
```

### File Validation Logic
```javascript
const validateFile = (file) => {
  // Type validation
  const allowedTypes = ['application/pdf', 'image/tiff', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  // Size validation
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  return { valid: true };
};
```

### Upload Implementation
```javascript
const handleUpload = async (files, documentType, documentName) => {
  for (const file of files) {
    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      // Convert file to base64
      const base64File = await fileToBase64(file);

      // Upload via EPS API
      const result = await uploadDocument({
        accountId: currentLoanNumber,
        fileName: documentName || file.name,
        fileData: base64File,
        documentType: documentType,
        documentCategory: 'LOS Docs'
      });

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      toast.success(`${file.name} uploaded successfully`);

      // Refresh document library
      await refreshDocumentLibrary();

    } catch (error) {
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    }
  }
};
```

### Reference Implementations
- **Feature 49754** (Add Documents and Drop Zone Screen): Drag-and-drop UX patterns
- **Feature 9819** (Docs - File Processing): File processing architecture
- **Feature 21512** (Doc Storage/Management): Storage patterns

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides refresh mechanism

### Related Stories
- **US004** (Document Properties): Set properties during upload

### Technical Dependencies
- `react-dropzone` library for drag-and-drop
- File-to-base64 utility function
- Existing `uploadDocument()` from epsDocumentApi.js

---

## Definition of Done

- [ ] Upload component implemented with drag-and-drop
- [ ] File validation with user-friendly error messages
- [ ] Progress indicator for upload status
- [ ] Multi-file upload tested
- [ ] Unit tests for validation logic
- [ ] Integration test with mock file upload
- [ ] Error handling for all failure scenarios
- [ ] Code review approved
- [ ] QA tested with various file types and sizes
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path
1. User clicks "Upload Document" button
2. Upload zone opens with drag-and-drop area
3. User drags PDF file onto zone
4. File validation passes
5. User selects "Mortgage Application" from dropdown
6. User clicks "Upload" button
7. Progress bar shows 0% → 100%
8. Success notification appears
9. Document appears in library

### Error Scenarios
1. **Invalid File Type (.exe)**: Show validation error immediately
2. **File Too Large (60MB)**: Show size limit error
3. **Network Failure Mid-Upload**: Show retry button
4. **Missing Document Type**: Disable upload button
5. **Duplicate Filename**: Warn user and offer rename

### Edge Cases
1. **10 Files at Once**: Batch upload with individual progress bars
2. **Special Characters in Filename**: Sanitize and upload successfully
3. **Browser Crashes During Upload**: Auto-resume on next session (future)
4. **Slow Network**: Show estimated time remaining

---

## Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Upload Documents                                     [✕]    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │          📤 Drag and drop files here                   │ │
│ │              or click to browse                        │ │
│ │                                                         │ │
│ │    Supported: PDF, TIFF, JPG, PNG (Max 50MB)          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Selected Files:                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 📄 1003_Application.pdf  (2.1 MB)            [Remove] │  │
│ │ 📄 Appraisal_Report.pdf  (8.5 MB)            [Remove] │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ Document Type: [Dropdown: Mortgage Application ▼] *        │
│ Document Name: [Optional custom name_______________]        │
│                                                             │
│ Upload Progress:                                            │
│ 1003_Application.pdf  [████████████████████] 100%         │
│ Appraisal_Report.pdf  [█████████░░░░░░░░░░░] 45%          │
│                                                             │
│                               [Cancel]  [Upload]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Notes
- Implement chunked upload for files > 10MB (future enhancement)
- Consider virus scanning integration before storage (security requirement)
- Log all uploads to audit trail in BytePro
