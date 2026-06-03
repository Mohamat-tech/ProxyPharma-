import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ProxyPharma — Votre santé, à proximité",
  description: "Recherchez et faites livrer vos médicaments certifiés en 30 minutes à Douala et Yaoundé.",
  manifest: "/manifest.json",
  themeColor: "#10B981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Poppins', sans-serif;
            background: #F8FAFC;
          }
          /* Mobile first */
          .app-container {
            width: 100%;
            max-width: 430px;
            margin: 0 auto;
          }
          /* Tablet */
          @media (min-width: 768px) {
            .app-container {
              max-width: 600px;
              box-shadow: 0 0 40px rgba(15,76,129,0.1);
              min-height: 100vh;
            }
            body {
              background: #E2E8F0;
            }
          }
          /* Desktop */
          @media (min-width: 1024px) {
            .app-container {
              max-width: 430px;
            }
          }
          /* Fix bottom nav on desktop */
          @media (min-width: 768px) {
            .bottom-nav-fixed {
              max-width: 600px !important;
            }
          }
          @media (min-width: 1024px) {
            .bottom-nav-fixed {
              max-width: 430px !important;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
