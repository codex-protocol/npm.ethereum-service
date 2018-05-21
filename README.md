# Codex Protocol | Ethereum Service & Contracts

This package holds all (compiled) Codex Protocol smart contracts and exports
[web3.Contract](http://web3js.readthedocs.io/en/1.0/web3-eth-contract.html)
instances for each one.

This package also exports an instance of
[web3.eth](http://web3js.readthedocs.io/en/1.0/web3-eth.html) for use in
projects so that each individual project doesn't have to set up the eth client
itself.


## Installation & Contract Development

To use this package as you develop smart contracts locally, follow these steps:

### tl;dr
```bash

cd contract.biddable-escrow
npm run migrate:reset # or `npm run copy` if you already have this contract deployed

# repeat the steps above for each contract you need in your project

cd ../npm.ethereum-service
npm link

cd ../service.biddable-api # or whatever project you need to use contracts in
npm install --save @codex-protocol/ethereum-service@latest
npm link @codex-protocol/ethereum-service
npm start

```

### The Long Version

1. Clone this repository and the contract source repo you want to develop
   (see below.)

1. In the contract source repository, run `npm run migrate:reset`. This will
   deploy the contract to Ganache and copy the
   [Truffle Contract Object JSON](https://github.com/trufflesuite/truffle-contract-schema)
   over into this repo's `static` folder. If you've already got the contracts
   deployed locally, then just run `npm run copy`. This step will also run
   `npm run build` in the npm.ethereum-serivce repo, which strips out the
   essential values from the JSON files and saves the pruned JSON for use inside
   your projects.

1. Inside this repo, run `npm link`. This will create a symlink in your global
   `node_modules` folder that other projects can read from. See
   [these docs](https://docs.npmjs.com/cli/link) for more info on `npm link`.

1. Inside whatever repo is using these contracts, run
   `npm install @codex-protocol/ethereum-service` to install the currently
   published version.

   _NOTE: You should also set the package version for
   `@codex-protocol/ethereum-service` set to `latest` instead of a specific
   version number so that deployments will always grab the most recently
   published package version._

   Still in whatever repo is using these contracts, run
   `npm link @codex-protocol/ethereum-service`. This will create a symlink in
   the project's `node_modules` folder that points to the symlink created in the
   previous step.

Now you should have the latest development changes available in the repos using
this package. When contract changes are made from now on, just run `npm migrate`
in the contract repo, then restart the applications using the this package.

### Caveats

Every time you do a fresh `npm install` in the repos that use this package, you
will have to re-link your local environment so that the development builds of
the contracts are available. So just run
`npm install && npm link @codex-protocol/ethereum-service` whenever you want to
install dependencies in projects that use this package.


## Usage

Export `ETHEREUM_NETWORK_ID` & `ETHEREUM_RPC_URL` as environment variables, or
use a package like [dotenv](https://www.npmjs.com/package/dotenv) to define them
in a .env file. Then you can consume the package like so:

```javascript

// NOTE: eth will point to Ganache locally, Rinkeby for staging, and
//  Mainnet for production
import { eth, contracts } from '@codex-protocol/ethereum-service'

eth.sendSignedTransaction(/* ... */)

contracts.BiddableEscrow.getPastEvents(/* ... */)

```


## Publishing New Contract Revisions

When you're ready to publish new contract changes, follow these steps:

1. In the contract source repository, run `npm run migrate:reset:staging` or
   `npm run migrate:reset:production` (based on the network you want to deploy
   the contract to.)

1. In this repository, commit the newly copied JSON files.

1. In this repository, run `npm run bump-version`.

1. In the repositories using this module, run
   `npm update --save @codex-protocol/ethereum-service`.

## Contract Source Repositories
- [BiddableEscrow](https://github.com/codex-protocol/contract.biddable-escrow)
- [CodexTitle](https://github.com/codex-protocol/contract.codex-registry)
