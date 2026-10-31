
import "./globals.css";

export const metadata = {
  title: "SkinCare AI | Skin Cancer Classification",
  description:
    "AI-powered skin lesion classification using a trained CNN model."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
