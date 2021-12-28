import { CSSProperties } from "react";
import styles from "./NavBar.module.scss";

import { darkTheme } from "./Themes";

import {
  ActionButton,
  IconButton,
  ITheme,
  Link,
  Pivot,
  PivotItem,
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

const Brand: React.FC<{ className: string }> = ({ className }) => (
  <div className={className}>
    <ReactLogoIcon className={styles.reactLogo} />
    <Text variant="large">React Native Versions</Text>
  </div>
);

const NavBar = <ItemKey extends string>(props: NavBarProps<ItemKey>) => {
  const theme = props.theme ?? darkTheme;
  const style: CSSProperties = {
    backgroundColor: (props.theme ?? darkTheme).semanticColors.bodyBackground,
  };
  return (
    <>
      <ThemeProvider
        className={styles.mobileHeader}
        theme={theme}
        style={style}
      >
        <div className={styles.mobileHeaderContent}>
          <Brand className={styles.mobileBrand} />
        </div>
      </ThemeProvider>

      <ThemeProvider className={styles.nav} theme={theme} style={style}>
        <div className={styles.navContent}>
          <Brand className={styles.brand} />

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
      </ThemeProvider>
    </>
  );
};

export default NavBar;
