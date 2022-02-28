import './styles/globals.css';
import './styles/index.css';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllKeywords from "./pages/AllKeywords";
import OwnersExtractor from "./pages/OwnersExtractor";
import MerkleTreeLab from "./pages/MerkleTreeLab";
import config_test from "./configs/config_test.json";
import config from "./configs/config.json";

ReactDOM.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={
               <Home config={config} mode="sale" />
            } />
            <Route path="/keywords" element={
               <AllKeywords config={config} />
            } />

            <Route path="/test" element={
               <Home config={config_test} mode="intro" />
            } />
            <Route path="/test/intro" element={
               <Home config={config_test} mode="intro" />
            } />
            <Route path="/test/sale" element={
               <Home config={config_test} mode="sale" />
            } />
            <Route path="/test/presale" element={
               <Home config={config_test} mode="presale" />
            } />
            <Route path="/test/soldout" element={
               <Home config={config_test} mode="soldout" />
            } />
            <Route path="/test/keywords" element={
               <AllKeywords config={config_test} />
            } />
            
            <Route path="/tools/ownersextractor" element={
               <OwnersExtractor />
            } />
            <Route path="/tools/merkletree" element={
               <MerkleTreeLab />
            } />
         </Routes>
      </BrowserRouter>
   </React.StrictMode>,
   document.getElementById("root")
);
