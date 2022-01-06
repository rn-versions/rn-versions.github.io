import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "../styles/NavBar.module.scss";

import { darkTheme } from "../styles/Themes";

import {
  CommandBarButton,
  IconButton,
  ITheme,
  Link,
  Pivot,
  PivotItem,
  Text,
  ThemeProvider,
} from "@fluentui/react";

import { LightIcon, GitHubLogoIcon } from "@fluentui/react-icons-mdl2";
import ReactLogoIcon from "../assets/ReactLogoIcon";
import TooltipButton from "./TooltipButton";

export type NavBarProps<ItemKey extends string> = {
  items: NavPivotItem<ItemKey>[];
  selectedItem?: ItemKey;
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
    const bodyIntersectionObserver = new IntersectionObserver(
      (events) =>
        events.forEach((e) => setScrolledAway(e.intersectionRatio < 1.0)),
      { rootMargin: "10px" }
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
            selectedKey={props.selectedItem}
            onLinkClick={(item) => {
              window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
              if (props.onItemSelected) {
                props.onItemSelected(item!.props.itemKey! as ItemKey);
              }
            }}
          >
            {props.items.map((p) => (
              <PivotItem headerText={p.label} itemKey={p.key} key={p.key} />
            ))}
          </Pivot>

          <div className={styles.buttonRegion}>
            <TooltipButton
              toggle
              checked={props.darkMode}
              onClick={() => props.onToggleDarkMode && props.onToggleDarkMode()}
              className={styles.brightnessIconButton}
              content="Toggle dark mode"
              aria-label="Toggle dark mode"
              onRenderIcon={() => (
                <LightIcon className={styles.brightnessIcon} />
              )}
            />

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
