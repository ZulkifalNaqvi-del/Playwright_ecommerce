const fs = require('fs');
const path = require('path');

class CSVReporter {
  constructor(options = {}) {
    this.outputFolder = options.outputFolder || 'test-results';
    this.outputFile = options.outputFile || 'test-results.csv';
    this.results = [];
  }

  onBegin(config, suite) {
    console.log(`Starting test suite with ${suite.allTests().length} tests`);
  }

  onTestEnd(test, result) {
    const testPath = test.location.file.replace(/\\/g, '/');
    const testName = test.title;
    const status = result.status;
    const duration = result.duration;
    const error = result.error ? result.error.message : '';
    const startTime = new Date(result.startTime).toISOString();
    
    this.results.push({
      testFile: testPath,
      testName: testName,
      status: status,
      duration: duration,
      startTime: startTime,
      error: error,
      retries: result.retry
    });
  }

  onEnd(result) {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), this.outputFolder);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate CSV content
    const csvHeader = 'Test File,Test Name,Status,Duration (ms),Start Time,Retries,Error\n';
    const csvRows = this.results.map(row => {
      return `"${row.testFile}","${row.testName}","${row.status}",${row.duration},"${row.startTime}",${row.retries},"${row.error.replace(/"/g, '""')}"`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // Write to file
    const outputPath = path.join(outputDir, this.outputFile);
    fs.writeFileSync(outputPath, csvContent, 'utf-8');

    console.log(`\n✅ CSV Report generated: ${outputPath}`);
    console.log(`\nTest Summary:`);
    console.log(`  Total: ${this.results.length}`);
    console.log(`  Passed: ${this.results.filter(r => r.status === 'passed').length}`);
    console.log(`  Failed: ${this.results.filter(r => r.status === 'failed').length}`);
    console.log(`  Skipped: ${this.results.filter(r => r.status === 'skipped').length}`);
  }
}

module.exports = CSVReporter;

