import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/core/Header";
import Providers from "@/app/providers";
import {AuthContextProvider} from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Silly Squares",
  description: "Compete against other players to conquer squares on a grid. Whoever conquers the most squares, wins.",
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
