'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { useChain } from '@cosmos-kit/react-lite';
import { getChainName, getRpcUrl, getGasPrice } from '@/lib/chain-config';
import {
  getAcceptedDomains,
  isAcceptedDomain,
  extractUrlHost,
} from '@/lib/services/accepted-domains';
import { getCointrunkParams } from '@/lib/services/params';
import { bze, getSigningBzeClient } from '@bze/bzejs';
import { calculateFee, GasPrice } from '@cosmjs/stargate';
import type { AcceptedDomainProps, CointrunkParamsProps } from '@/lib/types';

interface Props {
  isPublisher: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddArticleModal({ isPublisher, onClose, onSuccess }: Props) {
  const chainName = getChainName();
  const { address, getOfflineSignerDirect } = useChain(chainName);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedDomains, setAcceptedDomains] = useState<
    AcceptedDomainProps[]
  >([]);
  const [params, setParams] = useState<CointrunkParamsProps | null>(null);

  useEffect(() => {
    getAcceptedDomains().then(setAcceptedDomains).catch(console.error);
    getCointrunkParams().then(setParams).catch(console.error);
  }, []);

  const activeDomains = acceptedDomains
    .filter((d) => d.active)
    .map((d) => d.domain);

  const validateForm = (): boolean => {
    if (title.length < 10 || title.length > 320) {
      setError('Title must be between 10 and 320 characters.');
      return false;
    }
    const urlHost = extractUrlHost(url);
    if (!urlHost || !isAcceptedDomain(urlHost, acceptedDomains)) {
      setError(
        `URL must be from an accepted domain: ${activeDomains.join(', ')}`
      );
      return false;
    }
    if (picture) {
      const picHost = extractUrlHost(picture);
      if (!picHost || !isAcceptedDomain(picHost, acceptedDomains)) {
        setError('Picture URL must be from an accepted domain.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateForm()) return;
    if (!address) {
      setError('Please connect your wallet first.');
      return;
    }

    setLoading(true);
    try {
      const offlineSigner = getOfflineSignerDirect();
      const signingClient = await getSigningBzeClient({
        rpcEndpoint: getRpcUrl(),
        signer: offlineSigner,
      });

      const { addArticle } = bze.cointrunk.MessageComposer.withTypeUrl;
      const msg = addArticle({
        publisher: address,
        title,
        url,
        picture,
      });

      const gasEstimated = await signingClient.simulate(
        address,
        [msg],
        undefined
      );
      const gasLimit = Math.round(gasEstimated * 1.3);
      const fee = calculateFee(gasLimit, GasPrice.fromString(getGasPrice()));

      const result = await signingClient.signAndBroadcast(address, [msg], fee);
      if (result.code !== 0) {
        setError(result.rawLog || `Transaction failed with code ${result.code}`);
        return;
      }
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to submit article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-content-primary">
            Publish Article
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-card-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anonymous warning */}
        {!isPublisher && params && (
          <div className="mb-5 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex gap-2.5">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-400">
                  Anonymous Article
                </p>
                <p className="text-content-secondary mt-1 leading-relaxed">
                  Publishing as non-publisher costs{' '}
                  <span className="text-content-primary font-medium">
                    {Number(params.anon_article_cost?.amount || 0) / 1_000_000}{' '}
                    BZE
                  </span>
                  . Monthly limit:{' '}
                  <span className="text-content-primary font-medium">
                    {String(params.anon_article_limit)}
                  </span>{' '}
                  articles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-content-secondary mb-1.5 font-medium">
              Title
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title (10-320 characters)"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-primary border border-surface-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/30 transition-all resize-none text-sm"
              maxLength={320}
            />
            <p className="mt-1 text-xs text-content-muted">
              {title.length}/320
            </p>
          </div>

          <div>
            <label className="block text-sm text-content-secondary mb-1.5 font-medium">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-primary border border-surface-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/30 transition-all text-sm"
            />
            {activeDomains.length > 0 && (
              <p className="mt-1 text-xs text-content-muted">
                Accepted: {activeDomains.join(', ')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-content-secondary mb-1.5 font-medium">
              Picture URL{' '}
              <span className="text-content-muted font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-primary border border-surface-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/30 transition-all text-sm"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-surface-border text-content-secondary text-sm font-medium hover:bg-surface-card-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title || !url}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-accent to-orange-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
