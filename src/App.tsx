import type { Component } from "solid-js";
import ApiTest from "./pages/ApiTest";

const App: Component = () => {
  return (
    <div>
      <p class="text-4xl text-green-700 text-center py-10">Hello tailwind!</p>
      <ApiTest />
    </div>
  );
};

export default App;
