const getConfig = require("./getConfig");
const Web3 = require("web3");

module.exports = async function getContractSupply(isTestMode) {
   const config = getConfig(isTestMode);
   const web3 = new Web3(config.infuraEndpoint); 

   let contract = await new web3.eth.Contract([                              
      {
         "inputs": [],
         "name": "totalSupply",
         "outputs": [
            {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      }], config.contractAddress);

   const supply = await contract.methods.totalSupply().call();
   return supply;
}