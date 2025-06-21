import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AgeGateProvider from "@/components/age-gate-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Acesso Privado - Conteúdo Exclusivo",
  description: "Acesse conteúdos exclusivos de forma 100% anônima. Prévia gratuita de 1 minuto!",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="https://cdn4.iconfinder.com/data/icons/3d-cyber-security/256/TOPI_IS.png" />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '633116172759767', {
                external_id: 'EAAa0uAc5UoABOzIZAaZBbhupvvvVHRX1lap0tZBXGuthlK75cKUXBilTfbKo1l0uDmizlOt64sYAp7HrNKki97NfR9yXwbwD6Yc962uPtN4EY6h7K4ZBG7q48pN9ME5CWKejEwSMiTftRBynoRn2bB0ODzXf6tdCNhuqPlZCvYZCvlIjhBQDkN6BUIGgxxFgZDZD'
              });
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=633116172759767&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-black">
          <AgeGateProvider>{children}</AgeGateProvider>
        </div>
      </body>
    </html>
  )
}
