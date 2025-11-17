const fs = require('fs').promises;
const path = require('path');

const talksFilePath = path.join(__dirname, 'talks.json');
const outputFilePath = path.join(__dirname, 'event-website.html');
const cssFilePath = path.join(__dirname, 'public', 'style.css');
const jsFilePath = path.join(__dirname, 'public', 'app.js');

async function generateWebsite() {
    try {
        // Read data and template files
        const talksData = JSON.parse(await fs.readFile(talksFilePath, 'utf8'));
        const cssContent = await fs.readFile(cssFilePath, 'utf8');
        const jsContent = await fs.readFile(jsFilePath, 'utf8');

        // Generate schedule HTML
        let scheduleHtml = '';
        let currentTime = new Date('2025-11-17T10:00:00');

        const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        talksData.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

            scheduleHtml += `
                <li class="schedule-item" data-category="${talk.category.join(', ')}">
                    <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                    <h3>${talk.title}</h3>
                    <div class="speakers">${talk.speakers.join(', ')}</div>
                    <div>${talk.category.map(c => `<span class="category">${c}</span>`).join('')}</div>
                    <p class="description">${talk.description}</p>
                </li>
            `;

            currentTime = new Date(endTime.getTime() + 10 * 60 * 1000); // 10-minute break

            if (index === 2) { // After the 3rd talk, add a lunch break
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000);
                scheduleHtml += `
                    <li class="schedule-item break">
                        <div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                        <h3>Lunch Break</h3>
                    </li>
                `;
                currentTime = lunchEndTime;
            }
        });

        // Create final HTML content
        const finalHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tech Talks 2025</title>
                <style>${cssContent}</style>
            </head>
            <body>
                <div class="container">
                    <h1>Tech Talks 2025 Schedule</h1>
                    <input type="text" id="search-bar" placeholder="Search by category (e.g., AI, Web, ...)">
                    <ul class="schedule">
                        ${scheduleHtml}
                    </ul>
                </div>
                <script>${jsContent}<\/script>
            </body>
            </html>
        `;

        // Write the final HTML file
        await fs.writeFile(outputFilePath, finalHtml, 'utf8');
        console.log('Event website generated successfully: event-website.html');

    } catch (error) {
        console.error('Error generating website:', error);
    }
}

generateWebsite();
