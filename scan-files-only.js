const fs = require('fs');
const path = require('path');

// Scan for broker data files without database connection
async function scanBrokerFiles() {
  const sourceDir = 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers';
  const results = {
    htmlFiles: [],
    jsFiles: [],
    totalFiles: 0,
    errors: []
  };

  try {
    console.log(`🔍 Scanning directory: ${sourceDir}`);

    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory does not exist: ${sourceDir}`);
    }

    const files = fs.readdirSync(sourceDir);

    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        results.totalFiles++;

        if (file.endsWith('.html')) {
          results.htmlFiles.push({
            name: file,
            path: filePath,
            size: stat.size
          });
        } else if (file.endsWith('.js')) {
          results.jsFiles.push({
            name: file,
            path: filePath,
            size: stat.size
          });
        }
      }
    }

    console.log(`✅ Scan completed successfully`);
    console.log(`📊 Found ${results.htmlFiles.length} HTML files`);
    console.log(`📊 Found ${results.jsFiles.length} JavaScript files`);
    console.log(`📊 Total files scanned: ${results.totalFiles}`);

    // Show sample files
    if (results.htmlFiles.length > 0) {
      console.log(`\n📄 Sample HTML files:`);
      results.htmlFiles.slice(0, 5).forEach(file => {
        console.log(`   - ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      });
    }

    return results;

  } catch (error) {
    console.error(`❌ Scan failed: ${error.message}`);
    results.errors.push(error.message);
    return results;
  }
}

// Run the scan
scanBrokerFiles().then(results => {
  if (results.errors.length === 0) {
    console.log('\n🎉 File scan completed successfully!');
    console.log('Ready to proceed with data extraction phase');
  } else {
    console.log('\n⚠️  Scan completed with errors');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }
});