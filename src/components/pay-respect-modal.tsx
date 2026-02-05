'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Loader2, Info } from 'lucide-react';
import { useChain } from '@cosmos-kit/react-lite';
import {
  getChainName,
  getRpcUrl,
  getMinDenom,
  getExplorerTxUrl,
} from '@/lib/chain-config';
import { getCointrunkParams } from '@/lib/services/params';
import { getAccountBalance } from '@/lib/services/account';
import { bze, getSigningBzeClient } from '@bze/bzejs';
import { coins } from '@cosmjs/stargate';
import type { PublisherProps } from '@/lib/types';

interface Props {
  publisher: PublisherProps;
  onClose: () => void;
  onSuccess: () => void;
}

export function PayRespectModal({ publisher, onClose, onSuccess }: Props) {
  const chainName = getChainName();
  const { address, getOfflineSignerDirect } = useChain(chainName);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [taxRate, setTaxRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (address) {
      getAccountBalance(address, getMinDenom())
        .then((b) => setBalance(b))
        .catch(console.error);
    }
    getCointrunkParams()
      .then((p) => {
        if (p?.publisher_respect_params?.tax) {
          setTaxRate(Math.round(parseFloat(p.publisher_respect_params.tax) * 100));
        }
      })
      .catch(console.error);
  }, [address]);

  const publisherPercent = 100 - taxRate;
  const balanceDisplay = (Number(balance) / 1_000_000).toFixed(6);

  const handleSubmit = async () => {
    setError('');
    if (!address || !amount || Number(amount) <= 0) return;

    const microAmount = String(Math.floor(Number(amount) * 1_000_000));

    setLoading(true);
    try {
      const offlineSigner = getOfflineSignerDirect();
      const signingClient = await getSigningBzeClient({
        rpcEndpoint: getRpcUrl(),
        signer: offlineSigner,
      });

      const { payPublisherRespect } =
        bze.cointrunk.MessageComposer.withTypeUrl;
      const msg = payPublisherRespect({
        creator: address,
        address: publisher.address,
        amount: microAmount + getMinDenom(),
      });

      const gasEstimated = await signingClient.simulate(
        address,
        [msg],
        undefined
      );
      const fee = {
        amount: coins(0, getMinDenom()),
        gas: String(Math.round(gasEstimated * 1.3)),
      };

      const result = await signingClient.signAndBroadcast(
        address,
        [msg],
        fee
      );
      setTxHash(result.transactionHash);
      onSuccess();
    } catch (e: any) {
      if (e.message?.includes('Length must be a multiple of 4')) {
        onSuccess();
        return;
      }
      setError(e.message || 'Failed to pay respect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-content-primary">
            Pay Respect
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-card-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-content-secondary mb-4 leading-relaxed">
          Show appreciation for{' '}
          <span className="text-content-primary font-medium">
            {publisher.name}
          </span>
          . 1 BZE = 1 Respect point.
        </p>

        {/* Tax info */}
        <div className="mb-5 p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
          <div className="flex gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-content-secondary leading-relaxed">
              <span className="text-content-primary font-medium">
                {publisherPercent}%
              </span>{' '}
              goes to the publisher,{' '}
              <span className="text-content-primary font-medium">
                {taxRate}%
              </span>{' '}
              is community tax for keeping CoinTrunk decentralized.
            </p>
          </div>
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-sm text-content-secondary mb-1.5 font-medium">
            BZE Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.000001"
            disabled={loading}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-primary border border-surface-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/30 transition-all text-sm disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-content-muted">
            Available: {balanceDisplay} BZE
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* TX success */}
        {txHash && (
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Respect paid!{' '}
            <a
              href={getExplorerTxUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View transaction
            </a>
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
            disabled={loading || !amount || Number(amount) <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-accent to-orange-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
            {loading ? 'Sending...' : 'Send Respect'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
