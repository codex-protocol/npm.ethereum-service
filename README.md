# Codex Protocol | Ethereum Service & Contracts _(npm.ethereum-service)_

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> All Codex Protocol smart contracts in a centralized package for use in various projects

This package holds all (compiled) Codex Protocol smart contracts and exports
[web3.Contract](http://web3js.readthedocs.io/en/1.0/web3-eth-contract.html)
instances for each one.

This package also exports an instance of
[web3.eth](http://web3js.readthedocs.io/en/1.0/web3-eth.html) for use in
projects so that each individual project doesn't have to set up the eth client
itself.

## Table of Contents

- [Install](#install)
  - [Clone & Set Up Required Repositories](#clone--set-up-required-repositories)
  - [Dependencies](#dependencies)
- [Usage](#usage)
  - [Testing Local Contract Changes](#testing-local-contract-changes)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)


## Install

To use this package as you develop smart contracts locally, follow these steps:

### Clone & Set Up Required Repositories

1. First, clone this repository and all Codex Protocol smart contract repositories you wish to use (see [Dependencies](#dependencies) below for more details):

    - [contract.codex-registry](https://github.com/codex-protocol/contract.codex-registry)
    - [npm.ethereum-service](https://github.com/codex-protocol/npm.ethereum-service)

    ```bash
    $ git clone https://github.com/codex-protocol/contract.codex-registry
    $ git clone https://github.com/codex-protocol/npm.ethereum-service
    ```

    (Optional) Since this repository doesn't really do anything except hold deployed contracts, you'll probably also want to clone a repository that actually uses the contracts, such as the the [Codex Registry API](https://github.com/codex-protocol/service.codex-registry-api), [EEL](https://github.com/codex-protocol/service.eel), and/or the [Codex Viewer](https://github.com/codex-protocol/web.codex-viewer):

    - [service.codex-registry-api](https://github.com/codex-protocol/service.codex-registry-api)
    - [web.codex-viewer](https://github.com/codex-protocol/web.codex-viewer)
    - [service.eel](https://github.com/codex-protocol/service.eel)

    ```bash
    $ git clone https://github.com/codex-protocol/service.codex-registry-api
    $ git clone https://github.com/codex-protocol/web.codex-viewer
    $ git clone https://github.com/codex-protocol/service.eel
    ```

    **IMPORTANT NOTE:** It's necessary to have all of these repositories in the same directory, since our npm scripts assume this is the case.

1. Then install all npm packages in each repository:

    ```bash
    $ cd ../contract.codex-registry
    $ npm install

    $ cd ../npm.ethereum-service
    $ npm install

    $ cd ../service.codex-registry-api
    $ npm install

    $ cd ../web.codex-viewer
    $ npm install

    $ cd ../service.eel
    $ npm install
    ```

1. After you've installed all npm packages, you will also need to [npm link](https://docs.npmjs.com/cli/link) the ethereum-service repository so that other projects (e.g. the [API](https://github.com/codex-protocol/service.codex-registry-api), [EEL](https://github.com/codex-protocol/service.eel), & the [Codex Viewer](https://github.com/codex-protocol/web.codex-viewer)) can use your locally-deployed smart contracts:

    ```bash
    $ cd npm.ethereum-service
    $ npm link

    $ cd ../service.codex-registry-api
    $ npm link @codex-protocol/ethereum-service

    $ cd ../web.codex-viewer
    $ npm link @codex-protocol/ethereum-service

    $ cd ../service.eel
    $ npm link @codex-protocol/ethereum-service
    ```

    Now when you deploy the smart contracts locally, other projects will be able to pull the ABIs from the linked ethereum-service repository.

    **IMPORTANT NOTE:** every time you run `npm install` in "other" repositories, you will need to re-link the ethereum-service repository. For convenience, you can simply run the npm script `npm run link-all` to link, or `npm run install-and-link` to install and link in one step. (You re-link in the "other" repositories, not the ethereum-service repository.)

### Dependencies

Now you will need to install & set up some dependencies.

1. [Ganache](http://truffleframework.com/ganache)

    Ganache is a blockchain development application that allows you to deploy & test contracts locally.

    You can download Ganache directly from [the Truffle Framework website](http://truffleframework.com/ganache).


1. Link the ethereum-service repository

    Make sure you've cloned the [ethereum-service repository](https://github.com/codex-protocol/npm.ethereum-service) and have `npm link`ed it so that other projects will be able to use your locally-deployed smart contracts (see [Clone & Set Up Required Repositories](#clone--set-up-required-repositories) above).

    For more information on this repository, see the [README](https://github.com/codex-protocol/npm.ethereum-service/blob/master/README.md).


1. Deploy Codex Protocol smart contracts

    After you've set up Ganache and linked the ethereum-service repository, you will need to deploy the Codex Protocol smart contracts. Examples of Codex Protocol smart contracts you may wish to deploy include:

    - [contract.codex-registry](https://github.com/codex-protocol/contract.codex-registry)
    - [contract.codex-coin](https://github.com/codex-protocol/contract.codex-coin)

    Make sure Ganache is running, and then run:

    ```bash
    $ cd contract.codex-registry
    $ npm run migrate:reset

    $ cd contract.codex-coin
    $ npm run migrate:reset
    ```

    This will make Truffle deploy the contracts to Ganache and copy over the built contract JSON files to the ethereum-service repository, where other projects will be able to read them.


## Usage

You will now be able to use your locally-deployed contracts inside of any other `npm link`ed projects.

In the other repositories, export `ETHEREUM_NETWORK_ID` & `ETHEREUM_RPC_URL` as environment variables (or
use a package like [dotenv](https://www.npmjs.com/package/dotenv) to define them
in a `.env` file.) Then you can consume the package like so:

```javascript
import { eth, contracts } from '@codex-protocol/ethereum-service'

eth.sendSignedTransaction(/* ... */)

contracts.CodexRecord.getPastEvents(/* ... */)
```

Note that the [API](https://github.com/codex-protocol/service.codex-registry-api), [EEL](https://github.com/codex-protocol/service.eel), and the [Codex Viewer](https://github.com/codex-protocol/web.codex-viewer) are already configured to use ethereum-service locally, so you should only have to deploy the contracts and start them up (after `npm link`-ing as described above in [Clone & Set Up Required Repositories](#clone--set-up-required-repositories).)

### Testing Local Contract Changes

Every time you make contract changes and redeploy them to Ganache, restart any projects using the ethereum-service and you should have the updated contract ABIs!


## Maintainers

- [John Forrest](mailto:john@codexprotocol.com) ([@johnhforrest](https://github.com/johnhforrest))
- [Colin Wood](mailto:colin@codexprotocol.com) ([@Anaphase](https://github.com/Anaphase))
- [Shawn Price](mailto:shawn@codexprotocol.com) ([@sprice](https://github.com/sprice))


## Contribute

If you have any questions, feel free to reach out to one of the repository [maintainers](#maintainers) or simply [open an issue](https://github.com/codex-protocol/npm.ethereum-service/issues/new) here on GitHub. If you have questions about Codex Protocol in general, feel free to [reach out to us Telegram!](https://t.me/codexprotocol)

[Pull Requests](https://github.com/codex-protocol/npm.ethereum-service/pulls) are not only allowed, but highly encouraged! All Pull Requests must pass CI checks (if applicable) and be approved by at least one repository [maintainer](#maintainers) before being considered for merge.

Codex Labs, Inc follows the [Contributor Covenant Code of Conduct](https://contributor-covenant.org/version/1/4/code-of-conduct).


## License

[GNU Affero General Public License v3.0 or later](LICENSE) © Codex Labs, Inc
