import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./context/ChatProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-lexend">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider>
            <ChatProvider>
              <RouterProvider router={router} />
            </ChatProvider>
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </div>
    <Toaster position="top-center" richColors expand={false} />
  </StrictMode>
);
