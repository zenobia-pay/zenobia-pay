import { createConfig } from "vinxi";
import mdx from "@mdx-js/rollup";

export default createConfig({
  plugins: [
    mdx({
      // Add any MDX options here
      remarkPlugins: [],
      rehypePlugins: [],
    }),
  ],
  vite: {
    css: {
      postcss: {
        plugins: [
          require("tailwindcss"),
          require("autoprefixer"),
          require("@tailwindcss/typography"),
        ],
      },
    },
  },
});
