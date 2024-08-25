import { queryOptions } from "@tanstack/react-query";
import { Job } from "@subbiesnap/types";

export const jobsQueryOptions = queryOptions<Job[]>({
  queryKey: ["jobs"],
  queryFn: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);

    return response.json();
  },
});
