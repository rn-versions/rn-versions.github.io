import React from "react";
import styles from "./NavBar.module.scss";

import reactLogo from "./assets/react-logo.svg";

import { darkTheme } from "./Themes";

import {
  ActionButton,
  IconButton,
  Link,
  Pivot,
  PivotItem,
  Stack,
  Text,
  ThemeProvider,
} from "@fluentui/react";

export type NavBarProps<ItemKey extends string> = {
  items: NavPivotItem<ItemKey>[];
  onItemSelected?: (key: ItemKey) => void;
};

export type NavPivotItem<ItemKey extends string> = {
  label: string;
  key: ItemKey;
};

const NavBar = <ItemKey extends string>(props: NavBarProps<ItemKey>) => (
  <>
    <ThemeProvider theme={darkTheme}>
      <Stack
        horizontal
        className={styles.nav}
        style={{ backgroundColor: darkTheme.semanticColors.bodyBackground }}
      >
        <div className={styles.navContent}>
          <img src={reactLogo} alt="React Logo" className={styles.reactLogo} />
          <Text variant="large">React Native Versions</Text>

          <Pivot
            headersOnly
            className={styles.pivot}
            onLinkClick={(item) => {
              window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
              if (props.onItemSelected) {
                props.onItemSelected(item!.props.itemKey! as ItemKey);
              }
            }}
          >
            {props.items.map((p) => (
              <PivotItem headerText={p.label} itemKey={p.key} />
            ))}
          </Pivot>

          <Link
            className={styles.gitHubLink}
            underline={false}
            href="https://github.com/rn-versions/rn-versions.github.io"
            target="_blank"
            rel="noreferrer"
          >
            <ActionButton
              className={styles.gitHubTextButton}
              text="Contribute"
              label="Contribute"
              iconProps={{ iconName: "GitHub", className: styles.gitHubLogo }}
            />
            <IconButton
              className={styles.gitHubIconButton}
              label="Contribute"
              iconProps={{ iconName: "GitHub", className: styles.gitHubLogo }}
            />
          </Link>
        </div>
      </Stack>
    </ThemeProvider>
    <div className={styles.navSpacer} />
  </>
);

export default NavBar;
