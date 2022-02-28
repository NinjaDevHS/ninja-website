const getDbContainer = require("../helpers/getDbContainer");
const getContractSupply = require("../helpers/getContractSupply");

module.exports = async function getTokens(event, isTestMode) {
   try {            
      let tokens = isTestMode ? require("../data/tokens_test.json") : require("../data/tokens.json");
      // get the quantity of tokens minted so far from the contract, 
      // and discard all others from the list loaded from disk
      const contractSupply = await getContractSupply(isTestMode);
      tokens = tokens.slice(0, contractSupply);

      const container = await getDbContainer(isTestMode);
      const { resources: items } = await container.items
         .query({ query: "SELECT * from c" }).fetchAll();
   
      items.forEach(item => {
         let token = tokens.find(t => t.id === item.id);
         if (token)
            token.linkUrl = item.linkUrl;
      });
       
      return {
         statusCode: 200,
         body: JSON.stringify(tokens),
      };
   } catch (error) {
      return { statusCode: 500, body: error.toString() };
   }
};