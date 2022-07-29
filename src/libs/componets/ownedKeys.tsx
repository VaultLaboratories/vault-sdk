import { getOwnedKeys } from '../api/vault'
import * as types from '../types/types'
import { useMemo } from "react";

import {
    useInfiniteQuery,
    UseInfiniteQueryResult,
  } from "react-query";

interface Props {
    walletAddress: string;
    display: Boolean;
    onClick: (key: types.KeyEntry) => void;
}

export const MyKeys = (props: Props) => {
    const myKeysQuery = useInfiniteQuery(
        ["my-keys", props.walletAddress],
        ({ pageParam }) => getOwnedKeys(props.walletAddress, pageParam),
            {
                getNextPageParam: (lastPage = []) => {
                    return lastPage[lastPage.length - 1]?.mint;
                },
            }
    );

    if (props.display !== true) {
        return (<></>);
    } else {
        return (
            <>
                {myKeysQuery.isLoading ? (
                    <div>Loading</div>
                ): (
                    <>
                        <div>Keys for wallet {props.walletAddress}</div>
                        <KeysList {...myKeysQuery} onClick={props.onClick} />
                    </>
                )}
            </>    
        );
    }
    
}

export const KeysList: React.FunctionComponent<
  UseInfiniteQueryResult<types.KeyEntry[], unknown> & {onClick: (key: types.KeyEntry) => void}
> = ({
  data, 
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  onClick
}) => {
    const vaults = useMemo(
        () => data?.pages.reduce((list, page) => list.concat(page), []),
        [data]
    );

    const VaultItem = (keyEntry: types.KeyEntry) => (
        <div style={{
            width: "300px",
            height: "200px",
            float: "left"
        }}
        onClick={() => {onClick(keyEntry);}}
        >
            <img src={`${keyEntry.mediaUrls[0].url}?width=250&height=150`} alt={keyEntry.name} width="250" height="150" />
            <div>{keyEntry.name}</div>
        </div>
    );

    return (
        <div style={{
            paddingLeft: "25%",
            width: "50%"

        }}>{vaults?.map(VaultItem)}</div>
    )
};