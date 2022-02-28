import { useEffect, useState } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import axios from "axios";

const initialInfoState = {
   connected: false,
   status: null,
   account: null,
   web3: null,
   contract: null
};

const initialMintState = {
   loading: false,
   amount: 1,
   supply: "0",
   cost: "0",
   termsAccepted: false,
   walletTokens: []
};

const initialWhitelistState = {
   loading: false,
   status: null,
   addresses: [],
   tree: null,
   treeRoot: null,
   isWhitelisted: false
};

function Minter({ config, mode, showKeywordsLink }) {
   const [info, setInfo] = useState(initialInfoState);
   const [mintInfo, setMintInfo] = useState(initialMintState);
   const [whitelistInfo, setWhitelistInfo] = useState(initialWhitelistState);
   const [walletConnectProvider, setWalletConnectProvider] = useState(null);

   const initWithMetaMask = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
         try {
            const accounts = await window.ethereum.request({
               method: "eth_requestAccounts",
            });
            const networkId = await window.ethereum.request({
               method: "net_version",
            });
            if (networkId === config.chain_id.toString()) {
               let web3 = new Web3(window.ethereum);
               setInfo((prevState) => ({
                  ...prevState,
                  connected: true,
                  status: null,
                  account: accounts[0],
                  web3: web3,
                  contract: new web3.eth.Contract(
                     config.abi,
                     config.address
                  )
               }));
               setMintInfo((prevState) => ({
                  ...prevState,
                  status: ``,
               }));
            } else {
               setInfo(() => ({
                  ...initialInfoState,
                  status: `Change network to ${config.chain}`,
               }));
               setMintInfo((prevState) => ({
                  ...prevState,
                  status: ``,
               }));
            }
         } catch (err) {
            console.log(err.message);
            setInfo(() => ({
               ...initialInfoState,
            }));
         }
      } else {
         setInfo(() => ({
            ...initialInfoState,
            status: "Please install Metamask or use WalletConnect",
         }));
      }
   };

   const initWithWalletConnect = async (t) => {
      const provider = new WalletConnectProvider({
         infuraId: config.infura_id,
      });   
      try {
         await provider.enable();
         initWalletConnectListeners();
         console.log(provider);
      } catch (err) {
         return;
      }      

      try {
         const accounts = provider.accounts;
         const networkId = provider.chainId.toString();
         if (networkId === config.chain_id) {
            let web3 = new Web3(provider);
            setInfo((prevState) => ({
               ...prevState,
               connected: true,
               status: null,
               account: accounts[0],
               web3: web3,
               contract: new web3.eth.Contract(
                  config.abi,
                  config.address
               )
            }));
            setMintInfo((prevState) => ({
               ...prevState,
               status: ``,
            }));
            setWalletConnectProvider(provider);
         } else {
            setWalletConnectProvider(null);
            setInfo(() => ({
               ...initialInfoState,
               status: `Change network to ${config.chain}`,
            }));
            setMintInfo((prevState) => ({
               ...prevState,
               status: ``,
            }));
         }
      } catch (err) {
         console.log(err.message);
         setInfo(() => ({
            ...initialInfoState,
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

   const initWalletConnectListeners = () => {
      if (info.provider) {
         info.provider.on("accountsChanged", (accounts) => {            
            window.location.reload();
          });          
          info.provider.on("chainChanged", (chainId) => {
            window.location.reload();
          });         
          info.provider.on("disconnect", (code, reason) => {
            window.location.reload();
          });
      }
   }

   const getSupply = async () => {
      try {
         var result = await info.contract.methods.totalSupply().call();
         console.log("Current total supply: " + result);
         setMintInfo((prevState) => ({
            ...prevState,
            supply: result.toString(),
         }));
      } catch (err) {
         setMintInfo((prevState) => ({
            ...prevState,
            supply: "0",
         }));
      }
   };

   const getCost = async () => {
      try {
         var result = await info.contract.methods.cost().call();
         console.log("Cost: " + result);
         setMintInfo((prevState) => ({
            ...prevState,
            cost: result.toString(),
         }));
      } catch (err) {
         setMintInfo((prevState) => ({
            ...prevState,
            cost: "0",
         }));
      }
   };

   const getWallet = async () => {
      try {
         var revealed = await info.contract.methods.revealed().call();
         var result = await info.contract.methods.walletOfOwner(info.account).call();
         console.log("Wallet: " + result);

         var walletTokens = result.map(item => {
            return { id: item,
               imageUrl: revealed ?
                  config.post_reveal_image_url.replace("_TOKENID_", item) :
                  config.pre_reveal_image_url
            };
         });
         walletTokens = walletTokens.reverse();
         console.log("Wallet tokens: " + walletTokens);

         setMintInfo((prevState) => ({
            ...prevState,
            walletTokens: walletTokens,
         }));
      } catch (err) {
         console.log("Error fetching wallet: " + err);
      }
   };

   const mint = async () => {
      try {
         if (!mintInfo.termsAccepted) {
            setMintInfo((prevState) => ({
               ...prevState,
               status: "You must accept the terms before minting",
            }));
            return;
         }

         setMintInfo((prevState) => ({
            ...prevState,
            loading: true,
            status: `Minting ${mintInfo.amount}...`,
         }));

         if (mode === "sale") {
            await info.contract.methods.mint(mintInfo.amount)
               .send({ from: info.account, value: Number(mintInfo.cost) * mintInfo.amount })
               .on("receipt", async () => {
                  console.log(`You've received the NFT`);
               })
               .on("error", (error) => {
                  console.log(`error in purchase- ${error}`);
               });
         } else if (mode === "presale") {
            await info.contract.methods.mintWhitelist(mintInfo.amount, getMerkleProof())
            .send({ from: info.account, value: Number(mintInfo.cost) * mintInfo.amount })
               .on("receipt", async () => {
                  console.log(`You've received the NFT`);
               })
               .on("error", (error) => {
                  console.log(`error in purchase- ${error}`);
               });
         }

         setMintInfo((prevState) => ({
            ...prevState,
            loading: false,
            status: "Woohoo, you did it, you're now part of the Squad! Your Ninja keyword NFT will show up on OpenSea and the other marketplaces, once the transaction is successful.",
         }));
         getSupply();
         getWallet();
      } catch (err) {
         setMintInfo((prevState) => ({
            ...prevState,
            loading: false,
            status: err.message,
         }));
      }
   };

   const updateAmount = (newAmount) => {
      if (newAmount <= config.max_per_account && newAmount >= 1) {
         setMintInfo((prevState) => ({
            ...prevState,
            amount: newAmount,
         }));
      }
   };

   const connectToContract = (providerType = "metamask") => {
      if (providerType === "metamask") {
         console.log("Connecting with MetaMask");
         initWithMetaMask();
      } else {
         console.log("Connecting with WalletConnect");
         initWithWalletConnect(); 
      }
   };

   const connectToWallet = (providerType = "metamask") => {
      connectToContract(providerType);
   };

   const disconnectWalletConnect = () => {
      if (walletConnectProvider) {
         walletConnectProvider.close();
         window.location.reload();
         setWalletConnectProvider(null);
      }       
   };

   const loadWhitelistFromFile = () => {
      setWhitelistInfo((prevState) => ({
         ...prevState,
         loading: true,
      }));

      axios.get(config.whitelist_url).then((response) => {
         const leaves = response.data.map(x => keccak256(Web3.utils.toChecksumAddress(x)));
         const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
         const root = tree.getHexRoot();
         console.log("MerkleTree root for whitelist: " + root);
         setWhitelistInfo((prevState) => ({
            ...prevState,
            loading: false,
            addresses: response.data,
            tree: tree,
            treeRoot: root
         }));
      });
   };

   const checkIfWhitelisted = () => {
      if (mode === "presale" && info.connected && whitelistInfo.addresses.length > 0) {
         const leaf = keccak256(Web3.utils.toChecksumAddress(info.account));
         const proof = whitelistInfo.tree.getHexProof(leaf);
         const verified = whitelistInfo.tree.verify(proof, leaf, whitelistInfo.treeRoot);
         setWhitelistInfo((prevState) => ({
            ...prevState,
            isWhitelisted: verified,
         }));
         console.log("Whitelisted: " + verified);
      }
   }

   const getMerkleProof = () => {
      if (mode === "presale" && info.connected && whitelistInfo.addresses.length > 0) {
         const leaf = keccak256(Web3.utils.toChecksumAddress(info.account));
         const proof = whitelistInfo.tree.getHexProof(leaf);
         return proof;
      } else {
         return null;
      }
   }

   useEffect(() => {
      // if presale mode, load the whitelist addresses file, and build a merkletree from it
      if (mode === "presale") {
         loadWhitelistFromFile();
      }
      // if permission to get connected accounts was given already, do it now, 
      // otherwise postpone until user clicks the Connect Wallet button
      if (window.ethereum && window.ethereum.isMetaMask)
      {
         let web3 = new Web3(window.ethereum);
         if (web3.eth.getAccounts().then(accounts => {
            if (accounts.length) {
               connectToWallet();
            }
         }));
      }      
      initMetaMaskListeners();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (info.connected) {
         getSupply();
         getCost();
         getWallet();
         checkIfWhitelisted();         
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [info.connected]);

   useEffect(() => {
      if (info.connected) {
         checkIfWhitelisted();         
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [whitelistInfo.addresses]);   

   return (
      <>
      <div className="flex flex-col md:flex-row gap-16 pt-8">
         <div className="flex-1 flex flex-col gap-4">
            {showKeywordsLink &&
               <div className="text-center p-2">
                  <a href="./keywords">See keywords minted so far</a>
               </div>
            }
            {info.connected ?
               <>
               {(mode === "sale" || (mode === "presale" && !whitelistInfo.loading && whitelistInfo.isWhitelisted)) ?
                  <> {/* public sale or presale but whitelisted */}
                  {mintInfo.supply < config.total_supply ? 
                     (<div className="flex flex-col gap-4 text-center">
                        {mintInfo.walletTokens.length < config.max_per_account ?
                           (<div className="flex flex-row gap-2">
                           <button
                              disabled={mintInfo.cost === "0" || mintInfo.amount === 1}
                              className="flex-none p-4 bg-slate-200 rounded-md"
                              onClick={() => updateAmount(mintInfo.amount - 1)}
                           > - </button>
                           <button className="grow p-4 bg-slate-200 rounded-md" onClick={(e) => mint()} disabled={mintInfo.cost === "0"}>
                              MINT {mintInfo.amount}
                           </button>
                           <button
                              disabled={mintInfo.cost === "0" || config.max_per_account <= mintInfo.walletTokens.length + mintInfo.amount}
                              className="flex-none p-4 bg-slate-200 rounded-md"
                              onClick={() => updateAmount(mintInfo.amount + 1)}
                           > + </button>
                           </div>)
                           :
                           <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">You've minted enough!</div>
                        }
                        <div>
                           max {config.max_per_account} per person,{" "}
                           {info.web3?.utils.fromWei(mintInfo.cost, "ether") * mintInfo.amount}{" "} {config.chain_symbol} each                         
                        </div>
                        <div className="text-xs text-center">
                           ({mintInfo.supply}/{config.total_supply} minted)
                        </div>
                        <div className="text-xs text-center">
                           Connected with: {String(info.account).substring(0, 6) + "..." + String(info.account).substring(38)}{" "}
                           { walletConnectProvider ? (
                              <>(<a href="/#" onClick={ (e) => { disconnectWalletConnect(); e.preventDefault(); }}>logout</a>)</>
                           ): null}
                        </div>                                    
                     </div>)                  
                     :
                     <div>
                        <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200 font-medium">
                           {mintInfo.supply}/{config.total_supply} minted, we've sold out!
                        </div>
                        <p>But fear not, you can still buy and trade the {config.name}{" "}
                        on marketplaces such as <a href={config.opensea_collection_url} target="_blank" rel="noreferrer">OpenSea</a>
                        </p>
                     </div>
                  }

                  { mintInfo.status ? <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">{mintInfo.status}</div> : null }         
                  { info.status ? <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">{info.status}</div> : null }                  
                  </>
                  :
                  <div className="flex flex-col gap-4 text-center">
                     <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">
                        { whitelistInfo.loading ?
                           <span>Loading whitelist...</span> :
                           <span>Pre-sale minting going on, but you're not in the whitelist, sorry buddy :(
                           Check out the Discord for more info...</span>
                        }
                     </div>
                     <div className="text-xs text-center">
                        Connected with: {String(info.account).substring(0, 6) + "..." + String(info.account).substring(38)}{" "}
                        { walletConnectProvider ? (
                           <>(<a href="/#" onClick={ (e) => { disconnectWalletConnect(); e.preventDefault(); }}>logout</a>)</>
                        ): null}
                     </div>
                  </div>
               }
               </>            
               : 
               <>
               <div className="text-center">
                  <button className="p-4 mb-2 bg-slate-200 w-full rounded-md" onClick={(e) => connectToWallet()}>Connect with MetaMask</button>
                  <a className="text-xs" href="/#" onClick={ (e) => { connectToWallet("walletconnect"); e.preventDefault(); }}>Connect with WalletConnect</a>
               </div>
               { mintInfo.status ? <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">{mintInfo.status}</div> : null }
               { info.status ? <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">{info.status}</div> : null }
               </>
            }               
         </div>                  
         <div className="flex-1">
            { (((mode === "presale" && whitelistInfo.isWhitelisted) || mode === "sale") 
               && 
               mintInfo.supply < config.total_supply
               &&
               mintInfo.walletTokens.length < config.max_per_account) ?
               <div className="text-justify" style={{ fontSize:'0.60rem'}}>
                  <input id="chkTerms" className="mr-4" value={mintInfo.termsAccepted} type="checkbox" onChange={ (e) => {
                     setMintInfo((prevState) => ({
                        ...prevState,
                        termsAccepted: e.target.checked}));
                  } } />
                  <label htmlFor="chkTerms">
                     I confirm that I understand how the Ethereum blockchain works, I know what gas fees are and that the gas price is volatile.
                     I'm aware that transactions that fail for whatever reason still have a cost, but accept that this website is in no way
                     responsible for failures. I'm ok with the risks of minting a NFT, and accept that I won't be refunded if a transaction fails
                     or in case of any other inconvenience. I also understand that the minting logic is defined in a Smart Contract deployed on the blockchain, 
                     I have reviewed <a href={config.etherscan_url.replace("_ADDRESS_", config.address)} target="_blank" rel="noreferrer">its source code on Etherscan</a>, and I approve it. Really, I know what I'm doing and want to proceed!
                  </label>
               </div>
               : null
            }
         </div>
      </div>

      {mintInfo.walletTokens.length !== 0 ?
         <div className="mt-8 p-4 bg-stone-100 flex flex-col gap-4">
            <div className="text-2xl text-center">Your Keywords</div>
            <div className="grid grid-cols-3 gap-4">
            {                     
               mintInfo.walletTokens.map((token, i) =>
                  <div className="text-center" key={i}>
                     <img src={token.imageUrl}  alt="" />
                     <p>#{token.id}</p>
                  </div>
               )
            }
            </div>
         </div> : null
      }
      </>
   );
}

export default Minter;
