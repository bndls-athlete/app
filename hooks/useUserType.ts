"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

interface UserPublicMetadata {
  userType?: string;
}

const useUserType = () => {
  const { isSignedIn, user } = useUser();
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      const metadata = user?.publicMetadata as UserPublicMetadata | undefined;
      if (metadata?.userType) {
        setType(metadata.userType);
      } else {
        setType(null);
      }
    }
  }, [isSignedIn, user]);

  return { type };
};

export default useUserType;
