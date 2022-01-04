import { useEffect, useMemo, useState } from "react";
import { VersionFilter } from "../components/PackageCard";
import HistoryReader, { HistoryPointCollection } from "../HistoryReader";
import { PackageIdentifier } from "../PackageDescription";

export default function useHistory(
  identifier: PackageIdentifier,
  versionFilter: VersionFilter
): HistoryPointCollection | undefined {
  const [hisoryReaderRequests, setHistoryReaderRequests] = useState<
    Partial<Record<PackageIdentifier, Promise<HistoryReader>>>
  >({});
  const [hisoryReaders, setHistoryReaders] = useState<
    Partial<Record<PackageIdentifier, HistoryReader>>
  >({});

  useEffect(() => {
    if (!hisoryReaderRequests[identifier]) {
      const req = HistoryReader.get(identifier).then((reader) => {
        setHistoryReaders({ ...hisoryReaders, [identifier]: reader });
        return reader;
      });

      setHistoryReaderRequests({
        ...setHistoryReaderRequests,
        [identifier]: req,
      });
    }
  }, [hisoryReaderRequests, identifier, hisoryReaders]);

  return useMemo(() => {
    return hisoryReaders[identifier]?.getDatePoints(versionFilter);
  }, [hisoryReaders, identifier, versionFilter]);
}
