import fs from 'node:fs';
import path from 'node:path';
import type { Reporter } from 'vitest/reporters';

export default class FailedTestsReporter implements Reporter {
    private failedTests: string[] = [];

    onTestCaseResult(testCase: any) {
        const result = typeof testCase.result === 'function' ? testCase.result() : testCase.result;
        if (result && (result.state === 'fail' || result.state === 'failed')) {
            const pathParts = [];
            let current = testCase;
            while (current) {
                if (current.name) {
                    pathParts.unshift(current.name);
                }
                current = current.parent || current.suite;
            }
            let msg = `FAIL: ${pathParts.join(' > ')}`;
            if (result.errors) {
                for (const err of result.errors) {
                    msg += `\n    ${err.message || err}`;
                }
            }
            this.failedTests.push(msg);
        }
    }

    onTestRunEnd() {
        const outputDir = path.resolve(process.cwd(), 'tests/results/layer1');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFile = path.join(outputDir, 'failed-tests.log');

        if (this.failedTests.length > 0) {
            fs.writeFileSync(outputFile, this.failedTests.join('\n\n'), 'utf-8');
            console.log(`\n[FailedTestsReporter] Logged ${this.failedTests.length} failed tests to ${outputFile}\n`);
        } else {
            // Clear previous log if no failures
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
        }
    }
}
