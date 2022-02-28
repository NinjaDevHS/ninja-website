import { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'react-router-dom'
import Web3 from "web3";
import Footer from "../components/Footer";
import Header from "../components/Header";

const initialInfoState = {
   connected: false,
   status: null,
   account: null,
   web3: null,
   contract: null,
   address: null
};

const initialContractState = {
   supply: 0,
   owners: []
};

function OwnersExtractor() {
   const [info, setInfo] = useState(initialInfoState);   
   const [contractData, setContractData] = useState(initialContractState);      
   const contractAddressRef = useRef();
   const contractSupplyRef = useRef();
   const [searchParams, setSearchParams] = useSearchParams();   
   const [contractAddress, setContractAddress] = useState(searchParams.get("address") ?? "");
   const [contractSupply, setContractSupply] = useState(searchParams.get("supply") ?? "");


   const loadContractData = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
         initMetaMaskListeners();
         try {
            // const accounts = await window.ethereum.request({
            //    method: "eth_requestAccounts",
            // });
            const networkId = await window.ethereum.request({
               method: "net_version",
            });
            let web3 = new Web3(window.ethereum);            
            let contract = await new web3.eth.Contract(
               [                     
                  {
                    "inputs": [],
                    "name": "maxSupply",
                    "outputs": [
                      {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },                     
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
                  },                     
                  {
                    "inputs": [
                      {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                      }
                    ],
                    "name": "tokenURI",
                    "outputs": [
                      {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },
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
                  }                     
               ], contractAddress);

            setInfo((prevState) => ({
               ...prevState,
               connected: true,
               //account: accounts[0],
               web3: web3,
               contract: contract,                  
            }));

            let supply = 0;
            if (contractSupply.length > 0)
               supply = parseInt(contractSupply);
            else 
               supply = await getSupply(contract);
            console.log("Total supply: " + supply);

            // get all addresses
            let addresses = [];
            for (let i = 1; i <= supply; i++) {
               setInfo(() => ({
                  ...initialInfoState,
                  status: `Loading data for token #${i}.`,
               }));
               addresses.push(await getOwnerOf(contract, i));
            }
            
            // get unique addresses and count
            let owners = [];
            for (let i = 0; i < addresses.length; i++) {
               let addr = addresses[i];
               let addrObj = owners.find(a => a.address === addr);
               if (addrObj)
                  addrObj.tokens.push(i+1);
               else 
                  owners.push({ address: addr, tokens:[i+1] });
            }
            owners.sort((a, b) => b.tokens.length - a.tokens.length);

            setContractData((prevState) => ({
               ...prevState,
               supply: supply,
               owners: owners
            }));

            setInfo(() => ({
               ...initialInfoState,
               status: "",
            }));
         } catch (err) {
            console.log(err.message);
            setInfo(() => ({
               ...initialInfoState,
               status: err.message,
            }));
         }
      } else {
         setInfo(() => ({
            ...initialInfoState,
            status: "Please install Metamask.",
         }));
      }
   };

   const initMetaMaskListeners = () => {
      if (window.ethereum) {
         window.ethereum.on("accountsChanged", () => {
            window.location.reload();
         });
         window.ethereum.on("chainChanged", () => {
            window.location.reload();
         });
      }
   };

   const getSupply = async (contract) => {
      try {
         var result = await contract.methods.totalSupply().call();   
         return result;
      } catch (err) {
         console.log(err.message);
      }
   };

   const getOwnerOf = async (contract, tokenId) => {
      try {
         var result = await contract.methods.ownerOf(tokenId).call();
         return result;
      } catch (err) {
         console.log(err.message);
      }
   };

   const handleExtractAddresses = () => {
      setInfo(() => ({
         ...initialInfoState,
         status: "Loading data...stay put.",
      }));
      loadContractData();
   }

   const handleCopyToClipboard = async (separator) => {
      let addresses = [];
      for (let i = 0; i < contractData.owners.length; i++) {
         addresses.push(contractData.owners[i].address);
      }

      await navigator.clipboard.writeText(
         separator + addresses.join(separator + "," + separator) + separator);
      alert("Addresses copied to clipboard, enjoy.");
   }

   return (
      <div>
         <Header />
         
         <div className="bg-white">
            <div className="max-w-screen-lg mx-auto px-4 py-12">
               <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-medium">NFT Owners Extractor</h1>
                  <div>
                     <p>Contract address:</p>
                     <input className="w-full p-2 border border-gray-800 rounded-md" ref={contractAddressRef} value={contractAddress} onChange={e => setContractAddress(e.target.value.trim())}></input>
                  </div>
                  <div>
                     <p>Number of tokens (leave empty to retrieve totalSupply if present):</p>
                     <input className="w-full p-2 border border-gray-800 rounded-md" ref={contractSupplyRef} value={contractSupply} onChange={e => setContractSupply(e.target.value.trim())}></input>
                  </div>
                  <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={handleExtractAddresses}>Extract owners</button>
                  <div className="font-medium">Total supply: {contractData.supply}</div>
                  { contractData.owners.length > 0 ?
                     <>
                     <div className="flex flex-row gap-4">
                        <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={() => handleCopyToClipboard("'")}>Copy list (' quotes)</button>
                        <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={() => handleCopyToClipboard('"')}>Copy list (" quotes)</button>
                        <button className="self-start p-2 px-8 bg-gray-200 rounded-md" onClick={() => handleCopyToClipboard('')}>Copy list (no quotes)</button>
                     </div>
                     <div>
                        <table className="w-full">
                           <tbody>
                           {
                              contractData.owners.map((owner, i) =>
                                 <tr key={i} className="even:bg-slate-100">                        
                                    <td className="py-2 align-top" style={{ width:'420px'}}>{owner.address}</td>
                                    <td className="py-2 align-top" style={{ width:'50px'}}>=&gt;</td>
                                    <td className="py-2 align-top">({owner.tokens.length}): {owner.tokens.join(", ")}</td>
                                 </tr>
                              )
                           }
                           </tbody>
                        </table>
                     </div></> : null
                  }         
                  {info.status ? <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">{info.status}</div> : null }
               </div>
            </div>
         </div>         

         <Footer />
      </div>
   );
}

export default OwnersExtractor;
