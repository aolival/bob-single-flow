# User Story 4: Document Properties & Metadata

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 5
**Priority:** Must Have
**Sprint:** Phase 3B - Sprint 3-4

---

## User Story

**As a** bundle creator
**I want to** view and edit document properties
**So that** I can ensure documents are correctly classified for bundling

---

## Acceptance Criteria

### View Properties
- [ ] Properties panel accessible from:
  - Info icon/button on document card in library
  - Properties tab in document preview pane
  - Right-click context menu → "Properties"
- [ ] Display all metadata fields (read-only):
  - Document ID (GUID from BytePro)
  - Document Type
  - Document Category
  - Original File Name
  - Upload Date/Time
  - Uploaded By (user email)
  - Last Modified Date/Time
  - Modified By (user email)
  - File Size (formatted: KB, MB)
  - Page Count
  - Status (Draft/Final/Needs Review)
  - Related Loan Number
  - BytePro Stack ID (if assigned to stack)
  - File Path (server location)

### Edit Properties
- [ ] Editable fields have pencil icon or inline edit
- [ ] Editable fields:
  - Document Name (text input with validation)
  - Document Type (dropdown from taxonomy)
  - Document Category (dropdown, auto-populated by type)
  - Status (dropdown: Draft/Final/Needs Review)
  - Description (optional, textarea)
- [ ] Field validation:
  - Document Name: Required, max 255 characters
  - Document Type: Required, must match taxonomy
  - Description: Optional, max 1000 characters

### Save & Cancel
- [ ] Save button enabled only when changes made
- [ ] Save validates all fields before submission
- [ ] Success notification on save
- [ ] Error notification with specific field errors
- [ ] Cancel button reverts all unsaved changes
- [ ] Dirty state warning if closing without saving
- [ ] Auto-save draft every 30 seconds (future)

### Audit Trail
- [ ] "View History" link shows audit log
- [ ] Audit log displays:
  - Timestamp of change
  - User who made change
  - Field changed
  - Old value → New value
- [ ] Audit log is read-only
- [ ] Audit log paginated (10 entries per page)

---

## Technical Notes

### Component Structure
```jsx
<DocumentPropertiesPanel
  document={activeDocument}
  isEditing={isEditingProperties}
  onEdit={handleEnableEdit}
  onSave={handleSaveProperties}
  onCancel={handleCancelEdit}
>
  <PropertiesDisplay
    document={activeDocument}
    editableFields={['documentName', 'documentType', 'status', 'description']}
  />

  {isEditingProperties && (
    <PropertyEditForm
      initialValues={activeDocument}
      onSubmit={handleSaveProperties}
      onCancel={handleCancelEdit}
    />
  )}

  <AuditTrail documentGuid={activeDocument.documentGuid} />
</DocumentPropertiesPanel>
```

### Edit State Management
```javascript
const [propertyState, setPropertyState] = useState({
  isEditingProperties: false,
  editedDocument: null,
  hasUnsavedChanges: false,
  validationErrors: {}
});

const handleSaveProperties = async (updatedProperties) => {
  try {
    // Validate
    const errors = validateProperties(updatedProperties);
    if (Object.keys(errors).length > 0) {
      setPropertyState(prev => ({ ...prev, validationErrors: errors }));
      return;
    }

    // Save via API
    await updateDocumentProperties(activeDocument.documentGuid, updatedProperties);

    // Update local state
    refreshDocumentInLibrary(activeDocument.documentGuid);

    toast.success('Document properties updated successfully');
    setPropertyState({
      isEditingProperties: false,
      editedDocument: null,
      hasUnsavedChanges: false,
      validationErrors: {}
    });
  } catch (error) {
    toast.error(`Failed to save properties: ${error.message}`);
  }
};
```

### API Integration
```javascript
// Add to epsDocumentApi.js
export const updateDocumentProperties = async (documentGuid, properties) => {
  const response = await fetch(
    `${EPS_BASE_URL}/api/v1/documents/${documentGuid}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': EPS_API_KEY
      },
      body: JSON.stringify({
        documentName: properties.documentName,
        documentType: properties.documentType,
        documentCategory: properties.documentCategory,
        status: properties.status,
        description: properties.description
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update document properties');
  }

  return await response.json();
};

export const getDocumentAuditLog = async (documentGuid) => {
  const response = await fetch(
    `${EPS_BASE_URL}/api/v1/documents/${documentGuid}/audit`,
    {
      headers: { 'X-API-Key': EPS_API_KEY }
    }
  );

  return await response.json();
};
```

### Reference Implementations
- **Feature 55287** (CLEAR Docs Document Properties): UI patterns and metadata display
- **Feature 6755** (Business objects/logic): Validation rules
- **BytePro dbo.EmbeddedDoc** table structure

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides document list
- **US002** (Document Viewer): Properties accessible from viewer

### Related Stories
- **US003** (Document Upload): Set properties during upload

### Technical Dependencies
- EPS API PUT endpoint for document updates
- BytePro audit logging (dbo.AuditLog table)

---

## Definition of Done

- [ ] Properties panel component implemented
- [ ] All read-only fields displayed correctly
- [ ] Edit mode with validation
- [ ] Save/Cancel functionality working
- [ ] Audit trail display implemented
- [ ] Unit tests for validation logic
- [ ] Integration test for save operation
- [ ] Error handling for API failures
- [ ] Code review approved
- [ ] QA tested all edit scenarios
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path
1. User clicks info icon on document
2. Properties panel opens
3. User clicks "Edit" button
4. Edit mode enables with form fields
5. User changes document name
6. User changes status to "Final"
7. User clicks "Save"
8. Validation passes
9. API updates document
10. Success notification appears
11. Properties panel shows updated values

### Error Scenarios
1. **Empty Document Name**: Show "Document name is required"
2. **Invalid Characters**: Show "Special characters not allowed"
3. **API Failure**: Show retry button, rollback changes
4. **Network Timeout**: Show timeout message, save draft locally
5. **Concurrent Edit**: Detect conflict, show merge dialog

### Edge Cases
1. **Very Long Name (300 chars)**: Truncate to 255, show warning
2. **Unsaved Changes + Close**: Show confirmation dialog
3. **Rapid Successive Saves**: Debounce save calls
4. **Read-Only Document**: Disable edit button, show tooltip

---

## Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Document Properties                                  [✕]    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 1003_Mortgage_Application.pdf                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ▼ General Information                          [Edit] [ℹ]  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Document ID:  a1b2c3d4-e5f6-7890-abcd-ef1234567890     │ │
│ │ Document Name: 1003_Mortgage_Application.pdf           │ │
│ │ Document Type: Mortgage Application                    │ │
│ │ Category:      LOS Docs                                │ │
│ │ Status:        🟡 Draft                                 │ │
│ │ Description:   Final version of 1003 form for...       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ▼ File Details                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ File Size:     2.1 MB                                   │ │
│ │ Page Count:    8 pages                                  │ │
│ │ File Type:     PDF                                      │ │
│ │ Original Name: 1003_v2_final.pdf                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ▼ Metadata                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Uploaded:      Dec 1, 2024 at 10:30 AM                 │ │
│ │ Uploaded By:   jane.doe@cmgfi.com                       │ │
│ │ Last Modified: Dec 2, 2024 at 2:15 PM                  │ │
│ │ Modified By:   john.smith@cmgfi.com                     │ │
│ │ Loan Number:   12345678                                 │ │
│ │ Stack ID:      Not assigned                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [View Audit History]                                        │
│                                                              │
│                                      [Close]                │
└─────────────────────────────────────────────────────────────┘

Edit Mode:
┌─────────────────────────────────────────────────────────────┐
│ Edit Document Properties                             [✕]    │
│                                                              │
│ Document Name: *                                            │
│ [1003_Mortgage_Application.pdf__________________]          │
│                                                              │
│ Document Type: *                                            │
│ [Dropdown: Mortgage Application ▼]                          │
│                                                              │
│ Status: *                                                   │
│ [Dropdown: Draft ▼] → Final, Needs Review                  │
│                                                              │
│ Description:                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Final version of 1003 form for loan 12345678...        │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ 0 / 1000 characters                                         │
│                                                              │
│ * Required fields                                           │
│                                                              │
│                               [Cancel]  [Save Changes]      │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

```javascript
const validateProperties = (properties) => {
  const errors = {};

  // Document Name
  if (!properties.documentName || properties.documentName.trim() === '') {
    errors.documentName = 'Document name is required';
  } else if (properties.documentName.length > 255) {
    errors.documentName = 'Document name must be 255 characters or less';
  } else if (!/^[a-zA-Z0-9_\-\s.()]+$/.test(properties.documentName)) {
    errors.documentName = 'Document name contains invalid characters';
  }

  // Document Type
  const validTypes = [
    'Mortgage Application',
    'Appraisal',
    'Title Insurance',
    'Homeowners Insurance',
    'Purchase Agreement',
    'Other'
  ];
  if (!validTypes.includes(properties.documentType)) {
    errors.documentType = 'Invalid document type';
  }

  // Description (optional)
  if (properties.description && properties.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less';
  }

  return errors;
};
```

---

## Notes
- Consider adding bulk edit for multiple documents (future enhancement)
- Implement document property templates for common scenarios
- Add custom fields support for organization-specific needs (Phase 4)
