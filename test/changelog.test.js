const assert = require('assert');
const fs = require('fs');
const path = require('path');
const changelog = require('../src/changelog');

const changelogFile = path.join(process.cwd(), "CHANGELOG.txt");

// 測試初始化changelog
function testInitChangelog() {
    // 確保初始狀態
    if (fs.existsSync(changelogFile)) {
        fs.unlinkSync(changelogFile);
    }

    changelog.initChangelog();
    assert.strictEqual(fs.existsSync(changelogFile), true, 'Changelog should be created');
}

// 測試添加條目
function testAddEntry() {
    const testMessage = "Test entry";
    changelog.addEntry(testMessage);
    
    const content = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
    assert.strictEqual(content.includes(testMessage), true, 'Changelog should contain the test entry');
}
// 測試標記changelog為已釋出
function testReleaseChangelog() {
    // 初始化changelog以確保測試一致性
    changelog.initChangelog();
    changelog.releaseChangelog();

    const content = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
    assert.match(content, /## Released on \d{4}-\d{2}-\d{2}/, 'Changelog should contain a release header');
}

// 測試添加版本
function testAddVersion() {
    const version = '1.0.0';
    const description = 'Initial release';

    // 確保在測試前changelog不存在
    if (fs.existsSync(changelogFile)) {
        fs.unlinkSync(changelogFile);
    }

    changelog.initChangelog();
    changelog.addVersion(version, description);

    const content = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
    assert.match(content, new RegExp(`## \\[${version}\\] - \\d{4}-\\d{2}-\\d{2}\n${description}\n`), 'Changelog should contain the new version and description');
}

// 測試顯示changelog
function testShowChangelog() {
    // 此功能可能需要更複雜的測試，因為它涉及到控制台輸出
    // 您可能需要使用像是 sinon 這樣的庫來攔截和檢查console.log的調用
    console.log("testShowChangelog needs to be implemented");
}

// 測試列出所有版本
function testListVersions() {
    // 此功能同樣可能需要更複雜的測試策略
    console.log("testListVersions needs to be implemented");
}

// 執行所有測試
function runTests() {
    testInitChangelog();
    testAddEntry();
    testReleaseChangelog();
    testAddVersion();
    // testShowChangelog(); // Uncomment after implementation
    // testListVersions(); // Uncomment after implementation

    console.log("All tests passed!");
}


// 導出 runTests 函數
module.exports = runTests;