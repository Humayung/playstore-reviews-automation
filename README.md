# Play Store Review Scraper

This project allows you to fetch and update Google Play Store reviews for any public app using the `google-play-scraper` library. It supports large batch fetching (e.g., 9000 reviews at a time) and deduplication to avoid saving duplicate reviews.

---

## Features
- Fetch reviews for any public app by package name
- Save reviews to a JSON file
- On subsequent runs, fetches the latest reviews and only adds new ones (deduplication)
- Handles large batches (e.g., 9000 reviews at a time)
- Easy to configure and run
- **Standalone mode**: Run the script independently to fetch reviews for a single app
- **CSV Export**: Export reviews to CSV format for easy analysis

---

## Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd playstore-reviews-automation
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure package names
- Package names are provided in `package-names.json` (not via command-line arguments).
- Edit `package-names.json` to include the package names of the apps you want to fetch reviews for.

Example of `package-names.json`:
```javascript
export default {
  "com.whatsapp": "WhatsApp",
  "com.instagram.android": "Instagram",
  "com.facebook.katana": "Facebook"
}
```
