// import { BrowserRouter } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { NavMenu } from "@shopify/app-bridge-react";
// import Routes from "./Routes";
// import Footer from "./components/Footer";

// import { QueryProvider, PolarisProvider } from "./components";
// import { Provider } from "react-redux";
// import store from "./store";
// import { useEffect } from "react";

// export default function App() {
//   // Any .tsx or .jsx files in /pages will become a route
//   // See documentation for <Routes /> for more info
//   const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
//     eager: true,
//   });
//   const { t } = useTranslation();
  

//   return (
//     <Provider store={store}>
//     <PolarisProvider>
//       <BrowserRouter>
//         <QueryProvider>

//             <NavMenu>
//               <a href="/" rel="home" />
//               <a href="/analytics">{t("NavigationMenu.Analytics")}</a>
//               <a href="/settings">{t("NavigationMenu.Settings")}</a>

//             </NavMenu>
//             <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
//               <Routes pages={pages} />
//               <Footer />
//             </div>

//         </QueryProvider>
//       </BrowserRouter>
//     </PolarisProvider>
//     </Provider>
//   );
// }
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavMenu } from '@shopify/app-bridge-react';
import Routes from './Routes';
import Footer from './components/Footer';
import { QueryProvider, PolarisProvider } from './components';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { fetchStoreData } from './store/storeSlice';

// Child component to handle Redux logic
function AppContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hasFetched } = useSelector((state) => state.store);

  useEffect(() => {
    console.log('AppContent mounted - hasFetched:', hasFetched);
    if (!hasFetched) {
      console.log('Dispatching fetchStoreData from AppContent');
      dispatch(fetchStoreData());
    }
  }, [dispatch, hasFetched]);

  const pages = import.meta.glob('./pages/**/!(*.test.[jt]sx)*.([jt]sx)', {
    eager: true,
  });

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <NavMenu>
            <a href="/" rel="home" />
            <a href="/analytics">{t('NavigationMenu.Analytics')}</a>
            <a href="/settings">{t('NavigationMenu.Settings')}</a>
          </NavMenu>
          <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
            <Routes pages={pages} />
            <Footer />
          </div>
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}