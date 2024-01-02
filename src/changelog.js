const fs = require("fs");
const path = require("path");

const changelogFile = path.join(process.cwd(), "CHANGELOG.txt");

function initChangelog() {
    if (!fs.existsSync(changelogFile)) {
        fs.writeFileSync(changelogFile, "");
        console.log("New changelog created.");
    } else {
        console.log("Changelog already exists.");
    }
}

//確認不是空的
function addEntry(message) {
    const now = new Date();
    const localDateTime = now.toLocaleString();
    const entry = `${localDateTime}: ${message}\n`;
    fs.appendFileSync(changelogFile, entry);
    console.log("Entry added.");
}

function addVersion(version, description) {
    if (!fs.existsSync(changelogFile)) {
        console.log("Changelog does not exist. Please initialize it first.");
        return;
    }

    const versionHeader = `## [${version}] - ${new Date().toISOString().split('T')[0]}\n`;
    const versionContent = `${versionHeader}${description}\n\n`;
    const changelogContent = fs.readFileSync(changelogFile, 'utf8');

    // 檢查該版本是否已經存在
    if (changelogContent.includes(`## [${version}]`)) {
        console.log(`Version ${version} already exists.`);
        return;
    }

    // 將新版本添加到文件開頭（或其他適當的位置）
    const updatedChangelogContent = versionContent + changelogContent;
    fs.writeFileSync(changelogFile, updatedChangelogContent);
    console.log(`Version ${version} added.`);
}

function releaseChangelog() {
    if (!fs.existsSync(changelogFile)) {
        console.log("Changelog does not exist.");
        return;
    }

    let changelogContent = fs.readFileSync(changelogFile, 'utf8');
    const releaseDate = new Date().toISOString().split('T')[0]; // 只獲取日期部分
    const releaseHeader = `## Released on ${releaseDate}\n\n`;

    // 檢查是否已有發布標記
    if (changelogContent.includes('## Released on')) {
        console.log("Changelog already marked as released.");
        return;
    }

    // 在文件開頭添加發布標記
    changelogContent = releaseHeader + changelogContent;
    fs.writeFileSync(changelogFile, changelogContent);
    console.log("Changelog marked as released.");
}

function showChangelog(version) {
    // 如果 changelog 文件不存在
    if (!fs.existsSync(changelogFile)) {
        console.log("Changelog does not exist.");
        return;
    }

    const changelogContent = fs.readFileSync(changelogFile, 'utf8');
    if (version) {
        // 如果指定了版本，則查找該版本的 changelog
        const versionPattern = new RegExp(`## \\[${version}\\].*?(?=## \\[|$)`, 'gs');
        const versionContent = changelogContent.match(versionPattern);
        if (versionContent) {
            console.log(`Changelog for version ${version}:\n`);
            console.log(versionContent[0]);
        } else {
            console.log(`Version ${version} not found.`);
        }
    } else {
        // 如果沒有指定版本，則顯示最新的 changelog
        const sections = changelogContent.split('## [').slice(1); // 根據版本拆分
        const latestSection = '## [' + sections[sections.length - 1];
        console.log("Showing latest changelog:\n");
        console.log(latestSection);
    }
}

function listVersions() {
    // 如果 changelog 文件不存在
    if (!fs.existsSync(changelogFile)) {
        console.log("Changelog does not exist.");
        return;
    }

    const changelogContent = fs.readFileSync(changelogFile, 'utf8');
    const versionPattern = /## \[(.*?)\]/g;
    let match;
    const versions = [];
    while ((match = versionPattern.exec(changelogContent)) !== null) {
        versions.push(match[1]);
    }

    if (versions.length === 0) {
        console.log("No versions found.");
    } else {
        console.log("List of all versions:");
        versions.forEach(version => console.log(version));
    }
}

module.exports = {
    initChangelog,
    addEntry,
    addVersion,
    releaseChangelog,
    showChangelog,
    listVersions
};
