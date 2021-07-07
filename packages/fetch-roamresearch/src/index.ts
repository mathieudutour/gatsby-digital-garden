import puppeteer from "puppeteer";
import * as path from "path";
import * as fs from "fs";
import watch from "node-watch";
import JSZip from "jszip";
import { RoamPage, RoamBlock } from "./roam-schema";

export { RoamPage, RoamBlock };

enum LOGIN_STATE {
  NEED,
  IN,
}

type Reporter = {
  info(log: string): void;
};

const topBarMoreSelector = `.rm-topbar .bp3-icon-more`;

async function click(page: puppeteer.Page, xpath: string) {
  await page.waitForXPath(xpath);
  const [button] = await page.$x(xpath);
  if (!button) {
    throw new Error(`Button "${xpath}" not found`);
  }

  await button.click();
}

function sleep(time: number = 3000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function checkLogin(
  page: puppeteer.Page,
  auth: {
    email: string;
    password: string;
  },
  options?: {
    reporter?: Reporter;
    debug?: boolean;
  }
) {
  const state = await Promise.race([
    page
      .waitForSelector('input[name="email"]')
      .then(() => LOGIN_STATE.NEED)
      .catch(() => LOGIN_STATE.NEED),
    page
      .waitForSelector(topBarMoreSelector)
      .then(() => LOGIN_STATE.IN)
      .catch(() => LOGIN_STATE.NEED),
  ]);

  if (state === LOGIN_STATE.NEED) {
    options?.reporter?.info("Login into Roam Research...");
    await page.type('input[name="email"]', auth.email);
    await page.type('input[name="password"]', auth.password);
    const [loginButton] = await page.$x("//button[text()='Sign In']");
    if (!loginButton) {
      throw new Error("Login Button not found");
    }
    await loginButton.click();
    await sleep();

    // check for login until we are fine
    await checkLogin(page, auth);
  }
}

const downloadRoam = async (
  url: string,
  auth: {
    email: string;
    password: string;
  },
  options?: {
    reporter?: Reporter;
    puppeteer?: puppeteer.LaunchOptions &
      puppeteer.BrowserLaunchArgumentOptions &
      puppeteer.BrowserConnectOptions;
    debug?: boolean;
  }
): Promise<RoamPage[] | undefined> => {
  const downloadPath = path.join(__dirname, `${Date.now()}`);
  await fs.promises.mkdir(downloadPath, { recursive: true });

  if (options?.debug) {
    options.reporter?.info(`created cache dir ${downloadPath}`);
  }

  const zipCreationPromise = new Promise<string>((resolve, reject) => {
    const watcher = watch(
      downloadPath,
      { filter: /\.zip$/ },
      (eventType, filename) => {
        if (eventType == "update" && filename) {
          watcher.close();
          resolve(filename);
        }
      }
    );
  });

  // disable sandbox in production
  const browser = await puppeteer.launch({
    args: process.env.NODE_ENV === "production" ? ["--no-sandbox"] : [],
    ...(options?.puppeteer || {}),
  });

  try {
    const page = await browser.newPage();
    const cdp = await page.target().createCDPSession();
    cdp.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath,
    });

    await page.goto(url);

    if (options?.debug) {
      options.reporter?.info(`opening ${url}`);
    }

    await checkLogin(page, auth, options);

    await page.click(topBarMoreSelector);

    await click(page, "//div[text()='Export All']");
    await click(page, "//span[text()='Markdown']");
    await click(page, "//div[text()='JSON']");

    options?.reporter?.info("Downloading Roam Research database...");

    await click(page, "//button[text()='Export All']");
    const zipPath = await zipCreationPromise;

    cdp.detach();
    await browser.close();

    const data = await fs.promises.readFile(zipPath);
    const zip = await JSZip.loadAsync(data);

    const jsonFile = await new Promise<JSZip.JSZipObject>((resolve) => {
      zip.forEach((_relPath, file) => {
        resolve(file);
      });
    });

    const jsonString = await jsonFile.async("text");

    await fs.promises.unlink(zipPath);
    await fs.promises.rmdir(downloadPath);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error(err);
    await browser.close();
    return undefined;
  }
};

export default downloadRoam;
