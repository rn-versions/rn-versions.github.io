import React from "react";
import styles from "./App.module.scss";
import reactLogo from "./assets/react-logo.svg";
import githubLogo from "./assets/github-logo.svg";
import PackageCard from "./PackageCard";

import { Container, Navbar, Nav, NavItem, NavLink } from "react-bootstrap";

function App() {
  return (
    <div className={styles.app}>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <img
              src={reactLogo}
              alt="React Logo"
              className={styles.navbarLogo}
            />{" "}
            React Native Version Share
          </Navbar.Brand>
          <Nav>
            <NavItem>
              <NavLink
                href="https://github.com/rn-versions/rn-versions.github.io"
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.visitGithub}>Contribute on GitHub</span>
                <img
                  src={githubLogo}
                  alt="GitHub Logo"
                  className={styles.githubLogo}
                />
              </NavLink>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>

      <Container className={styles.cardContainer}>
        <PackageCard title="React Native" packageName="react-native" />
        <PackageCard title="React Native Web" packageName="react-native-web" />
        <PackageCard
          title="React Native Windows"
          packageName="react-native-windows"
        />
        <PackageCard
          title="React Native macOS"
          packageName="react-native-macos"
        />
      </Container>
    </div>
  );
}

export default App;
