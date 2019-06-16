'use strict';

const yaml = require('js-yaml');
const {
    FileSystemWallet,
    Gateway
} = require('fabric-network');
const fs = require('fs');
const path = require('path');


// capture network variables from config.json
const configPath = path.join(process.cwd(), './../server/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var userName = config.appAdmin;
var gatewayDiscovery = config.gatewayDiscovery;

// connect to the connection file
const ccpPath = path.join(process.cwd(), './../server/' + connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('./../server/wallet');
const gateway = new Gateway();

class queryByKey {

    // A gateway defines the peers used to access Fabric networks

    // Main try/catch block
    static async queryByKey() {
        try {
            var contract = process.argv[2];
            var func = process.argv[3];
            var parameters = process.argv.slice(4);
            const userExists = await wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }

            // const identityLabel = 'Admin@org1.example.com';
            // let connectionProfile = yaml.safeLoad(fs.readFileSync('./network.yaml', 'utf8'));

            // let connectionOptions = {
            //   identity: identityLabel,
            //   wallet: wallet,
            //   discovery: {
            //     asLocalhost: true
            //   }
            // };

            // Connect to gateway using network.yaml file and our certificates in _idwallet directory
            await gateway.connect(ccp, {
                wallet,
                identity: userName,
                discovery: gatewayDiscovery
            });

            console.log('Connected to Fabric gateway.');

            // Connect to our local fabric
            const network = await gateway.getNetwork('mychannel');

            console.log('Connected to mychannel. ');

            // Get the contract we have installed on the peer
            const channel = network.getChannel();
            let request = { chaincodeId: contract, fcn: func, args: parameters};
            let response = await channel.queryByChaincode(request);
            console.log(response.toString());
            return response;

        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        } finally {
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
        }
    }
}

queryByKey.queryByKey();