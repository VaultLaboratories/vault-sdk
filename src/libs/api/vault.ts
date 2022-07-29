import { TypeFlags } from 'typescript';
import * as types from '../types/types';

const VAULT_URL = process.env.NEXT_PUBLIC_VAULT_URL || "https://vault-be-dev.fan"

class ResponseError extends Error {
    public code?: number;
}

const request = async (
    path: string,
    options: RequestInit = { headers: new Headers() }
  ) => {
    const response = await fetch(VAULT_URL + path, options);
  
    if (!response.ok) {
      const error = new ResponseError(
        response.statusText || "network request failed"
      );
      error.code = response.status;
      throw error;
    }
  
    const contentType = response.headers.get("content-type");
  
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    } else if (contentType && contentType.indexOf("image") !== -1) {
      return response.blob();
    }
  
    return response.text();
  };

export const getOwnedKeys = (
    walletAddress: string,
    lastMint?: string
  ): Promise<types.KeyEntry[]> => {
    const headers = new Headers();
  
    return request(
      `/v0/solana/wallet/${walletAddress}/keys${lastMint ? `?lastKeyId=${lastMint}`: ''}`,
      {
        headers,
        method: "GET",
        mode: "cors",
      }
    );
  };

 export const getContents = async (key: types.KeyEntry, walletAddress: string, walletVerificationGetter: (maxAgeInDays: number) => Promise<types.WalletPermissions>, retry: Boolean = false): Promise<types.Content[]> => {
    const permissions = await walletVerificationGetter(retry ? -1 : 89); //-1 forces to refresh the wallet token

    console.log(`Got permissions ${JSON.stringify(permissions)}`);

    const headers = new Headers();
    headers.append("Authorization", `WalletSignature ${permissions.signeture}`);
    headers.append("SignedAt", permissions.signedAt.toString());
    headers.append("WalletAddress", permissions.address);

    console.log('About to request the content');

    return request(
        `/v0/vaults/${key.id}/contents/${walletAddress}/${key.mint}`,
        {
            headers,
            method: "GET",
            mode: "cors"
        }
    ).catch((e) => {
        if (!retry) {
            return getContents(key, walletAddress, walletVerificationGetter, true)
        }
        Promise.reject(e);
    });
    
 } 