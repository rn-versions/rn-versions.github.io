import React from 'react';
import styles from './PackageCard.module.scss';

import VersionDownloadChart, { MeasurementPoint } from './VersionDownloadChart';

import HistoryReader, { PackageIdentifier } from './HistoryReader';

export type PackageCardProps = {
  /**
   * The string to use in the title section of the card
   */
   title: string;

  /**
   * Which NPM package to show a shart for
   */
  packageName: PackageIdentifier;
}

const PackageCard: React.FC<PackageCardProps> = ({title, packageName}) => {
  const dataPoints = createDownloadMeasurementPoints(packageName);
  
  return (
    <div className={styles.versionChart}>
      <h3 className={styles.header}>{title}</h3>
      <VersionDownloadChart datapoints={dataPoints} maxVersionsShown={8} />
    </div>
  );
}

/**
 * Create the point representation of downloads to show
 */
function createDownloadMeasurementPoints(packageName: PackageIdentifier): MeasurementPoint[] {
  const historyReader = new HistoryReader(packageName);

  const dataPoints: MeasurementPoint[] = [];

  for (const datePoint of historyReader.getMajorVersionDatePoints()) {
    for (const [version, count] of Object.entries(datePoint.versions)) {
      dataPoints.push({date: datePoint.date.getTime(), version, count});
    }
  }

  return dataPoints;
}

export default PackageCard;
