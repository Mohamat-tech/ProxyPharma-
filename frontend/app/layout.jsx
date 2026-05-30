import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ProxyPharma — Votre santé, à proximité",
  description:
    "Recherchez et faites livrer vos médicaments certifiés en 30 minutes à Douala et Yaoundé.",
  manifest: "/manifest.json",
  themeColor: "#10B981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'Poppins', sans-serif",
          background: "#F8FAFC",
        }}
      >
        {children}
      </body>
    </html>
  );
}
