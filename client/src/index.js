import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store,persistor } from "./store/redux";
import App from "./App";
import AppAdmin from "./AppAdmin";
;
import { BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { PersistGate } from "redux-persist/integration/react";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <HelmetProvider>
            <Helmet>
              <meta charSet="utf-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
              <meta name="keywords" content="" />
              <meta name="description" content="" />
              <meta name="author" content="" />
              <link
                rel="shortcut icon"
                href="images/favicon.png"
                type="image/png"
              />
              <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
              <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
                rel="stylesheet"
              />
              <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
              />
              <link href="css/font-awesome.min.css" rel="stylesheet" />
              <link href="css/style.css" rel="stylesheet" />
              <link href="css/responsive.css" rel="stylesheet" />
              
            </Helmet>
            <App />
            <AppAdmin />
          </HelmetProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
