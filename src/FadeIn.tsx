import React, { useEffect, useState } from "react";

const FadeIn: React.FC<{ duration: "fast" | "slow"; className?: string }> = ({
  duration,
  className,
  children,
}) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      setHidden(false);
    });
  }, []);
  return (
    <div
      className={className}
      style={{
        transitionTimingFunction: "ease-in-out",
        transitionDuration: duration === "fast" ? "100ms" : "300ms",
        transitionProperty: "opacity",
        opacity: hidden ? 0.0 : 1,
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
