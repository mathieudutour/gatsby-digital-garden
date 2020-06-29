import * as fs from "fs";
import * as path from "path";
import { Node } from "gatsby";
import { nonNullable } from "./non-nullable";
import { References } from "./get-references";

export const cacheDirectory = (cache: any): string => {
  return cache.directory;
};

export type CachedNode = {
  node: Node;
  outboundReferences: References;
  resolvedOutboundReferences?: string[];
  title: string;
  aliases: string[];
};
export type InboundReferences = { [id: string]: string[] };
const inboundFile = `___inboundReferences.json`;

export const getAllCachedNodes = async (cache: any, getNode: Function) => {
  const dir = cacheDirectory(cache);
  const files = await fs.promises.readdir(dir);

  return (
    await Promise.all(
      files.map((f) => {
        if (f === inboundFile) {
          return;
        }
        const id = decodeURIComponent(f.replace(/\.json$/, ""));
        return getCachedNode(cache, id, getNode);
      })
    )
  ).filter(nonNullable);
};

export const setCachedNode = (cache: any, id: string, data: CachedNode) => {
  return fs.promises.writeFile(
    path.join(cacheDirectory(cache), `${encodeURIComponent(id)}.json`),
    JSON.stringify({
      outboundReferences: data.outboundReferences,
      title: data.title,
      aliases: data.aliases,
      resolvedOutboundReferences: data.resolvedOutboundReferences,
    })
  );
};

export const getCachedNode = async (
  cache: any,
  id: string,
  getNode: Function
): Promise<CachedNode | undefined> => {
  const node = getNode(id);

  if (!node) {
    try {
      // clean up the cache if we have some file that aren't node
      await fs.promises.unlink(
        path.join(cacheDirectory(cache), `${encodeURIComponent(id)}.json`)
      );
    } catch (err) {}
    return undefined;
  }

  try {
    const data = JSON.parse(
      await fs.promises.readFile(
        path.join(cacheDirectory(cache), `${encodeURIComponent(id)}.json`),
        "utf8"
      )
    );

    return { node, ...data };
  } catch (err) {
    return undefined;
  }
};

export const setInboundReferences = (cache: any, data: InboundReferences) => {
  return fs.promises.writeFile(
    path.join(cacheDirectory(cache), inboundFile),
    JSON.stringify(data)
  );
};

export const getInboundReferences = async (
  cache: any
): Promise<InboundReferences | undefined> => {
  try {
    return JSON.parse(
      await fs.promises.readFile(
        path.join(cacheDirectory(cache), inboundFile),
        "utf8"
      )
    );
  } catch (err) {
    return undefined;
  }
};

export const clearInboundReferences = async (cache: any) => {
  try {
    await fs.promises.unlink(path.join(cacheDirectory(cache), inboundFile));
  } catch (e) {}
};
