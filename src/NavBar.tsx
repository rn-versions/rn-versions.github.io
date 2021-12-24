import React from "react";
import styles from "./NavBar.module.scss";

import reactLogo from "./assets/react-logo.svg";
import githubLogo from "./assets/github-logo.svg";

import { ActionButton, Link, Pivot, PivotItem, Text } from "@fluentui/react";

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
    <div className={styles.nav}>
      <div className={styles.navContent}>
        <img src={reactLogo} alt="React Logo" className={styles.reactLogo} />
        <Text variant="xLarge">RN Versions</Text>

        <Pivot
          headersOnly
          className={styles.pivot}
          onLinkClick={(item) =>
            props.onItemSelected &&
            props.onItemSelected(item!.props.itemKey! as ItemKey)
          }
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
            text="Contribute on GitHub"
          />
          <img
            src={githubLogo}
            alt="GitHub Logo"
            className={styles.githubLogo}
          />
        </Link>
      </div>
    </div>
    <div className={styles.navSpacer} />
  </>
);

export default NavBar;
