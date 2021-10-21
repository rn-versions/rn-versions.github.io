import React, { useState } from "react";
import styles from "./App.module.scss";
import reactLogo from "./assets/react-logo.svg";
import githubLogo from "./assets/github-logo.svg";
import PackageCard from "./PackageCard";

import {
  Container,
  Navbar,
  Nav,
  NavLink,
  ButtonGroup,
  Button,
} from "react-bootstrap";

function App() {
  const [showPatch, setshowPatch] = useState<boolean>(false);

  return (
    <div className={styles.app}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container className={styles.navbarContainer}>
          <Navbar.Brand className={styles.navbarBranc}>
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
                    className={styles.navToggleButton}
                    variant="outline-secondary"
                    active={!showPatch}
                    onClick={() => setshowPatch(false)}
                  >
                    Major versions
                  </Button>
                  <Button
                    className={styles.navToggleButton}
                    variant="outline-secondary"
                    active={showPatch}
                    onClick={() => setshowPatch(true)}
                  >
                    Patch versions
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
        <PackageCard
          identifier={"react-native"}
          showPatchVersions={showPatch}
        />
        <PackageCard
          identifier={"@types/react-native"}
          showPatchVersions={showPatch}
        />
        <PackageCard
          identifier={"react-native-web"}
          showPatchVersions={showPatch}
        />
        <PackageCard
          identifier={"react-native-windows"}
          showPatchVersions={showPatch}
        />
        <PackageCard
          identifier={"react-native-macos"}
          showPatchVersions={showPatch}
        />
        <PackageCard
          identifier={"react-native-reanimated"}
          showPatchVersions={showPatch}
        />
      </Container>
    </div>
  );
}

export default App;
