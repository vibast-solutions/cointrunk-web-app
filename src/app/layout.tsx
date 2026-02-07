'use client';

import { Poppins } from "next/font/google"

import {Provider} from "@/components/ui/provider";
import {TopNavBar} from "@/components/ui/navigation/navbar";
import {Toaster} from "@/components/ui/toaster";
import {AssetsProvider} from "@/contexts/assets_context";
import {BlockchainListenerWrapper} from "@/components/blockchain-listener-wrapper";
import {GoogleTagManager} from "@next/third-parties/google";
import {Box} from "@chakra-ui/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
      <html className={poppins.className} suppressHydrationWarning>
          <head>
              <title>CoinTrunk - Decentralized News on BeeZee</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="description" content="Browse and publish articles on the BeeZee blockchain. Decentralized, transparent, community-driven news."/>
              <link rel="icon" href="/cointrunk.svg"/>

              {/* Open Graph / Facebook */}
              <meta property="og:type" content="website" />
              <meta property="og:title" content="CoinTrunk - Decentralized News on BeeZee" />
              <meta property="og:description" content="Browse and publish articles on the BeeZee blockchain. Decentralized, transparent, community-driven news." />
              <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
              <meta property="og:site_name" content="CoinTrunk" />

              {/* Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="CoinTrunk - Decentralized News on BeeZee" />
              <meta name="twitter:description" content="Browse and publish articles on the BeeZee blockchain. Decentralized, transparent, community-driven news." />
          </head>
          <body style={{backgroundColor: '#0a0912'}}>
            <GoogleTagManager gtmId="G-7DRJTECDTV"/>
            <Provider>
              <AssetsProvider>
                  <BlockchainListenerWrapper />
                  <TopNavBar />
                  <Box pt="14">
                    {children}
                  </Box>
                  <Toaster />
              </AssetsProvider>
            </Provider>
          </body>
      </html>
  )
}
