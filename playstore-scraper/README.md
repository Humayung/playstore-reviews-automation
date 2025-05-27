# Play Store Reviews Automation

This script allows you to fetch reviews for any app from the Google Play Store by providing its package name. The reviews are saved to a JSON file with a timestamp.

## Installation

1. Make sure you have Node.js installed on your system
2. Install the dependencies by running:
```bash
npm install
```

## Usage

Run the script using Node.js:

```bash
node fetch-reviews.js [package-name] [number-of-reviews]
```

### Parameters:
- `package-name` (optional): The package name of the app (e.g., 'com.whatsapp'). If not provided, it defaults to WhatsApp.
- `number-of-reviews` (optional): The number of reviews to fetch. If not provided, it defaults to 100.

### Example:
```bash
# Fetch 100 reviews for WhatsApp
node fetch-reviews.js com.whatsapp

# Fetch 50 reviews for Instagram
node fetch-reviews.js com.instagram.android 50
```

The script will create a JSON file in the current directory with the format: `reviews_[package-name]_[timestamp].json`

## Output Format

The JSON file contains an array of review objects with the following structure:
- `userName`: Name of the reviewer
- `userImage`: URL of the reviewer's profile image
- `content`: The review text
- `score`: Rating (1-5)
- `thumbsUp`: Number of helpful votes
- `reviewCreatedVersion`: App version when the review was created
- `at`: Timestamp of the review
- `replyContent`: Developer's reply (if any)
- `repliedAt`: Timestamp of the developer's reply (if any) 