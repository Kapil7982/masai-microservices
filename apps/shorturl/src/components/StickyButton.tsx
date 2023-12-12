import React, { MouseEvent } from "react";

interface StickyButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  label: string;
}

const StickyButton: React.FC<StickyButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      style={{
        zIndex: "100",
      }}
      className="bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {label}
    </button>
  );
};

export default StickyButton;
