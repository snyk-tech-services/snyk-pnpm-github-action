const github = require('@actions/github')
const core = require('@actions/core')
import * as apiTool from 'snyk-pnpm-deptree-api-tool'

const runAction = async () => {
     
    const breakBuild: boolean = core.getInput('breakBuild') == 'true' ? true : false
    try{
        const snykToken: string = core.getInput('snykToken');
        const snykOrganization: string = core.getInput('snykOrganization');
        const path: string = core.getInput('pnpmLockfilePath') == '.' ? '/' : core.getInput('pnpmLockfilePath')
        const includeDev: string = core.getInput('includeDev');
        const debug: boolean = core.getInput('debugMode')

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

        const packageLock = await apiTool.main();

        if (packageLock.exitCode == 1) {
            core.debug("Vulnerabilities found!")
            core.setFailed("Vulnerabilities found!")
        }

    } catch(err) {
        console.log("Failed Check!")
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
