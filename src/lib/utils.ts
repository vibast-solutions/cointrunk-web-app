export function truncateAddress(address: string, maxLength: number = 18): string {
  if (address.length <= maxLength) return address;
  const start = Math.ceil(maxLength / 2);
  const end = Math.floor(maxLength / 2) - 1;
  return `${address.slice(0, start)}\u2026${address.slice(-end)}`;
}

export function extractUrlHost(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.hostname;
    }
  } catch {
    // invalid URL
  }
  return null;
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generateAvatarGradient(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = Math.abs((hash * 127) % 360);
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 55%), hsl(${hue2}, 60%, 40%))`;
}

export function formatBzeAmount(amount: string | number): string {
  const num = Number(amount) / 1_000_000;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  if (num === 0) return '0';
  return num.toFixed(2);
}
