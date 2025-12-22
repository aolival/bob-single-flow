# User Story 9: Document Search & Filter

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 8
**Priority:** Must Have
**Sprint:** Phase 3A - Sprint 2

---

## User Story

**As a** bundle creator
**I want to** search and filter the document library
**So that** I can quickly find the documents I need

---

## Acceptance Criteria

### Search Functionality
- [ ] Search bar at top of document library
- [ ] Real-time search as user types (debounced 300ms)
- [ ] Search by:
  - Document name (partial match, case-insensitive)
  - Document type
  - Uploaded by (user name/email)
  - Date uploaded (natural language: "last week", "December 2024")
- [ ] Search highlights matching text in results
- [ ] "X" clear button appears when search active
- [ ] Search preserves other active filters

### Filter Panel
- [ ] Collapsible filter panel on left side or top
- [ ] "Filters" button shows/hides panel
- [ ] Active filter count badge: "Filters (3)"
- [ ] Filter categories:
  - **Document Type** (multi-select checkboxes)
    - Mortgage Application
    - Appraisal
    - Title Insurance
    - Homeowners Insurance
    - Purchase Agreement
    - Other
  - **Document Category** (multi-select)
    - LOS Docs
    - Post-Close
    - Servicing
  - **Status** (multi-select)
    - Draft
    - Final
    - Needs Review
  - **Date Range**
    - From date picker
    - To date picker
    - Quick options: Today, Last 7 days, Last 30 days, This Month
  - **Uploaded By** (multi-select dropdown)
    - Auto-populated from document metadata
  - **File Size**
    - Slider: 0 MB to max file size
    - Min/Max input fields

### Filter Actions
- [ ] "Apply Filters" button (if not auto-apply)
- [ ] "Clear All Filters" button
- [ ] Individual filter removal (X on each active filter chip)
- [ ] Filter persistence during session
- [ ] Filter state saved to localStorage

### Results Display
- [ ] Results count: "Showing 12 of 156 documents"
- [ ] Active filter chips above results:
  - "Type: Mortgage Application (x)"
  - "Status: Final (x)"
  - "Date: Last 7 days (x)"
- [ ] No results state with:
  - Clear messaging: "No documents found"
  - Suggestion: "Try adjusting your filters"
  - "Clear All Filters" button

### Performance
- [ ] Search and filter operations < 200ms for 500 documents
- [ ] Smooth scrolling with virtual list for large result sets
- [ ] No UI blocking during filter application

---

## Technical Notes

### Component Structure
```jsx
<DocumentLibrary>
  <DocumentSearchBar
    value={searchQuery}
    onChange={handleSearchChange}
    onClear={handleClearSearch}
  />

  <FilterPanel
    isOpen={showFilters}
    filters={activeFilters}
    onFilterChange={handleFilterChange}
    onClearFilters={handleClearAllFilters}
  >
    <FilterCategory name="Document Type" options={documentTypes} />
    <FilterCategory name="Status" options={statusOptions} />
    <DateRangeFilter onRangeChange={handleDateRangeChange} />
    <UserFilter users={uniqueUsers} onUserChange={handleUserFilter} />
    <FileSizeFilter onSizeChange={handleSizeFilter} />
  </FilterPanel>

  <ActiveFilterChips
    filters={activeFilters}
    onRemoveFilter={handleRemoveFilter}
  />

  <DocumentList
    documents={filteredDocuments}
    resultCount={filteredDocuments.length}
    totalCount={allDocuments.length}
  />
</DocumentLibrary>
```

### Search & Filter State
```javascript
const [searchFilterState, setSearchFilterState] = useState({
  searchQuery: '',
  activeFilters: {
    documentTypes: [],
    statuses: [],
    dateRange: { from: null, to: null },
    uploadedBy: [],
    fileSizeRange: { min: 0, max: Infinity }
  },
  filteredDocuments: [],
  showFilters: false
});
```

### Search Logic
```javascript
const searchDocuments = (documents, query) => {
  if (!query || query.trim() === '') {
    return documents;
  }

  const lowerQuery = query.toLowerCase();

  return documents.filter(doc => {
    // Search in document name
    if (doc.documentName.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in document type
    if (doc.documentType.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in uploaded by
    if (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Natural language date search
    if (matchesDateQuery(doc.uploadDate, query)) {
      return true;
    }

    return false;
  });
};

const matchesDateQuery = (uploadDate, query) => {
  const date = new Date(uploadDate);
  const now = new Date();

  const patterns = {
    'today': () => isSameDay(date, now),
    'yesterday': () => isSameDay(date, subDays(now, 1)),
    'last week': () => isWithinInterval(date, { start: subDays(now, 7), end: now }),
    'last month': () => isWithinInterval(date, { start: subMonths(now, 1), end: now }),
    'this month': () => isSameMonth(date, now)
  };

  for (const [pattern, check] of Object.entries(patterns)) {
    if (query.toLowerCase().includes(pattern) && check()) {
      return true;
    }
  }

  return false;
};
```

### Filter Logic
```javascript
const applyFilters = (documents, filters) => {
  let filtered = [...documents];

  // Filter by document types
  if (filters.documentTypes.length > 0) {
    filtered = filtered.filter(doc =>
      filters.documentTypes.includes(doc.documentType)
    );
  }

  // Filter by status
  if (filters.statuses.length > 0) {
    filtered = filtered.filter(doc =>
      filters.statuses.includes(doc.status)
    );
  }

  // Filter by date range
  if (filters.dateRange.from || filters.dateRange.to) {
    filtered = filtered.filter(doc => {
      const docDate = new Date(doc.uploadDate);
      const fromMatch = !filters.dateRange.from || docDate >= filters.dateRange.from;
      const toMatch = !filters.dateRange.to || docDate <= filters.dateRange.to;
      return fromMatch && toMatch;
    });
  }

  // Filter by uploaded by
  if (filters.uploadedBy.length > 0) {
    filtered = filtered.filter(doc =>
      filters.uploadedBy.includes(doc.uploadedBy)
    );
  }

  // Filter by file size
  filtered = filtered.filter(doc =>
    doc.fileSize >= filters.fileSizeRange.min &&
    doc.fileSize <= filters.fileSizeRange.max
  );

  return filtered;
};
```

### Combined Search & Filter
```javascript
const handleSearchAndFilter = useMemo(() => {
  // First apply search
  let results = searchDocuments(allDocuments, searchQuery);

  // Then apply filters
  results = applyFilters(results, activeFilters);

  return results;
}, [allDocuments, searchQuery, activeFilters]);
```

### Debounced Search
```javascript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (query) => {
    const results = searchDocuments(allDocuments, query);
    setSearchFilterState(prev => ({
      ...prev,
      filteredDocuments: results
    }));
  },
  300 // 300ms debounce
);

const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchFilterState(prev => ({ ...prev, searchQuery: query }));
  debouncedSearch(query);
};
```

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides document list to search/filter

### Related Stories
- **US008** (Document Status): Status filter integration

### Technical Dependencies
- `date-fns` for date operations: `npm install date-fns`
- `use-debounce` for search debouncing: `npm install use-debounce`

---

## Definition of Done

- [ ] Search bar with real-time results
- [ ] Filter panel with all categories
- [ ] Multi-select filters working
- [ ] Date range picker functional
- [ ] Active filter chips displaying
- [ ] Clear filters functionality
- [ ] No results state implemented
- [ ] Performance optimized for large datasets
- [ ] Unit tests for search/filter logic
- [ ] Integration test for combined search+filter
- [ ] Code review approved
- [ ] QA tested all filter combinations
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path - Search
1. User types "1003" in search bar
2. Results update in real-time
3. 3 documents match, showing "Showing 3 of 20 documents"
4. Matching text highlighted in document names
5. User clears search with X button
6. All 20 documents return

### Happy Path - Filters
1. User opens filter panel
2. User checks "Mortgage Application" type
3. User checks "Final" status
4. User clicks "Apply Filters" (if not auto-apply)
5. Results show 8 documents
6. Filter chips show: "Type: Mortgage (x)" "Status: Final (x)"
7. User clicks X on status chip
8. Results update to 12 documents (all Mortgage regardless of status)

### Combined Search + Filter
1. User searches "appraisal"
2. 5 documents found
3. User adds "Final" status filter
4. Results narrow to 3 documents
5. Both search and filter chips visible

### Error Scenarios
1. **No Results**: Show empty state with clear message
2. **Invalid Date Range**: Disable apply, show validation error
3. **All Filters Clear All**: Reset to showing all documents

### Edge Cases
1. **Search "last week" Natural Language**: Parse and filter by date
2. **Very Long Search Query (500 chars)**: Truncate, still search effectively
3. **500 Documents Filtered**: Performance remains smooth
4. **Rapidly Changing Filters**: Debounce, apply only final state

---

## Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Stored Documents - Loan 12345678                         │
│ ┌────────────────────────────────────┐ [Filters (2)] [Upload]│
│ │ 🔍 Search documents...         [×] │                      │
│ └────────────────────────────────────┘                      │
│                                                              │
│ Active Filters:                                             │
│ [Type: Mortgage Application (×)] [Status: Final (×)]        │
│ [Clear All]                                                 │
│                                                              │
│ Showing 8 of 20 documents                                   │
│ ─────────────────────────────────────────────────────────── │
│ ☐ 📄 1003_Mortgage_Application.pdf        [Final]  👁 ⬇    │
│    Uploaded: Dec 1, 2024 | 8 pages | 2.1 MB                │
│ ☐ 📄 1003_Uniform_Residential.pdf         [Final]  👁 ⬇    │
│    Uploaded: Dec 2, 2024 | 6 pages | 1.8 MB                │
└─────────────────────────────────────────────────────────────┘

Filter Panel (Expanded):
┌─────────────────────────────────────────────────────────────┐
│ Filters                                              [✕]    │
│                                                              │
│ ▼ Document Type                                             │
│ ☑ Mortgage Application (12)                                │
│ ☐ Appraisal (3)                                            │
│ ☐ Title Insurance (2)                                      │
│ ☐ Homeowners Insurance (1)                                 │
│ ☐ Purchase Agreement (2)                                   │
│                                                              │
│ ▼ Status                                                    │
│ ☐ Draft (5)                                                │
│ ☑ Final (12)                                               │
│ ☐ Needs Review (3)                                         │
│                                                              │
│ ▼ Date Uploaded                                            │
│ Quick: [Today] [Last 7 days] [Last 30 days] [This Month]   │
│ From: [Dec 1, 2024 ▼]  To: [Dec 31, 2024 ▼]               │
│                                                              │
│ ▼ Uploaded By                                               │
│ [Dropdown: Select users... ▼]                               │
│ ☑ jane.doe@cmgfi.com (8)                                   │
│ ☐ john.smith@cmgfi.com (12)                                │
│                                                              │
│ ▼ File Size                                                 │
│ [Slider: 0 MB ═══●═════ 10 MB]                             │
│ Min: [0] MB  Max: [10] MB                                  │
│                                                              │
│                        [Clear All]  [Apply Filters]         │
└─────────────────────────────────────────────────────────────┘

No Results State:
┌─────────────────────────────────────────────────────────────┐
│ 📄 Stored Documents                                         │
│ [🔍 appraisal report final 2023_____________] [Filters (3)] │
│                                                              │
│ Active Filters:                                             │
│ [Type: Title Insurance (×)] [Status: Draft (×)]            │
│ [Date: Last 7 days (×)] [Clear All]                        │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                       🔍                                 │ │
│ │                                                         │ │
│ │              No documents found                         │ │
│ │                                                         │ │
│ │     Try adjusting your search or filters                │ │
│ │                                                         │ │
│ │              [Clear All Filters]                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Virtual Scrolling
```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={filteredDocuments.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <DocumentCard
      key={filteredDocuments[index].documentGuid}
      document={filteredDocuments[index]}
      style={style}
    />
  )}
</FixedSizeList>
```

### Memoization
```javascript
const filteredDocuments = useMemo(() => {
  return applySearchAndFilter(allDocuments, searchQuery, activeFilters);
}, [allDocuments, searchQuery, activeFilters]);
```

### Index-Based Search (Future Enhancement)
```javascript
// Build search index on document load
const searchIndex = buildSearchIndex(allDocuments);

// Use index for faster searches
const results = searchIndex.search(query);
```

---

## Accessibility

- [ ] Keyboard navigation through filters
- [ ] Screen reader announces result count
- [ ] Focus management when opening/closing filter panel
- [ ] ARIA labels for all filter controls
- [ ] Clear visual focus indicators

---

## Notes
- Consider saved search presets (future enhancement)
- Add advanced search operators: AND, OR, NOT
- Implement search history dropdown
- Add search suggestions/autocomplete
