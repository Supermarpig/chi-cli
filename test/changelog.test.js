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

// 測試添加項目
function testAddEntry() {
    const testMessage = "Test entry";
    changelog.addEntry(testMessage);
    
    const content = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
    assert.strictEqual(content.includes(testMessage), true, 'Changelog should contain the test entry');
}
// 測試標記changelog為已釋出
function testReleaseChangelog() {
    // 初始化changelog以確保測試一緻性
    changelog.initChangelog();
    changelog.releaseChangelog();

    const content = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
    assert.match(content, /## Released on \d{4}-\d{2}-\d{2}/, 'Changelog should contain a release header');
}

// 備份 CHANGELOG.txt 文件
function backupChangelog() {
    if (fs.existsSync(changelogFile)) {
        fs.copyFileSync(changelogFile, backupFile);
    }
}

// 恢複 CHANGELOG.txt 文件
function restoreChangelog() {
    if (fs.existsSync(backupFile)) {
        fs.renameSync(backupFile, changelogFile);
    } else if (fs.existsSync(changelogFile)) {
        // 如果測試期間創建了 CHANGELOG.txt 但冇有備份文件，則刪除它
        fs.unlinkSync(changelogFile);
    }
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
    // 此功能可能需要更複雜的測試，因為它涉及到控製臺輸出
    console.log("testShowChangelog needs to be implemented");
}

// 測試列出所有版本
function testListVersions() {
    // 此功能同樣可能需要更複雜的測試策略
    console.log("testListVersions needs to be implemented");
}

// 執行所有測試
function runTests() {
    backupChangelog(); // 備份原始 CHANGELOG.txt 文件

    testInitChangelog();
    testAddEntry();
    testReleaseChangelog();
    testAddVersion();
    // testShowChangelog(); // Uncomment after implementation
    // testListVersions(); // Uncomment after implementation

    restoreChangelog(); // 恢複原始 CHANGELOG.txt 文件

    console.log("All tests passed!");
}


// 導出 runTests 函數
module.exports = runTests;