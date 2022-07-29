import {
    PublicKey,
    Transaction,
  } from "@solana/web3.js";

export interface SocialLink {
    socialNetwork: string;
    handle: string;
}

export interface User {
    id: string;
    slug: string;
    creator: boolean;
    signupDate: 0;
    solWalletLinked: boolean;
    userName: string;
    avatarUrl: string;
    description: string;
    userBannerUrl: string;
    socialLinks: SocialLink[];
    verified: boolean;
    approved?: boolean;
    primarySaleVaultCut?: number;
    secondarySaleVaultCut?: number;
}

export interface MediaEntry {
    galleryOrder?: number;
    url: string; // arweave image uri
    mediaType: "IMAGE" | "VIDEO" | "AUDIO";
    mimeType: string;
    previewUrl?: string;
    previewMimeType?: string;
    title?: string;
    artist?: string;
}

export interface Supply {
    current: number;
    reserved: number;
    max: number;
    currentUser: {
        owned: number;
        reserved: number;
    };
}

export interface Content {
    createdTimestamp: number;
    description: string | null;
    id: string;
    mediaUrls: MediaEntry[];
    notificationSent: boolean;
}

export interface VaultEntry {
    id: string; // the master edition mint address
    blockchain: "SOLANA";
    benefits: string[];
    creator: User;
    creatorId: string; // Firebase uid of the creator
    description: string;
    dropTimestamp: number;
    featured: boolean;
    mediaUrls: MediaEntry[];
    name: string;
    numAvailableKeys?: number;
    price: {
        currency: "USD_CENTS";
        value: number;
    };
    properties: {
        auction?: string; // exists on vaults that use the metaplex auction manager
        arweaveUri: string;
        creator: string;
        mintAuthority: string;
    };
    tags: string[];
    revenueCatId: string;
    supply: Supply;
    previewContent: Content[];
}

export interface KeyEntry extends VaultEntry {
    mint: string;
    boughtAt: number;
    transferableAt: number;
    walletType: string;
    walletAddress: string;
    edition: number;
}

export type DisplayEncoding = "utf8" | "hex";
export type PhantomEvent = "disconnect" | "connect" | "accountChanged";
export type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

export interface ConnectOpts {
    onlyIfTrusted: boolean;
}

export interface PhantomProvider {
    publicKey: PublicKey | null;
    isConnected: boolean | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage: (
        message: Uint8Array | string,
        display?: DisplayEncoding
    ) => Promise<any>;
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}
  
export interface WalletPermissions {
    address: string;
    signeture: string;
    signedAt: number;
}