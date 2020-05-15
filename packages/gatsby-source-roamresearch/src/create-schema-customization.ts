import { CreateSchemaCustomizationArgs } from "gatsby";

export const createSchemaCustomization = ({
  actions,
  schema,
  getNode,
}: CreateSchemaCustomizationArgs) => {
  const resolve = (source: any, args: any, context: any, info: any) => {
    const ids = source[`${info.fieldName}___NODE`];
    if (!ids || !Array.isArray(ids)) {
      return [];
    }
    return ids.map((id) => getNode(id));
  };

  actions.createTypes(
    schema.buildObjectType({
      name: "RoamFields",
      fields: {
        inboundReferences: {
          type: "[RoamPageOrBlock!]!",
          resolve,
        },
        outboundReferences: {
          type: "[RoamPageOrBlock!]!",
          resolve,
        },
        allOutboundReferences: {
          type: "[RoamPageOrBlock!]!",
          resolve,
        },
      },
    })
  );

  actions.createTypes(`
    type RoamPage implements Node {
      fields: RoamFields
    }

    type RoamBlock implements Node {
      fields: RoamFields
    }

    union RoamPageOrBlock = RoamBlock | RoamPage

    type RoamFields {
      inboundReferences: [RoamPageOrBlock!]!
      outboundReferences: [RoamPageOrBlock!]!
      allOutboundReferences: [RoamPageOrBlock!]!
      slug: String
    }
  `);
};
