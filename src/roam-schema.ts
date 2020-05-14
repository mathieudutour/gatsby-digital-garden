export type RoamPage = {
  title: string;
  children?: RoamBlock[];
  "create-time"?: number;
  "create-email"?: string;
  "edit-time"?: number;
  "edit-email"?: string;
};

export type RoamBlock = {
  string: string;
  uid?: string;
  children?: RoamBlock[];
  "create-time"?: number;
  "create-email"?: string;
  "edit-time"?: number;
  "edit-email"?: string;
  heading?: 0 | 1 | 2 | 3;
  "text-align": "left" | "center" | "right" | "justify";
};
