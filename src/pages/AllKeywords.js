import React, { useEffect, useState } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import axios from "axios";
import Footer from "../components/Footer";
import link_external_white from "../images/link_external_white.png";

const initialInfoState = {
   connected: false,
   status: null,
   account: null,
   web3: null,
   contract: null
};

function AllKeywords({ config }) {   
   const [info, setInfo] = useState(initialInfoState);
   const [walletConnectProvider, setWalletConnectProvider] = useState(null);

   const [groupedTokens, setGroupedTokens] = useState([]);
   const [allTokens, setAllTokens] = useState([]);
   const [myTokens, setMyTokens] = useState([]);
   const [groupedTokensMessage, setGroupedTokensMessage] = useState("");
   const [myTokensMessage, setMyTokensMessage] = useState("");

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
            } else {
               setInfo(() => ({
                  ...initialInfoState,
                  status: `Change network to ${config.chain}.`,
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
            status: "Please install Metamask or use WalletConnect.",
         }));
      }
   };

   const initWithWalletConnect = async () => {
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
            setWalletConnectProvider(provider);
         } else {
            setWalletConnectProvider(null);
            setInfo(() => ({
               ...initialInfoState,
               status: `Change network to ${config.chain}.`,
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

   const getWallet = async () => {
      try {
         const revealed = await info.contract.methods.revealed().call();
         const result = await info.contract.methods.walletOfOwner(info.account).call();         
         console.log("Wallet: " + result);

         const myTokens = result.map(item => {
            return allTokens.find(t => t.id === item.toString());
         });
         setMyTokens(myTokens.reverse());
      } catch (err) {
         console.log("Error fetching wallet: " + err);
      }
   };

   const getAllKeywords = async () => {
      setGroupedTokensMessage("Loading keywords...");
      const response = await axios.get(`/api/tokens?env=${config.env}`);
      const tokens = response.data.map((token, i) => {
         return {
            ...token,
            imageUrl: config.post_reveal_image_url.replace("_TOKENID_", token.id)
         };
      });
      tokens.sort((a, b) => a.language.localeCompare(b.language) || a.keyword.localeCompare(b.keyword) );
      setAllTokens(tokens);

      // group tokens by language
      const groups = []
      for (const token of tokens) {
         const group = groups.find(g => g.language === token.language);
         if (group) {
            group.tokens.push(token);
         } else {
            groups.push({
               language: token.language,
               tokens: [token]
            });
         }
      }
      setGroupedTokens(groups);
      setGroupedTokensMessage("");
   };

   const setTokenLinkUrl = async (token) => {
      let newUrl = prompt(`Type the new url for the "${token.keyword}" keyword:`, 
      `${token.linkUrl && token.linkUrl.length > 0 ? token.linkUrl : "https://"}`);

      if (!newUrl)
         return;

      setMyTokensMessage("Updating keyword's url...");
      console.log(`Setting the url for ${token.language} / ${token.keyword}: ${newUrl}`);
      try {
         const message = "Sign this message to prove your identity and ownership of this keyword.\nNOTE: this operation doesn't cost you anything, as you can verify by yourself.";
         const signature = await info.web3.eth.personal.sign(message, info.account);
         console.log(`User's signature is ${signature}`);  
         // call update API
         await axios.put(`/api/tokens/${token.id}?env=${config.env}`, 
            { "linkUrl": newUrl },
            { headers: { "signature": signature } });
         
         setMyTokensMessage("");
         getAllKeywords();
      } catch (err) {
         console.log(err.message);
         setMyTokensMessage(err.message);
      }      
   }

   const openLinkUrl = (url) => {
      if (window.confirm(`Do you want to open "${url}"?\n\nNOTE: the url was associated to the keyword by its owner, and this website has no responsibility over the content it links to. Open it at your own risk if you recognize the url and trust it.`)) {
         window.open(url, '_blank').focus();
      }      
   }

   useEffect(() => {
      getAllKeywords();

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
      if (info.connected && allTokens.length > 0) {
         getWallet();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [info.connected, allTokens]);            

   return (
      <div>
         <div className="bg-zinc-50">
            <div className="max-w-screen-lg mx-auto px-4 py-1">
               <a href="./">&lt; Back to Ninja Developer Hacking Squad's homepage</a>
            </div>
         </div>
         
         <div className="bg-gray-200">
            <div className="max-w-screen-lg mx-auto px-4 py-12 flex flex-col gap-8">
               <div>
                  <h1 className="text-3xl font-medium text-center">My Keywords</h1>
                  <div className="text-xs text-center text-gray-700">(click a keyword to associate a url to it)</div>
               </div>
               {info.connected ?
                  <>
                  {myTokens.length === 0 &&
                     <div className="text-xl font-medium text-center">
                        None :(
                     </div>
                  }
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {
                     myTokens.map((token, i) => {
                        return <a href="/#" onClick={ (e) => { setTokenLinkUrl(token); e.preventDefault(); }} key={i}>
                           <img src={token.imageUrl} alt={token.language + " / " + token.keyword} />
                        </a>
                     })
                  }
                  </div>
                  {myTokensMessage.length > 0 ?
                     <div className="p-4 text-center">{myTokensMessage}</div> : null
                  }
                  <div className="text-xs text-center">
                     Connected with: {String(info.account).substring(0, 6) + "..." + String(info.account).substring(38)}{" "}
                     { walletConnectProvider ? (
                        <>(<a href="/#" onClick={ (e) => { disconnectWalletConnect(); e.preventDefault(); }}>logout</a>)</>
                     ): null}
                  </div>
                  </>
                  :
                  <div className="text-center">
                     <div><button className="p-4 px-8 mb-2 bg-gray-300 rounded-md" onClick={(e) => connectToWallet()}>Connect with MetaMask</button></div>
                     <div><a className="text-xs" href="/#" onClick={ (e) => { connectToWallet("walletconnect"); e.preventDefault(); }}>Connect with WalletConnect</a></div>
                  </div>
               }
               {info.status ? <div className="p-4 text-center bg-orange-50 border-l-2 border-orange-200">{info.status}</div> : null }
            </div>
         </div>

         <div className="bg-gray-50">
            <div className="max-w-screen-lg mx-auto px-4 py-12 text-center">
               {groupedTokensMessage.length > 0 ?
                  <div className="p-4 text-center">{groupedTokensMessage}</div> : null
               }
               {groupedTokens.length > 0 ?   
                  <>
                  <div className="p-4 text-center">
                     All keywords minted so far for:{" "}
                     {
                        groupedTokens.map((group, n) => { 
                           return <React.Fragment key={n}>
                              <a href={"#lang-" + group.language}>{group.language}</a>
                              { n <= (groupedTokens.length - 2) ? ", " : "" }
                           </React.Fragment>;
                        })
                     }
                  </div>
                  {
                     groupedTokens.map((group, n) => {
                        return <React.Fragment key={n}>                        
                        <div className="text-3xl font-medium text-center p-4"><a href="/#" id={"lang-" + group.language}></a>{group.language}</div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {
                           group.tokens.map((token, i) => {
                              if (token.linkUrl && token.linkUrl.length > 0) {
                                 return <div className="relative" key={i}>
                                    <a href="/#" onClick={ (e) => { openLinkUrl(token.linkUrl); e.preventDefault(); }}>
                                       <img src={token.imageUrl} alt={token.language + " / " + token.keyword} />
                                       <img src={link_external_white} className="absolute right-1 top-1" alt="External link" />
                                    </a>
                                    <p>#{token.id}</p>
                                 </div>
                              } else {
                                 return <div key={i}>
                                    <img src={token.imageUrl} alt={token.language + " / " + token.keyword} />
                                    <p>#{token.id}</p>
                                 </div>
                              }
                           })
                        }
                        </div>
                        </React.Fragment>
                     })
                  }
                  </> : null
               }
            </div>
         </div>

         <Footer />
      </div>
   );
}

export default AllKeywords;
