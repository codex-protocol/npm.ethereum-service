Running `npm run build` in this repo will copy & prune the contracts in
`static/contracts-source` for use when deployed. Non-development (network 5777)
contracts should be committed and published.

NOTE: development contracts (network 5777) are .npmignore'd since development
contracts can't be used by anyone other than you on your machine (because
Ganache will deploy the contract to a different address for every machine.)
