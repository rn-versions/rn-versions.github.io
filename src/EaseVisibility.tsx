import React from "react";

const EaseVisiblity: React.FC<{
  visible: boolean;
  duration: "fast" | "slow";
  className?: string;
}> = ({ visible, duration, className, children }) => {
  return (
    <div
      className={className}
      style={{
        transitionTimingFunction: "ease-in-out",
        transitionDuration: duration === "fast" ? "100ms" : "300ms",
        transitionProperty: "opacity",
        opacity: visible ? 1.0 : 0,
      }}
    >
      {children}
    </div>
  );
};

export default EaseVisiblity;
