import { useState } from "react";
import styles from "./App.module.scss";
import PackageCard, { VersionFilter } from "./PackageCard";

import { PackageIdentifier } from "./PackageDescription";
import NavBar, { NavPivotItem } from "./NavBar";
import { blackTheme, darkTheme, lightTheme } from "./Themes";

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
    <div
      className={`${styles.app} ${darkMode ? styles.appDark : styles.appLight}`}
    >
      <NavBar
        items={navItems}
        onItemSelected={(version) => setVersionFilter(version)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        theme={darkMode ? blackTheme : lightTheme}
      />

      <div className={styles.contentContainer}>
        <div className={styles.cardContainer}>
          {packages.map((pkg) => (
            <PackageCard
              identifier={pkg.name}
              versionFilter={versionFilter}
              key={pkg.name}
              theme={darkMode ? darkTheme : lightTheme}
              tooltipTheme={darkMode ? blackTheme : lightTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
