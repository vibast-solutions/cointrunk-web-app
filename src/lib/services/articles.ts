import { bze } from '@bze/bzejs';
import { getRestUrl } from '@/lib/chain-config';
import type { ArticleProps } from '@/lib/types';

function mapArticle(article: any): ArticleProps {
  return {
    id: String(article.id),
    title: article.title,
    url: article.url,
    picture: article.picture,
    publisher: article.publisher,
    paid: article.paid,
    created_at: String(article.created_at),
  };
}

export async function getAllArticles(
  limit: number,
  offset: number
): Promise<{ articles: ArticleProps[]; total: number }> {
  const client = await bze.ClientFactory.createLCDClient({
    restEndpoint: getRestUrl(),
  });

  const response = await client.bze.cointrunk.allArticles({
    pagination: {
      key: new Uint8Array(),
      offset: BigInt(offset),
      limit: BigInt(limit),
      countTotal: false,
      reverse: true,
    },
  });

  const articles = (response?.article || []).map(mapArticle);

  return {
    articles,
    total: Number(response?.pagination?.total || 0),
  };
}
