import React from "react";
import styles from "./NavBar.module.scss";

import { darkTheme } from "./Themes";

import {
  ActionButton,
  IconButton,
  ITheme,
  Link,
  Pivot,
  PivotItem,
  Stack,
  Text,
  ThemeProvider,
} from "@fluentui/react";

import { GitHubLogoIcon } from "@fluentui/react-icons-mdl2";
import ReactLogoIcon from "./assets/ReactLogoIcon";

export type NavBarProps<ItemKey extends string> = {
  items: NavPivotItem<ItemKey>[];
  onItemSelected?: (key: ItemKey) => void;
  theme?: ITheme;
};

export type NavPivotItem<ItemKey extends string> = {
  label: string;
  key: ItemKey;
};

const NavBar = <ItemKey extends string>(props: NavBarProps<ItemKey>) => (
  <>
    <ThemeProvider theme={props.theme ?? darkTheme}>
      <Stack
        horizontal
        className={styles.nav}
        style={{
          backgroundColor: (props.theme ?? darkTheme).semanticColors
            .bodyBackground,
        }}
      >
        <div className={styles.navContent}>
          <div className={styles.brand}>
            <ReactLogoIcon className={styles.reactLogo} />
            <Text variant="large">React Native Versions</Text>
          </div>

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
              aria-label="Contribute"
              onRenderIcon={() => (
                <GitHubLogoIcon className={styles.gitHubLogo} />
              )}
            />
            <IconButton
              className={styles.gitHubIconButton}
              aria-label="Contribute"
              onRenderIcon={() => (
                <GitHubLogoIcon className={styles.gitHubLogo} />
              )}
            />
          </Link>
        </div>
      </Stack>
    </ThemeProvider>
    <div className={styles.navSpacer} />
  </>
);

export default NavBar;
