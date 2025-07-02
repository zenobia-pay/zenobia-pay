import { Component, JSX } from "solid-js";

interface SectionCardProps {
  children: JSX.Element;
  class?: string;
}

const SectionCard: Component<SectionCardProps> = (props) => {
  return (
    <div
      class={`rounded-[2rem] bg-white shadow-sm border border-neutral-200 p-10 md:p-16 space-y-6 ${
        props.class || ""
      }`}
    >
      {props.children}
    </div>
  );
};

export default SectionCard;
