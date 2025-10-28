"use client";

import { store } from "@/libs/redux/store.";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <SnackbarProvider
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      />
      {children}
    </Provider>
  );
}
