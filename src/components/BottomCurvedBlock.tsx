import { JSX } from "solid-js";

interface BottomCurvedBlockProps {
  leftText: string;
  rightText: string;
  background: string;
  showButton?: boolean;
  buttonOnClick?: () => void;
  buttonText?: string;
}

export default function BottomCurvedBlock(
  props: BottomCurvedBlockProps
): JSX.Element {
  return (
    <div
      style={{
        height: "var(--hero-bottom-height)",
        "border-radius":
          "var(--hero-bottom-radius) var(--hero-bottom-radius) 0 0",
        background: props.background,
      }}
      class="relative"
    >
      <div
        class="absolute inset-0 flex items-start justify-between pt-6"
        style={{
          "padding-left": "calc(var(--hero-bottom-radius))",
          "padding-right": "calc(var(--hero-bottom-radius))",
        }}
      >
        <span class="text-black/60 text-xl font-medium md:block hidden">
          {props.leftText}
        </span>
        {props.showButton && (
          <div
            class="absolute left-1/2 top-8"
            style={{ transform: "translateX(-50%)" }}
          >
            <button
              onClick={props.buttonOnClick}
              class="bg-neutral-200 hover:bg-neutral-300 transition-colors px-24 py-1.5 rounded-lg text-black/80 font-medium md:block hidden cursor-pointer"
            >
              {props.buttonText}
            </button>
          </div>
        )}
        <span class="text-black/60 text-xl font-medium md:block hidden">
          {props.rightText}
        </span>
      </div>
    </div>
  );
}
