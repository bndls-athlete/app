"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Company() {
  const router = useRouter();

  useEffect(() => {
    router.push("/company/settings");
  }, [router]);

  return <div>Redirecting...</div>;
}

export default Company;
