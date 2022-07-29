import React from 'react';
import './App.css';
import * as types from './libs/types/types'

import { MyKeys } from './libs/componets/ownedKeys'
import { Contents } from './libs/componets/contents'
import * as wallet from './libs/api/wallet'

import { useEffect, useState } from "react";  

function App() {

  const [provider, setProvider] = useState<types.PhantomProvider | undefined>(
    undefined
  );

  const [ walletAddress, setWalletAddress ] = useState<string>();

  // detect phantom provider exists
  useEffect(() => {
    const provider = wallet.getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const [ keys, showKeys ] = useState<Boolean>(true);
  const [ content, showContent ] = useState<types.KeyEntry>();

  const myKeysOnClick = (key: types.KeyEntry) => {
    showKeys(false);
    showContent(key);
  };
  
  return (
    <div className="App">
        {!walletAddress && (<button onClick={async () => { const address = (await wallet.connectWallet()).publicKey?.toBase58(); setWalletAddress(address) }} >Connect phantom wallet</button>)}
        {walletAddress && (<MyKeys walletAddress={walletAddress} display={keys} onClick={myKeysOnClick} />)}

        {provider && content && content?.id && (<Contents keyEntry={content} wallet={provider} />)}
    </div>
  );
}

export default App;
