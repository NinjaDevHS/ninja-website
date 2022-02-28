const getDbContainer = require("../helpers/getDbContainer");
const getAddressFromSignature = require("../helpers/getAddressFromSignature");
const getTokenOwnerFromContract = require("../helpers/getTokenOwnerFromContract");

module.exports = async function updateToken(event, tokenId, isTestMode) {
   try {
      // get the signer's public address
      console.log(`Validating signature: ${event.headers.signature}`);
      const signerAddress = getAddressFromSignature(event.headers.signature).toLowerCase();      
      console.log(`Signer's address is ${signerAddress}`);
      // get the current token's owner's address from the blockchain
      const ownerAddress = (await getTokenOwnerFromContract(parseInt(tokenId), isTestMode)).toLowerCase();
      console.log(`Owner's address is ${ownerAddress}`);
      // check if the signer is the owner, and if not return a 401
      if (signerAddress != ownerAddress) {
         return { statusCode: 401, body: "" };
      }

      // update or create the token in the DB
      const reqBody = JSON.parse(event.body);      
      const container = await getDbContainer(isTestMode);
      const { resource: tokenToUpdate } = await container.item(tokenId, tokenId).read();
      
      if (tokenToUpdate) {
         console.log("UPDATING: " + tokenToUpdate);
         tokenToUpdate.linkUrl = reqBody.linkUrl;
         tokenToUpdate.updatedBy = signerAddress;
         tokenToUpdate.ownedBy = signerAddress;
         tokenToUpdate.updateCount += 1;
         tokenToUpdate.updatedAt = new Date().toISOString();
         await container.item(tokenId, tokenId).replace(tokenToUpdate);
      } else {
         console.log("CREATING token");
         await container.items.create({
            id: tokenId,
            linkUrl: reqBody.linkUrl,
            updatedBy: signerAddress,
            ownedBy: signerAddress,
            updateCount: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
         });
      }

      return { statusCode: 200, body: "" };
   } catch (error) {
      return { statusCode: 500, body: error.toString() };
   }
};