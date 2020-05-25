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
    : ref.parent.childMdx // File
    ? {
        mdx: ref.body,
        title: ref.parent.childMdx.frontmatter.title,
        id: ref.parent.id,
        displayTitle: ref.parent.childMdx.frontmatter.title,
        slug: ref.parent.fields.slug,
      }
    : null;

export const dataToNote = (data) =>
  data.roamPage
    ? {
        title: data.roamPage.title,
        mdx: data.roamPage.childMdx.body,
        outboundReferences: data.roamPage.childMdx.outboundReferences.map(
          mapOutboundRefs
        ),
        inboundReferences: data.roamPage.childMdx.inboundReferences,
      }
    : data.roamBlock
    ? {
        title: data.roamBlock.fields.parentPage.title,
        mdx: data.roamBlock.childMdx.body,
        outboundReferences: data.roamBlock.childMdx.outboundReferences.map(
          mapOutboundRefs
        ),
        inboundReferences: data.roamBlock.childMdx.inboundReferences,
        partOf: {
          slug: data.roamBlock.fields.parentPage.fields.slug,
          title: data.roamBlock.fields.parentPage.title,
        },
      }
    : data.file
    ? {
        title: data.file.childMdx.frontmatter.title,
        mdx: data.file.childMdx.body,
        outboundReferences: data.file.childMdx.outboundReferences.map(
          mapOutboundRefs
        ),
        inboundReferences: data.file.childMdx.inboundReferences,
      }
    : null;
