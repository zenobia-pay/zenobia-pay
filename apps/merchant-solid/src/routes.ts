import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import MainLayout from "./components/layout/MainLayout";

// Lazy-loaded page components
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));

// Helper function to wrap components with MainLayout
const withMainLayout = (Component: any) => () =>
  MainLayout({ children: Component });

// Components wrapped with MainLayout
const LayoutHomePage = withMainLayout(HomePage);
const LayoutProductsPage = withMainLayout(ProductsPage);
const LayoutProductDetailPage = withMainLayout(ProductDetailPage);
const LayoutCartPage = withMainLayout(CartPage);
const LayoutCheckoutPage = withMainLayout(CheckoutPage);

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: LayoutHomePage,
  },
  {
    path: "/men",
    children: [
      {
        path: "/",
        component: LayoutProductsPage,
      },
      {
        path: "/:category",
        component: LayoutProductsPage,
      },
    ],
  },
  {
    path: "/women",
    children: [
      {
        path: "/",
        component: LayoutProductsPage,
      },
      {
        path: "/:category",
        component: LayoutProductsPage,
      },
    ],
  },
  {
    path: "/kids",
    children: [
      {
        path: "/",
        component: LayoutProductsPage,
      },
      {
        path: "/:category",
        component: LayoutProductsPage,
      },
    ],
  },
  {
    path: "/products/:id",
    component: LayoutProductDetailPage,
  },
  {
    path: "/cart",
    component: LayoutCartPage,
  },
  {
    path: "/checkout",
    component: CheckoutPage,
  },
  {
    path: "/demo",
    component: DemoPage,
  },
];
