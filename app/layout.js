import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/core/Header";
import Providers from "@/app/providers";
import {AuthContextProvider} from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Test Generator",
  description: "An easy to use software to analyze javascript code and develop test cases using Jest",
};

export default function RootLayout({ children }) {
  return (
   <Providers>
       <AuthContextProvider>
           <html lang="en">
           <body>
           <Header/>
           {children}
           </body>
           </html>
       </AuthContextProvider>
   </Providers>
  );
}
