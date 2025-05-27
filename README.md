# Play Store Review Scraper

This project allows you to fetch and update Google Play Store reviews for any public app using the `google-play-scraper` library. It supports large batch fetching (e.g., 9000 reviews at a time) and deduplication to avoid saving duplicate reviews.

---

## Features
- Fetch reviews for any public app by package name
- Save reviews to a JSON file
- On subsequent runs, fetches the latest reviews and only adds new ones (deduplication)
- Handles large batches (e.g., 9000 reviews at a time)
- Easy to configure and run

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

### 3. Configure package name
Edit the script or pass the package name as a command-line argument (see Usage below).

### 4. (Optional) Security
- Add any secret or sensitive files (like `package-names.js`) to `.gitignore` to avoid accidental commits.
- Example:
  ```
  echo "package-names.js" >> .gitignore
  git add .gitignore
  git commit -m "chore: ignore package-names.js"
  ```

---

## Usage

### Fetch and Save Reviews
Fetch the latest 9000 reviews for an app (e.g., WhatsApp):
```bash
node fetch-reviews.js com.whatsapp 9000
```
- The first argument is the package name (e.g., `com.whatsapp`)
- The second argument is the number of reviews to fetch (default: 100)

### Deduplication
- The script saves all reviews to a file (e.g., `all_reviews.json`)
- On each run, it loads existing reviews and only adds new ones (by unique review ID)
- This ensures you never save duplicates, even if you fetch overlapping batches

### Output
- Reviews are saved in a timestamped JSON file (e.g., `reviews_com.whatsapp_2024-05-28T00-00-00-000Z.json`)
- The master file (e.g., `all_reviews.json`) contains all unique reviews

---

## Example Workflow
1. **First run:**
   - Fetch 9000 reviews, save all to `all_reviews.json`
2. **Next run:**
   - Fetch 9000 reviews
   - Only new reviews (not already in `all_reviews.json`) are added
   - The master file is updated

---

## Tips
- Use a cron job or scheduler to run the script regularly and keep your review archive up to date
- Always keep sensitive files out of version control
- For very large datasets, consider using a database (like SQLite) instead of a JSON file

---

## License
MIT 