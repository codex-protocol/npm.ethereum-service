import fs from 'fs'
import Web3 from 'web3'

if (!process.env.ETHEREUM_NETWORK_ID || !process.env.ETHEREUM_RPC_URL) {
  console.error('[npm.ethereum-service]', 'both ETHEREUM_NETWORK_ID and ETHEREUM_RPC_URL environment variables must be set to use this package')
  process.exit(1)
}
const networkId = process.env.ETHEREUM_NETWORK_ID
const contractDirectoryPath = `${__dirname}/../static/contracts/${networkId}`

const networkName = (() => {
  switch (networkId) {
    case '1': return 'mainnet'
    case '3': return 'ropsten'
    case '4': return 'rinkeby'
    case '5777': return 'ganache'
    default: throw new Error(`network with id ${networkId} is invalid, no network name defined`)
  }
})()

try {
  fs.statSync(contractDirectoryPath)
} catch (error) {
  console.error('[npm.ethereum-service]', `network with id ${networkId} is invalid, no contract directory found`)
  process.exit(1)
}

const transactionConfirmationBlocks = (() => {
  switch (networkName) {
    case 'ganache': return 1
    case 'ropsten': return 1
    case 'rinkeby': return 1
    case 'mainnet': return 2
    default: return 1
  }
})()

const web3Options = {
  transactionConfirmationBlocks,
  transactionBlockTimeout: 100,
  transactionPollingTimeout: 900,
}

const web3 = new Web3(process.env.ETHEREUM_RPC_URL, null, web3Options)
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
    console.warn('[npm.ethereum-service]', `skipping ${contractFileName} because it has no contract JSON for network with id ${networkId}`)
    return
  }

  const contractJSON = JSON.parse(fs.readFileSync(contractFilePath))

  const contract = new web3.eth.Contract(contractJSON.abi, contractJSON.address, { data: contractJSON.bytecode })

  contract.name = contractJSON.name
  contract.rawAbi = contractJSON.abi

  contracts[contract.name] = contract

})

if (contracts.CodexRecord && contracts.CodexRecordProxy) {
  contracts.CodexRecord.address = contracts.CodexRecordProxy.address
  delete contracts.CodexRecordProxy
}

export {
  networkName,
  networkId,
  contracts,
  web3,
  eth,
}

export default {
  networkName,
  networkId,
  contracts,
  web3,
  eth,
}
