import { useDeferredValue } from "react";
import styles from "../styles/App.module.scss";
import PackageCard, { VersionFilter } from "./PackageCard";

import { PackageIdentifier, packages } from "../PackageDescription";
import NavBar, { NavPivotItem } from "./NavBar";
import {
  blackTheme,
  darkTheme,
  lightTheme,
  whiteTheme,
} from "../styles/Themes";
import { ThemeProvider } from "@fluentui/react";

import usePersistentState from "../hooks/usePersistentState";
import useSearchParamsState from "../hooks/useSearchParamsState";

const navItems: NavPivotItem<VersionFilter>[] = [
  { label: "Major", key: "major" },
  { label: "Patch", key: "patch" },
  { label: "Prerelease", key: "prerelease" },
];

function App() {
  const [versionFilter, setVersionFilter] = useSearchParamsState<VersionFilter>(
    "versionFilter",
    "major"
  );
  const [darkMode, setDarkMode] = usePersistentState(
    "App.darkMode",
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const deferredVersionFilter = useDeferredValue(versionFilter);

  const packagesByWeight = (Object.keys(packages) as PackageIdentifier[]).sort(
    (a, b) => packages[b].popularity - packages[a].popularity
  );

  return (
    <ThemeProvider
      theme={darkMode ? blackTheme : lightTheme}
      className={styles.app}
    >
      <NavBar
        items={navItems}
        selectedItem={versionFilter}
        onItemSelected={(version) => setVersionFilter(version)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        theme={darkMode ? blackTheme : lightTheme}
      />

      <div className={styles.contentContainer}>
        <div className={styles.cardContainer}>
          {packagesByWeight.map((pkg) => (
            <PackageCard
              identifier={pkg}
              versionFilter={deferredVersionFilter}
              key={pkg}
              theme={darkMode ? darkTheme : whiteTheme}
              tooltipTheme={darkMode ? blackTheme : lightTheme}
              maxVersionsShown={
                deferredVersionFilter === "major"
                  ? 12
                  : deferredVersionFilter === "patch"
                  ? 10
                  : 8
              }
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
