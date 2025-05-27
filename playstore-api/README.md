# Play Store Reviews API

This project uses the official Google Play Developer API to fetch app reviews.

## Prerequisites

1. A Google Cloud Project
2. Google Play Console access for your app
3. Service account credentials

## Setup

1. Create a Google Cloud Project:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the "Google Play Android Developer API"

2. Create Service Account:
   - In Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
   - Create a new service account
   - Download the JSON key file
   - Save it as `credentials.json` in the project root

3. Link Service Account to Play Console:
   - Go to [Google Play Console](https://play.google.com/console)
   - Go to "Users and permissions"
   - Add the service account email
   - Grant it "View app information" permission

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file:
   ```
   PACKAGE_NAME=your.app.package.name
   ```

## Usage

Run the script:
```bash
node fetch-reviews.js
```

The script will:
1. Fetch new reviews since the last run
2. Save them to a JSON file
3. Update the last fetch timestamp

## Output

Reviews are saved in `reviews_[package-name]_[timestamp].json` with the following structure:
- Review text
- Rating
- Date
- Device info
- App version
- Developer replies (if any) 