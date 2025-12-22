# Backend Requirements Document (BRD)
## Single Flow BoB MVP - BytePro Integration

**Document Version:** 1.0
**Date:** December 11, 2025
**Status:** Draft
**Owner:** Backend Development Team

---

## Executive Summary

This document outlines the backend integration requirements for the Single Flow BoB (Bundle of Bundles) MVP. The objective is to replace the current dummy data implementation in the QA environment with live data from BytePro database endpoints, routed through the Enterprise Proxy Service (EPS).

### Scope
- **In Scope:** Integration of BytePro API endpoints to replace dummy data in Single Flow BoB UI
- **In Scope:** EPS routing configuration for API calls
- **In Scope:** Data mapping and transformation layer
- **Out of Scope:** UI/UX changes (existing UI remains unchanged)
- **Out of Scope:** New business logic or workflow modifications

---

## Current State vs. Future State

### Current State
- Single Flow BoB UI deployed in QA environment
- Frontend consuming hardcoded/dummy data
- No backend API integration
- All business logic contained in frontend with mock data

### Future State (MVP)
- Single Flow BoB UI connected to BytePro database via API
- API calls routed through EPS following existing BytePro patterns
- Real-time data retrieval from BytePro
- Frontend consumes live data from backend endpoints
- Seamless integration with existing BytePro infrastructure

---

## Data Requirements

### Core Data Entities

The Single Flow BoB MVP requires access to the following BytePro data entities:

#### 1. Bundle Master Data
- **Bundle ID** (Primary Key)
- **Bundle Name** (derived from stacking order algorithm)
- **Bundle Status** (Active, Pending, Completed, Cancelled)
- **Created Date/Time**
- **Created By User**
- **Last Modified Date/Time**
- **Last Modified By User**
- **Bundle Type/Category**
- **Priority Level**

#### 2. Stacking Order Configuration
- **Stacking Order ID**
- **Order Sequence**
- **Loan Identifiers** (Loan Numbers in order)
- **Stacking Rules Applied**
- **Bundle Name Generation Logic**
- **Validation Status**

#### 3. Loan Data
- **Loan Number** (Primary Key)
- **Borrower Name(s)**
- **Property Address**
- **Loan Amount**
- **Loan Type**
- **Current Status**
- **Closing Date**
- **Loan Officer**
- **Bundle Assignment** (Foreign Key to Bundle)
- **Position in Stacking Order**

#### 4. Document Metadata
- **Document ID**
- **Document Type**
- **Document Name**
- **Associated Loan Number** (Foreign Key)
- **Upload Date/Time**
- **Document Status** (Complete, Incomplete, Under Review)
- **File Path/Storage Location**
- **Page Count**
- **Checksum/Validation Hash**

#### 5. Workflow & Status Tracking
- **Workflow ID**
- **Bundle ID** (Foreign Key)
- **Current Workflow Stage**
- **Stage Start Date/Time**
- **Stage Completion Date/Time**
- **Assigned User/Team**
- **Status Notes/Comments**
- **Workflow History** (audit trail)

#### 6. User & Assignment Data
- **User ID**
- **User Name**
- **Role/Permissions**
- **Active Bundle Assignments**
- **Work Queue Items**
- **Last Activity Timestamp**

---

## API Integration Requirements

### BytePro API Endpoints

The following API endpoints need to be exposed by BytePro and made accessible through EPS:

#### Bundle Operations
```
GET    /api/v1/bundles                    # List all bundles (with filters)
GET    /api/v1/bundles/{bundleId}         # Get bundle details
POST   /api/v1/bundles                    # Create new bundle
PUT    /api/v1/bundles/{bundleId}         # Update bundle
DELETE /api/v1/bundles/{bundleId}         # Delete/archive bundle
GET    /api/v1/bundles/{bundleId}/loans   # Get loans in bundle
```

#### Stacking Order Operations
```
GET    /api/v1/stacking-order/{bundleId}          # Get stacking order for bundle
POST   /api/v1/stacking-order                     # Create/update stacking order
PUT    /api/v1/stacking-order/{bundleId}          # Modify stacking order
POST   /api/v1/stacking-order/generate-name       # Generate bundle name from order
```

#### Loan Operations
```
GET    /api/v1/loans                      # List loans (with filters)
GET    /api/v1/loans/{loanNumber}         # Get loan details
PUT    /api/v1/loans/{loanNumber}         # Update loan data
GET    /api/v1/loans/{loanNumber}/documents # Get documents for loan
```

#### Document Operations
```
GET    /api/v1/documents/{documentId}            # Get document metadata
GET    /api/v1/documents/{documentId}/download   # Download document
POST   /api/v1/documents                         # Upload new document
PUT    /api/v1/documents/{documentId}            # Update document metadata
DELETE /api/v1/documents/{documentId}            # Delete document
```

#### Workflow Operations
```
GET    /api/v1/workflows/{bundleId}              # Get workflow status
POST   /api/v1/workflows/{bundleId}/advance      # Move to next stage
POST   /api/v1/workflows/{bundleId}/assign       # Assign to user/team
GET    /api/v1/workflows/history/{bundleId}      # Get workflow history
```

#### User Operations
```
GET    /api/v1/users/current                     # Get current user info
GET    /api/v1/users/{userId}/assignments        # Get user's assignments
GET    /api/v1/users/{userId}/work-queue         # Get user's work queue
```

### API Request/Response Format

#### Standard Request Headers
```
Content-Type: application/json
Accept: application/json
Authorization: [To be determined by dev team - follow existing BytePro EPS patterns]
X-Correlation-ID: [Generated UUID for request tracing]
X-Client-App: SingleFlowBoB
```

#### Standard Response Structure
```json
{
  "success": true,
  "timestamp": "2025-12-11T10:30:00Z",
  "data": { ... },
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalRecords": 150,
    "totalPages": 3
  },
  "errors": [],
  "warnings": []
}
```

#### Error Response Structure
```json
{
  "success": false,
  "timestamp": "2025-12-11T10:30:00Z",
  "errors": [
    {
      "code": "ERR_001",
      "message": "Bundle not found",
      "field": "bundleId",
      "severity": "ERROR"
    }
  ]
}
```

---

## EPS Integration Requirements

### Routing Configuration

All API calls from Single Flow BoB frontend must be routed through EPS following existing BytePro patterns.

#### EPS Endpoint Pattern
```
Frontend → EPS → BytePro API

Example:
https://eps.company.com/bytepro/api/v1/bundles/{bundleId}
                      └─────┬─────┘
                      Routes to BytePro
```

#### Requirements
1. **Consistency:** EPS routing must follow the same patterns as existing BytePro API integrations
2. **Path Preservation:** API path structure should be preserved through EPS (e.g., `/api/v1/bundles` remains consistent)
3. **Header Management:** EPS should handle authentication headers, rate limiting, and request enrichment
4. **Load Balancing:** EPS should distribute requests across available BytePro API instances
5. **Circuit Breaker:** EPS should implement circuit breaker pattern for fault tolerance

### Authentication & Authorization

**Requirement:** Single Flow BoB backend integration must follow existing BytePro EPS authentication patterns.

**Action Required:** Development team to implement authentication consistent with current BytePro EPS implementations. This may include:
- Token-based authentication (OAuth 2.0, JWT)
- API keys for service-to-service communication
- Session management
- Role-based access control (RBAC)

**Note:** Specific authentication mechanism will be determined by development team based on existing BytePro infrastructure standards.

---

## Data Mapping & Transformation

### Frontend-Backend Contract

The backend API layer must provide data in the format expected by the existing Single Flow BoB UI.

#### Current Dummy Data Structure
The development team should:
1. Document the current dummy data structure used in the UI
2. Map BytePro API responses to match this structure
3. Implement transformation layer if BytePro data format differs from UI expectations

#### Transformation Requirements
- **Date/Time Formatting:** Ensure consistent date/time format (ISO 8601 recommended)
- **Null Handling:** Define behavior for null/missing values
- **Enumeration Mapping:** Map BytePro status codes to UI-expected values
- **Data Enrichment:** Combine multiple API calls if needed to build complete UI objects

---

## Non-Functional Requirements (MVP)

### Performance
- **Response Time Target:** < 2 seconds for standard data retrieval
- **Timeout:** 30 seconds maximum for API calls
- **Pagination:** Support for large data sets (50-100 records per page)

### Error Handling
- **Graceful Degradation:** UI should display user-friendly error messages
- **Retry Logic:** Implement retry for transient failures (3 attempts with exponential backoff)
- **Logging:** Log all API errors with correlation IDs for troubleshooting

### Data Consistency
- **Cache Strategy:** Define caching approach for frequently accessed data (if applicable)
- **Data Refresh:** Implement manual or automatic refresh mechanisms
- **Optimistic Updates:** Consider optimistic UI updates with rollback on failure

---

## Testing Requirements

### Unit Testing
- Test data transformation logic
- Test error handling and edge cases
- Test API client functions

### Integration Testing
- Test EPS routing end-to-end
- Verify authentication flow
- Validate data mapping accuracy
- Test error scenarios (timeouts, 404s, 500s)

### QA Environment Testing
- Smoke test all API endpoints through EPS
- Verify UI displays real data correctly
- Test with production-like data volumes
- Validate performance under load

---

## Deployment & Rollout

### Prerequisites
1. BytePro API endpoints deployed and accessible
2. EPS routing configured and tested
3. Authentication mechanism implemented and validated
4. Data transformation layer tested with real data

### Deployment Steps
1. Deploy backend API integration to QA environment
2. Update Single Flow BoB UI configuration to point to real endpoints
3. Perform smoke testing
4. Conduct UAT with business stakeholders
5. Deploy to production (after UAT sign-off)

### Rollback Plan
- Maintain ability to revert to dummy data if issues arise
- Document rollback procedure
- Define criteria for rollback decision

---

## Success Criteria

The MVP integration will be considered successful when:

1. ✅ All dummy data replaced with live BytePro data
2. ✅ API calls successfully routed through EPS
3. ✅ UI displays real-time data from BytePro
4. ✅ No degradation in UI performance or user experience
5. ✅ Authentication and authorization working as expected
6. ✅ Error handling provides clear user feedback
7. ✅ All QA test cases passing
8. ✅ UAT sign-off received from business stakeholders

---

## Open Questions & Decisions Needed

| Question | Owner | Target Date | Status |
|----------|-------|-------------|--------|
| Confirm BytePro API endpoint availability | Backend Team | TBD | Open |
| Define authentication mechanism details | Security/DevOps Team | TBD | Open |
| Determine caching strategy (if any) | Backend Team | TBD | Open |
| Identify EPS configuration owner | DevOps Team | TBD | Open |
| Define production deployment window | Release Management | TBD | Open |

---

## Appendix

### Glossary
- **BoB:** Bundle of Bundles - Tool for managing loan bundles
- **BytePro:** Core database and API platform
- **EPS:** Enterprise Proxy Service - Routing layer for API calls
- **MVP:** Minimum Viable Product
- **QA:** Quality Assurance environment

### References
- BytePro API Documentation: [Link to be added]
- EPS Configuration Guide: [Link to be added]
- Single Flow BoB UI Specification: [Link to be added]
- Existing BytePro Integration Examples: [Link to be added]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-11 | Initial Draft | Initial BRD creation for MVP integration |

---

**Approval Signatures**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Backend Tech Lead | | | |
| DevOps Lead | | | |
| QA Manager | | | |
