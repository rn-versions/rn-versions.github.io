# React Native Version Tracker

Viewable at [https://rn-versions.github.io/](https://rn-versions.github.io/)

## How to run

Run `yarn start` to open a browser with live reload of the application

## Contributing

Committed changes are built and pushed automatically.

## Updating data

Data is updated on a daily internal via GitHub actions. Data can be manually
updated for testing by running `yarn update-history`.

Version counts and assets may be regenerated against the scraped HTML by running
`yarn fix-history`. This can be used to retroactively fix bugs in how download
information is parsed.

Assets can be generated without modifying history data by running
`yarn generate-assets`.