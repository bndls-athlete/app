"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Athlete() {
  const router = useRouter();

  useEffect(() => {
    router.push("/athlete/jobs");
  }, [router]);

  return <div>Redirecting to Athlete Jobs...</div>;
}

export default Athlete;
