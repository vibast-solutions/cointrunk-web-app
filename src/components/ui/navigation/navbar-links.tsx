import {Text, Box, Link, Stack, type StackProps, Menu, Portal, HStack} from '@chakra-ui/react'
import NextLink from 'next/link'
import {useNavigation} from "@/hooks/useNavigation";
import {Newspaper, Users} from 'lucide-react'
import {LuGlobe, LuCoins, LuFactory, LuChartColumn, LuFlame} from 'react-icons/lu'
import type { IconType } from 'react-icons'

interface NavbarLinksProps extends StackProps {
    onLinkClick?: () => void
}

const navItems = [
    { name: 'Articles', href: '/', icon: Newspaper },
    { name: 'Publishers', href: '/publishers', icon: Users },
]

const navSubitems: { [key: string]: string } = {}

const appsItems: Array<{ name: string; href: string; disabled: boolean; icon: IconType }> = [
    { name: 'Website', href: 'https://cointrunk.io', disabled: false, icon: LuGlobe },
    { name: 'BZE Website', href: 'https://getbze.com', disabled: false, icon: LuGlobe },
    { name: 'Burner', href: 'https://burner.getbze.com', disabled: false, icon: LuFlame },
    { name: 'Staking', href: 'https://staking.getbze.com', disabled: false, icon: LuCoins },
    { name: 'DEX', href: 'https://dex.getbze.com', disabled: false, icon: LuChartColumn },
    { name: 'Factory', href: '#', disabled: true, icon: LuFactory },
]

export const NavbarLinks = ({ onLinkClick, ...props }: NavbarLinksProps) => {
    const {navigate, currentPathName} = useNavigation()

    const handleClick = (item: typeof navItems[0]) => {
        navigate(item.href)
        if (onLinkClick) onLinkClick()
    }

    return (
        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '4', md: '1' }} {...props}>
            {navItems.map((item) => {
                const isActive = currentPathName === item.href || item.href === navSubitems[currentPathName]
                const Icon = item.icon

                return (
                    <Link
                        onClick={() => handleClick(item)}
                        key={item.name}
                        as={NextLink}
                        href={item.href}
                        display="flex"
                        alignItems="center"
                        gap="1.5"
                        px="3"
                        py="1.5"
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                        textDecoration="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        bg={isActive ? 'brand.primary/25' : 'transparent'}
                        color={isActive ? 'white' : 'content.secondary'}
                        shadow={isActive ? 'sm' : 'none'}
                        _hover={{
                            color: isActive ? 'white' : 'content.primary',
                            bg: isActive ? 'brand.primary/25' : 'surface.cardHover',
                            textDecoration: 'none',
                        }}
                        _focus={{
                            outline: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        <Icon size={16} />
                        <Text>{item.name}</Text>
                    </Link>
                )
            })}

            {/* Other Items - Mobile: Inline, Desktop: Dropdown */}

            {/* Mobile: Show items inline */}
            <Box hideFrom="md" mt="2">
                <Text
                    fontWeight="medium"
                    color="content.muted"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb="3"
                >
                    Other Apps
                </Text>
                <Stack direction="column" gap="2" pl="1">
                    {appsItems.map((item) => {
                        const Icon = item.icon
                        return item.disabled ? (
                            <HStack
                                key={item.name}
                                gap="2"
                                px="3"
                                py="1.5"
                                opacity={0.4}
                            >
                                <Icon size={16} />
                                <Text fontWeight="medium" fontSize="sm" color="content.muted">
                                    {item.name}
                                </Text>
                                <Text fontSize="xs" color="content.muted">(soon)</Text>
                            </HStack>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                px="3"
                                py="1.5"
                                borderRadius="lg"
                                fontWeight="medium"
                                fontSize="sm"
                                color="content.secondary"
                                textDecoration="none"
                                transition="all 0.2s"
                                onClick={onLinkClick}
                                _hover={{
                                    color: 'content.primary',
                                    bg: 'surface.cardHover',
                                    textDecoration: 'none',
                                }}
                            >
                                <Icon size={16} />
                                {item.name}
                            </Link>
                        )
                    })}
                </Stack>
            </Box>

            {/* Desktop: Show as dropdown menu */}
            <Box hideBelow="md">
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Text
                            as="button"
                            display="flex"
                            alignItems="center"
                            px="3"
                            py="1.5"
                            borderRadius="full"
                            fontSize="sm"
                            fontWeight="medium"
                            color="content.secondary"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{
                                color: 'content.primary',
                                bg: 'surface.cardHover',
                            }}
                            _focus={{
                                outline: 'none',
                                boxShadow: 'none',
                            }}
                        >
                            Other
                        </Text>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content
                                bg="surface.elevated"
                                borderWidth="1px"
                                borderColor="surface.border"
                                borderRadius="xl"
                                shadow="lg"
                            >
                                {appsItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <Menu.Item
                                            key={item.name}
                                            value={item.name}
                                            disabled={item.disabled}
                                            asChild={!item.disabled}
                                        >
                                            {item.disabled ? (
                                                <Text display="flex" alignItems="center" gap="2" color="content.muted">
                                                    <Icon size={16} />
                                                    {item.name} <Text as="span" fontSize="xs">(soon)</Text>
                                                </Text>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    textDecoration="none"
                                                    color="content.secondary"
                                                    display="flex"
                                                    alignItems="center"
                                                    gap="2"
                                                    width="100%"
                                                    onClick={onLinkClick}
                                                    _hover={{
                                                        color: 'content.primary',
                                                    }}
                                                >
                                                    <Icon size={16} />
                                                    {item.name}
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    )
                                })}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Box>
        </Stack>
    )
}
