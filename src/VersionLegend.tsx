import type { Payload } from "recharts/types/component/DefaultLegendContent";
import styles from "./VersionLegend.module.scss";
import getContrastingColor from "./getContrastingColor";

import { Text, ThemeContext } from "@fluentui/react";

const VersionLegend: React.FC<{ payload: Payload[] }> = ({ payload }) => {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <ul className={styles.versionsList}>
          {payload.map((entry) => {
            const colorChipColor = theme
              ? getContrastingColor(
                  entry.color!,
                  theme.semanticColors.bodyBackground,
                  "minimal"
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

export default VersionLegend;
