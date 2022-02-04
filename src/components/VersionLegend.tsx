import type { Payload } from "recharts/types/component/DefaultLegendContent";
import styles from "../styles/VersionLegend.module.scss";

import { Text, ThemeContext } from "@fluentui/react";
import { colorForHue } from "../chartColor";

type VersionLegendProps = {
  payload: Payload[];
  versionHues: Record<string, number>;
  hiddenSeries: string[];
  setHiddenSeries: React.Dispatch<React.SetStateAction<string[]>>;
};

const VersionLegend: React.FC<VersionLegendProps> = ({
  payload,
  versionHues,
  hiddenSeries,
  setHiddenSeries,
}) => {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={styles.versionsListContainer}>
          <ul className={styles.versionsList}>
            {payload.map(({ value, color }) => {
              const isHidden = hiddenSeries.includes(value);
              const colorChipColor = isHidden
                ? theme?.semanticColors.buttonBackgroundDisabled
                : theme
                ? colorForHue(
                    versionHues[value!],
                    theme.isInverted
                      ? { variant: "dark", targetLuminance: "contrasts-dark" }
                      : {
                          variant: "light",
                          targetLuminance: "contrasts-light",
                        }
                  )
                : color!;

              return (
                <li
                  key={value}
                  className={styles.versionsListItem}
                  onClick={() =>
                    setHiddenSeries((hiddenSeries: string[]) =>
                      hiddenSeries.includes(value)
                        ? hiddenSeries.filter((key: string) => key !== value)
                        : hiddenSeries.concat(value)
                    )
                  }
                >
                  <div
                    className={styles.versionColorIndicator}
                    style={{ backgroundColor: colorChipColor }}
                  />
                  <Text
                    variant="small"
                    className={styles.versionLabel}
                    style={
                      isHidden
                        ? { color: theme?.semanticColors.buttonTextDisabled }
                        : {}
                    }
                  >
                    {value}
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
