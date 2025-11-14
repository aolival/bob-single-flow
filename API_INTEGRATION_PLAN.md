# EPS API Integration Plan
## CMG Document Servicing API

---

## ✅ API Configuration (COMPLETE)

### Base URL
```
https://qa.servicing-api.cmgtest.com/docs
```

### Authentication
- **Method:** API Key in Header
- **Header Name:** `Ocp-Apim-Subscription-Key`
- **API Key:** `dd87e724615b4d6988c58fe5b771876a`

---

## 📋 Available Endpoints

### 1. Get All Documents for a Loan
**Endpoint:** `GET /api/v1/documents?AccountId={accountId}`

**Purpose:** Retrieve all documents associated with a loan (AccountId = Loan Number)

**Request:**
```bash
GET https://qa.servicing-api.cmgtest.com/docs/api/v1/documents?AccountId=123456
Headers:
  Ocp-Apim-Subscription-Key: dd87e724615b4d6988c58fe5b771876a
  Accept: text/plain
```

**Response:**
```json
{
  "documents": [
    {
      "guid": "<uuid>",
      "accountId": "<long>",
      "name": "<string>",
      "documentTypeGUID": "<uuid>",
      "sourceApplicationGUID": "<uuid>",
      "vendorGUID": "<uuid>",
      "createdBy": "<uuid>",
      "createdOn": "<dateTime>",
      "modifiedBy": "<uuid>",
      "modifiedOn": "<dateTime>",
      "fileVersions": [
        {
          "guid": "<uuid>",
          "path": "<string>",
          "mimeType": "<string>",
          "createdOn": "<dateTime>"
        }
      ]
    }
  ]
}
```

**Optional Query Parameters:**
- `DocumentTypes` (uuid) - Filter by document type
- `VendorGUID` (uuid) - Filter by vendor
- `SourceApplicationGUID` (uuid) - Filter by source app
- `StartDate` / `EndDate` (dateTime) - Date range filter

---

### 2. Get Single Document by GUID
**Endpoint:** `GET /api/v1/documents/{id}`

**Purpose:** Get metadata for a specific document

**Request:**
```bash
GET https://qa.servicing-api.cmgtest.com/docs/api/v1/documents/{documentGuid}
Headers:
  Ocp-Apim-Subscription-Key: dd87e724615b4d6988c58fe5b771876a
```

---

### 3. Download Document File
**Endpoint:** `GET /api/v1/documents/{id}/download`

**Purpose:** Download the actual document file (PDF, etc.)

**Request:**
```bash
GET https://qa.servicing-api.cmgtest.com/docs/api/v1/documents/{documentGuid}/download
Headers:
  Ocp-Apim-Subscription-Key: dd87e724615b4d6988c58fe5b771876a
```

**Response:**
```json
{
  "fileContent": "<base64-string>",
  "fileName": "<string>",
  "mimeType": "<string>"
}
```

---

### 4. Get Multiple Documents (Bulk)
**Endpoint:** `GET /api/v1/documents/bulk?AccountId={accountId}&DocumentGuids={guid1}&DocumentGuids={guid2}`

**Purpose:** Get multiple specific documents at once

---

### 5. Upload New Document
**Endpoint:** `POST /api/v1/documents`

**Purpose:** Upload a new document to a loan

**Body (multipart/form-data):**
- `AccountId` (required)
- `Name` (required)
- `DocumentTypeGUID` (required)
- `SourceApplicationGUID` (required)
- `VendorGUID`
- `File` (required)

---

### 6. Merge Documents
**Endpoint:** `POST /api/v1/documents/merge`

**Purpose:** Merge multiple documents into one PDF

**Request Body:**
```json
{
  "accountId": 123456,
  "documentGuids": [
    "uuid1",
    "uuid2"
  ]
}
```

---

## 🔄 Integration Mapping

### For BoBSingleFlow.jsx

Replace `generateStackingOrder()` function (line 71-89) with:

1. **Call:** `GET /api/v1/documents?AccountId={loanNumber}`
2. **Map Response:**
   - Each document from API → Display in stacking order table
   - `documentTypeGUID` → Map to `documentType` field
   - `name` → Document name
   - Check if document exists → Status: "Found" or "Missing"

### For BoBBundleManager.jsx

Replace `handleRunSummary()` function (line 148-257) with:

1. **For each loan in list:**
   - Call: `GET /api/v1/documents?AccountId={loanNumber}`
   - Count documents returned
   - Calculate missing vs found based on required bundle documents

---

## ⚠️ Important Notes

1. **AccountId = Loan Number** - The API uses `AccountId` parameter which corresponds to loan numbers in your system

2. **Document Type Mapping** - We need to map:
   - API's `documentTypeGUID` → Your bundle's required document types
   - This mapping likely exists in your `dbo.Bundle` / `dbo.DocumentType` tables

3. **Missing Documents** - The API only returns documents that EXIST. To determine "missing" documents:
   - Get bundle's stacking order (required docs)
   - Call API to get existing docs for loan
   - Compare: Required docs - Existing docs = Missing docs

4. **Rate Limiting** - For bulk operations, be mindful of API rate limits

---

## 🎯 Next Steps

### Step 1: Find Test Loan Number
- Need to find a valid `AccountId` (loan number) in the QA environment that has documents
- Test the API in Postman first to verify it works

### Step 2: Create API Service File
- Create `src/services/epsDocumentApi.js`
- Implement wrapper functions for the endpoints
- Handle authentication, error handling, response parsing

### Step 3: Integrate into Components
- Replace mock data in `BoBSingleFlow.jsx`
- Replace mock data in `BoBBundleManager.jsx`
- Add loading states, error handling

### Step 4: Test with Real Data
- Verify document retrieval works
- Verify status calculation (Found/Missing) works
- Test with multiple loans
