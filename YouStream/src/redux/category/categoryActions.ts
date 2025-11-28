import { CATEGORY_SET } from "./categoryTypes";

export const setSelectedCategory = (id: string | null, title: string | null) => ({
  type: CATEGORY_SET,
  payload: { id, title },
});
