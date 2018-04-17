# Codex Protocol | Ethereum Service & Contracts

This package holds all (compiled) Codex Protocol smart contracts and exports
[web3.Contract](http://web3js.readthedocs.io/en/1.0/web3-eth-contract.html)
instances for each one.

This package also exports an instance of
[web3.eth](http://web3js.readthedocs.io/en/1.0/web3-eth.html) for use in
projects so that each individual project doesn't have to set up the eth client
itself.


## Usage

Export `ETHEREUM_NETWORK_ID` & `ETHEREUM_RPC_URL` as environment variables, or
use a package like [dotenv](https://www.npmjs.com/package/dotenv) to define them
in a .env file. Then you can consume the package like so:

```javascript

// NOTE: ethClient will point to Ganache locally, Rinkeby for staging, and
//  Mainnet for production
import { ethClient, contracts } from '@codex-protocol/ethereum-service'

ethClient.sendSignedTransaction(/* ... */)

contracts.BiddableEscrow.getPastEvents(/* ... */)

```


## Contract Development

To use this package as you develop smart contracts locally, follow these steps:

1. Clone this repository and the contract source repo you want to develop
   (see below.)

1. Inside this repo, run `npm link`. This will create a symlink in your global
   `node_modules` folder that other projects can read from. See
   [these docs](https://docs.npmjs.com/cli/link) for more info on `npm link`.

1. Inside whatever repo is using these contracts, run
   `npm install @codex-protocol/ethereum-service` to install the currently
   published version.

   You should also have the package version for
   `@codex-protocol/ethereum-service` set to `latest` instead of a specific
   version number so that deployments will always grab the most recently
   published package version.

   Still in whatever repo is using these contracts, run
   `npm link @codex-protocol/ethereum-service`. This will create a symlink in
   the project's `node_modules` folder that points to the symlink created in the
   previous step.

1. In the contract source repository, run `npm run migrate:reset`. This will
   deploy the contract to Ganache and copy the
   [Truffle Contract Object JSON](https://github.com/trufflesuite/truffle-contract-schema)
   over into this repo's `static` folder.

1. Inside this repo, run `npm build`. This will strip out the essential values
   from the JSON files and save the pruned JSON for use inside your projects.

Now you should have the latest development changes available in the repos using
this package. When contract changes are made from now on, just run `npm copy` in
the contract repo and `npm build` in this repo and restart application using the
this package, then you should be good to go.


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
- [CodexTitle](https://github.com/codex-protocol/contract.codex-title)
