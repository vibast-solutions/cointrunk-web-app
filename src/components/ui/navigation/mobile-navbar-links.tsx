'use client'

import { Icon, IconButton, Popover, Portal } from '@chakra-ui/react'
import {PropsWithChildren, useState} from 'react'
import { LuAlignRight, LuX } from 'react-icons/lu'
import {NavbarLinks} from "@/components/ui/navigation/navbar-links";

export const MobileNavbarLinks = (props: PropsWithChildren) => {
    const [open, setOpen] = useState(false)

    const closeNavbar = () => {
        setOpen(false)
    }

    return (
        <Popover.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            positioning={{
                placement: 'bottom',
                overflowPadding: 0,
                offset: { mainAxis: 12 },
            }}
        >
            <Popover.Context>
                {(context) => (
                    <Popover.Trigger asChild>
                        <IconButton
                            aria-label="Open Menu"
                            variant="ghost"
                            size="sm"
                            hideFrom="md"
                            color="content.secondary"
                            _hover={{color: 'content.primary', bg: 'surface.cardHover'}}
                            borderRadius="lg"
                        >
                            <Icon size="md">{context.open ? <LuX /> : <LuAlignRight />}</Icon>
                        </IconButton>
                    </Popover.Trigger>
                )}
            </Popover.Context>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content
                        textStyle="md"
                        boxShadow="lg"
                        borderRadius="xl"
                        maxW="unset"
                        px="4"
                        py="6"
                        width="var(--available-width)"
                        height="var(--available-height)"
                        bg="surface.primary/95"
                        backdropFilter="blur(20px)"
                        borderWidth="1px"
                        borderColor="surface.border"
                        {...props}
                    >
                        <NavbarLinks onLinkClick={closeNavbar} />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}
