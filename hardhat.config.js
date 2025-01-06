/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require('dotenv').config();
const { PRIVATE_KEY, API_KEY } = process.env;

module.exports = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1
            }
        }
    },
    networks: {
        polygon: {
            url: `https://polygon-amoy.g.alchemy.com/v2/${API_KEY}`,
            accounts: [
                PRIVATE_KEY,
            ],
        },
        sepolia: {
            url: "https://polygon-amoy.g.alchemy.com/v2/9VhAqL4GhWY3zQDHCx2c36XVrBa7WLVD",
            accounts: [PRIVATE_KEY],
        },
        quorum: {
            url: 'http://172.29.25.252:22000',
            accounts: [PRIVATE_KEY]
        },
        localhost: {
            url: 'http://127.0.0.1:7545',
            accounts: [
                '0xc48e4def0f1bce43cf457928321fc9ae4508758cec5c397eca451c5e1df20790',
            ],
        }
    }
};