libraries {
  workflow {
    environment="node:lts"
    build="yarn install"
    lint="yarn lint"
    test {
      command="yarn test"
      junitReports="junit.xml"
    }
  }
}
