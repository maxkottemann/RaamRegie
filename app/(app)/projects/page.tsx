"use client";

import { useProjectList } from "@/hooks/projectHooks/projectHooks";
import { useState } from "react";

export default function ProjectOverViewPage() {
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const { data: projectData, isFetching } = useProjectList(page, pageSize);

  console.log(projectData?.projects);
}
