const github = require('@actions/github')
const core = require('@actions/core')
import * as apiTool from 'snyk-pnpm-deptree-api-tool'

const runAction = async () => {
     
    const breakBuild: boolean = core.getInput('breakBuild') == 'true' ? true : false
    try{
        const snykToken: string = core.getInput('snykToken');
        const snykOrganization: string = core.getInput('snykOrganization');
        const path: string = core.getInput('pnpmLockfilePath') == '.' ? '/' : core.getInput('pnpmLockfilePath');
        const manifestPath = core.getInput('manifestfilePath') == '.' ? '/' : core.getInput('manifestfilePath');
        const includeDev: string = core.getInput('includeDev');

        checkSnykToken(snykToken)

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

        if (manifestPath.length > 0) {
            process.argv.push('--manifestFilePath')
            process.argv.push(manifestPath)
        }

        console.log("process.argv", process.argv)
        console.log("manifestPath", manifestPath)

        const packageLock = await apiTool.main();

        console.log(packageLock.exitCode)

        console.debug(packageLock.exitCode)

        if (packageLock.exitCode === 1) {
            throw new Error("Vulnerabilities found!");
        }

    } catch(err) {
        console.log("Failed Check!!")
        if(breakBuild) {
            core.setFailed(err)
        } else {
            console.log(err)
        }

    }
}

const checkSnykToken = (snykToken: string) => {
  const regex = /[^a-f0-9\-]/
  if(!isStringAgainstRegexOK(snykToken,regex)){
      throw new Error("Unauthorized characters in snyk token")
  }
  
}

const isStringAgainstRegexOK = (stringItem: string, regex: RegExp): boolean => {
  const blacklistedCharacters = stringItem.match(regex)
  if (blacklistedCharacters && blacklistedCharacters.length > 0) {
      return false
  }
  return true
}


if(!module.parent){
    runAction()
}
 

export {
    runAction
}
