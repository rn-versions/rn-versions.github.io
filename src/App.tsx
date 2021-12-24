import React, { useState } from "react";
import styles from "./App.module.scss";
import PackageCard, { VersionFilter } from "./PackageCard";

import { PackageIdentifier } from "./PackageDescription";
import NavBar, { NavPivotItem } from "./NavBar";

const packages: PackageIdentifier[] = [
  "react-native",
  "@types/react-native",
  "react-native-windows",
  "react-native-macos",
  "react-native-web",
];

const navItems: NavPivotItem<VersionFilter>[] = [
  { label: "Major", key: "major" },
  { label: "Patch", key: "patch" },
  { label: "Prerelease", key: "prerelease" },
];

function App() {
  const [versionFilter, setVersionFilter] = useState<VersionFilter>("major");

  return (
    <div className={styles.app}>
      <NavBar
        items={navItems}
        onItemSelected={(version) => setVersionFilter(version)}
      />

      <div className={styles.contentContainer}>
        <div className={styles.cardContainer}>
          {packages.map((pkg) => (
            <PackageCard
              identifier={pkg}
              versionFilter={versionFilter}
              key={pkg}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
