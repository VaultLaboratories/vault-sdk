import * as wallet from '../api/wallet'

import {
    useInfiniteQuery,
    UseInfiniteQueryResult
  } from "react-query";

import { getContents } from '../api/vault'

import { useMemo } from 'react';
import * as types from '../types/types';  

interface Props {
    keyEntry?: types.KeyEntry | undefined, 
    wallet: types.PhantomProvider
}

export const Contents = (props: Props) => {
    const contents = useInfiniteQuery(
        ["contents", JSON.stringify(props.keyEntry)],
        ({ pageParam }) => getContents(props.keyEntry!!, props.wallet.publicKey?.toBase58() || "", (maxAgeInDays: number) => wallet.getWalletVerification(props.wallet, maxAgeInDays)),
            {
                getNextPageParam: (lastPage = []) => {
                    return lastPage[lastPage.length - 1]?.id;
                },
            }
    );

    return <>
        {contents.isLoading ? (
            <div>Loading</div>
        ): (
            <>
                <div>Content for {props?.keyEntry?.name}</div>
                <ContentList {...contents} />
            </>
        )}
    </>    
 
};

export const ContentList: React.FunctionComponent<
  UseInfiniteQueryResult<types.Content[], unknown>
> = ({
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}) => {
    const contents = useMemo(
        () => data?.pages.reduce((list, page) => list.concat(page), []),
        [data]
    );

    const Content = (content: types.Content) => (
        <p style={{
            width: "300px",
            height: "200px",
            float: "left"
        }}
        onClick={() => {console.log(`Clicked on ${content.description}`)}}
        >
            {content.mediaUrls.map(Media)}
            <div>{content.description}</div>
        </p>
    );

    const Media = (media: types.MediaEntry) => (
        <div style={{
            width: "300px",
            height: "200px",
            float: "left"
        }}>
            {media.mediaType === 'IMAGE' && (<img src={`${media.url}?width=250&height=150`} alt={media.title} width="250" height="150" />)}
            {media.mediaType !== 'IMAGE' && (<video width="250" height="150" controls><source src={`${media.url}`} type="application/x-mpegURL" /></video>)}
        </div>
    );

    return (
        <div style={{
            paddingLeft: "25%",
            width: "50%"

        }}>{contents?.map(Content)}</div>
    )
};