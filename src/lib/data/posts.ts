import type { Post } from "@/models/post";
import fetchApi from "../utils/api";
import { adminCategoryId, revalidateTime } from "@/lib/utils/constants";

export function getPosts(props?: { limit?: number }) {
  const params = {
    categories: adminCategoryId.toString(),
    per_page: props?.limit ? props.limit.toString() : "100",
  };

  const queryParams = new URLSearchParams(params).toString();

  return fetchApi<Post[]>(`/posts?${queryParams}`, {
    next: {
      revalidate: revalidateTime,
      tags: ["posts"],
    },
    cache: "force-cache",
  });
}

export async function getPostsByCategoryId(categoryId: number) {
  const posts = await getPosts();

  return posts.filter((post) => post.categories.includes(categoryId));
}

export async function getPostById(id: number) {
  const posts = await getPosts();

  return posts.find((post) => post.id === id);
}
