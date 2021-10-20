import React from "react";
import styles from "./App.module.scss";
import reactLogo from "./assets/react-logo.svg";
import githubLogo from "./assets/github-logo.svg";
import PackageCard from "./PackageCard";

import {
  Col,
  Container,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "react-bootstrap";
import { PackageIdentifier } from "./HistoryReader";

type PackageRowProps = {
  title: string;
  packageName: PackageIdentifier;
};

const PackageRow: React.FC<PackageRowProps> = ({ title, packageName }) => (
  <Row className={styles.chartRow} key={packageName}>
    <Col>
      <PackageCard title={title} packageName={packageName} />
    </Col>
  </Row>
);

function App() {
  return (
    <div className="App">
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

      <Container className={styles.contentContainer}>
        <PackageRow title="React Native" packageName="react-native" />
        <PackageRow
          title="React Native Windows"
          packageName="react-native-windows"
        />
        <PackageRow
          title="React Native macOS"
          packageName="react-native-macos"
        />
      </Container>
    </div>
  );
}

export default App;
