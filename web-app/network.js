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

class queryHelper {
    static async addSecurityQuestion(contractName, accountKey, question, answer) {
        try {
            await gateway.connect(ccp, {
                wallet,
                identity: userName,
                discovery: gatewayDiscovery
            });
            console.log('Connected to Fabric gateway.');
            // Connect to our local fabric
            const network = await gateway.getNetwork('mychannel');

            console.log('Connected to mychannel. ');
            const contract = network.getContract(contractName);
            // Get the contract we have installed on the peer
            console.log(accountKey);
            console.log(question);
            const createMemberResponse = await contract.submitTransaction('addSecurityQuestion', accountKey, question, answer);
            console.log('createMemberResponse: ');
            console.log(createMemberResponse.toString());
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        } finally {
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
        }
    }

    static async queryAccount(contractName, accountKey) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');

        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        const createMemberResponse = await contract.submitTransaction('queryTrader', accountKey);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    static async checkPoll(contractName, proposalName) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');

        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        const createMemberResponse = await contract.submitTransaction('PollIsFinished', proposalName);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    // recoverAccount(ctx, proposalName, sos, detail, initiator, oldAccount)   
    static async startPoll(contractName, proposalName, sos, detail, initiator, oldAccount) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');

        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        const createMemberResponse = await contract.submitTransaction('recoverAccount', proposalName, sos, detail, initiator, oldAccount);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    static async SecurityProblem(contractName, traderKey) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');

        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        traderKey = traderKey + "-SQ";
        const createMemberResponse = await contract.submitTransaction('querySQ', traderKey);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    static async addMnemonic(contractName, traderKey, word) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');

        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        const createMemberResponse = await contract.submitTransaction('addMnemonicWord', traderKey, word);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    static async queryMnemonic(contractName, traderKey) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');
        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        const createMemberResponse = await contract.submitTransaction('queryMnemonicWord', traderKey);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    static async transferAccount(contractName, oldAccount, newAccount, detail) {
        await gateway.connect(ccp, {
            wallet,
            identity: userName,
            discovery: gatewayDiscovery
        });
        console.log('Connected to Fabric gateway.');
        // Connect to our local fabric
        const network = await gateway.getNetwork('mychannel');
        console.log('Connected to mychannel. ');
        const contract = network.getContract(contractName);
        // Get the contract we have installed on the peer
        const createMemberResponse = await contract.submitTransaction('transferAccount', oldAccount, newAccount, detail);
        console.log('createMemberResponse: ');
        var response = createMemberResponse.toString()
        console.log(response);
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
        return response;
    }

    static async query(args) {
        try {
            var inputs = Array.prototype.slice.call(arguments);
            const userExists = await wallet.exists(userName);
            if (!userExists) {
                console.log('An identity for the user ' + userName + ' does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
                return response;
            }

            // Create a new gateway for connecting to our peer node.
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

            //set up our request - specify which chaincode, which function, and which arguments
            let parameters = inputs.slice(2);
            let request = {
                chaincodeId: inputs[0],
                fcn: inputs[1],
                args: parameters
            };

            //query the ledger by the key in the args above
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


module.exports = queryHelper;