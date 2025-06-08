const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const inputDir = './'; // change to your target directory
const outputDir = './pdfs';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to recursively get all files from directory and subdirectories
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip node_modules directory
            if (file !== 'node_modules') {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    
    return arrayOfFiles;
}

// Function to ensure output directory structure exists
function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Get all files recursively
    const allFiles = getAllFiles(inputDir);
    
    for (const fullPath of allFiles) {
        const ext = path.extname(fullPath);
        const relativePath = path.relative(inputDir, fullPath);
        const baseName = path.basename(fullPath, ext);
        const relativeDir = path.dirname(relativePath);
        
        // Create output path maintaining directory structure
        const outputPath = path.join(outputDir, relativeDir, `${baseName}.pdf`);
        
        // Process .html files
        if (ext === '.html') {
            const fileUrl = 'file://' + path.resolve(fullPath);
            await page.goto(fileUrl, { waitUntil: 'networkidle0' });
            
            ensureDirectoryExists(outputPath);
            await page.pdf({
                path: outputPath,
                format: 'A4'
            });
            console.log(`Converted ${relativePath} to PDF`);
        }
        
        // Process .js files by wrapping them in a simple HTML template
        if (ext === '.js') {
            const code = fs.readFileSync(fullPath, 'utf-8');
            const htmlContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: monospace; white-space: pre-wrap; margin: 40px; }
                        </style>
                    </head>
                    <body>
                        <pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                    </body>
                </html>
            `;
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
            ensureDirectoryExists(outputPath);
            await page.pdf({
                path: outputPath,
                format: 'A4'
            });
            console.log(`Converted ${relativePath} to PDF`);
        }
    }
    
    await browser.close();
    console.log('All files processed successfully!');
})();