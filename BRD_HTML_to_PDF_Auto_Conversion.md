# Business and System Requirements Specifications

**Title:** HTML to PDF Auto-Conversion for Bundled Documents - Builder of Bundles 'BoB' - User Story [TBD]

**Author/Owner:** [TBD]

**Reviewers/Approvers:** [TBD]

**Review/Approved Date:** [TBD]

**Last Updated:** March 4, 2026

**Type:** Add

---

## Summary

### Initiative Overview

CMG Financial's current document management system stores DU (Desktop Underwriter) AUS Findings documents from Fannie Mae in HTML format within the `dbo.EmbeddedDoc` table. When these documents are included in investor submission bundles via the Bundle API, they are rejected due to security policies that prohibit HTML-formatted files. This results in critical compliance failures, as AUS Findings are mandatory regulatory documents for Fannie Mae loan submissions.

**Problem Statement:**
Fannie Mae DU AUS Findings are automatically stored as HTML files in the BytePro database. The Bundle API rejects HTML documents, causing 100% of Fannie Mae loans to fail compliance when AUS Findings are included in the stacking order.

### Current State Issues and Impact

**Current State Problems:**
1. **Automatic HTML Storage:** DU AUS Findings are automatically ingested and stored in HTML format (MimeType: `text/html`) in `dbo.EmbeddedDoc`
2. **Bundle API Rejection:** Bundle API security policies explicitly reject HTML files, preventing bundle generation
3. **Manual Intervention Required:** Users must manually discover the HTML format issue, download the document, convert to PDF using external tools, and re-upload
4. **Compliance Risk:** Missing AUS Findings in investor submissions result in automatic loan rejection and regulatory violations
5. **No Automated Conversion:** System lacks capability to automatically detect and convert HTML documents to investor-acceptable PDF format

**Operational Bottlenecks:**
- **Manual Detection Time:** 15-30 minutes per loan to identify HTML format issue
- **Manual Conversion Time:** 10-20 minutes per document (download, convert, re-upload workflow)
- **Bundle Generation Delays:** Average 45-minute delay per affected loan
- **Compliance Exposure:** $2M+ annual risk from missing AUS Findings in submissions
- **User Friction:** 100% of Fannie Mae loans require manual document intervention

**User Pain Points:**
- Users are unaware HTML documents will be rejected until Bundle API fails
- No system notification or warning when HTML documents are approved
- Cumbersome manual workflow disrupts loan processing efficiency
- Risk of human error during manual conversion and re-upload
- Lack of audit trail for document format conversions
- Inconsistent metadata preservation during manual conversion process

---

## Proposed Process

### Future-State MVP Description

The HTML to PDF Auto-Conversion feature provides seamless, automatic conversion of HTML-formatted documents to PDF format using CMG's existing "Doc Converter" tool infrastructure. The solution implements a **dual-trigger architecture** to ensure zero HTML documents enter the Bundle API while maintaining complete audit compliance.

**Dual-Trigger Architecture:**

**Trigger 1 - Status Change Event (Primary):**
When a document's status changes to "Approved" AND the document format is HTML (`MimeType = 'text/html'`), the system automatically:
1. Detects the HTML format via database trigger or event listener
2. Adds document to conversion queue with priority flag
3. Invokes Doc Converter tool asynchronously
4. Converts HTML to PDF while preserving all metadata
5. Updates `dbo.EmbeddedDoc` with new PDF file data and MimeType
6. Logs conversion activity to `dbo.DocumentConversionLog`

**Trigger 2 - Bundle API Pre-Processing (Safety Net):**
When Bundle API is invoked for bundle generation, the system performs pre-flight validation:
1. Queries all documents in the requested stacking order
2. Identifies any HTML-formatted documents in the bundle scope
3. Performs synchronous (blocking) conversion of HTML documents to PDF
4. Validates conversion success before proceeding
5. Generates bundle with converted PDF documents
6. Logs safety-net conversion activity separately for monitoring

### UI/UX Enhancements

**BoB Single Flow Document Manager Integration:**
- **Visual Indicator:** Documents with MimeType = `text/html` display a conversion badge in the Document Library Panel
- **Real-Time Status:** During Trigger 1 conversion, document shows "Converting..." status with spinner
- **Conversion Complete Notification:** Toast notification confirms successful HTML→PDF conversion
- **Document Preview:** Preview panel automatically refreshes to show PDF version after conversion
- **Audit Access:** Users can view conversion history via document details modal (timestamp, trigger type, duration)

**No User Action Required:**
- Conversion occurs automatically in background (Trigger 1) or synchronously (Trigger 2)
- Users experience no workflow changes or additional steps
- Existing document approval workflows remain unchanged

### Value Propositions

**Business Value:**
- **Compliance Assurance:** 100% of Fannie Mae loans include AUS Findings in investor bundles
- **Risk Mitigation:** Eliminates $2M+ annual exposure from missing regulatory documents
- **Operational Efficiency:** Eliminates 45-minute manual intervention per affected loan
- **User Experience:** Zero-friction document management (no manual conversion required)
- **Audit Compliance:** Complete conversion audit trail with 7-year retention

**Technical Value:**
- **Leverages Existing Infrastructure:** Uses proven Doc Converter tool (no new vendor dependencies)
- **Dual-Trigger Safety Net:** Race condition protection ensures no HTML documents bypass conversion
- **Metadata Preservation:** All document attributes, categories, and relationships maintained
- **Performance:** <5 second conversion time with 99.5% success rate target
- **Scalability:** Asynchronous queue architecture supports high-volume processing

### Phased Rollout Strategy

**Phase 1 - Development & Testing (Weeks 1-3):**
- Implement Trigger 1 (Status Change) conversion logic
- Implement Trigger 2 (Bundle API Pre-Processing) safety net
- Create `dbo.DocumentConversionLog` table for audit trail
- Develop Doc Converter tool integration layer
- Build retry mechanism for failed conversions
- Unit and integration testing in QA environment

**Phase 2 - QA Validation (Week 4):**
- End-to-end testing with real DU AUS Findings HTML documents
- Validate metadata preservation across all document fields
- Performance testing: conversion time, queue throughput, Bundle API latency
- Security validation: verify PDF output meets Bundle API requirements
- User acceptance testing (UAT) with Docs team

**Phase 3 - Production Deployment (Week 5):**
- Deploy to Production with monitoring alerts
- Enable Trigger 1 for all new document approvals
- Enable Trigger 2 as safety net for Bundle API calls
- Monitor conversion success rates and performance metrics
- Gradual rollout: 10% → 50% → 100% of traffic

**Phase 4 - Post-Launch Monitoring (Ongoing):**
- Daily monitoring of `dbo.DocumentConversionLog` for failures
- Alert on conversion success rate <99.5%
- Weekly review of Trigger 2 activations (should trend toward zero)
- Monthly performance optimization based on telemetry

### Technical Dependencies

**Required Components:**
1. **CMG Doc Converter Tool:** Existing document conversion service (HTML→PDF capability required)
2. **BytePro Database Access:** Write permissions to `dbo.EmbeddedDoc` and new `dbo.DocumentConversionLog` table
3. **EPS API Layer:** Integration point for Trigger 1 event handling
4. **Bundle API Modification:** Add pre-processing step for Trigger 2 HTML detection
5. **Async Queue Infrastructure:** Message queue or job scheduler for Trigger 1 conversions (e.g., Azure Service Bus, Hangfire)

**External Dependencies:**
- **Fannie Mae DU Integration:** No changes required (continues sending HTML AUS Findings)
- **Bundle API Security Policy:** No changes required (continues rejecting HTML)
- **Doc Converter Tool SLA:** Must support <5 second conversion time and 99.5% uptime

### User Experience Improvements

**Before (Current State):**
1. User approves DU AUS Findings document (HTML format - unknown to user)
2. User creates bundle with approved documents
3. Bundle API fails with cryptic HTML rejection error
4. User investigates error, discovers HTML format issue
5. User manually downloads HTML document
6. User converts HTML to PDF using external tool
7. User re-uploads PDF version to BytePro
8. User re-creates bundle (45-minute total delay)

**After (Future State):**
1. User approves DU AUS Findings document (HTML format detected automatically)
2. **System automatically converts HTML to PDF in <5 seconds** (Trigger 1)
3. User creates bundle with approved documents (now PDF format)
4. Bundle API succeeds with all documents included
5. **Zero manual intervention required**

---End of Section---

---

## Software Development Implementation Specs (Business Requirements)

### Requirement Statement

**As a** loan processor or underwriter using BoB Single Flow,
**I need** HTML-formatted AUS Findings documents to be automatically converted to PDF format when approved or before bundling,
**So that** investor submission bundles always include compliant AUS Findings documents without manual intervention or compliance risk.

---

### Functional & Technical Requirements

#### 1. Document Format Detection (Exhibit a-1)

**Requirement:** The system shall detect HTML-formatted documents in `dbo.EmbeddedDoc` and flag them for automatic conversion to PDF format.

**Fields and Data Sources:**
- **Source Table:** `dbo.EmbeddedDoc`
- **Detection Fields:**
  - `GUID` (UNIQUEIDENTIFIER) - Document unique identifier
  - `AccountID` (BIGINT) - Loan account reference
  - `MimeType` (VARCHAR(100)) - Document format type
    - Detection Logic: `MimeType = 'text/html'`
  - `Category` (VARCHAR(50)) - Document category type
    - Primary Target: `Category = 'AUS'` (AUS Findings)
    - Scope: All document categories eligible for conversion
  - `Status` (VARCHAR(20)) - Document approval status
    - Trigger Condition: `Status = 'Approved'`

**Business Rules:**
- BR-1.1: Only documents with `MimeType = 'text/html'` are eligible for conversion
- BR-1.2: Conversion priority: Documents with `Category = 'AUS'` receive highest priority
- BR-1.3: Documents with `Status != 'Approved'` are NOT converted (draft/pending documents excluded)
- BR-1.4: System shall support conversion of all HTML document categories (not limited to AUS)

**User Interactions:**
- No direct user interaction required (automatic detection)
- Document Library Panel displays visual badge indicator for HTML documents flagged for conversion

**Error Handling:**
- EH-1.1: If `MimeType` field is NULL or empty, skip conversion and log warning
- EH-1.2: If document `FileData` is NULL or corrupted, log error and alert support team

**Validation Rules:**
- VR-1.1: Validate `GUID` exists and is unique before adding to conversion queue
- VR-1.2: Validate `FileData` BLOB size >0 bytes before conversion attempt
- VR-1.3: Validate `MimeType = 'text/html'` using case-insensitive comparison

---

#### 2. Status Change Event Trigger (Trigger 1) (Exhibit a-2)

**Requirement:** The system shall automatically trigger HTML→PDF conversion when a document's status changes to "Approved" and the document format is HTML.

**Fields and Data Sources:**
- **Event Source:** `dbo.EmbeddedDoc` status change event
- **Trigger Condition Fields:**
  - `Status` (VARCHAR(20)) - NEW value = 'Approved'
  - `MimeType` (VARCHAR(100)) - Current value = 'text/html'
- **Conversion Queue Payload:**
  - `GUID` (UNIQUEIDENTIFIER) - Document to convert
  - `AccountID` (BIGINT) - Loan account context
  - `TriggerType` (VARCHAR(50)) - Value: 'StatusChange'
  - `Priority` (INT) - Based on Category ('AUS' = 1, Others = 2)
  - `QueuedOn` (DATETIME2) - Timestamp when added to queue

**Business Rules:**
- BR-2.1: Trigger activates ONLY when status transitions TO 'Approved' (not other status changes)
- BR-2.2: If document is already PDF format (`MimeType = 'application/pdf'`), skip conversion
- BR-2.3: Conversion executes asynchronously (non-blocking user workflow)
- BR-2.4: Retry failed conversions up to 3 attempts with exponential backoff (1s, 5s, 15s)
- BR-2.5: After 3 failed attempts, log error and alert support team via email/Slack

**User Interactions:**
- User approves document via existing workflow (no changes to approval process)
- Document Library Panel shows "Converting..." status badge during conversion
- Toast notification displays "Document converted to PDF" upon successful completion

**Error Handling:**
- EH-2.1: If conversion queue is unavailable, log error and retry trigger after 30 seconds
- EH-2.2: If Doc Converter tool returns error, increment retry counter and log failure details
- EH-2.3: If conversion times out (>30 seconds), mark as failed and alert support

**Validation Rules:**
- VR-2.1: Validate document is not already in conversion queue (prevent duplicate queue entries)
- VR-2.2: Validate `FileData` is valid HTML markup before sending to Doc Converter
- VR-2.3: Validate converted PDF file size >0 bytes and <100MB before replacing original

---

#### 3. Bundle API Pre-Processing Trigger (Trigger 2) (Exhibit a-3)

**Requirement:** The system shall perform pre-flight validation when Bundle API is invoked to detect and synchronously convert any HTML documents in the requested stacking order before bundle generation.

**Fields and Data Sources:**
- **Input:** Bundle API request payload
  - `LoanNumber` (VARCHAR(50)) - Loan account identifier
  - `StackingOrder` (JSON Array) - List of document GUIDs in bundle sequence
- **Query:** `dbo.EmbeddedDoc` filtered by stacking order GUIDs
  - Filter: `GUID IN (StackingOrder) AND MimeType = 'text/html' AND Status = 'Approved'`
- **Conversion Log Fields:**
  - `TriggerType` (VARCHAR(50)) - Value: 'BundleAPI'
  - `ConversionStatus` (VARCHAR(20)) - 'Success', 'Failed', 'Retry'

**Business Rules:**
- BR-3.1: Trigger 2 executes synchronously (blocking) before bundle generation begins
- BR-3.2: If HTML documents detected, convert ALL HTML docs before proceeding
- BR-3.3: If any conversion fails after 3 retries, abort bundle generation and return error to user
- BR-3.4: If zero HTML documents detected, proceed directly to bundle generation (no delay)
- BR-3.5: Log all Trigger 2 activations for monitoring (goal: trend toward zero over time)

**User Interactions:**
- User clicks "Generate Bundle" button in BoB Single Flow
- If Trigger 2 activates, display modal: "Preparing documents for bundle..." with progress spinner
- If conversion succeeds, proceed to bundle generation seamlessly
- If conversion fails, display error modal: "Unable to convert documents. Please contact support. [Error ID: XXXX]"

**Error Handling:**
- EH-3.1: If Doc Converter tool unavailable, return HTTP 503 error with retry-after header
- EH-3.2: If conversion fails for critical document (e.g., AUS Findings), abort bundle and log critical error
- EH-3.3: If conversion times out (>30 seconds), abort bundle and alert support team

**Validation Rules:**
- VR-3.1: Validate stacking order contains at least 1 document GUID
- VR-3.2: Validate all GUIDs in stacking order exist in `dbo.EmbeddedDoc`
- VR-3.3: Validate converted PDFs pass Bundle API security validation before proceeding

**Performance Requirements:**
- PR-3.1: Trigger 2 pre-processing shall complete in <10 seconds for up to 50 documents
- PR-3.2: Trigger 2 shall not increase Bundle API response time by >15% on average
- PR-3.3: Conversion queue throughput: minimum 100 documents/minute

---

#### 4. Doc Converter Tool Integration (Exhibit a-4)

**Requirement:** The system shall integrate with CMG's existing "Doc Converter" tool to perform HTML→PDF conversions with proper error handling, retry logic, and audit logging.

**Fields and Data Sources:**
- **Doc Converter API Endpoint:** `https://[doc-converter-api]/api/convert`
- **Request Payload:**
  - `DocumentGUID` (UNIQUEIDENTIFIER) - Document identifier
  - `SourceFormat` (VARCHAR(20)) - Value: 'HTML'
  - `TargetFormat` (VARCHAR(20)) - Value: 'PDF'
  - `FileData` (BLOB) - Base64-encoded HTML content from `dbo.EmbeddedDoc.FileData`
  - `ConversionOptions` (JSON Object) - PDF settings: page size (Letter), orientation (Portrait), margins (0.5in)
- **Response Payload:**
  - `ConversionStatus` (VARCHAR(20)) - 'Success', 'Failed', 'Timeout'
  - `ConvertedFileData` (BLOB) - Base64-encoded PDF content
  - `ErrorMessage` (VARCHAR(MAX)) - Error details if conversion failed
  - `ConversionDuration` (INT) - Milliseconds taken to convert

**Business Rules:**
- BR-4.1: Use existing Doc Converter tool authentication (API key or OAuth token)
- BR-4.2: Set conversion timeout to 30 seconds (abort if Doc Converter exceeds limit)
- BR-4.3: Validate PDF output format matches Bundle API requirements (PDF 1.4+, no encryption)
- BR-4.4: Preserve original HTML file in archive table (`dbo.EmbeddedDoc_Archive`) before replacing
- BR-4.5: If Doc Converter tool unavailable, queue conversions for retry when service restored

**User Interactions:**
- No direct user interaction with Doc Converter tool
- System logs conversion activity visible in Document Details modal (admin/support users)

**Error Handling:**
- EH-4.1: If Doc Converter returns HTTP 500, retry up to 3 times with exponential backoff
- EH-4.2: If Doc Converter returns HTTP 400 (invalid HTML), log error and alert support (no retry)
- EH-4.3: If network timeout occurs, mark conversion as failed and retry per retry policy

**Validation Rules:**
- VR-4.1: Validate Doc Converter response contains valid PDF magic bytes (`%PDF-1.`)
- VR-4.2: Validate converted PDF file size is within reasonable range (10KB - 100MB)
- VR-4.3: Validate PDF is not password-protected or encrypted

**Integration Requirements:**
- IR-4.1: Doc Converter tool must support HTML→PDF conversion with CSS rendering
- IR-4.2: Doc Converter tool must preserve hyperlinks, images, and formatting in PDF output
- IR-4.3: Doc Converter tool must support async/batch conversion API (for queue processing)

---

#### 5. Metadata Preservation During Conversion (Exhibit a-5)

**Requirement:** The system shall preserve ALL document metadata fields when replacing HTML file data with converted PDF file data, ensuring document relationships, categories, and audit trails remain intact.

**Fields and Data Sources:**
- **Preserved Fields in `dbo.EmbeddedDoc`:**
  - `GUID` (UNIQUEIDENTIFIER) - **PRESERVED** - Document identifier remains unchanged
  - `AccountID` (BIGINT) - **PRESERVED** - Loan account association unchanged
  - `Status` (VARCHAR(20)) - **PRESERVED** - Remains 'Approved'
  - `Category` (VARCHAR(50)) - **PRESERVED** - Remains 'AUS' (or original category)
  - `Description` (NVARCHAR(500)) - **PRESERVED** - User-defined description unchanged
  - `UploadedBy` (VARCHAR(100)) - **PRESERVED** - Original uploader attribution
  - `UploadedOn` (DATETIME2) - **PRESERVED** - Original upload timestamp
  - `ApprovedBy` (VARCHAR(100)) - **PRESERVED** - User who approved document
  - `ApprovedOn` (DATETIME2) - **PRESERVED** - Approval timestamp
  - `DocumentType` (VARCHAR(50)) - **PRESERVED** - Document type classification
  - `InvestorRequired` (BIT) - **PRESERVED** - Investor requirement flag
  - `StackingOrderPosition` (INT) - **PRESERVED** - Position in bundle sequence

- **Updated Fields in `dbo.EmbeddedDoc`:**
  - `MimeType` (VARCHAR(100)) - **UPDATED** - Changes from 'text/html' to 'application/pdf'
  - `FileName` (NVARCHAR(255)) - **UPDATED** - Changes extension from '.html' to '.pdf'
  - `FileData` (VARBINARY(MAX)) - **UPDATED** - Replaced with converted PDF binary content
  - `FileSize` (BIGINT) - **UPDATED** - Updated to reflect PDF file size
  - `LastModifiedBy` (VARCHAR(100)) - **UPDATED** - Set to 'SYSTEM_AUTO_CONVERSION'
  - `LastModifiedOn` (DATETIME2) - **UPDATED** - Set to conversion timestamp

**Business Rules:**
- BR-5.1: ALL fields except MimeType, FileName, FileData, FileSize, LastModifiedBy, LastModifiedOn MUST be preserved
- BR-5.2: Original HTML file data archived in `dbo.EmbeddedDoc_Archive` before replacement (7-year retention)
- BR-5.3: Update operation must be atomic (transaction rollback if any field update fails)
- BR-5.4: Document version history preserved (track conversion as version increment)

**User Interactions:**
- Document Details modal shows "Last Modified: SYSTEM_AUTO_CONVERSION" for converted documents
- Document history tab displays conversion event: "Converted from HTML to PDF on [timestamp]"

**Error Handling:**
- EH-5.1: If metadata update transaction fails, rollback conversion and log critical error
- EH-5.2: If archive operation fails, abort conversion and alert DBA team
- EH-5.3: If GUID collision detected (should never occur), abort and log critical error

**Validation Rules:**
- VR-5.1: Validate GUID exists before update operation
- VR-5.2: Validate AccountID exists in loan accounts table before update
- VR-5.3: Validate all preserved fields match original values after update (integrity check)

**Data Integrity Requirements:**
- DI-5.1: Foreign key relationships to `dbo.EmbeddedDoc.GUID` must remain valid after conversion
- DI-5.2: Document audit trail tables must link to converted document via unchanged GUID
- DI-5.3: Stacking order references must remain valid (GUID unchanged)

---

#### 6. Conversion Audit Logging (Exhibit a-6)

**Requirement:** The system shall log all HTML→PDF conversion attempts to a dedicated audit table with complete traceability, performance metrics, and 7-year retention for compliance and monitoring.

**Fields and Data Sources:**
- **New Table:** `dbo.DocumentConversionLog`
- **Table Schema:**

```sql
CREATE TABLE dbo.DocumentConversionLog (
    LogID BIGINT IDENTITY(1,1) PRIMARY KEY,
    DocumentGUID UNIQUEIDENTIFIER NOT NULL,
    AccountID BIGINT NOT NULL,
    TriggerType VARCHAR(50) NOT NULL, -- 'StatusChange' or 'BundleAPI'
    SourceFormat VARCHAR(20) NOT NULL DEFAULT 'HTML',
    TargetFormat VARCHAR(20) NOT NULL DEFAULT 'PDF',
    ConversionStatus VARCHAR(20) NOT NULL, -- 'Success', 'Failed', 'Retry', 'Timeout'
    ErrorMessage NVARCHAR(MAX) NULL,
    ErrorCode VARCHAR(50) NULL,
    OriginalFileName NVARCHAR(255) NULL,
    OriginalFileSize BIGINT NULL, -- Bytes
    ConvertedFileSize BIGINT NULL, -- Bytes
    ConversionDuration INT NULL, -- Milliseconds
    RetryCount INT NOT NULL DEFAULT 0,
    ConvertedOn DATETIME2 NOT NULL DEFAULT GETDATE(),
    ConvertedBy VARCHAR(100) NOT NULL DEFAULT 'SYSTEM_AUTO_CONVERSION',
    DocConverterVersion VARCHAR(50) NULL,
    ServerName VARCHAR(100) NULL,

    -- Foreign Keys
    CONSTRAINT FK_DocumentConversionLog_EmbeddedDoc
        FOREIGN KEY (DocumentGUID) REFERENCES dbo.EmbeddedDoc(GUID),

    -- Indexes for performance
    INDEX IX_DocumentConversionLog_DocumentGUID (DocumentGUID),
    INDEX IX_DocumentConversionLog_AccountID (AccountID),
    INDEX IX_DocumentConversionLog_ConvertedOn (ConvertedOn DESC),
    INDEX IX_DocumentConversionLog_TriggerType (TriggerType),
    INDEX IX_DocumentConversionLog_ConversionStatus (ConversionStatus)
);
```

**Business Rules:**
- BR-6.1: Log EVERY conversion attempt (success, failure, timeout, retry)
- BR-6.2: Retention policy: 7 years (regulatory compliance requirement)
- BR-6.3: Separate log entry for each retry attempt (linked via DocumentGUID + RetryCount)
- BR-6.4: Performance metrics captured: duration, file sizes, Doc Converter version
- BR-6.5: Log Trigger 2 activations separately for monitoring (goal: zero activations after stabilization)

**User Interactions:**
- Support/Admin users can query `dbo.DocumentConversionLog` via SQL or admin dashboard
- Document Details modal displays conversion history from log table
- BoB Admin Panel shows conversion metrics dashboard (success rate, avg duration, failure trends)

**Error Handling:**
- EH-6.1: If log write fails, do NOT abort conversion (conversion takes priority)
- EH-6.2: Queue failed log writes for retry via separate logging mechanism
- EH-6.3: Alert DBA team if log table write failures exceed 5% threshold

**Validation Rules:**
- VR-6.1: Validate DocumentGUID exists in `dbo.EmbeddedDoc` before logging
- VR-6.2: Validate TriggerType is one of: 'StatusChange', 'BundleAPI'
- VR-6.3: Validate ConversionStatus is one of: 'Success', 'Failed', 'Retry', 'Timeout'

**Monitoring & Alerting:**
- AL-6.1: Alert if conversion success rate drops below 99.5% over 1-hour window
- AL-6.2: Alert if average conversion duration exceeds 10 seconds
- AL-6.3: Alert if Trigger 2 activations exceed 10% of total conversions (indicates Trigger 1 failures)
- AL-6.4: Daily summary report: total conversions, success rate, avg duration, failure breakdown

**Retention & Archival:**
- RA-6.1: Archive log records older than 7 years to cold storage (Azure Blob Storage)
- RA-6.2: Automated monthly cleanup job removes archived records from active table
- RA-6.3: Maintain indexes on active table for query performance (<100ms query response)

---End of Section---

---

## Exhibits

### Exhibit a-1: Document Format Detection

**Visual Mockup:** Document Library Panel - HTML Document Indicator

```
┌─────────────────────────────────────────────────────────────┐
│  Document Library - Loan #RMA000005336                      │
├─────────────────────────────────────────────────────────────┤
│  📄 Purchase Agreement.pdf           [Approved] [Final]     │
│  📄 Appraisal Report.pdf              [Approved] [Final]     │
│  📄 DU Findings - 1717489543.html    [Approved] [AUS] 🔄    │
│      ↳ Converting to PDF...          [In Progress]          │
│  📄 Title Commitment.pdf              [Approved] [Final]     │
└─────────────────────────────────────────────────────────────┘

Legend:
🔄 = HTML document flagged for conversion
[In Progress] = Conversion currently processing
```

**Description:** Document Library Panel displays visual indicator (🔄 badge) for HTML documents flagged for automatic conversion. During Trigger 1 conversion, document shows "Converting to PDF..." status.

---

### Exhibit a-2: Status Change Event Trigger (Trigger 1)

**Visual Mockup:** Conversion Queue Processing Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Status Change Event Detected                                │
│  ───────────────────────────────────────────────────────────│
│  Document: DU Findings - 1717489543.html                     │
│  GUID: a3f8c9b2-4d7e-11ec-81d3-0242ac130003                 │
│  Status Changed: [Pending] → [Approved] ✓                   │
│  Format Detected: text/html                                  │
│                                                              │
│  ➡️ Adding to Conversion Queue...                           │
│     Priority: 1 (AUS Category)                              │
│     Trigger Type: StatusChange                              │
│     Queued On: 2026-03-04 14:32:15                          │
│                                                              │
│  ➡️ Invoking Doc Converter Tool...                          │
│     Conversion Duration: 3.2 seconds                        │
│     Status: ✅ Success                                       │
│                                                              │
│  ➡️ Updating dbo.EmbeddedDoc...                             │
│     MimeType: text/html → application/pdf                   │
│     FileName: DU_Findings.html → DU_Findings.pdf            │
│     FileSize: 45KB → 128KB                                  │
│                                                              │
│  ➡️ Logging to dbo.DocumentConversionLog...                 │
│     LogID: 12847                                            │
│     ConversionStatus: Success                               │
│                                                              │
│  ✅ Conversion Complete - Document Ready for Bundling       │
└──────────────────────────────────────────────────────────────┘
```

**Description:** Trigger 1 activates when document status changes to "Approved" and format is HTML. System automatically converts in background with complete audit trail.

---

### Exhibit a-3: Bundle API Pre-Processing Trigger (Trigger 2)

**Visual Mockup:** Bundle API Pre-Flight Validation Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Bundle API Request Received                                 │
│  ───────────────────────────────────────────────────────────│
│  Loan Number: RMA000005336                                   │
│  Stacking Order: 12 documents                                │
│                                                              │
│  ➡️ Pre-Flight Validation...                                │
│     Scanning stacking order for HTML documents...           │
│                                                              │
│     ⚠️ HTML Documents Detected: 1                            │
│        • DU Findings - 1717489543.html [GUID: a3f8...]      │
│                                                              │
│  ➡️ Synchronous Conversion Required                         │
│     Converting HTML documents before bundle generation...   │
│                                                              │
│     Document 1/1: DU_Findings.html                          │
│     Status: Converting... [████████░░] 80%                  │
│     Duration: 4.1 seconds                                   │
│     Result: ✅ Success                                       │
│                                                              │
│  ➡️ Validation Complete                                     │
│     All documents converted to PDF format                   │
│     Total Pre-Processing Time: 4.8 seconds                  │
│                                                              │
│  ➡️ Proceeding with Bundle Generation...                    │
│     Bundle ID: BDL-2026-03-04-98472                         │
│     Status: ✅ Bundle Generated Successfully                 │
└──────────────────────────────────────────────────────────────┘
```

**Description:** Trigger 2 safety net detects HTML documents during Bundle API call and performs synchronous conversion before bundle generation. Prevents any HTML documents from entering Bundle API.

---

### Exhibit a-4: Doc Converter Tool Integration

**Technical Diagram:** Doc Converter API Integration

```
┌─────────────────────────────────────────────────────────────┐
│  BoB Application Layer                                       │
│  ───────────────────────────────────────────────────────────│
│  │                                                           │
│  │  Trigger 1 (Async)         Trigger 2 (Sync)             │
│  │      │                            │                      │
│  │      ▼                            ▼                      │
│  │  ┌──────────────────────────────────────┐               │
│  │  │  Conversion Queue Manager            │               │
│  │  │  • Priority Queue (AUS = 1)          │               │
│  │  │  • Retry Logic (3 attempts)          │               │
│  │  │  • Exponential Backoff               │               │
│  │  └──────────────────────────────────────┘               │
│  │                    │                                     │
│  └────────────────────┼─────────────────────────────────────┘
│                       │
│                       ▼
│  ┌─────────────────────────────────────────────────────────┐
│  │  Doc Converter Tool API                                  │
│  │  ───────────────────────────────────────────────────────│
│  │  POST /api/convert                                       │
│  │  {                                                       │
│  │    "DocumentGUID": "a3f8c9b2...",                       │
│  │    "SourceFormat": "HTML",                              │
│  │    "TargetFormat": "PDF",                               │
│  │    "FileData": "PGh0bWw+Li4uPC9odG1sPg==",             │
│  │    "ConversionOptions": {                               │
│  │      "PageSize": "Letter",                              │
│  │      "Orientation": "Portrait",                         │
│  │      "Margins": "0.5in"                                 │
│  │    }                                                     │
│  │  }                                                       │
│  │                                                          │
│  │  Response (Success):                                     │
│  │  {                                                       │
│  │    "ConversionStatus": "Success",                       │
│  │    "ConvertedFileData": "JVBERi0xLjQKJeLjz...",         │
│  │    "ConversionDuration": 3200,  // milliseconds         │
│  │    "ErrorMessage": null                                 │
│  │  }                                                       │
│  │                                                          │
│  │  Response (Failure):                                     │
│  │  {                                                       │
│  │    "ConversionStatus": "Failed",                        │
│  │    "ConvertedFileData": null,                           │
│  │    "ConversionDuration": 0,                             │
│  │    "ErrorMessage": "Invalid HTML markup at line 42"     │
│  │  }                                                       │
│  └─────────────────────────────────────────────────────────┘
│                       │
│                       ▼
│  ┌─────────────────────────────────────────────────────────┐
│  │  Database Layer (BytePro)                                │
│  │  ───────────────────────────────────────────────────────│
│  │  • Update dbo.EmbeddedDoc (MimeType, FileName, FileData)│
│  │  • Insert dbo.DocumentConversionLog (Audit Trail)       │
│  │  • Archive dbo.EmbeddedDoc_Archive (Original HTML)      │
│  └─────────────────────────────────────────────────────────┘
```

**Description:** Doc Converter Tool integration layer with request/response schema, retry logic, and database update workflow.

---

### Exhibit a-5: Metadata Preservation During Conversion

**Data Mapping Table:** Field-Level Preservation Logic

| Field Name              | Data Type          | Preservation Status | Update Logic                                    |
|-------------------------|--------------------|---------------------|-------------------------------------------------|
| `GUID`                  | UNIQUEIDENTIFIER   | ✅ **PRESERVED**     | Unchanged (primary key)                         |
| `AccountID`             | BIGINT             | ✅ **PRESERVED**     | Unchanged (loan association)                    |
| `Status`                | VARCHAR(20)        | ✅ **PRESERVED**     | Remains 'Approved'                              |
| `Category`              | VARCHAR(50)        | ✅ **PRESERVED**     | Remains 'AUS' (or original value)               |
| `Description`           | NVARCHAR(500)      | ✅ **PRESERVED**     | Unchanged (user-defined text)                   |
| `UploadedBy`            | VARCHAR(100)       | ✅ **PRESERVED**     | Unchanged (original uploader)                   |
| `UploadedOn`            | DATETIME2          | ✅ **PRESERVED**     | Unchanged (original upload timestamp)           |
| `ApprovedBy`            | VARCHAR(100)       | ✅ **PRESERVED**     | Unchanged (approver name)                       |
| `ApprovedOn`            | DATETIME2          | ✅ **PRESERVED**     | Unchanged (approval timestamp)                  |
| `DocumentType`          | VARCHAR(50)        | ✅ **PRESERVED**     | Unchanged (type classification)                 |
| `InvestorRequired`      | BIT                | ✅ **PRESERVED**     | Unchanged (investor flag)                       |
| `StackingOrderPosition` | INT                | ✅ **PRESERVED**     | Unchanged (bundle sequence)                     |
| `MimeType`              | VARCHAR(100)       | 🔄 **UPDATED**       | `text/html` → `application/pdf`                 |
| `FileName`              | NVARCHAR(255)      | 🔄 **UPDATED**       | Extension changed: `.html` → `.pdf`             |
| `FileData`              | VARBINARY(MAX)     | 🔄 **UPDATED**       | Replaced with converted PDF binary              |
| `FileSize`              | BIGINT             | 🔄 **UPDATED**       | Updated to reflect PDF file size                |
| `LastModifiedBy`        | VARCHAR(100)       | 🔄 **UPDATED**       | Set to `'SYSTEM_AUTO_CONVERSION'`               |
| `LastModifiedOn`        | DATETIME2          | 🔄 **UPDATED**       | Set to conversion timestamp                     |

**Description:** Complete field-level mapping showing which metadata fields are preserved vs. updated during HTML→PDF conversion.

---

### Exhibit a-6: Conversion Audit Logging Schema

**Database Table Diagram:** `dbo.DocumentConversionLog`

```sql
-- Table: dbo.DocumentConversionLog
-- Purpose: 7-year audit trail for HTML→PDF conversions
-- Retention: 7 years (regulatory compliance)
-- Indexes: DocumentGUID, AccountID, ConvertedOn, TriggerType, ConversionStatus

┌────────────────────────────────────────────────────────────────┐
│  dbo.DocumentConversionLog                                     │
├────────────────────────────────────────────────────────────────┤
│  PK  LogID                  BIGINT IDENTITY(1,1)               │
│  FK  DocumentGUID           UNIQUEIDENTIFIER  [→ EmbeddedDoc]  │
│      AccountID              BIGINT                             │
│      TriggerType            VARCHAR(50)  ['StatusChange' |     │
│                                           'BundleAPI']         │
│      SourceFormat           VARCHAR(20)  DEFAULT 'HTML'        │
│      TargetFormat           VARCHAR(20)  DEFAULT 'PDF'         │
│      ConversionStatus       VARCHAR(20)  ['Success' |          │
│                                           'Failed' |           │
│                                           'Retry' |            │
│                                           'Timeout']           │
│      ErrorMessage           NVARCHAR(MAX)  NULL                │
│      ErrorCode              VARCHAR(50)  NULL                  │
│      OriginalFileName       NVARCHAR(255)  NULL                │
│      OriginalFileSize       BIGINT  (bytes)                    │
│      ConvertedFileSize      BIGINT  (bytes)                    │
│      ConversionDuration     INT  (milliseconds)                │
│      RetryCount             INT  DEFAULT 0                     │
│      ConvertedOn            DATETIME2  DEFAULT GETDATE()       │
│      ConvertedBy            VARCHAR(100)  DEFAULT 'SYSTEM'     │
│      DocConverterVersion    VARCHAR(50)  NULL                  │
│      ServerName             VARCHAR(100)  NULL                 │
└────────────────────────────────────────────────────────────────┘

Indexes:
• IX_DocumentConversionLog_DocumentGUID (DocumentGUID)
• IX_DocumentConversionLog_AccountID (AccountID)
• IX_DocumentConversionLog_ConvertedOn (ConvertedOn DESC)
• IX_DocumentConversionLog_TriggerType (TriggerType)
• IX_DocumentConversionLog_ConversionStatus (ConversionStatus)

Sample Query - Conversion Success Rate (Last 24 Hours):
──────────────────────────────────────────────────────────────
SELECT
    TriggerType,
    COUNT(*) AS TotalConversions,
    SUM(CASE WHEN ConversionStatus = 'Success' THEN 1 ELSE 0 END) AS Successes,
    CAST(SUM(CASE WHEN ConversionStatus = 'Success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS SuccessRate,
    AVG(ConversionDuration) AS AvgDurationMs
FROM dbo.DocumentConversionLog
WHERE ConvertedOn >= DATEADD(HOUR, -24, GETDATE())
GROUP BY TriggerType;

Expected Output:
TriggerType    | TotalConversions | Successes | SuccessRate | AvgDurationMs
───────────────┼──────────────────┼───────────┼─────────────┼──────────────
StatusChange   | 1,247            | 1,241     | 99.52%      | 3,180
BundleAPI      | 12               | 12        | 100.00%     | 4,250
```

**Description:** Complete audit logging schema with sample queries for monitoring conversion success rates and performance metrics.

---

### Exhibit b: Supporting Documents

**Exhibit b-1:** Database Schema Documentation
- **File:** `BytePro_Database_Schema_EmbeddedDoc.pdf`
- **Description:** Complete schema documentation for `dbo.EmbeddedDoc` table including all fields, data types, indexes, and foreign key relationships
- **Source:** CMG Database Architecture Team

**Exhibit b-2:** Doc Converter Tool API Documentation
- **File:** `Doc_Converter_API_Specification_v2.4.pdf`
- **Description:** API specification for CMG Doc Converter tool including supported formats (HTML, DOCX, TXT → PDF), authentication, request/response schemas, and SLA guarantees
- **Source:** CMG Platform Services Team

**Exhibit b-3:** Bundle API Security Policy
- **File:** `Bundle_API_Security_Policy_v3.1.pdf`
- **Description:** Security policy documentation explaining HTML file rejection rationale, accepted MIME types, and investor submission requirements
- **Source:** CMG Security & Compliance Team

**Exhibit b-4:** Example DU Findings Document
- **File:** `22.pdf` (User-provided example)
- **Description:** Sample Fannie Mae DU Findings document showing HTML format metadata:
  - Type: HTML
  - Status: Approved
  - Category: AUS
  - Casefile ID: 1717489543
  - Lender Loan Number: RMA000005336
  - Recommendation: Approve/Eligible
- **Source:** User-provided example from production system

---End of Section---

---

## Acceptance Criteria

### AC-1: Document Format Detection (FR1)

**Given** a document exists in `dbo.EmbeddedDoc` with `MimeType = 'text/html'` and `Status = 'Approved'`
**When** the system performs format detection
**Then** the document is flagged for conversion and added to the conversion queue

---

**Given** a document exists in `dbo.EmbeddedDoc` with `MimeType = 'application/pdf'` and `Status = 'Approved'`
**When** the system performs format detection
**Then** the document is NOT flagged for conversion (already PDF format)

---

**Given** a document exists in `dbo.EmbeddedDoc` with `MimeType = 'text/html'` and `Status = 'Pending'`
**When** the system performs format detection
**Then** the document is NOT flagged for conversion (not approved)

---

**Given** a document exists in `dbo.EmbeddedDoc` with `MimeType = 'text/html'`, `Status = 'Approved'`, and `Category = 'AUS'`
**When** the document is added to conversion queue
**Then** the document receives Priority = 1 (highest priority)

---

**Given** a document exists in `dbo.EmbeddedDoc` with `MimeType = 'text/html'`, `Status = 'Approved'`, and `Category = 'TitleReport'`
**When** the document is added to conversion queue
**Then** the document receives Priority = 2 (standard priority)

---

**Given** a document exists in `dbo.EmbeddedDoc` with `MimeType = NULL` or empty string
**When** the system performs format detection
**Then** the document is skipped and a warning is logged to the system log

---

**Given** a document exists in `dbo.EmbeddedDoc` with `FileData = NULL` (corrupted)
**When** the system performs format detection
**Then** the document is skipped and an error is logged with alert to support team

---

### AC-2: Status Change Event Trigger (Trigger 1) (FR2)

**Given** a document with `MimeType = 'text/html'` exists in `dbo.EmbeddedDoc`
**When** the document `Status` changes from 'Pending' to 'Approved'
**Then** Trigger 1 activates and adds the document to the conversion queue with `TriggerType = 'StatusChange'`

---

**Given** a document with `MimeType = 'application/pdf'` exists in `dbo.EmbeddedDoc`
**When** the document `Status` changes to 'Approved'
**Then** Trigger 1 does NOT activate (document already in PDF format)

---

**Given** a document with `MimeType = 'text/html'` exists in `dbo.EmbeddedDoc`
**When** the document `Status` changes from 'Approved' to 'Rejected'
**Then** Trigger 1 does NOT activate (status change is not TO 'Approved')

---

**Given** a document is added to the conversion queue via Trigger 1
**When** the conversion is processing
**Then** the Document Library Panel displays "Converting..." status badge with spinner icon

---

**Given** a document conversion completes successfully via Trigger 1
**When** the user is viewing the Document Library Panel
**Then** a toast notification displays: "Document converted to PDF successfully"

---

**Given** a document conversion fails after 1st attempt
**When** the retry logic executes
**Then** the system retries conversion after 1-second delay (exponential backoff attempt 1)

---

**Given** a document conversion fails after 2nd attempt
**When** the retry logic executes
**Then** the system retries conversion after 5-second delay (exponential backoff attempt 2)

---

**Given** a document conversion fails after 3rd attempt
**When** the retry logic executes
**Then** the system logs a critical error and alerts the support team via email/Slack (no further retries)

---

**Given** the conversion queue service is unavailable
**When** Trigger 1 attempts to add a document to the queue
**Then** the system logs an error and retries the trigger after 30 seconds

---

**Given** Doc Converter tool times out (>30 seconds)
**When** processing a conversion request
**Then** the system marks conversion as 'Timeout' and increments retry counter

---

### AC-3: Bundle API Pre-Processing Trigger (Trigger 2) (FR3)

**Given** a user initiates Bundle API call with `LoanNumber = 'RMA000005336'` and stacking order containing 1 HTML document
**When** Trigger 2 pre-flight validation executes
**Then** the system detects the HTML document, converts it synchronously, and proceeds with bundle generation

---

**Given** a user initiates Bundle API call with stacking order containing 0 HTML documents
**When** Trigger 2 pre-flight validation executes
**Then** the system skips conversion and proceeds directly to bundle generation (no delay)

---

**Given** a user initiates Bundle API call with stacking order containing 3 HTML documents
**When** Trigger 2 pre-flight validation executes
**Then** the system converts all 3 documents synchronously before proceeding with bundle generation

---

**Given** Trigger 2 is processing HTML document conversions
**When** the user is viewing the BoB application
**Then** a modal displays: "Preparing documents for bundle..." with progress spinner

---

**Given** Trigger 2 successfully converts all HTML documents
**When** conversion completes
**Then** the system proceeds seamlessly to bundle generation and dismisses the "Preparing..." modal

---

**Given** Trigger 2 conversion fails after 3 retries for a critical document (e.g., AUS Findings)
**When** the final retry attempt fails
**Then** the system aborts bundle generation and displays error modal: "Unable to convert documents. Please contact support. [Error ID: XXXX]"

---

**Given** Doc Converter tool is unavailable during Trigger 2 execution
**When** the system attempts conversion
**Then** the Bundle API returns HTTP 503 error with `Retry-After` header

---

**Given** Trigger 2 conversion times out (>30 seconds)
**When** processing a document
**Then** the system aborts bundle generation, logs critical error, and alerts support team

---

**Given** Trigger 2 activates and converts 1 HTML document
**When** conversion completes
**Then** a log entry is created in `dbo.DocumentConversionLog` with `TriggerType = 'BundleAPI'`

---

**Given** Trigger 2 activation rate exceeds 10% of total conversions over 24-hour period
**When** monitoring system detects threshold breach
**Then** an alert is sent to engineering team (indicates Trigger 1 failures)

---

### AC-4: Doc Converter Tool Integration (FR4)

**Given** a document with `MimeType = 'text/html'` is queued for conversion
**When** the system invokes Doc Converter tool
**Then** the request payload includes: `DocumentGUID`, `SourceFormat = 'HTML'`, `TargetFormat = 'PDF'`, Base64-encoded `FileData`, and `ConversionOptions`

---

**Given** Doc Converter tool successfully converts HTML to PDF
**When** the response is received
**Then** the response contains `ConversionStatus = 'Success'`, Base64-encoded `ConvertedFileData`, and `ConversionDuration` in milliseconds

---

**Given** Doc Converter tool fails conversion due to invalid HTML markup
**When** the response is received
**Then** the response contains `ConversionStatus = 'Failed'`, `ErrorMessage` with details, and `ConvertedFileData = NULL`

---

**Given** Doc Converter tool returns HTTP 500 (internal server error)
**When** the system receives the error
**Then** the system retries the request up to 3 times with exponential backoff (1s, 5s, 15s)

---

**Given** Doc Converter tool returns HTTP 400 (invalid HTML)
**When** the system receives the error
**Then** the system logs the error, alerts support team, and does NOT retry (permanent failure)

---

**Given** Doc Converter tool conversion timeout occurs (>30 seconds)
**When** the timeout is detected
**Then** the system marks conversion as 'Timeout' and retries per retry policy

---

**Given** Doc Converter tool returns converted PDF data
**When** the system validates the response
**Then** the system confirms PDF magic bytes (`%PDF-1.`) are present in the file header

---

**Given** Doc Converter tool returns converted PDF data
**When** the system validates the response
**Then** the system confirms PDF file size is within range: 10KB - 100MB

---

**Given** Doc Converter tool returns password-protected or encrypted PDF
**When** the system validates the response
**Then** the system rejects the PDF and logs error (Bundle API requires unencrypted PDFs)

---

**Given** original HTML file is successfully converted
**When** the conversion completes
**Then** the original HTML file is archived in `dbo.EmbeddedDoc_Archive` with 7-year retention before replacement

---

### AC-5: Metadata Preservation During Conversion (FR5)

**Given** a document with `GUID = 'a3f8c9b2-4d7e-11ec-81d3-0242ac130003'` is converted from HTML to PDF
**When** the conversion completes
**Then** the `GUID` field in `dbo.EmbeddedDoc` remains unchanged (primary key integrity preserved)

---

**Given** a document with `AccountID = 98765` is converted from HTML to PDF
**When** the conversion completes
**Then** the `AccountID` field in `dbo.EmbeddedDoc` remains unchanged (loan association preserved)

---

**Given** a document with `Status = 'Approved'` is converted from HTML to PDF
**When** the conversion completes
**Then** the `Status` field in `dbo.EmbeddedDoc` remains 'Approved' (approval status preserved)

---

**Given** a document with `Category = 'AUS'` is converted from HTML to PDF
**When** the conversion completes
**Then** the `Category` field in `dbo.EmbeddedDoc` remains 'AUS' (category preserved)

---

**Given** a document with `Description = 'DU Findings - Casefile 1717489543'` is converted from HTML to PDF
**When** the conversion completes
**Then** the `Description` field in `dbo.EmbeddedDoc` remains unchanged (user-defined text preserved)

---

**Given** a document with `UploadedBy = 'john.doe@cmgfi.com'` and `UploadedOn = '2026-02-15 10:30:00'` is converted
**When** the conversion completes
**Then** both `UploadedBy` and `UploadedOn` fields remain unchanged (original uploader attribution preserved)

---

**Given** a document with `ApprovedBy = 'jane.smith@cmgfi.com'` and `ApprovedOn = '2026-03-01 14:22:00'` is converted
**When** the conversion completes
**Then** both `ApprovedBy` and `ApprovedOn` fields remain unchanged (approver attribution preserved)

---

**Given** a document with `StackingOrderPosition = 5` is converted from HTML to PDF
**When** the conversion completes
**Then** the `StackingOrderPosition` field remains 5 (bundle sequence preserved)

---

**Given** a document with `MimeType = 'text/html'` is converted to PDF
**When** the conversion completes
**Then** the `MimeType` field is updated to 'application/pdf'

---

**Given** a document with `FileName = 'DU_Findings_1717489543.html'` is converted to PDF
**When** the conversion completes
**Then** the `FileName` field is updated to 'DU_Findings_1717489543.pdf' (extension changed)

---

**Given** a document with `FileData` containing HTML binary content is converted
**When** the conversion completes
**Then** the `FileData` field is replaced with converted PDF binary content

---

**Given** a document with `FileSize = 45000` bytes (HTML) is converted to PDF resulting in 128000 bytes
**When** the conversion completes
**Then** the `FileSize` field is updated to 128000 bytes

---

**Given** a document is converted via automatic conversion
**When** the conversion completes
**Then** the `LastModifiedBy` field is set to 'SYSTEM_AUTO_CONVERSION'

---

**Given** a document is converted at timestamp '2026-03-04 14:32:15'
**When** the conversion completes
**Then** the `LastModifiedOn` field is set to '2026-03-04 14:32:15'

---

**Given** metadata update transaction fails during conversion
**When** the failure is detected
**Then** the system performs full transaction rollback and logs critical error (no partial updates allowed)

---

**Given** archive operation to `dbo.EmbeddedDoc_Archive` fails
**When** the failure is detected
**Then** the system aborts conversion and alerts DBA team (original HTML must be preserved)

---

**Given** foreign key relationships exist to `dbo.EmbeddedDoc.GUID`
**When** a document is converted
**Then** all foreign key references remain valid (GUID unchanged)

---

### AC-6: Conversion Audit Logging (FR6)

**Given** a document is converted successfully via Trigger 1
**When** the conversion completes
**Then** a log entry is inserted into `dbo.DocumentConversionLog` with:
- `TriggerType = 'StatusChange'`
- `ConversionStatus = 'Success'`
- `ConversionDuration` = actual milliseconds taken
- `ConvertedOn` = timestamp
- `ConvertedBy = 'SYSTEM_AUTO_CONVERSION'`

---

**Given** a document conversion fails on 1st attempt
**When** the failure occurs
**Then** a log entry is inserted with:
- `ConversionStatus = 'Retry'`
- `RetryCount = 1`
- `ErrorMessage` = failure details
- `ErrorCode` = error code from Doc Converter

---

**Given** a document conversion fails on 3rd attempt (final retry)
**When** the final failure occurs
**Then** a log entry is inserted with:
- `ConversionStatus = 'Failed'`
- `RetryCount = 3`
- `ErrorMessage` = failure details

---

**Given** a document is converted via Trigger 2 (Bundle API)
**When** the conversion completes
**Then** a log entry is inserted with `TriggerType = 'BundleAPI'`

---

**Given** a document conversion processes successfully
**When** the log entry is created
**Then** the log includes performance metrics:
- `OriginalFileSize` (bytes)
- `ConvertedFileSize` (bytes)
- `ConversionDuration` (milliseconds)
- `DocConverterVersion` (version number)

---

**Given** log write operation fails during conversion
**When** the failure is detected
**Then** the system does NOT abort conversion (conversion takes priority) and queues log write for retry

---

**Given** log table write failures exceed 5% threshold over 1-hour window
**When** monitoring system detects breach
**Then** an alert is sent to DBA team

---

**Given** conversion success rate drops below 99.5% over 1-hour window
**When** monitoring system calculates metrics from `dbo.DocumentConversionLog`
**Then** an alert is sent to engineering team

---

**Given** average conversion duration exceeds 10 seconds over 1-hour window
**When** monitoring system calculates metrics from `dbo.DocumentConversionLog`
**Then** an alert is sent to engineering team

---

**Given** Trigger 2 activations exceed 10% of total conversions over 24-hour period
**When** monitoring system queries `dbo.DocumentConversionLog` grouped by `TriggerType`
**Then** an alert is sent to engineering team (indicates Trigger 1 failures)

---

**Given** log records older than 7 years exist in `dbo.DocumentConversionLog`
**When** monthly cleanup job executes
**Then** the system archives old records to Azure Blob Storage (cold storage) and removes them from active table

---

**Given** a support user queries `dbo.DocumentConversionLog` for specific `DocumentGUID`
**When** the query executes
**Then** query response time is <100ms (index on DocumentGUID)

---

**Given** an admin user views Document Details modal for a converted document
**When** the modal loads
**Then** conversion history is displayed from `dbo.DocumentConversionLog` showing:
- Conversion timestamp
- Trigger type
- Duration
- Original/converted file sizes
- Status

---

**Given** daily monitoring report runs at 8:00 AM
**When** the report executes
**Then** the report includes:
- Total conversions (last 24 hours)
- Success rate percentage
- Average conversion duration
- Failure breakdown by error type
- Trigger 2 activation count

---

### AC-7: Performance & Non-Functional Requirements

**NFR-1: Conversion Performance**

**Given** an HTML document of average size (50KB) is queued for conversion
**When** Doc Converter tool processes the document
**Then** conversion completes in <5 seconds (target: 3-4 seconds average)

---

**NFR-2: System Availability**

**Given** the HTML→PDF conversion feature is deployed to production
**When** measured over a 30-day period
**Then** system uptime is ≥99.9% (maximum 43 minutes downtime per month)

---

**NFR-3: Conversion Success Rate**

**Given** the HTML→PDF conversion feature processes 1,000 documents
**When** measured over a 7-day period
**Then** conversion success rate is ≥99.5% (maximum 5 failures per 1,000 conversions)

---

**NFR-4: Bundle API Performance Impact**

**Given** Trigger 2 pre-processing executes for bundle with 0 HTML documents
**When** Bundle API response time is measured
**Then** pre-processing adds <100ms overhead to Bundle API response time

---

**Given** Trigger 2 pre-processing executes for bundle with 1 HTML document
**When** Bundle API response time is measured
**Then** total response time (including conversion) is <10 seconds

---

**NFR-5: Scalability**

**Given** conversion queue receives 100 documents simultaneously
**When** queue processing begins
**Then** throughput is ≥100 documents per minute (average 1 document/600ms)

---

**Given** system processes 10,000 conversions per day
**When** measured over a 30-day period
**Then** average conversion duration remains <5 seconds (no performance degradation)

---

---End of Section---

---

## Performance & Non-Functional Requirements Summary

**NFR-1: Conversion Performance**
- Target: <5 seconds per HTML→PDF conversion (average: 3-4 seconds)
- Measured: 95th percentile conversion time
- Alert Threshold: Average >10 seconds over 1-hour window

**NFR-2: System Availability**
- Target: ≥99.9% uptime (maximum 43 minutes downtime per month)
- Measured: Monthly uptime percentage
- Includes: Doc Converter tool, conversion queue, database availability

**NFR-3: Conversion Success Rate**
- Target: ≥99.5% success rate
- Measured: (Successful Conversions / Total Attempts) * 100
- Alert Threshold: Success rate <99.5% over 1-hour window

**NFR-4: Bundle API Performance Impact**
- Target: Trigger 2 pre-processing adds <100ms overhead for bundles with zero HTML docs
- Target: Total Bundle API response time <10 seconds for bundles requiring conversion
- Measured: Bundle API response time before/after Trigger 2 implementation

**NFR-5: Scalability**
- Target: ≥100 documents/minute throughput
- Target: Support 10,000+ conversions per day without performance degradation
- Measured: Queue processing throughput, average conversion duration over time

---

## Document Revision History

| Version | Date       | Author    | Changes                                      |
|---------|------------|-----------|----------------------------------------------|
| 1.0     | 2026-03-04 | [TBD]     | Initial BRD creation                         |

---

**End of Document**
