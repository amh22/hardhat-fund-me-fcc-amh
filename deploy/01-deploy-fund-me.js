// function deployFunc() {
//     console.log('Yo G')
// }
// module.exports.default = deployFunc

const { network } = require('hardhat')
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get('MockV3Aggregator')
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
    }

    // if the contract does not exist, we deploy a minimal version
    // for our local testing

    // what happens when we want to change chains?
    // when going for a localhost or hardhat network we want to use a mock

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log('Deployed 🚀')
    log('------------------------------------------------')
}

module.exports.tags = ['all', 'fundme']
