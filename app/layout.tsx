import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quiz Learning Platform",
  description: "Online quiz platform for teachers and students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#eff6ff',
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8',
                    }
                  }
                }
              }
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <ToastContainer
          position="top-center" // Changed from "top-right" to "top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
