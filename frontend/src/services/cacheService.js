const CACHE_COMPTE_KEY = 'cache_compte';
const CACHE_DEPOTS_KEY = 'cache_depots';
const CACHE_WALLET_KEY = 'cache_wallet_address';

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn('Cache parse failed', err);
    return null;
  }
};

export const getCachedCompte = () => safeParse(localStorage.getItem(CACHE_COMPTE_KEY));
export const setCachedCompte = (compte) => localStorage.setItem(CACHE_COMPTE_KEY, JSON.stringify(compte));

export const getCachedDepots = () => safeParse(localStorage.getItem(CACHE_DEPOTS_KEY)) || [];
export const setCachedDepots = (depots) => localStorage.setItem(CACHE_DEPOTS_KEY, JSON.stringify(depots));

export const getCachedWalletAddress = () => localStorage.getItem(CACHE_WALLET_KEY) || null;
export const setCachedWalletAddress = (address) => localStorage.setItem(CACHE_WALLET_KEY, address);
export const clearCachedWalletAddress = () => localStorage.removeItem(CACHE_WALLET_KEY);
