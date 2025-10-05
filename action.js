// @ts-check

const path = require('path');
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
    } else if (os === 'Linux') {
        const pathToTar = await tc.downloadTool(
            `https://github.com/toBeOfUse/internet-golf/releases/download/${version}/golf-linux-amd64.tar.gz`
        );
        pathToCLI = await tc.extractTar(pathToTar);
    } else {
        throw new Error(`OS ${os} not supported`);
    }

    console.log(`downloaded ${version} to ${pathToCLI}. Adding to path...`)

    // Expose the tool by adding it to the PATH
    core.addPath(path.dirname(pathToCLI))
}

setup();
