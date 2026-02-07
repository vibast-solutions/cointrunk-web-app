'use client';

import {Box, HStack} from '@chakra-ui/react';

function Pulse({w, h, borderRadius = 'md'}: {w: string; h: string; borderRadius?: string}) {
    return (
        <Box
            w={w}
            h={h}
            borderRadius={borderRadius}
            bg="surface.elevated"
            animation="pulse 1.5s ease-in-out infinite"
        />
    );
}

export function ArticleSkeleton() {
    return (
        <Box px="4" py="3">
            <HStack gap="3" align="start">
                <Pulse w="10" h="10" borderRadius="full"/>
                <Box flex="1">
                    <HStack gap="2" mb="2">
                        <Pulse w="24" h="3.5"/>
                        <Pulse w="16" h="3"/>
                        <Pulse w="10" h="3"/>
                    </HStack>
                    <Pulse w="100%" h="4" />
                    <Box mt="1.5">
                        <Pulse w="75%" h="4"/>
                    </Box>
                    <HStack gap="2" mt="3">
                        <Pulse w="14" h="5" borderRadius="full"/>
                        <Pulse w="20" h="5" borderRadius="full"/>
                    </HStack>
                </Box>
            </HStack>

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </Box>
    );
}
