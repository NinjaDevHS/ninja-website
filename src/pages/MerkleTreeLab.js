import { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MerkleTreeLab() {
   const addressesDumpRef = useRef();
   const [addressesDump, setAddressesDump] = useState("");
   const walletAddressRef = useRef();
   const [walletAddress, setWalletAddress] = useState("");
   const [merkleTree, setMerkleTree] = useState(null);
   const [merkleRoot, setMerkleRoot] = useState("");
   const [merkleProof, setMerkleProof] = useState("");
   const [isInWhitelist, setIsInWhitelist] = useState(false);

   const handleGenerateMerkleRoot = () => {
      const addresses = addressesDump.split(",");
      const leaves = addresses.map(x => keccak256(Web3.utils.toChecksumAddress(x)));
      const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
      const root = tree.getHexRoot();
      setMerkleTree(tree);
      setMerkleRoot(root);
   }

   const handleCheckWalletAddress = () => {
      try {
         const leaf = keccak256(Web3.utils.toChecksumAddress(walletAddress));
         const proof = merkleTree.getHexProof(leaf);
         setMerkleProof(proof);

         const verified = merkleTree.verify(proof, leaf, merkleRoot);
         setIsInWhitelist(verified);
      } catch (err) {
         setIsInWhitelist(false);
      }
   }

   const handleLoadWhitelist = () => {
      axios.get("/data/whitelist_test.json").then((response) => {
         setAddressesDump(response.data.join(","));
      });
   }

   return (
      <div>
         <Header />
         
         <div className="bg-white">
            <div className="max-w-screen-lg mx-auto px-4 py-12">
               <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-medium">Generate Whitelist Hash</h1>
                  <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={handleLoadWhitelist}>Load addresses from file</button>
                  <div>
                     <p>List of addresses:</p>
                     <textarea rows="10" className="w-full p-2 border border-gray-800 rounded-md" ref={addressesDumpRef} value={addressesDump} onChange={e => setAddressesDump(e.target.value.trim())}></textarea>         
                  </div>
                  <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={handleGenerateMerkleRoot}>Generate Root</button>
                  <div className="font-medium">Root: {merkleRoot}</div>
               </div>

               <hr className="my-8 border-2" />
               
               <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-medium">Is Wallet Whitelisted?</h1>               
                  <div>
                     <p>Wallet Address:</p>
                     <input className="w-full p-2 border border-gray-800 rounded-md" ref={walletAddressRef} value={walletAddress} onChange={e => setWalletAddress(e.target.value.trim())}></input>         
                  </div>
                  <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={handleCheckWalletAddress}>Check</button>
                  <div className="font-medium">Proof: {merkleProof}</div>
                  <div className="font-medium">In Whitelist: {isInWhitelist.toString()}</div>
               </div>
            </div>
         </div>

         <Footer />
      </div>
   );
}

export default MerkleTreeLab;
