# AlmaAssist — Database Schema

## Cloud Firestore Collections

### `users`

Stores user profile metadata created on signup.

| Field     | Type      | Description                    |
|-----------|-----------|--------------------------------|
| email     | string    | User's email address           |
| createdAt | timestamp | Account creation timestamp     |

**Document ID**: Firebase Auth UID

---

### `questionnaires`

Stores uploaded questionnaire metadata.

| Field     | Type      | Description                           |
|-----------|-----------|---------------------------------------|
| userId    | string    | Owner's Firebase Auth UID             |
| title     | string    | Questionnaire title (from filename)   |
| status    | string    | "processing" / "ready" / "completed"  |
| createdAt | timestamp | Upload timestamp                      |

**Document ID**: Auto-generated

---

### `questions`

Stores individual questions extracted from a questionnaire, along with generated answers.

| Field           | Type    | Description                                           |
|-----------------|---------|-------------------------------------------------------|
| questionnaireId | string  | Parent questionnaire document ID                      |
| text            | string  | The question text                                     |
| answer          | string  | AI-generated answer (empty until generated)           |
| citation        | string  | Source document name(s) referenced                    |
| confidence      | string  | "high" / "medium" / "low" / "" (empty until generated)|
| evidenceSnippet | string  | Exact text from reference doc used for the answer     |
| edited          | boolean | Whether the user has manually edited the answer       |

**Document ID**: Auto-generated

---

### `documents`

Stores extracted text from uploaded reference documents.

| Field           | Type      | Description                              |
|-----------------|-----------|------------------------------------------|
| userId          | string    | Owner's Firebase Auth UID                |
| questionnaireId | string    | Associated questionnaire document ID     |
| title           | string    | Original filename of the document        |
| content         | string    | Full extracted text from PDF             |
| createdAt       | timestamp | Upload timestamp                         |

**Document ID**: Auto-generated

---

## Relationships

```
users (1) ──── (many) questionnaires
questionnaires (1) ──── (many) questions
questionnaires (1) ──── (many) documents
users (1) ──── (many) documents
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own user doc
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own questionnaires
    match /questionnaires/{questionnaireId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }

    // Users can access questions belonging to their questionnaires
    // (enforced at application level via questionnaireId lookup)
    match /questions/{questionId} {
      allow read, write: if request.auth != null;
    }

    // Users can only access their own documents
    match /documents/{documentId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Indexing

Firestore composite indexes needed:

1. `questionnaires` — `userId` ASC, `createdAt` DESC (list user's questionnaires)
2. `questions` — `questionnaireId` ASC (get all questions for a questionnaire)
3. `documents` — `questionnaireId` ASC (get all docs for a questionnaire)
