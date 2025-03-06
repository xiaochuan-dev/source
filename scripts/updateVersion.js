const semver = require('semver');
const { writeFile, readFile } = require('node:fs/promises');
const { join } = require('node:path');

async function getCurVersion() {
    const url = 'https://registry.npmjs.org/@xiaochuan-dev/source/latest';
    const r = await fetch(url);

    const data = await r.json();
    return data.version;
}

async function start() {
    const curVersion = await getCurVersion();

    const newVersion = semver.inc(curVersion, 'patch');


    const pkg = JSON.parse(await readFile(join(__dirname, '../package.json')));

    const newPkg = {
        ...pkg,
        version: newVersion,
    };
    await writeFile('./package.json', JSON.stringify(newPkg, null, 2), 'utf-8');
    console.log(`写入新版本成功 ${curVersion}`);

}

start();
