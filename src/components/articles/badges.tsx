'use client';

import {HStack, Box, Text} from '@chakra-ui/react';
import {Sparkles, Clock, CreditCard, ExternalLink} from 'lucide-react';

export function RespectBadge({respect}: {respect: string}) {
    const num = Number(respect);
    if (num <= 0) return null;

    const isHigh = num >= 1_000_000_000_000; // 1T
    const isMedium = num >= 50_000_000_000; // 50B

    const bg = isHigh ? 'teal.500/15' : isMedium ? 'yellow.500/15' : 'gray.500/15';
    const color = isHigh ? 'teal.400' : isMedium ? 'yellow.400' : 'gray.400';
    const borderColor = isHigh ? 'teal.500/20' : isMedium ? 'yellow.500/20' : 'gray.500/20';

    return (
        <HStack
            display="inline-flex"
            gap="1"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            bg={bg}
            color={color}
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Sparkles size={10}/>
            <Text fontSize="xs">{formatRespect(num)}</Text>
        </HStack>
    );
}

function formatRespect(num: number): string {
    if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(1)}T`;
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return String(num);
}

export function PublishedTodayBadge() {
    return (
        <HStack
            display="inline-flex"
            gap="1"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            bg="green.500/15"
            color="green.400"
            borderWidth="1px"
            borderColor="green.500/20"
        >
            <Clock size={10}/>
            <Text fontSize="xs">Today</Text>
        </HStack>
    );
}

export function PaidBadge() {
    return (
        <HStack
            display="inline-flex"
            gap="1"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            bg="yellow.500/15"
            color="yellow.400"
            borderWidth="1px"
            borderColor="yellow.500/20"
        >
            <CreditCard size={10}/>
            <Text fontSize="xs">Paid</Text>
        </HStack>
    );
}

export function DomainBadge({domain}: {domain: string}) {
    return (
        <HStack
            display="inline-flex"
            gap="1"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            bg="gray.500/15"
            color="gray.400"
            borderWidth="1px"
            borderColor="gray.500/20"
        >
            <ExternalLink size={10}/>
            <Text fontSize="xs">{domain}</Text>
        </HStack>
    );
}

export function ActiveBadge({active}: {active: boolean}) {
    return (
        <HStack
            display="inline-flex"
            gap="1"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            bg={active ? 'green.500/15' : 'red.500/15'}
            color={active ? 'green.400' : 'red.400'}
            borderWidth="1px"
            borderColor={active ? 'green.500/20' : 'red.500/20'}
        >
            <Box w="1.5" h="1.5" borderRadius="full" bg={active ? 'green.400' : 'red.400'}/>
            <Text fontSize="xs">{active ? 'Active' : 'Inactive'}</Text>
        </HStack>
    );
}

export function ArticleCountBadge({count}: {count: number}) {
    let bg = 'gray.500/15';
    let color = 'gray.400';
    let borderColor = 'gray.500/20';

    if (count >= 1000) {
        bg = 'green.500/15';
        color = 'green.400';
        borderColor = 'green.500/20';
    } else if (count >= 100) {
        bg = 'orange.500/15';
        color = 'orange.400';
        borderColor = 'orange.500/20';
    } else if (count >= 10) {
        bg = 'yellow.500/15';
        color = 'yellow.400';
        borderColor = 'yellow.500/20';
    }

    return (
        <HStack
            display="inline-flex"
            gap="1"
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            bg={bg}
            color={color}
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Text fontSize="xs">{count} articles</Text>
        </HStack>
    );
}
