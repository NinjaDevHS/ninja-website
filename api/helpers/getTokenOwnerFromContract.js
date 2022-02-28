const getConfig = require("./getConfig");
const Web3 = require("web3");

module.exports = async function getTokenOwnerFromContract(tokenId, isTestMode) {
   const config = getConfig(isTestMode);
   const web3 = new Web3(config.infuraEndpoint); 

   let contract = await new web3.eth.Contract([                              
      {
         "inputs": [
            {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
            }
         ],
         "name": "ownerOf",
         "outputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
         ],
         "stateMutability": "view",
         "type": "function"
      }], config.contractAddress);

   const ownerAddress = await contract.methods.ownerOf(tokenId).call();
   return ownerAddress;
}