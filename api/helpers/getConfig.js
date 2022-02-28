require("dotenv").config();

module.exports = function getConfig(isTestMode) {
   if (isTestMode) {
      return {
         cosmosDbEndpoint: process.env.MY_TEST_COSMOSDB_ENDPOINT,
         cosmosDbKey: process.env.MY_TEST_COSMOSDB_KEY,
         cosmosDbDatabaseId: process.env.MY_TEST_COSMOSDB_DATABASEID,
         cosmosDbContainerId: process.env.MY_TEST_COSMOSDB_CONTAINERID,
         cosmosDbPartitionKey: { kind: "Hash", paths: ["/id"] },
         infuraEndpoint: process.env.MY_TEST_INFURA_ENDPOINT,
         contractAddress: process.env.MY_TEST_CONTRACT_ADDRESS,
      };
   } else {
      return {
         cosmosDbEndpoint: process.env.MY_COSMOSDB_ENDPOINT,
         cosmosDbKey: process.env.MY_COSMOSDB_KEY,
         cosmosDbDatabaseId: process.env.MY_COSMOSDB_DATABASEID,
         cosmosDbContainerId: process.env.MY_COSMOSDB_CONTAINERID,
         cosmosDbPartitionKey: { kind: "Hash", paths: ["/id"] },
         infuraEndpoint: process.env.MY_INFURA_ENDPOINT,
         contractAddress: process.env.MY_CONTRACT_ADDRESS,
      };
   }
}