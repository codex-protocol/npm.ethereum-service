import fs from 'fs'
import Web3 from 'web3'

if (!process.env.ETHEREUM_NETWORK_ID || !process.env.ETHEREUM_RPC_URL) {
  console.error('[npm.ethereum-service]', 'both ETHEREUM_NETWORK_ID and ETHEREUM_RPC_URL environment variables must be set to use this package')
  process.exit(1)
}

const contractDirectoryPath = `${__dirname}/../static/contracts/${process.env.ETHEREUM_NETWORK_ID}`

try {
  fs.statSync(contractDirectoryPath)
} catch (error) {
  console.error('[npm.ethereum-service]', `network with id ${process.env.ETHEREUM_NETWORK_ID} is invalid, no contract directory found`)
  process.exit(1)
}

const web3 = new Web3(process.env.ETHEREUM_RPC_URL)
const { eth } = web3

const contracts = {}
const contractFileNames = fs.readdirSync(contractDirectoryPath)

contractFileNames.forEach((contractFileName) => {

  // do not consider files that start with an underscore or dot as valid
  //  contracts
  if (/^(_|\.)/.test(contractFileName) || !/\.json$/g.test(contractFileName)) {
    return
  }

  const contractFilePath = `${contractDirectoryPath}/${contractFileName}`

  try {
    fs.statSync(contractFilePath)
  } catch (error) {
    console.warn('[npm.ethereum-service]', `skipping ${contractFileName} because it has no contract JSON for network with id ${process.env.ETHEREUM_NETWORK_ID}`)
    return
  }

  const contractJSON = JSON.parse(fs.readFileSync(contractFilePath))

  const contractAddress = contractJSON.address
  const contract = new web3.eth.Contract(contractJSON.abi, contractAddress)

  contract.name = contractJSON.name

  contracts[contract.name] = contract

})

if (contracts.CodexTitle && contracts.TokenProxy) {
  contracts.CodexTitle.options.address = contracts.TokenProxy.options.address
  delete contracts.TokenProxy
}

export {
  contracts,
  web3,
  eth,
}

export default {
  contracts,
  web3,
  eth,
}
