# fetch-roamresearch

Export a Roam Research database

## Installation

```bash
npm install fetch-roamresearch
```

## Usage

```ts
import fetchRoamResearch from "fetch-roamresearch";

const ROAM_URL = "https://roamresearch.com/#/app/YOUR_ROAM_DATABASE";
const ROAM_EMAIL = "YOUR_ROAM_EMAIL";
const ROAM_PASSWORD = "YOUR_ROAM_PASSWORD";

const pages = await fetchRoamResearch(ROAM_URL, {
  email: ROAM_EMAIL,
  password: ROAM_PASSWORD,
});
```

> Note that it only works with an email/password login. Google login is not supported.
