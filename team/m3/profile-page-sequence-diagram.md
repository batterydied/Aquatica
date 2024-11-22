sequenceDiagram

    participant User as User
    participant ProfilePage as Profile Page
    participant ProfileService as Profile Service
    participant IndexedDB as IndexedDB
    
    User->>ProfilePage: Click "Edit" on Name
    ProfilePage->>User: Display input field and "Save" button
    User->>ProfilePage: Enter new name and click "Save"
    ProfilePage->>ProfileService: Save updated name
    ProfileService->>IndexedDB: Update name in database
    IndexedDB-->>ProfileService: Confirm update success
    ProfileService-->>ProfilePage: Notify update success
    ProfilePage->>User: Update name on Profile Page
