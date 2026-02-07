import {getRestClient} from "@/query/client";
import {PageRequest} from "@bze/bzejs/cosmos/base/query/v1beta1/pagination";
import type {ArticleProps} from "@/types/article";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(article: any): ArticleProps {
    return {
        id: String(article.id ?? '0'),
        title: article.title ?? '',
        url: article.url ?? '',
        picture: article.picture ?? '',
        publisher: article.publisher ?? '',
        paid: !!article.paid,
        created_at: String(article.created_at ?? '0'),
    };
}

export async function getAllArticles(limit: number, offset: number): Promise<{articles: ArticleProps[]; total: number}> {
    try {
        const client = await getRestClient();
        const response = await client.bze.cointrunk.allArticles({
            pagination: PageRequest.fromPartial({
                key: new Uint8Array(),
                offset: BigInt(offset),
                limit: BigInt(limit),
                countTotal: true,
                reverse: true,
            }),
        });

        return {
            articles: (response?.article || []).map(mapArticle),
            total: Number(response?.pagination?.total || 0),
        };
    } catch (e) {
        console.error('failed to get articles:', e);
        return {articles: [], total: 0};
    }
}
