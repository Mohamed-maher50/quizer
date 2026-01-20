import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { ReactNode } from "react";

import { StoreProvider } from "./StoreProvider";

import "./styles/globals.css";
interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <section>
            <main>
              <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
            </main>
          </section>
        </body>
      </html>
    </StoreProvider>
  );
}
