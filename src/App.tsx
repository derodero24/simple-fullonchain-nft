import { useContext, useEffect, useState } from 'react';

import { WalletContext } from './ethereum/WalletProvider';

export default function App(): JSX.Element {
  const { wallet, connectWallet } = useContext(WalletContext);
  const [nftInfo, setNftInfo] = useState({ name: '', symbol: '' });
  const [owner, setOwner] = useState('');

  // const setGreeting = async () => {
  //   wallet?.contract.helloNft
  //     .mint(wallet.address)
  //     .then(mintTx => mintTx.wait())
  //     .then(() => wallet?.contract.helloNft.ownerOf(0))
  //     .then(_address => setOwner(_address));
  // };

  useEffect(() => {
    Promise.all([
      wallet?.contract.helloNft.name(),
      wallet?.contract.helloNft.symbol(),
    ]).then(([name, symbol]) => {
      if (name && symbol) setNftInfo({ name, symbol });
    });
  }, [wallet]);

  return (
    <>
      {wallet ? (
        <div>
          <h4>HelloNFT</h4>
          <p>
            name: {nftInfo.name}, symbol: {nftInfo.symbol}
          </p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </>
  );
}
