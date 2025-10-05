// @ts-check

const path = require('path');
const fs = require('fs');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

async function setup() {
    // Get version of tool to be installed
    const version = core.getInput('version');

    const os = process.env.RUNNER_OS;

    if (!os) {
        throw new Error("Cannot discern OS from environment variable RUNNER_OS");
    }

    let pathToCLI = '';
    // this unnecessarily downloads both the server and the client, since both
    // are in the archive. however, the archive is needed to store the +x
    // permissions for Linux...
    if (os === 'Windows') {
        const pathToZip = await tc.downloadTool(
            `https://github.com/toBeOfUse/internet-golf/releases/download/${version}/golf-windows-amd64.zip`
        );
        pathToCLI = await tc.extractZip(pathToZip);
        fs.renameSync(path.join(pathToCLI, 'golf-windows-amd64.exe'), path.join(pathToCLI, 'golf.exe'));
    } else if (os === 'Linux') {
        const pathToTar = await tc.downloadTool(
            `https://github.com/toBeOfUse/internet-golf/releases/download/${version}/golf-linux-amd64.tar.gz`
        );
        pathToCLI = await tc.extractTar(pathToTar);
        fs.renameSync(path.join(pathToCLI, 'golf-linux-amd64'), path.join(pathToCLI, 'golf'));
    } else {
        throw new Error(`OS ${os} not supported`);
    }

    console.log(`downloaded ${version} to ${pathToCLI}. Adding to path...`)

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI)
}

setup();
