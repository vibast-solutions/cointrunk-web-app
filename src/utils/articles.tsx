export function truncateAddress(address: string, maxLength = 16): string {
    if (!address || address.length <= maxLength) return address;
    const side = Math.floor((maxLength - 3) / 2);
    return address.slice(0, side) + '...' + address.slice(-side);
}

export function formatRelativeTime(unixSeconds: string | number): string {
    const ts = Number(unixSeconds);
    if (!ts || isNaN(ts)) return '';

    const now = Math.floor(Date.now() / 1000);
    const diff = now - ts;

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

    const date = new Date(ts * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function generateAvatarGradient(address: string): string {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = address.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 40 + Math.abs((hash >> 8) % 60)) % 360;

    return `linear-gradient(135deg, hsl(${h1}, 70%, 50%), hsl(${h2}, 80%, 40%))`;
}

export function formatBzeAmount(amount: string | number): string {
    const num = Number(amount);
    if (isNaN(num) || num === 0) return '0';

    // Convert from micro units (ubze) to BZE
    const bze = num / 1_000_000;

    if (bze >= 1_000_000) return `${(bze / 1_000_000).toFixed(1)}M`;
    if (bze >= 1_000) return `${(bze / 1_000).toFixed(1)}K`;
    if (bze >= 1) return bze.toFixed(1);

    return bze.toFixed(4);
}
