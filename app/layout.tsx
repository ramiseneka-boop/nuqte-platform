import type {Metadata,Viewport} from 'next';import './globals.css';import './public-v1.css';
export const metadata:Metadata={metadataBase:new URL('https://nuqte-platform-i28p.vercel.app'),title:{default:'NUQTE — товарные знаки в Казахстане',template:'%s'},description:'Проверка, регистрация и передача прав на товарные знаки в Казахстане.',applicationName:'NUQTE',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg',apple:'/apple-touch-icon.svg'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#ffffff'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>;}
