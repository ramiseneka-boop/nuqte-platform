import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUQTE — регистрация товарных знаков в Казахстане",
  description: "Проверка названия и логотипа, подготовка и сопровождение регистрации товарного знака.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
