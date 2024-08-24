import { queryOptions } from "@tanstack/react-query";
import { Job } from "@subbiesnap/types";

export const jobsQueryOptions = queryOptions<Job[]>({
  queryKey: ["jobs"],
  queryFn: async () => {
    const response = await fetch("/api/jobs");

    return response.json();
  },
});
