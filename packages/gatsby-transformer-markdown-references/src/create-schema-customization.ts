import {
  CreateSchemaCustomizationArgs,
  SetFieldsOnGraphQLNodeTypeArgs,
  Node,
} from "gatsby";
import { PluginOptions, resolveOptions } from "./options";
import { generateData } from "./compute-inbounds";
import { getCachedNode, getInboundReferences } from "./cache";
import { nonNullable } from "./non-nullable";

export const createSchemaCustomization = (
  { actions }: CreateSchemaCustomizationArgs,
  _options?: PluginOptions
) => {
  const options = resolveOptions(_options);
  actions.createTypes(`
    union ReferenceTarget = ${options.types.join(" | ")}
  `);
};

export const setFieldsOnGraphQLNodeType = (
  { cache, type, getNode }: SetFieldsOnGraphQLNodeTypeArgs,
  _options?: PluginOptions
) => {
  const options = resolveOptions(_options);

  // if we shouldn't process this node, then return
  if (!options.types.includes(type.name)) {
    return {};
  }

  return {
    outboundReferences: {
      type: `[ReferenceTarget!]!`,
      resolve: async (node: Node) => {
        let cachedNode = await getCachedNode(cache, node.id, getNode);

        if (!cachedNode || !cachedNode.resolvedOutboundReferences) {
          await generateData(cache, getNode);
          cachedNode = await getCachedNode(cache, node.id, getNode);
        }

        if (cachedNode && cachedNode.resolvedOutboundReferences) {
          return cachedNode.resolvedOutboundReferences
            .map((nodeId) => getNode(nodeId))
            .filter(nonNullable);
        }

        return [];
      },
    },
    inboundReferences: {
      type: `[ReferenceTarget!]!`,
      resolve: async (node: Node) => {
        let data = await getInboundReferences(cache);

        if (!data) {
          await generateData(cache, getNode);
          data = await getInboundReferences(cache);
        }

        if (data) {
          return (data[node.id] || [])
            .map((nodeId) => getNode(nodeId))
            .filter(nonNullable);
        }

        return [];
      },
    },
  };
};
