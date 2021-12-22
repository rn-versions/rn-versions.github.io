import React, { useState } from "react";
import styles from "./App.module.scss";
import reactLogo from "./assets/react-logo.svg";
import githubLogo from "./assets/github-logo.svg";
import PackageCard, { VersionFilter } from "./PackageCard";

import {
  Container,
  Navbar,
  Nav,
  NavLink,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { PackageIdentifier } from "./PackageDescription";

const packages: PackageIdentifier[] = [
  "react-native",
  "@types/react-native",
  "react-native-windows",
  "react-native-macos",
  "react-native-web",
];

function App() {
  const [versionFilter, setVersionFilter] = useState<VersionFilter>("major");

  return (
    <div className={styles.app}>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container className={styles.navbarContainer}>
          <Navbar.Brand className={styles.navbarBrand}>
            <Navbar.Toggle />
            <img
              src={reactLogo}
              alt="React Logo"
              className={styles.navbarLogo}
            />{" "}
            React Native Version Share
          </Navbar.Brand>

          <Navbar.Collapse>
            <Nav className={styles.leftNav}>
              <Nav.Item>
                <ButtonGroup className={styles.versionFilterToggle}>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    active={versionFilter === "major"}
                    onClick={() => setVersionFilter("major")}
                  >
                    Major
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    active={versionFilter === "patch"}
                    onClick={() => setVersionFilter("patch")}
                  >
                    Patch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    active={versionFilter === "prerelease"}
                    onClick={() => setVersionFilter("prerelease")}
                  >
                    Prerelease
                  </Button>
                </ButtonGroup>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Collapse className={styles.noGrow}>
            <Nav>
              <Nav.Item>
                <NavLink
                  href="https://github.com/rn-versions/rn-versions.github.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.visitGithub}>
                    Contribute on GitHub
                  </span>
                  <img
                    src={githubLogo}
                    alt="GitHub Logo"
                    className={styles.githubLogo}
                  />
                </NavLink>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className={styles.cardContainer}>
        {packages.map((pkg) => (
          <PackageCard
            identifier={pkg}
            versionFilter={versionFilter}
            key={pkg}
          />
        ))}
      </Container>
    </div>
  );
}

export default App;
