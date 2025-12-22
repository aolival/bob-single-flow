# User Story 10: Document Notifications & Real-Time Updates

**Feature:** BoB - Stored Docs Integration (Phase 3)
**Feature ID:** 84459
**Epic:** Builder of Bundles (BoB) - #72742
**Story Points:** 8
**Priority:** Should Have
**Sprint:** Phase 3D - Sprint 8

---

## User Story

**As a** bundle creator
**I want to** receive notifications when documents are uploaded or modified
**So that** I know when new documents are available for my bundle

---

## Acceptance Criteria

### Toast Notifications
- [ ] Real-time toast notifications for:
  - New document uploaded
  - Document status changed (Draft → Final)
  - Document properties updated
  - Document deleted/archived
  - Document merged successfully
  - Multiple users working on same loan
- [ ] Toast appears in top-right corner
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Toast can be manually dismissed with X button
- [ ] Toast shows:
  - Icon (based on notification type)
  - Title (e.g., "New Document Available")
  - Message (e.g., "Appraisal_Report.pdf was uploaded")
  - Timestamp (e.g., "Just now", "2 minutes ago")
  - Action buttons (optional): "View", "Dismiss"

### New Document Indicators
- [ ] Visual badge/indicator for new documents since last view:
  - "NEW" badge on document card
  - Blue dot indicator
  - Highlight row with subtle background color
- [ ] "New documents available" banner when updates detected
- [ ] Banner shows count: "3 new documents since your last visit"
- [ ] Banner action: "View New Documents" (filters to new only)

### Notification Center
- [ ] Bell icon in header with notification count badge
- [ ] Click bell opens notification center dropdown
- [ ] Notification center shows:
  - Recent document activity (last 50 notifications)
  - Grouped by type: "Today", "Yesterday", "This Week"
  - Each notification shows:
    - Icon
    - Title
    - Timestamp
    - Document name (clickable)
    - User who made change
- [ ] "Mark All as Read" button
- [ ] "Clear All" button
- [ ] Individual notification dismiss (X button)
- [ ] Unread notifications bold/highlighted

### Auto-Refresh
- [ ] Document library auto-refreshes when notification received
- [ ] Smooth fade-in animation for new documents
- [ ] Preserve user's scroll position during refresh
- [ ] Preserve user's selection during refresh
- [ ] Show "Refreshing..." indicator briefly

### Notification Sound (Optional)
- [ ] Optional sound on new notification
- [ ] User setting to enable/disable sound
- [ ] Volume control
- [ ] Different sounds for different notification types

### Notification Preferences
- [ ] Settings panel for notification preferences:
  - Enable/disable notifications by type
  - Sound on/off
  - Auto-refresh on/off
  - Notification frequency (real-time vs. batched)
  - Quiet hours (no notifications)

---

## Technical Notes

### Component Structure
```jsx
<NotificationProvider>
  <NotificationBell
    unreadCount={unreadNotifications.length}
    onClick={toggleNotificationCenter}
  />

  <NotificationCenter
    isOpen={showNotificationCenter}
    notifications={notifications}
    onMarkAsRead={handleMarkAsRead}
    onClearAll={handleClearAll}
    onClose={handleCloseNotificationCenter}
  />

  <ToastContainer>
    {toasts.map(toast => (
      <Toast
        key={toast.id}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onDismiss={() => dismissToast(toast.id)}
      />
    ))}
  </ToastContainer>
</NotificationProvider>
```

### Real-Time Connection Options

#### Option 1: SignalR (Preferred)
```javascript
import * as signalR from '@microsoft/signalr';

const setupSignalRConnection = () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${EPS_BASE_URL}/documentHub`, {
      accessTokenFactory: () => getAuthToken()
    })
    .withAutomaticReconnect()
    .build();

  connection.on('DocumentUploaded', (notification) => {
    handleDocumentNotification('upload', notification);
  });

  connection.on('DocumentStatusChanged', (notification) => {
    handleDocumentNotification('statusChange', notification);
  });

  connection.on('DocumentDeleted', (notification) => {
    handleDocumentNotification('delete', notification);
  });

  connection.start().catch(err => console.error('SignalR Error:', err));

  return connection;
};
```

#### Option 2: Polling Fallback
```javascript
const setupPolling = () => {
  const pollInterval = 30000; // 30 seconds

  const pollForUpdates = async () => {
    try {
      const lastCheck = localStorage.getItem('lastDocumentCheck');
      const updates = await fetchDocumentUpdates(lastCheck);

      if (updates.length > 0) {
        updates.forEach(update => {
          handleDocumentNotification(update.type, update.data);
        });

        localStorage.setItem('lastDocumentCheck', new Date().toISOString());
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Initial poll
  pollForUpdates();

  // Set up interval
  const intervalId = setInterval(pollForUpdates, pollInterval);

  return () => clearInterval(intervalId);
};
```

### Notification State Management
```javascript
const [notificationState, setNotificationState] = useState({
  notifications: [],
  unreadCount: 0,
  toasts: [],
  lastCheck: null,
  preferences: {
    enabled: true,
    soundEnabled: false,
    autoRefresh: true,
    notificationTypes: {
      upload: true,
      statusChange: true,
      propertiesUpdate: true,
      delete: true,
      merge: true
    }
  }
});

const handleDocumentNotification = (type, data) => {
  // Check if this notification type is enabled
  if (!notificationState.preferences.notificationTypes[type]) {
    return;
  }

  // Create notification object
  const notification = {
    id: generateId(),
    type,
    title: getNotificationTitle(type),
    message: getNotificationMessage(type, data),
    timestamp: new Date(),
    read: false,
    documentGuid: data.documentGuid,
    documentName: data.documentName,
    user: data.user
  };

  // Add to notification list
  setNotificationState(prev => ({
    ...prev,
    notifications: [notification, ...prev.notifications],
    unreadCount: prev.unreadCount + 1
  }));

  // Show toast
  showToast(notification);

  // Play sound if enabled
  if (notificationState.preferences.soundEnabled) {
    playNotificationSound(type);
  }

  // Auto-refresh library if enabled
  if (notificationState.preferences.autoRefresh) {
    refreshDocumentLibrary();
  }
};
```

### Toast Management
```javascript
const showToast = (notification) => {
  const toast = {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    timestamp: notification.timestamp
  };

  setNotificationState(prev => ({
    ...prev,
    toasts: [...prev.toasts, toast]
  }));

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    dismissToast(toast.id);
  }, 5000);
};

const dismissToast = (toastId) => {
  setNotificationState(prev => ({
    ...prev,
    toasts: prev.toasts.filter(t => t.id !== toastId)
  }));
};
```

### Reference Implementations
- **Feature 51114** (Process Background Service Loan/Document Notifications): Notification infrastructure
- **Feature 49748** (Email Processing and Notifications): Notification patterns
- SignalR for real-time communication

---

## Dependencies

### Blockers
- **US001** (Document Library Panel): Provides documents to notify about

### Related Stories
- **US003** (Document Upload): Upload notifications
- **US008** (Document Status): Status change notifications

### Technical Dependencies
- `@microsoft/signalr`: `npm install @microsoft/signalr`
- `react-hot-toast` or `react-toastify`: `npm install react-hot-toast`
- SignalR hub endpoint on EPS API backend

---

## Definition of Done

- [ ] SignalR connection established (or polling fallback)
- [ ] Toast notifications displaying for all event types
- [ ] Notification center implemented
- [ ] New document indicators working
- [ ] Auto-refresh functionality
- [ ] Notification preferences panel
- [ ] Optional sound effects
- [ ] Unit tests for notification logic
- [ ] Integration test with mock SignalR events
- [ ] Code review approved
- [ ] QA tested real-time scenarios
- [ ] Product owner accepts story

---

## Testing Scenarios

### Happy Path - Real-Time Notification
1. User A has document library open for Loan 12345
2. User B uploads new document to Loan 12345
3. User A receives toast notification: "New Document Available"
4. Toast shows: "Appraisal_Report.pdf was uploaded by john.smith@cmgfi.com"
5. Document library auto-refreshes
6. New document appears with "NEW" badge
7. Bell icon shows notification count badge: 1
8. User A clicks bell icon
9. Notification center opens showing the upload notification
10. User A clicks on notification
11. Document preview opens

### Happy Path - Batch Notifications
1. Multiple documents uploaded in quick succession
2. Toasts appear stacked (max 3 visible)
3. Older toasts auto-dismiss as new ones arrive
4. All notifications recorded in notification center
5. Banner shows: "5 new documents since your last visit"

### Error Scenarios
1. **SignalR Connection Lost**: Fall back to polling
2. **Polling API Failure**: Show offline indicator, retry with exponential backoff
3. **Invalid Notification Data**: Log error, don't crash, skip notification

### Edge Cases
1. **Rapid Notifications (10+ per second)**: Throttle, batch into single notification
2. **User Triggered Update**: Don't show notification for own actions
3. **Browser Tab Inactive**: Queue notifications, show all when tab active
4. **Page Reload**: Preserve unread notification count in localStorage

---

## Design Mockup

```
Toast Notification (Top-Right):
┌─────────────────────────────────────────┐
│ ✓ New Document Available         [✕]   │
│ Appraisal_Report.pdf was uploaded      │
│ by jane.doe@cmgfi.com                  │
│ Just now                    [View]     │
└─────────────────────────────────────────┘

Notification Bell:
┌──────┐
│ 🔔 5  │ ← Unread count badge
└──────┘

Notification Center Dropdown:
┌─────────────────────────────────────────────────────────────┐
│ Notifications                    [Mark All Read] [Clear All]│
│ ─────────────────────────────────────────────────────────── │
│ Today                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📤 Appraisal_Report.pdf uploaded           [✕]          │ │
│ │ by jane.doe@cmgfi.com  •  Just now                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✓ 1003_Mortgage_Application.pdf marked as Final [✕]    │ │
│ │ by john.smith@cmgfi.com  •  5 minutes ago               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Yesterday                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔄 Title_Insurance.pdf properties updated     [✕]       │ │
│ │ by jane.doe@cmgfi.com  •  Yesterday at 3:42 PM          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [View All Notifications]                                    │
└─────────────────────────────────────────────────────────────┘

New Documents Banner:
┌─────────────────────────────────────────────────────────────┐
│ ℹ 3 new documents since your last visit  [View New] [✕]    │
└─────────────────────────────────────────────────────────────┘

Document Card with NEW Badge:
┌──────────────────────────────────────────────────────────┐
│ ☐ 📄 Appraisal_Report.pdf  [🟢 Final]  [NEW]  👁 ⬇      │
│    Uploaded: Dec 15, 2024 | 42 pages | 8.5 MB           │
└──────────────────────────────────────────────────────────┘

Notification Preferences:
┌─────────────────────────────────────────────────────────────┐
│ Notification Settings                                [✕]    │
│                                                              │
│ ☑ Enable notifications                                     │
│                                                              │
│ Notification Types:                                         │
│ ☑ New document uploads                                     │
│ ☑ Document status changes                                  │
│ ☑ Document properties updates                              │
│ ☑ Document deletions                                       │
│ ☑ Document merge completions                               │
│                                                              │
│ ☐ Enable notification sound                               │
│ ☑ Auto-refresh document library                           │
│                                                              │
│ Refresh Frequency:                                          │
│ ( ) Real-time (recommended)                                │
│ ( ) Every 30 seconds                                       │
│ (•) Every minute                                           │
│                                                              │
│                               [Cancel]  [Save Settings]     │
└─────────────────────────────────────────────────────────────┘
```

---

## SignalR Hub Events

### Server-Side Events (Subscribed)
```csharp
// Backend EPS API SignalR Hub
public class DocumentHub : Hub
{
    public async Task NotifyDocumentUploaded(string loanNumber, DocumentNotification notification)
    {
        await Clients.Group(loanNumber).SendAsync("DocumentUploaded", notification);
    }

    public async Task NotifyDocumentStatusChanged(string loanNumber, DocumentNotification notification)
    {
        await Clients.Group(loanNumber).SendAsync("DocumentStatusChanged", notification);
    }

    public async Task NotifyDocumentDeleted(string loanNumber, DocumentNotification notification)
    {
        await Clients.Group(loanNumber).SendAsync("DocumentDeleted", notification);
    }
}
```

### Client-Side Event Handlers
```javascript
connection.on('DocumentUploaded', (notification) => {
  showToast({
    type: 'success',
    title: 'New Document Available',
    message: `${notification.documentName} was uploaded by ${notification.user}`
  });
});

connection.on('DocumentStatusChanged', (notification) => {
  showToast({
    type: 'info',
    title: 'Document Status Updated',
    message: `${notification.documentName} is now ${notification.newStatus}`
  });
});
```

---

## Performance Considerations

### Throttling
```javascript
// Throttle rapid notifications
const throttledNotification = throttle((notification) => {
  showToast(notification);
}, 1000); // Max 1 notification per second
```

### Batching
```javascript
// Batch multiple notifications
let notificationBatch = [];
const batchTimeout = setTimeout(() => {
  if (notificationBatch.length > 3) {
    showToast({
      type: 'info',
      title: 'Multiple Updates',
      message: `${notificationBatch.length} documents were updated`
    });
  } else {
    notificationBatch.forEach(n => showToast(n));
  }
  notificationBatch = [];
}, 2000);
```

---

## Notes
- Consider email digest of notifications (daily/weekly summary)
- Add in-app notification sound customization
- Implement notification categories/tags for advanced filtering
- Add notification action buttons: "Add to Bundle", "Preview", "Ignore"
