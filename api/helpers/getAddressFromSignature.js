module.exports = function getAddressFromSignature(signature) {
   const message = "Sign this message to prove your identity and ownership of this keyword.\nNOTE: this operation doesn't cost you anything, as you can verify by yourself.";
   const ethUtil = require("ethereumjs-util");
   const sig = ethUtil.fromRpcSig(ethUtil.addHexPrefix(signature));
   const msg = ethUtil.hashPersonalMessage(Buffer.from(message));
   const publicKey = ethUtil.ecrecover(msg, sig.v, sig.r, sig.s);
   const pubAddress = ethUtil.pubToAddress(publicKey);
   const address = ethUtil.addHexPrefix(pubAddress.toString('hex'));
   return address;
}