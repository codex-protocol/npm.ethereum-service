import fs from 'fs'
import mkdirp from 'mkdirp'

const networkIds = [1, 3, 4, 5777]

networkIds.forEach((networkId) => {

  const prunedContractDirectoryPath = `${__dirname}/../static/contracts/${networkId}`
  const sourceContractDirectoryPath = `${__dirname}/../static/contracts-source/${networkId}`

  mkdirp.sync(prunedContractDirectoryPath)
  mkdirp.sync(sourceContractDirectoryPath)

  const contractFileNames = fs.readdirSync(sourceContractDirectoryPath)

  if (
    (contractFileNames.includes('CodexRecord.json') && !contractFileNames.includes('CodexRecordProxy.json')) ||
    (!contractFileNames.includes('CodexRecord.json') && contractFileNames.includes('CodexRecordProxy.json'))
  ) {
    console.warn('[npm.ethereum-service]', `CodexRecord and CodexRecordProxy are mutually inclusive, and one is missing for network id ${networkId}`)
    process.exit(1)
  }

  contractFileNames
    .forEach((contractFileName) => {

      // do not consider files that start with an underscore or dot as valid
      //  contracts
      if (/^(_|\.)/.test(contractFileName) || !/\.json$/g.test(contractFileName)) {
        return
      }

      const contractFilePath = `${sourceContractDirectoryPath}/${contractFileName}`

      const contractJSON = JSON.parse(fs.readFileSync(contractFilePath))

      if (!contractJSON.networks[networkId]) {
        console.warn('[npm.ethereum-service]', `skipping ${contractFilePath} because it has no address for network with id ${networkId}`)
        return
      }

      const contractData = {
        abi: contractJSON.abi,
        name: contractJSON.contractName,
        bytecode: contractJSON.bytecode,
        address: contractJSON.networks[networkId].address,
      }

      fs.writeFileSync(`${prunedContractDirectoryPath}/${contractFileName}`, JSON.stringify(contractData))

    })

})
