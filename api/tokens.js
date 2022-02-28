const getTokens = require("./endpoints/getTokens");
const updateToken = require("./endpoints/updateToken");
const getId = require("./helpers/getId");

require("dotenv").config();

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
   try {
      if (event.httpMethod === "GET") {
         return await getTokens(event, event.queryStringParameters.env === "test");
      } else if (event.httpMethod === "PUT") {
         const tokenId = getId(event.path);
         return await updateToken(event, tokenId, event.queryStringParameters.env === "test");         
      } else {
         return {
            statusCode: 404,
            body: JSON.stringify({errorMessage: "Endpoint doesn't exist"})
         };
      }
   } catch (error) {
      return { statusCode: 500, body: error.toString() };
   }
}

module.exports = { handler }
