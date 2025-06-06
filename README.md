# Global Native Web MVP

## Pokretanje

1. Unesi Firebase konfiguraciju u `assets/js/firebase-config.js`
2. Deploy na Firebase Hosting:
   ```bash
   firebase init
   firebase deploy
   ```
3. Firestore pravila (samo za razvoj):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /firms/{firmId} {
      allow read, write: if true;
    }
  }
}
```