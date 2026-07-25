
export type Nullable<T> = T | null;

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};

export type AsyncStatus = "idle" | "loading" | "error" | "success";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};
