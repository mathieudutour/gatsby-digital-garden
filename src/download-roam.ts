import puppeteer from "puppeteer";
import * as path from "path";
import * as fs from "fs";
import watch from "node-watch";
import { Reporter } from "gatsby";
import * as JSZip from "jszip";
import { RoamPage } from "./roam-schema";

enum LOGIN_STATE {
  NEED,
  IN,
}

const topBarMoreSelector = `.roam-topbar .bp3-icon-more`;

async function click(page: puppeteer.Page, xpath: string) {
  await page.waitForXPath(xpath);
  const [button] = await page.$x(xpath);
  if (!button) {
    throw new Error(`Button "${xpath}" not found`);
  }

  await button.click();
}

export const downloadRoam = async (
  url: string,
  {
    email,
    password,
    reporter,
    headless = true,
  }: { email: string; password: string; reporter: Reporter; headless?: boolean }
): Promise<RoamPage[] | undefined> => {
  const downloadPath = path.join(__dirname, `${Date.now()}`);
  await fs.promises.mkdir(downloadPath, { recursive: true });

  const zipCreationPromise = new Promise<string>((resolve, reject) => {
    const watcher = watch(
      downloadPath,
      { filter: /\.zip$/ },
      (eventType: "update" | "remove", filename: string) => {
        if (eventType == "update") {
          watcher.close();
          resolve(filename);
        }
      }
    );
  });

  // disable sandbox in production
  const browser = await puppeteer.launch({
    headless,
    args: process.env.NODE_ENV === "production" ? ["--no-sandbox"] : [],
  });

  try {
    const page = await browser.newPage();
    const cdp = await page.target().createCDPSession();
    cdp.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath,
    });

    await page.goto(url);

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
      reporter.info("Login into Roam Research...");
      await page.type('input[name="email"]', email);
      await page.type('input[name="password"]', password);
      const [loginButton] = await page.$x("//button[text()='Sign In']");
      if (!loginButton) {
        throw new Error("Login Button not found");
      }
      await loginButton.click();
      await page.waitForSelector(topBarMoreSelector);
    }

    await page.click(topBarMoreSelector);

    await click(page, "//div[text()='Export All']");
    await click(page, "//span[text()='Markdown']");
    await click(page, "//div[text()='JSON']");

    reporter.info("Downloading Roam Research database...");

    await click(page, "//button[text()='Export All']");
    const zipPath = await zipCreationPromise;

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
