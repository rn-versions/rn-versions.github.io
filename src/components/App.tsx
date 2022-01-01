import { useState } from "react";
import styles from "../styles/App.module.scss";
import PackageCard, { VersionFilter } from "./PackageCard";

import { PackageIdentifier } from "../PackageDescription";
import NavBar, { NavPivotItem } from "./NavBar";
import {
  blackTheme,
  darkTheme,
  lightTheme,
  whiteTheme,
} from "../styles/Themes";
import { ThemeProvider } from "@fluentui/react";

const packages: Array<{ name: PackageIdentifier }> = [
  { name: "react-native" },
  { name: "@types/react-native" },
  { name: "react-native-windows" },
  { name: "react-native-macos" },
  { name: "react-native-web" },
];

const navItems: NavPivotItem<VersionFilter>[] = [
  { label: "Major", key: "major" },
  { label: "Patch", key: "patch" },
  { label: "Prerelease", key: "prerelease" },
];

function App() {
  const [versionFilter, setVersionFilter] = useState<VersionFilter>("major");
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  return (
    <ThemeProvider
      theme={darkMode ? darkTheme : lightTheme}
      className={styles.app}
    >
      <NavBar
        items={navItems}
        onItemSelected={(version) => setVersionFilter(version)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        theme={darkMode ? darkTheme : lightTheme}
      />

      <div className={styles.contentContainer}>
        <div className={styles.cardContainer}>
          {packages.map((pkg) => (
            <PackageCard
              identifier={pkg.name}
              versionFilter={versionFilter}
              key={pkg.name}
              theme={darkMode ? blackTheme : whiteTheme}
              tooltipTheme={darkMode ? darkTheme : lightTheme}
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
