import fs from 'fs';

// Convert reviews array to CSV format
export function reviewsToCSV(reviews) {
    const headers = ['pos', 'packageName', 'appName', 'userName', 'scoreText', 'text', 'date', 'version', 'reply', 'replyDate', 'url', 'userImage'];
    const csvContent = [
        headers.join(','),
        ...reviews.map((review, index) => 
            headers.map(header => {
                const value = review[header] || '';
                // Escape quotes and wrap in quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');
    return csvContent;
}

// Save reviews to CSV file
export function saveReviewsToCSV(reviews, filename) {
    const csvContent = reviewsToCSV(reviews);
    fs.writeFileSync(filename, csvContent);
}

// Save reviews to JSON file
export function saveReviewsToJSON(reviews, filename) {
    fs.writeFileSync(filename, JSON.stringify(reviews, null, 2));
}

// Generate filename with timestamp
export function generateFilename(prefix, extension) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}_${timestamp}.${extension}`;
}

// Ensure directory exists
export function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
} 