import { ethers } from 'ethers';

const BCX_CONTRACT_ADDRESS = import.meta.env.VITE_BCX_CONTRACT_ADDRESS;
const BCX_ABI = [
  'function balanceOf(address account) view returns (uint256)'
];
const SEPOLIA_CHAIN_ID = 11155111;

const getBrowserProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask non détecté');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const isMetaMaskAvailable = () => typeof window !== 'undefined' && !!window.ethereum;

export const requestMetaMaskAccount = async () => {
  const provider = getBrowserProvider();
  const accounts = await provider.send('eth_requestAccounts', []);
  if (!accounts || !accounts.length) {
    throw new Error('Aucun compte MetaMask disponible');
  }
  return accounts[0];
};

export const getConnectedChainId = async () => {
  const provider = getBrowserProvider();
  const network = await provider.getNetwork();
  return network.chainId;
};

export const getTokenBalance = async (walletAddress) => {
  const provider = getBrowserProvider();
  const network = await provider.getNetwork();
  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error('Veuillez passer MetaMask sur le réseau Sepolia');
  }
  const contract = new ethers.Contract(BCX_CONTRACT_ADDRESS, BCX_ABI, provider);
  const rawBalance = await contract.balanceOf(walletAddress);
  return parseFloat(ethers.formatUnits(rawBalance, 18));
};

export const sendCryptoDeposit = async (amountUSD) => {
  const provider = getBrowserProvider();
  const network = await provider.getNetwork();
  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error('Veuillez passer MetaMask sur le réseau Sepolia');
  }
  
  const signer = await provider.getSigner();
  
  // Taux de change fictif pour le concours/démo (ex: 1 ETH = 3000 USD)
  const ETH_PRICE = 3000;
  const ethAmount = (parseFloat(amountUSD) / ETH_PRICE).toFixed(18);
  
  const tx = await signer.sendTransaction({
    to: BCX_CONTRACT_ADDRESS,
    value: ethers.parseEther(ethAmount)
  });

  const receipt = await tx.wait(); // attente confirmation blockchain
  return receipt.hash;
};
