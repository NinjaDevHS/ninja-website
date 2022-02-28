const getConfig = require("./getConfig");
const CosmosClient = require("@azure/cosmos").CosmosClient;

module.exports = async function getDbContainer(isTestMode) {
   const config = getConfig(isTestMode);

   const client = new CosmosClient({ 
      endpoint: config.cosmosDbEndpoint,
      key: config.cosmosDbKey 
   });
   const { database } = await client.databases.createIfNotExists({
      id: config.cosmosDbDatabaseId
   });
   const { container } = await database.containers.createIfNotExists({ 
      id: config.cosmosDbContainerId,
      partitionKey : config.cosmosDbPartitionKey
   }, { offerThroughput: 400 });

   return container;
}