import fs from 'fs'
import mkdirp from 'mkdirp'

const allContracts = {}
const networkIds = [1, 3, 4, 5777]

networkIds.forEach((networkId) => {

  const prunedContractDirectoryPath = `${__dirname}/../static/contracts/${networkId}`
  const sourceContractDirectoryPath = `${__dirname}/../static/contracts-source/${networkId}`

  mkdirp.sync(prunedContractDirectoryPath)
  mkdirp.sync(sourceContractDirectoryPath)

  // first, iterate over the source contracts and export a single pruned json
  //  file for each contract
  const sourceContractFileNames = fs.readdirSync(sourceContractDirectoryPath)

  if (
    (sourceContractFileNames.includes('CodexRecordV2.json') && !sourceContractFileNames.includes('CodexRecordProxy.json'))
    || (!sourceContractFileNames.includes('CodexRecordV2.json') && sourceContractFileNames.includes('CodexRecordProxy.json'))
  ) {
    console.warn('[npm.ethereum-service]', `CodexRecordV2 and CodexRecordProxy are mutually inclusive, and one is missing for network id ${networkId}`)
    process.exit(1)
  }

  sourceContractFileNames
    .forEach((contractFileName) => {

      // do not consider files that start with an underscore or dot as valid
      //  contracts
      if (/^(_|\.)/.test(contractFileName) || !/\.json$/g.test(contractFileName)) {
        return
      }

      const contractFilePath = `${sourceContractDirectoryPath}/${contractFileName}`
      const contractJSON = JSON.parse(fs.readFileSync(contractFilePath))

      if (
        !contractJSON.networks[networkId]
        && contractJSON.contractName !== 'CODXVesting'
        && contractJSON.contractName !== 'IdentityProxy'
        && contractJSON.contractName !== 'IdentityProxyV2'
      ) {
        console.warn('[npm.ethereum-service]', `skipping ${contractFilePath} because it has no address for network with id ${networkId}`)
        return
      }

      const contractData = {
        address: null,
        abi: contractJSON.abi,
        name: contractJSON.contractName,
        bytecode: contractJSON.bytecode,
      }

      if (contractJSON.networks[networkId]) {
        contractData.address = contractJSON.networks[networkId].address
      }

      fs.writeFileSync(`${prunedContractDirectoryPath}/${contractFileName}`, JSON.stringify(contractData))

    })

  // now iterate over the pruned contracts and create a monolithic json file
  //  with all contracts (used by the frontend)
  const prunedContractFileNames = fs.readdirSync(prunedContractDirectoryPath)

  prunedContractFileNames
    .forEach((contractFileName) => {

      // do not consider files that start with an underscore or dot as valid
      //  contracts
      if (/^(_|\.)/.test(contractFileName) || !/\.json$/g.test(contractFileName)) {
        return
      }

      const contractFilePath = `${prunedContractDirectoryPath}/${contractFileName}`
      const contractData = JSON.parse(fs.readFileSync(contractFilePath))

      // since the bytecode isn't really necessary on the frontend right now,
      //  let's remove it from the monolithic json file since doing so reduces
      //  the file size from like ~350kb to 100kb
      delete contractData.bytecode

      allContracts[networkId] = allContracts[networkId] || {}
      allContracts[networkId][contractData.name] = contractData

      if (allContracts[networkId].CodexRecordV2 && allContracts[networkId].CodexRecordProxy) {
        allContracts[networkId].CodexRecordV2.address = allContracts[networkId].CodexRecordProxy.address
        delete allContracts[networkId].CodexRecordProxy
      }

    })

})

fs.writeFileSync(`${__dirname}/../dist/contracts-by-network.json`, JSON.stringify(allContracts))
