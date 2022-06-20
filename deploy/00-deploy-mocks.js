const { network } = require('hardhat')
const {
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
} = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log('Local network detected, deploying mocks...')
        await deploy('MockV3Aggregator', {
            contract: 'MockV3Aggregator',
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log('Mocks deployed 🚀')
        log('------------------------------------------------')
    }
}

module.exports.tags = ['all', 'mocks']
// allows us to run deploys script based on whether they contain the relevant 'tag'
// e.g npx hardhat deploy --tags mocks
