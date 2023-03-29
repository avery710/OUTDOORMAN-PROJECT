import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
        <Head>
            <meta name="keywords" content="mountain, trails, outdoor, blog, 登山, 台灣登山, 戶外, 山岳"/>

            <link rel="shortcut icon" href="/images/icons/page-icon.ico" />

            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
            integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>

            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css" />
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
        </Html>
    )
}