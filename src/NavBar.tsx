import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./NavBar.module.scss";

import { darkTheme } from "./Themes";

import {
  CommandBarButton,
  IconButton,
  ITheme,
  Link,
  Pivot,
  PivotItem,
  Text,
  TooltipHost,
  ThemeProvider,
} from "@fluentui/react";

import { LightIcon, GitHubLogoIcon } from "@fluentui/react-icons-mdl2";
import ReactLogoIcon from "./assets/ReactLogoIcon";

export type NavBarProps<ItemKey extends string> = {
  items: NavPivotItem<ItemKey>[];
  onItemSelected?: (key: ItemKey) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
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

  const [scrolledAway, setScrolledAway] = useState(false);
  const nonStickyElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyIntersectionObserver = new IntersectionObserver((events) =>
      events.forEach((e) => setScrolledAway(e.intersectionRatio < 1.0))
    );
    bodyIntersectionObserver.observe(nonStickyElement.current!);
    return () => bodyIntersectionObserver.disconnect();
  });

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

      <div ref={nonStickyElement} />

      <ThemeProvider
        className={
          scrolledAway ? `${styles.nav} ${styles.scrolledAwayNav}` : styles.nav
        }
        theme={theme}
        style={style}
      >
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

          <div className={styles.buttonRegion}>
            <TooltipHost content="Toggle dark mode">
              <IconButton
                toggle
                checked={props.darkMode}
                onClick={() =>
                  props.onToggleDarkMode && props.onToggleDarkMode()
                }
                className={styles.brightnessIconButton}
                aria-label="Toggle dark mode"
                onRenderIcon={() => (
                  <LightIcon className={styles.brightnessIcon} />
                )}
              />
            </TooltipHost>

            <Link
              className={styles.gitHubLink}
              underline={false}
              href="https://github.com/rn-versions/rn-versions.github.io"
              target="_blank"
              rel="noreferrer"
            >
              <CommandBarButton
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
        </div>
      </ThemeProvider>
    </>
  );
};

export default NavBar;
