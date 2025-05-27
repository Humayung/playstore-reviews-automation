import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PACKAGE_NAME = process.env.PACKAGE_NAME;
const SCOPES = ['https://www.googleapis.com/auth/androidpublisher'];

async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join('.secrets', 'credentials.json'),
        scopes: SCOPES,
    });
    return auth;
}

async function fetchReviews() {
    try {
        const auth = await getAuthClient();
        const androidpublisher = google.androidpublisher({
            version: 'v3',
            auth,
        });

        // Get current date and date 90 days ago
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90); // Get last 90 days

        // Format dates as YYYY-MM-DD
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        console.log(`Fetching reviews from ${formatDate(startDate)} to ${formatDate(endDate)}`);

        // First, create a report
        const createResponse = await androidpublisher.reports.create({
            packageName: PACKAGE_NAME,
            requestBody: {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                reportType: 'REVIEWS',
                reportFormat: 'JSON'
            }
        });

        console.log('Report creation response:', createResponse.data);

        // Then, get the report
        const reportResponse = await androidpublisher.reports.get({
            packageName: PACKAGE_NAME,
            reportId: createResponse.data.reportId
        });

        console.log('Report data:', reportResponse.data);

        if (reportResponse.data) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `reviews_${PACKAGE_NAME}_${timestamp}.json`;
            fs.writeFileSync(filename, JSON.stringify(reportResponse.data, null, 2));
            console.log(`Successfully saved report to ${filename}`);
            
            return reportResponse.data;
        } else {
            console.log('No report data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        throw error;
    }
}

// Run the script
fetchReviews()
    .then(() => console.log('Done!'))
    .catch(error => console.error('Failed:', error)); 