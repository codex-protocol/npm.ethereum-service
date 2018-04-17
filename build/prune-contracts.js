import fs from 'fs'
import mkdirp from 'mkdirp'

const networkIds = [1, 4, 5777]

networkIds.forEach((networkId) => {

  const prunedContractDirectoryPath = `${__dirname}/../static/contracts/${networkId}`
  const sourceContractDirectoryPath = `${__dirname}/../static/contracts-source/${networkId}`

  mkdirp.sync(prunedContractDirectoryPath)
  mkdirp.sync(sourceContractDirectoryPath)

  fs.readdirSync(sourceContractDirectoryPath)
    .forEach((contractFileName) => {

      // do not consider files that start with an underscore or dot as valid
      //  contracts
      if (/^(_|\.)/.test(contractFileName) || !/\.json$/g.test(contractFileName)) {
        return
      }

      const contractFilePath = `${sourceContractDirectoryPath}/${contractFileName}`

      const contractJSON = JSON.parse(fs.readFileSync(contractFilePath))

      if (!contractJSON.networks[networkId]) {
        console.warn(`skipping ${contractFilePath} because it has no address for network with id ${networkId}`)
        return
      }

      const contractData = {
        name: contractJSON.contractName,
        address: contractJSON.networks[networkId].address,
        abi: contractJSON.abi,
      }

      fs.writeFileSync(`${prunedContractDirectoryPath}/${contractFileName}`, JSON.stringify(contractData))

    })

})
