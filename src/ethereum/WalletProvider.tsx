import { Contract } from 'ethers';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ExternalProvider,
  JsonRpcSigner,
  Provider,
  Web3Provider,
} from '@ethersproject/providers';

import { HelloNft } from '../../typechain-types';
import HelloNftInfo from './abi/HelloNft.json';

declare global {
  interface Window {
    ethereum: Provider & ExternalProvider;
  }
}

type Wallet =
  | {
      provider: Web3Provider;
      signer: JsonRpcSigner;
      address: string;
      contract: {
        helloNft: HelloNft;
      };
    }
  | undefined;

export const WalletContext = createContext({
  wallet: undefined as Wallet,
  connectWallet: () => {},
});

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function WalletProvider(props: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>();

  const connectWallet = useCallback(() => {
    if (window.ethereum?.isMetaMask) {
      window.ethereum
        .request?.({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          onAccountsChanged(accounts);
        })
        .catch(error => {
          console.log('An error occurred while connecting MetaMask:', error);
        });
    } else {
      console.log('MetaMask is not installed.');
    }
  }, []);

  const onAccountsChanged = (addresses: string[]) => {
    if (!addresses.length) {
      setWallet(undefined);
    } else {
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const helloNft = new Contract(
        contractAddress,
        HelloNftInfo.abi,
        signer
      ) as HelloNft;
      setWallet({
        provider,
        signer,
        address: addresses[0],
        contract: { helloNft },
      });
    }
  };

  useEffect(() => {
    // Connect on page load
    connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    if (!wallet) return;
    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', () => window.location.reload());
  }, [wallet]);

  return (
    <WalletContext.Provider value={{ wallet, connectWallet }}>
      {props.children}
    </WalletContext.Provider>
  );
}
