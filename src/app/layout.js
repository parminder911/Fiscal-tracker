import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "@/components/Layout/Layout";


export const metadata = {
  title: "Fiscal Tracker - Punjab Transparency Portal",
  description: "Government Spending Transparency Portal for Punjab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
