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

for (const packageName of Object.keys(packageNames)) {
    const idReviews = await fetchReviews(packageName, 5000, "id", "id");
    const enReviews = await fetchReviews(packageName, 5000, "en", "us");
    const allReviews = [...idReviews, ...enReviews];
    saveReviews(packageName, allReviews);
    saveReviews(packageName, idReviews);
}
