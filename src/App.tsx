import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as types from './libs/types/types'

// import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
// import { PhantomWalletName } from "@solana/wallet-adapter-phantom";


import { MyKeys } from './libs/componets/ownedKeys'
import { Contents } from './libs/componets/contents'
import * as wallet from './libs/api/wallet'

import { useEffect, useState } from "react";  
import { useQuery } from "react-query";

function App() {

  const [provider, setProvider] = useState<types.PhantomProvider | undefined>(
    undefined
  );

  // detect phantom provider exists
  useEffect(() => {
    const provider = wallet.getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);


  const [ keys, showKeys ] = useState<Boolean>(true);
  const [ content, showContent ] = useState<types.KeyEntry>();

  const phantomWallet = useQuery(["phantomWallet"], () => wallet.connectWallet());
  // const walletVerification = useQuery(["walletVerificaation"], () => wallet.getWalletVerification(provider.data));
  // console.log(walletVerification.data);

  const myKeysOnClick = (key: types.KeyEntry) => {
    showKeys(false);
    showContent(key);
  };
  
  return (
    <div className="App">
        <MyKeys walletAddress={phantomWallet.data?.publicKey?.toBase58() || ""} display={keys} onClick={myKeysOnClick} />

        {provider && content && content?.id && (<Contents keyEntry={content} wallet={provider} />)}
    </div>
  );
}

export default App;
