import type { Payload } from "recharts/types/component/DefaultLegendContent";
import styles from "../styles/VersionLegend.module.scss";

import { Text, ThemeContext } from "@fluentui/react";
import { colorForHue } from "../chartColor";

type VersionLegendProps = {
  payload: Payload[];
  versionHues: Record<string, number>;
};

const VersionLegend: React.FC<VersionLegendProps> = ({
  payload,
  versionHues,
}) => {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={styles.versionsListContainer}>
          <ul className={styles.versionsList}>
            {payload.map((entry) => {
              const colorChipColor = theme
                ? colorForHue(
                    versionHues[entry.value!],
                    theme.isInverted
                      ? { variant: "dark", targetLuminance: "contrasts-dark" }
                      : {
                          variant: "light",
                          targetLuminance: "contrasts-light",
                        }
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
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default VersionLegend;
