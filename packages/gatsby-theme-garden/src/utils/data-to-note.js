import React from "react";

const mapOutboundRefs = (ref) =>
  ref.parent.uid // roamBlock
    ? {
        mdx: ref.body,
        title: `__roam_block_${ref.parent.uid}`,
        id: ref.parent.id,
        displayTitle: ref.parent.fields.parentPage.title,
        slug: ref.parent.fields.slug,
      }
    : ref.parent.title // roamPage
    ? {
        mdx: ref.body,
        title: ref.parent.title,
        id: ref.parent.id,
        displayTitle: ref.parent.title,
        slug: ref.parent.fields.slug,
      }
    : ref.parent.fields && typeof ref.parent.fields.title !== "undefined" // File
    ? {
        mdx: ref.body,
        title: ref.parent.fields.title,
        id: ref.parent.id,
        displayTitle: ref.parent.fields.title,
        slug: ref.parent.fields.slug,
      }
    : console.warn(`Cannot map outbound ref`, ref) || null;

const mapInboundRefs = (ref) =>
  ref.parent.fields.parentPage // roamBlock
    ? {
        content: (
          <ul>
            <li>{ref.parent.string}</li>
          </ul>
        ),
        title: ref.parent.fields.parentPage.title,
        id: ref.parent.id,
        slug: ref.parent.fields.parentPage.fields.slug,
      }
    : ref.parent.title // roamPage
    ? {
        content: null,
        title: ref.parent.title,
        id: ref.parent.id,
        slug: ref.parent.fields.slug,
      }
    : ref.parent.fields && ref.parent.fields.title // File
    ? {
        content: null,
        title: ref.parent.fields.title,
        id: ref.parent.id,
        slug: ref.parent.fields.slug,
      }
    : console.warn(`Cannot map inbound ref`, ref) || null;

export const dataToNote = (data) =>
  data.roamPage
    ? {
        title: data.roamPage.title,
        mdx: data.roamPage.childMdx.body,
        outboundReferences: data.roamPage.childMdx.outboundReferences
          .map(mapOutboundRefs)
          .filter((x) => !!x),
        inboundReferences: data.roamPage.childMdx.inboundReferences
          .map(mapInboundRefs)
          .filter((x) => !!x),
      }
    : data.roamBlock
    ? {
        title: data.roamBlock.fields.parentPage.title,
        mdx: data.roamBlock.childMdx.body,
        outboundReferences: data.roamBlock.childMdx.outboundReferences
          .map(mapOutboundRefs)
          .filter((x) => !!x),
        inboundReferences: data.roamBlock.childMdx.inboundReferences
          .map(mapInboundRefs)
          .filter((x) => !!x),
        partOf: {
          slug: data.roamBlock.fields.parentPage.fields.slug,
          title: data.roamBlock.fields.parentPage.title,
        },
      }
    : data.file
    ? {
        title: data.file.fields.title,
        mdx: data.file.childMdx.body,
        outboundReferences: data.file.childMdx.outboundReferences
          .map(mapOutboundRefs)
          .filter((x) => !!x),
        inboundReferences: data.file.childMdx.inboundReferences
          .map(mapInboundRefs)
          .filter((x) => !!x),
      }
    : null;

export const dataToSlug = (data) =>
  data.roamPage
    ? data.roamPage.fields.slug
    : data.roamBlock
    ? data.roamBlock.fields.slug
    : data.file
    ? data.file.fields.slug
    : null;
