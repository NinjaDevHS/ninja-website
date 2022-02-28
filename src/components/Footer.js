import twitter from "../images/twitter.png";
import discord from "../images/discord.png";

function Footer(props) {
   return (
      <div className="bg-gray-50">
         <a href="/#" id="footer"></a>
         <div className="max-w-screen-lg mx-auto px-4 py-12 flex flex-col gap-8">
            {props.children}            
            <div className="flex flex-row gap-4 justify-end">
               <div className="grow">
               <p className="text-xs">©2022 Ninja Developer Hacking Squad. All right reserved (like it was worth saying...)</p>
               </div>
               <a href="https://discord.gg/E7wTVDFwPg" target="_blank" rel="noreferrer"><img src={discord} loading="lazy" alt="" className="w-12 md:w-8" /></a>
               <a href="https://twitter.com/NinjaDevHS" target="_blank" rel="noreferrer"><img src={twitter} loading="lazy" alt="" className="w-12 md:w-8" /></a>
            </div>
         </div>
      </div>
   );
}

export default Footer;
