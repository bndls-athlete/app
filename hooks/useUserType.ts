import { useEffect, useState } from "react";
import { useUser, useSession } from "@clerk/clerk-react";

interface UserPublicMetadata {
  userType?: string;
}

const useUserType = () => {
  const { isSignedIn, user } = useUser();
  const { session } = useSession();
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      session?.reload();
      const metadata = user?.publicMetadata as UserPublicMetadata | undefined;
      setType(metadata?.userType ?? null);
    }
  }, [isSignedIn, session, user]);

  return { type };
};

export default useUserType;
