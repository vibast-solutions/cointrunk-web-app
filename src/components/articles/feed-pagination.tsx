'use client';

import {HStack, Button, Text} from '@chakra-ui/react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface FeedPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function FeedPagination({currentPage, totalPages, onPageChange}: FeedPaginationProps) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <HStack gap="1" justify="center" py="4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                color="content.secondary"
            >
                <ChevronLeft size={16}/>
            </Button>

            {start > 1 && (
                <>
                    <Button variant="ghost" size="sm" onClick={() => onPageChange(1)} color="content.secondary">
                        1
                    </Button>
                    {start > 2 && <Text color="content.muted" fontSize="sm">...</Text>}
                </>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    variant={page === currentPage ? 'solid' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    color={page === currentPage ? 'white' : 'content.secondary'}
                    bg={page === currentPage ? 'brand.primary' : undefined}
                    _hover={page === currentPage ? {bg: 'brand.light'} : undefined}
                >
                    {page}
                </Button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <Text color="content.muted" fontSize="sm">...</Text>}
                    <Button variant="ghost" size="sm" onClick={() => onPageChange(totalPages)} color="content.secondary">
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                color="content.secondary"
            >
                <ChevronRight size={16}/>
            </Button>
        </HStack>
    );
}
