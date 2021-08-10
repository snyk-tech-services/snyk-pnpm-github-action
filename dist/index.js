"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAction = void 0;
const github = require('@actions/github');
const core = require('@actions/core');
const apiTool = require("snyk-pnpm-deptree-api-tool");
const runAction = async () => {
    const breakBuild = core.getInput('breakBuild') == 'true' ? true : false;
    try {
        const snykToken = core.getInput('snykToken');
        const snykOrganization = core.getInput('snykOrganization');
        const path = core.getInput('pnpmLockfilePath') == '.' ? '/' : core.getInput('pnpmLockfilePath');
        const includeDev = core.getInput('includeDev');
        const debug = core.getInput('debugMode');
        checkSnykToken(snykToken);
        process.argv = [
            '--root',
            path,
            '--snykToken',
            snykToken,
            '--orgId',
            snykOrganization,
            '--includeDev',
            includeDev,
        ];
        const packageLock = await apiTool.main();
    }
    catch (err) {
        console.log("Failed Check !");
        if (breakBuild) {
            core.setFailed(err);
        }
        else {
            console.log(err);
        }
    }
};
exports.runAction = runAction;
const checkSnykToken = (snykToken) => {
    const regex = /[^a-f0-9\-]/;
    if (!isStringAgainstRegexOK(snykToken, regex)) {
        throw new Error("Unauthorized characters in snyk token");
    }
};
const isStringAgainstRegexOK = (stringItem, regex) => {
    const blacklistedCharacters = stringItem.match(regex);
    if (blacklistedCharacters && blacklistedCharacters.length > 0) {
        return false;
    }
    return true;
};
if (!module.parent) {
    runAction();
}
//# sourceMappingURL=index.js.map