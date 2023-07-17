import { useEffect, useMemo, useState } from "react";
import { VersionFilter } from "../components/PackageCard";
import HistoryReader, { HistoryPointCollection } from "../HistoryReader";
import { PackageIdentifier } from "../PackageDescription";

export default function useHistory(
  identifier: PackageIdentifier,
  versionFilter: VersionFilter
): HistoryPointCollection | undefined {
  const [historyReaderRequests, setHistoryReaderRequests] = useState<
    Partial<Record<PackageIdentifier, Promise<HistoryReader>>>
  >({});
  const [historyReaders, setHistoryReaders] = useState<
    Partial<Record<PackageIdentifier, HistoryReader>>
  >({});

  useEffect(() => {
    if (!historyReaderRequests[identifier]) {
      const req = HistoryReader.get(identifier).then((reader) => {
        setHistoryReaders({ ...historyReaders, [identifier]: reader });
        return reader;
      });

      setHistoryReaderRequests({
        ...setHistoryReaderRequests,
        [identifier]: req,
      });
    }
  }, [historyReaderRequests, identifier, historyReaders]);

  return useMemo(() => {
    return historyReaders[identifier]?.getDatePoints(versionFilter);
  }, [historyReaders, identifier, versionFilter]);
}
