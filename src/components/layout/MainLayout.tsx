import { Component, JSX } from "solid-js";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface MainLayoutProps {
  children: JSX.Element;
}

const MainLayout: Component<MainLayoutProps> = (props) => {
  return (
    <div class="min-h-screen flex flex-col bg-white text-gray-900">
      <Navigation />
      <main class="flex-grow">{props.children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
