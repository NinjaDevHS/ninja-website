import Minter from "../components/Minter";
import Footer from "../components/Footer";
import twitter from "../images/twitter.png";
import discord from "../images/discord.png";
import checkmark from "../images/checkmark.png";
import hero from "../images/hero.gif";
import banner from "../images/banner.png";

function Home({ config, mode }) {
   const handleMintDuringIntro = () => {
      alert("Coming soon, check out the Discord...");
   }

   const handleGoToKeywords = () => {
      window.location.href = "./keywords";
   }

   return (
      <div>
         <div className="p-2 text-center text-sm font-medium bg-yellow-400 text-black">
            <a className="no-underline" href="https://github.com/NinjaDevHS" target="_blank" rel="noreferrer">This is a sample minting website on Rinkeby
            (but with fully working functionalities) for a sample NFT collection, developed for educational purposes.
            Everything is open source and <span className="underline">available on GitHub!</span></a>
         </div>
         <div className="bg-zinc-50">
            <div className="max-w-screen-lg mx-auto px-4 py-12">
               <div className="flex flex-col-reverse md:flex-row gap-16">
                  <div className="flex-1 flex flex-col gap-8">
                     <h1 className="text-7xl font-medium">&gt; Ninja<br/>Developer<br/>Hacking<br/>Squad ▮</h1>
                     <p className="text-xl text-light">Get an NFT representing a programming language keyword, and join the most elite programmers 
                        you can dream of<sup>(<a href="#footer">*</a>)</sup>. 
                        Supply is limited (yes, we're stating the obvious) and new programming languages are not born often.
                        <a href="/#" id="minter" className=""></a>
                     </p>                     
                     <div className="flex flex-row gap-4">
                        <a href="https://discord.gg/E7wTVDFwPg" target="_blank" rel="noreferrer"><img src={discord} loading="lazy" alt="" className="w-8" /></a>
                        <a href="https://twitter.com/NinjaDevHS" target="_blank" rel="noreferrer"><img src={twitter} loading="lazy" alt="" className="w-8" /></a>
                     </div>
                  </div>                  
                  <div className="flex-1 grid place-items-center">
                     <img src={hero} loading="lazy" alt="" className="rounded-2xl w-full  drop-shadow-md" />
                  </div>
               </div>

               {mode === "intro" ?
                  <div className="flex flex-col md:flex-row gap-16 pt-8">
                     <div className="flex-1 flex flex-col gap-8">                    
                        <button className="p-4 bg-slate-200 w-full rounded-md" onClick={handleMintDuringIntro}>
                           MINT (coming soon)
                        </button>
                     </div>                  
                     <div className="flex-1"></div>
                  </div>
                  : null
               }
               {mode === "sale" || mode === "presale" ?
                  <Minter config={config} mode={mode} showKeywordsLink={mode === "sale"} />
                  : null
               }
               {mode === "soldout" ?
                  <div className="flex flex-col md:flex-row gap-16 pt-8">
                     <div className="flex-1 flex flex-col gap-8">
                        <div className="text-center flex flex-col gap-2">
                           <p className="uppercase text-xl font-bold text-purple-800 border-y-4 border-purple-800 p-2">Wow, we are sold out!</p>
                           <p>Congrats to all the ninjas that got a keyword!</p>
                        </div>                 
                        <button className="p-4 bg-purple-800 text-white w-full rounded-md" onClick={handleGoToKeywords}>
                           See all keywords
                        </button>
                     </div>                  
                     <div className="flex-1">
                        If you dind't manage to get a keyword, don't despair. You can use a
                        secondary market such as <a href={config.opensea_collection_url} target="_blank" rel="noreferrer">OpenSea</a> 
                        to make an offer for one you like, or just purchase one that's already listed for sale.
                     </div>
                  </div>
                  : null
               }
            </div>            
         </div>

         <div className="bg-indigo-100">
            <div className="max-w-screen-lg mx-auto px-4 py-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                     <h1 className="text-3xl font-medium mb-8">1024 Unique Keywords</h1>
                     <img src={banner} loading="lazy"alt="" className="w-full drop-shadow-md" />
                  </div>                  
                  <div className="flex flex-col gap-4">
                     <div className="font-medium">Each keyword is unique by definition, and its NFT is generated by a custom program with a randomly selected style (effects, font, colors, background, ...). They are all cool.</div>                     
                     <div className="flex gap-2">
                        <img src={checkmark} loading="lazy" alt="" className="h-8" />
                        <p>The 1st collection consists of 1024 keywords for Solidity, JavaScript, TypeScript, Python, Rust, Swift, Kotlin, Java, C#, C, C++, PHP, Visual Basic, Go, and Ruby.</p>
                     </div>
                     <div className="flex gap-2">
                        <img src={checkmark} loading="lazy" alt="" className="h-8" />
                        <p>Keywords are minted on Ethereum as ERC-721 tokens, only on this website.</p>
                     </div>
                     <div className="flex gap-2">
                        <img src={checkmark} loading="lazy" alt="" className="h-8" />
                        <p>Many utility benefits, that go beyond the beauty of the image.</p>
                     </div>
                     <div className="flex gap-2">
                        <img src={checkmark} loading="lazy" alt="" className="h-8" />
                        <p>After minting, keywords can be traded on the secondary markets.</p>
                     </div>
                     <div className="flex gap-2">
                        <img src={checkmark} loading="lazy" alt="" className="h-8" />
                        <p>The owner has all commercial rights for his NFT image.</p>
                     </div>
                     <div className="flex gap-2">
                        <img src={checkmark} loading="lazy" alt="" className="h-8" />
                        <p>Blind minting and later reveal. Get your random keyword(s), and exchange them later if you want a specific language.</p>
                     </div>
                  </div>
               </div>
            </div>            
         </div>

         <div className="bg-gray-200">
            <div className="max-w-screen-lg mx-auto px-4 py-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="flex flex-col gap-4">
                     <p className="text-2xl font-medium">Token Utility! 🏆</p>
                     <p>1️. Access to all the source code for this minting website, the Smart Contract, the custom tools to generate the random images and metadata, and more utilities.</p>
                     <p>2. All keywords displayed on the Ninja Developer HS website will link to a URL set by their owners. Be recognized as being part of the Squad, be proud, and get visibility. You might link your profile page, portfolio, Twitter, LinkedIn, etc. URLs are stored off-chain, which means no transaction costs, and the freedom to change your URL at any time.</p>
                     <p>3. Priority access to the minting of Warriors NFTs. There will be 2048 of which 1024 will be reserved to Ninja keyword holders.</p>
                     <p>4. Access to restricted Discord channels, collaborations with other collections, and exclusive Web3 projects deals.</p>
                     <p className="text-center text-3xl">🙌🏻  🙌🏽  🙌🏿</p>
                  </div>                  
                  <div className="flex flex-col gap-4 p-8 bg-gray-100 rounded-lg">                     
                     <p className="font-bold">💻 Source code you'll get:</p>
                     <p>1. The React.js code for this website, which supports multiple configurations and modes (eg: test/production for pre-sale, sale, post-sale, etc.), connecting with MetaMask and WalletConnect, whitelist checking, filterable keyword listing and utilities (eg: a tool to take a snapshot of the tokens ownership for any ERC-721 contract).</p>
                     <p>2. The Node.js backend code that verifies the NFT ownership and manages the associated url(s) on a database.</p>
                     <p>3. The C# / .NET Core tools to generate the keyword-images with random styles, shuffle their order, and generate the corresponding metadata files.</p>
                     <p className="text-sm">NOTE: the Solidity Smart Contract will be visible in Ehterscan by anyone of course.</p>
                  </div>
               </div>
            </div>            
         </div>      

         <div className="bg-gray-100">         
            <div className="max-w-screen-lg mx-auto px-4 py-12 flex flex-col gap-8">
               <h1 className="text-3xl font-medium text-center">The Roadmap</h1>
               <div className="p-12 bg-rose-100 bg-opacity-75 rounded-lg">
                  <p className="uppercase text-2xl text-bold">v 0.9: Hello World</p>
                  <ul className="list-disc list-outside pl-4 pt-4">
                  <li className="pb-2">Ninja website launched.</li>
                  <li className="pb-2">Discord and Twitter channels are now open and starting to attract the real OGs.</li>
                  <li className="pb-2">Call to all Web2 and Web3 Ninjas.</li>
                  <li>Requirements for initial whitelist slots to be provided into the Discord's #announcement channel.</li>
                  </ul>
               </div>
               <div className="p-12 bg-amber-100 bg-opacity-75 rounded-lg">
                  <p className="uppercase text-2xl text-bold">v 1.0: Production</p>
                  <ul className="list-disc list-outside pl-4 pt-4">
                  <li className="pb-2">1st NFT drop of 1024 unique Ninja keywords: ERC-721 Smart Contract on Ethereum and IPFS for decentralized storage.</li>
                  <li className="pb-2">Blind minting for whitelisted users during pre-sale, followed by public sale and reveal.</li>
                  <li className="pb-2">The collection will have 8 LEGENDARY keywords and 32 ultra-rare. Good luck to all!</li>
                  <li>Keep up on our <a href="https://discord.gg/E7wTVDFwPg" target="_blank" rel="noreferrer">Discord</a>'s #announcement channel for the details about whitelists, pre-sale, and public sale.</li>
                  </ul>
               </div>
               <div className="p-12 bg-emerald-100 bg-opacity-75 rounded-lg">
                  <p className="uppercase text-2xl text-bold">v 1.1: Benefits go live</p>
                  <ul className="list-disc list-outside pl-4 pt-4">
                  <li className="pb-2">Get all the source code powering this website's frontend + backend, and other internal tools used for the drop. More details are in the Token Utility section above.</li>
                  <li className="pb-2">Access to private Discord channels will be unlocked using collab.land.</li>
                  <li>Recognition on the Ninja Developer's Hall of Fame Gallery: link your profile or website from the iconic keyword you own (link details are stored off-chain, and you'll be able to update this at any time and at no cost).</li>
                  </ul>
               </div>
               <div className="p-12 bg-sky-100 bg-opacity-75 rounded-lg">
                  <p className="uppercase text-2xl text-bold">v 2.0: Warriors</p>
                  <ul className="list-disc list-outside pl-4 pt-4">
                  <li className="pb-2">2nd drop of 2048 new unique Warrior NFTs, of which 1024 will be reserved to Ninja holders!</li>
                  <li>Mint price, whitelist requirements, and other details will be voted on and decided by the Ninja holders community.</li>
                  </ul>
               </div>
               <div className="p-12 bg-gray-200 bg-opacity-75 rounded-lg">
                  <p className="uppercase text-2xl text-bold">v 2.1: Onwards and Upwards</p>
                  <ul className="list-disc list-outside pl-4 pt-4">
                  <li className="pb-2">Squad masters might introduce Web3 and NFT projects to which Ninja and Warrior Developers could apply on a full-time or part-time basis.</li>
                  <li>Ninjas and Warriors work together to take control of the community and creation of new initiatives.</li>
                  </ul>
               </div>
            </div>            
         </div>      

         <div className="bg-gray-50">         
            <div className="max-w-screen-lg mx-auto px-4 py-12 flex flex-col gap-8">
               <h1 className="text-3xl font-medium text-center">Got Questions?</h1>
               <h3 className="text-xs text-center -mt-8">If what you're looking for is not here, try Stack Overflow.</h3>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">Who are ninja developers?</span></div>
                  <div>
                     If you are one of us, you should know already<sup>(<a href="#footer">*</a>)</sup>. But, just to make it clear, you're one if:
                     <ul className="list-disc list-outside pl-4 pt-4">
                        <li className="pb-2">You don't need a debugger, the debugger needs you.</li>
                        <li className="pb-2">You smash your tasks by 11am, so that you can spend the rest of your day on Twitter and Reddit.</li>
                        <li className="pb-2">You have FAANG (MANGA now?) knocking at your door praying you to join them, skipping the interview process.</li>
                        <li className="pb-2">You are underpaid for what you do, but you don't care because you are a crypto OG.</li>
                        <li className="pb-2">You have a maxed out MBP and a $2k ergonomic chair.</li>
                        <li>You dodge stupid work questions on Slack by replying with the perfect GIF.</li>
                     </ul>
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">Ok, but are you really that badass?</span></div>
                  <div>
                     You judge for yourself:
                     <ul className="list-disc list-outside pl-4 pt-4">
                        <li className="pb-2">Our resume lists the things we haven't done, it's shorter that way.</li>
                        <li className="pb-2">Our IDE doesn't do code analysis, it does code appreciation.</li>
                        <li className="pb-2">We compile and run our code before submitting, but only to check for compiler and CPU bugs.</li>
                        <li className="pb-2">We can instantiate abstract classes.</li>
                        <li className="pb-2">When we say "Hello World", the world says "Hello Ninjas".</li>
                        <li className="pb-2">You don't explain your work to us, we explain your work to you.</li>
                        <li className="pb-2">We don't write bugs, just features you can't understand.</li>
                        <li>Chuck Norris is our 20% project. We completed it in 10%.</li>
                     </ul>
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">Where can I get Ninja NFTs and be part of the Squad?</span></div>
                  <div>
                     Initial minting is on <a href="#minter">this website</a>, but NFTs will also be available on 
                     secondary markets such as <a href={config.opensea_collection_url} target="_blank" rel="noreferrer">OpenSea</a> after that.
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">When is the minting going to start?</span></div>
                  <div>
                     Our exclusive 1024 NFTs will be released sometime in March 2022. 
                     Follow us on <a href="https://twitter.com/NinjaDevHS" target="_blank" rel="noreferrer">Twitter</a> and join the 
                     free <a href="https://discord.gg/E7wTVDFwPg" target="_blank" rel="noreferrer">Ninja Developer Discord</a> to stay tuned.
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">What wallet should I use?</span></div>
                  <div>
                     If you don't know what MetaMask and WalletConnect are and how to use them, all this is probably not for you.
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">Are there benefits to holding multiple Ninja keywords?</span></div>
                  <div>
                     Yes, you will be able to mint 1 Warrior NFT for each keyword you hold.
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">What blockchain are you on?</span></div>
                  <div>
                  Ethereum, because of its reliability and ease of use (in comparison to alternatives at least).
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">Why do I need a keyword?</span></div>
                  <div>
                     You don't. If you're not a ninja developer. If you are, you definitely want to be part of our Squad<sup>(<a className="note" href="#footer">*</a>)</sup>.
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div><span className="border-b-4 border-b-gray-200 text-xl font-medium">No keywords for {"{"}languageX{"}"}? Why?! It can't get any ninja-er than that...</span></div>
                  <div>
                  We feel you...but a supply of 1024 was the perfect number, as you'll surely agree, and it couldn't fit all languages. And anyway, tbh, all relevant languages worth knowing today should be present :P<sup>(<a href="#footer">*</a>)</sup>.
                  </div>
               </div>
            </div>            
         </div>
         
         {mode !== "soldout" ?
            <div className="bg-gray-100">
               <div className="max-w-screen-lg mx-auto px-4 py-12 flex flex-col gap-8">
                  <h1 className="text-3xl font-medium text-center">Get a Keyword</h1>
                  <div className="text-center"><button className="p-4 px-8 bg-purple-800 rounded-md text-white" onClick={(e) => {window.location.href='#minter'}}>Mint on this website</button></div>
               </div>
            </div>
            : null
         }

         <Footer>
            <p className="text-xs">(*) = or maybe not</p>
            <p className="text-xs">NOTE: a real ninja understands that this website's tone is ironic, 
            especially when describing what it is that defines a ninja developer...</p>
            <p className="text-xs">NOTE2: This is also just a sample site (but with fully working functionalities) developed for educational purposes. <a href="https://github.com/NinjaDevHS" target="_blank" rel="noreferrer">Everything is open source and available on GitHub!</a></p>
         </Footer>

      </div>
   );
}

export default Home;
