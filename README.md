# Play Store Review Scraper

This project allows you to fetch and update Google Play Store reviews for any public app using the `google-play-scraper` library. It supports large batch fetching (e.g., 9000 reviews at a time) and deduplication to avoid saving duplicate reviews.

---

## Features
- Fetch reviews for any public app by package name
- Save reviews to a JSON file
- On subsequent runs, fetches the latest reviews and only adds new ones (deduplication)
- Handles large batches (e.g., 9000 reviews at a time)
- Easy to configure and run
- **Standalone mode**: Standalone viewer for fetched reviews
- **CSV Export**: Export reviews to CSV format for easy analysis

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/Humayung/playstore-reviews-automation.git
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

### 4. Running the Project

1. Start the scraping process:
```bash
npm start
```

2. Wait for the scraping process to complete. This may take some time depending on the number of reviews being fetched.

3. Once the scraping is finished, open `view-reviews.html` in your web browser to view the fetched reviews.

Note: The scraping process needs to complete before viewing the reviews. You can open the HTML file independently after the scraping is done.
**Note:** This project was made with help from AI. Its mainly for my private use, but feel free to use it if you find it useful. No guarantees though.
