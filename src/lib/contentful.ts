import { createClient } from "contentful";

import { Entry } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface IBlogFields {
  title: string;
  slug: string;
  content: Document;
}

export interface IBlog extends Entry<IBlogFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "blog";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export const buildClient = () => {
  const client = createClient({
    space: process.env.CF_SPACE_ID || "",
    accessToken: process.env.CF_ACCESS_TOKEN || "",
  });
  return client;
};