import { PhantomProvider, WalletPermissions} from '../types/types';
import bs58 from "bs58";

export const getProvider = (): PhantomProvider | undefined => {
    if ("solana" in window) {
        // @ts-ignore
        const provider = window.solana as any;
        if (provider.isPhantom) return provider as PhantomProvider;
    }
};

/**
 * @description prompts user to connect wallet if it exists
 */
export const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
        try {
            const response = await solana.connect();
            console.log('wallet account ', response.publicKey.toString());
            return response;
        } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
        }
    }
};

export const walletVerification = async (wallet: PhantomProvider): Promise<WalletPermissions> => {
    const timestamp = Date.now();
    const message = `I verify ownership of the wallet. Sign at ${timestamp}`;
    const encodedMessage = new TextEncoder().encode(message);
    console.log(`Provider ${JSON.stringify(wallet)}`);
    const signedMessage = await wallet.signMessage(encodedMessage);
    console.log(`Signed message ${JSON.stringify(signedMessage)}`);
    return {
        address: wallet.publicKey?.toBase58() || "",
        signedAt: timestamp,
        signeture: bs58.encode(signedMessage.signature)
    };
};

export const getWalletVerification = async (wallet: PhantomProvider, maxAgeInDays: number = 89): Promise<WalletPermissions> => {
    const verificationKey = `verification_${wallet.publicKey?.toBase58()}`;
    console.log(`Verification for ${verificationKey}`);
    let verification = JSON.parse(localStorage.getItem(verificationKey) || "{\"signedAt\": 1}") as WalletPermissions;

    console.log(`Retrieved verification ${JSON.stringify(verification)}`);

    const today = new Date();
    const signedAt = new Date(verification.signedAt);
    const diffTime = Math.abs(today.getTime() - signedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));  

    console.log(`Diff days ${diffDays} and maxAgeInDays is ${maxAgeInDays}`);

    if (diffDays > maxAgeInDays) {
        verification = await walletVerification(wallet);
        const toSave = JSON.stringify(verification);
        console.log(`About to save ${toSave}`);
        localStorage.setItem(verificationKey, toSave);
    } 

    return verification;
}