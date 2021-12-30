import type { Payload } from "recharts/types/component/DefaultLegendContent";
import styles from "./VersionLegend.module.scss";

import { Text, ThemeContext } from "@fluentui/react";
import { colorForHue } from "./chartColor";

type CreateOptions = {
  versionHues: Record<string, number>;
};

export function createLegendContent(
  opts: CreateOptions
): React.FC<{ payload: Payload[] }> {
  return ({ payload }) => {
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <ul className={styles.versionsList}>
            {payload.map((entry) => {
              const colorChipColor = theme
                ? colorForHue(
                    opts.versionHues[entry.value!],
                    theme.isInverted
                      ? { variant: "dark", targetLuminance: "contrasts-dark" }
                      : { variant: "light", targetLuminance: "contrasts-light" }
                  )
                : entry.color!;

              return (
                <li key={entry.value} className={styles.versionsListItem}>
                  <div
                    className={styles.versionColorIndicator}
                    style={{ backgroundColor: colorChipColor }}
                  />
                  <Text variant="small" className={styles.versionLabel}>
                    {entry.value}
                  </Text>
                </li>
              );
            })}
          </ul>
        )}
      </ThemeContext.Consumer>
    );
  };
}
