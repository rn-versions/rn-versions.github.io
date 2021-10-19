import React from 'react';
import styles from './App.module.scss';
import logo from './assets/logo.svg';
import PackageCard from './PackageCard';

import {Col, Container, Navbar, Row} from 'react-bootstrap'
import {PackageIdentifier} from './HistoryReader';

type PackageRowProps = {
  title: string;
  packageName: PackageIdentifier;
}

const PackageRow: React.FC<PackageRowProps> = ({title, packageName}) => (
  <Row className={styles.chartRow} key={packageName}>
    <Col>
      <PackageCard title={title} packageName={packageName} />
    </Col>
  </Row>);

function App() {
  return (
    <div className="App">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              <img
                src={logo}
                alt="logo"
                className={styles.navbarLogo} />
              {' '}
              React Native Version Share
            </Navbar.Brand>
          </Container>
        </Navbar>

      <Container className={styles.contentContainer}>
        <PackageRow title="Android/iOS" packageName="react-native" />
        <PackageRow title="Windows" packageName="react-native-windows" />
        <PackageRow title="macOS" packageName="react-native-macos" />
      </Container>
    </div>
  );
}

export default App;
