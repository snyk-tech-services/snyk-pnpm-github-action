![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)

***

[![Known Vulnerabilities](https://snyk.io/test/github/snyk-tech-services/snyk-pnpm-github-action/badge.svg)](https://snyk.io/test/github/snyk-tech-services/snyk-pnpm-github-action)

Snyk helps you find, fix and monitor for known vulnerabilities in your dependencies, both on an ad hoc basis and as part of your CI (Build) system.

## Snyk snyk-pnpm-github-action
GitHub action using snyk-pnpm-depTree-api-tool to convert a pnpm lockfile into a DepGraph and send it to the snyk API to scan
https://github.com/snyk-tech-services/snyk-pnpm-depTree-api-tool
https://snyk.docs.apiary.io/#reference/test/dep-graph



## Inputs

## `SNYK_TOKEN`
**Required** API snyk token. Can be found here: https://snyk.io/account/

## `Org`
**Required** The name of the snyk organization to run the test against.

## `pnpmLockfilePath`
**Required** The root path of the project to test.

## `includeDev`
**Optional** Include dev dependencies while building the depGraph. True or false - default = false

## Example usage

'''
jobs:
  pnpm_snyk_check:
    runs-on: ubuntu-latest
    name: Snyk post processing
    steps:
      - uses: actions/checkout@v2
      - name: Snyk API pnpm scan
        id: pnpm-scan-api-tool
        uses: snyk-tech-services/snyk-pnpm-github-action@master
        with:
          snykToken: ${{ secrets.snykToken }}
          pnpmLockfilePath: "./test/fixtures"
          snykOrganization: "playground"
          IncludeDev: "false"
'''
