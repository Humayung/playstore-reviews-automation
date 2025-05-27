import gplay from "google-play-scraper";
import fs from "fs";
import packageNames from "./package-names.js";

async function fetchReviews(packageName, numReviews = 100, lang, country) {
    try {
        console.log(
            `Fetching reviews for package: ${packageName} ${lang} ${country}`
        );
        let allReviews = [];
        let nextPaginationToken = null;
        const pageSize = 100; // max per page
        do {
            const opts = {
                appId: packageName,
                sort: gplay.sort.NEWEST,
                num: Math.min(pageSize, numReviews - allReviews.length),
                paginate: true,
                nextPaginationToken: nextPaginationToken,
                lang: lang,
                country: country,
            };
            const res = await gplay.reviews(opts);
            allReviews = allReviews.concat(res.data);
            nextPaginationToken = res.nextPaginationToken;
            if (
                !nextPaginationToken ||
                allReviews.length >= numReviews ||
                res.data.length === 0
            )
                break;
            // Avoid rate limiting
            await new Promise((r) => setTimeout(r, 1000));
        } while (allReviews.length < numReviews);
        allReviews = allReviews.slice(0, numReviews);
        console.log(
            `Successfully fetched ${allReviews.length} reviews for package: ${packageName} ${lang} ${country}`
        );
        return allReviews;
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        throw error;
    }
}

function saveReviews(packageName, reviews) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dir = `./json`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filename = `${dir}/reviews_${packageName}.json`;
    fs.writeFileSync(filename, JSON.stringify(reviews, null, 2));
}

async function fetchReviewForSpecificApp(packageName) {
    const idReviews = await fetchReviews(packageName, 5000, "id", "id");
    const enReviews = await fetchReviews(packageName, 5000, "en", "us");
    const allReviews = [...idReviews, ...enReviews];
    return allReviews;
}

async function functionFetchAndSaveAllReviews() {
    for (const packageName of Object.keys(packageNames)) {
        const reviews = await fetchReviewForSpecificApp(packageName);
        saveReviews(packageName, reviews);
    }
}

async function generateReviewReport(allReviews) {
    // Initialize stats for all packages from packageNames
    const reviewStats = {};
    
    // First, initialize all packages with zero reviews
    for (const [packageName, appName] of Object.entries(packageNames)) {
        reviewStats[packageName] = {
            packageName,
            appName,
            totalReviews: 0,
            averageScore: 0,
            scoreDistribution: {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0
            }
        };
    }
    
    // Then update stats for packages that have reviews
    for (const review of allReviews) {
        const { packageName, scoreText } = review;
        
        // Update stats
        reviewStats[packageName].totalReviews++;
        reviewStats[packageName].scoreDistribution[scoreText]++;
    }
    
    // Calculate average scores
    for (const stats of Object.values(reviewStats)) {
        const totalScore = Object.entries(stats.scoreDistribution).reduce(
            (sum, [score, count]) => sum + (parseInt(score) * count), 
            0
        );
        stats.averageScore = stats.totalReviews > 0 
            ? (totalScore / stats.totalReviews).toFixed(2)
            : '0.00';
    }
    
    // Create CSV content
    const headers = ['pos', 'packageName', 'appName', 'totalReviews', 'averageScore', '1_star', '2_star', '3_star', '4_star', '5_star'];
    const csvContent = [
        headers.join(','),
        ...Object.values(reviewStats).map((stats, index) => 
            headers.map(header => {
                if (header === 'pos') return index + 1;
                if (header === '1_star') return stats.scoreDistribution['1'];
                if (header === '2_star') return stats.scoreDistribution['2'];
                if (header === '3_star') return stats.scoreDistribution['3'];
                if (header === '4_star') return stats.scoreDistribution['4'];
                if (header === '5_star') return stats.scoreDistribution['5'];
                return `"${stats[header]}"`;
            }).join(',')
        )
    ].join('\n');
    
    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./output/review_report_${timestamp}.csv`;
    fs.writeFileSync(filename, csvContent);
    
    console.log(`Successfully generated review report at ${filename}`);
}

async function fetchReviewsAndExportToCSV() {
    // this function fetch all reviews from all apps.
    // then combine it all and make it in one csv.
    // the column i only need are userName, scoreText, text, date (in human readable), version
    try {
        let allReviews = [];
        
        // Fetch reviews for each package
        let counter = 0
        for (const packageName of Object.keys(packageNames)) {
            console.log(`Fetching reviews for ${packageName}...`);
            
            // Use fetchReviewForSpecificApp to get all reviews for this package
            const packageReviews = await fetchReviewForSpecificApp(packageName);
            // Transform reviews for this package
            const transformedReviews = packageReviews.map((review, index) => ({
                pos: index + counter + 1,                
                packageName: packageName,
                appName: packageNames[packageName],
                userName: review.userName || 'Anonymous',
                scoreText: review.score.toString(),
                text: review.text.replace(/\n/g, ' ').replace(/,/g, ';'), // Clean text for CSV
                date: new Date(review.date).toLocaleString(),
                version: review.version || 'Unknown',
                reply: review.replyText ? review.replyText.replace(/\n/g, ' ').replace(/,/g, ';') : '',
                replyDate: review.replyDate ? new Date(review.replyDate).toLocaleString() : '',
                url: review.url,
                userImage: review.userImage
            }));
            
            counter += transformedReviews.length
            // Add to the main array
            allReviews = [...allReviews, ...transformedReviews];
            console.log(`Added ${transformedReviews.length} reviews from ${packageName}`);
        }
        
        // Sort all reviews by package name first, then by date (newest first)
        allReviews.sort((a, b) => {
            // First compare by package name
            const packageCompare = a.packageName.localeCompare(b.packageName);
            if (packageCompare !== 0) return packageCompare;
            
            // If same package, sort by date (newest first)
            return new Date(b.date) - new Date(a.date);
        });
        
        // Update positions after sorting
        allReviews = allReviews.map((review, index) => ({
            ...review,
            pos: index + 1
        }));
        
        // Create CSV content
        const headers = ['pos', 'packageName', 'appName', 'userName', 'scoreText', 'text', 'date', 'version', 'reply', 'replyDate'];
        const csvContent = [
            headers.join(','),
            ...allReviews.map(review => 
                headers.map(header => `"${review[header]}"`).join(',')
            )
        ].join('\n');
        
        // Save to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        if (!fs.existsSync("./output")) {
            fs.mkdirSync("./output", { recursive: true });
        }
        const filename = `./output/all_reviews_${timestamp}.csv`;
        fs.writeFileSync(filename, csvContent);
        
        console.log(`Successfully exported ${allReviews.length} total reviews to ${filename}`);
        
        // Save all reviews to JSON file
        const jsonFilename = `./output/all-reviews.json`;
        fs.writeFileSync(jsonFilename, JSON.stringify(allReviews, null, 2));
        console.log(`Successfully saved all reviews to ${jsonFilename}`);
        
        // Generate and save the review report
        await generateReviewReport(allReviews);
        
    } catch (error) {
        console.error('Error in fetchReviewsAndExportToCSV:', error);
        throw error;
    }
}

// Call the function
fetchReviewsAndExportToCSV();
