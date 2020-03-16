libraries {
  workflow {
    environment="node:lts"
    build="yarn install"
    lint="yarn lint"
    test="yarn test"
  }
}
