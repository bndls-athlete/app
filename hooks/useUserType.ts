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
      const metadata = user?.publicMetadata as UserPublicMetadata | undefined;
      if (metadata?.userType) {
        // Set the type if it's already available in the metadata
        setType(metadata.userType);
      } else {
        // Reload the session to fetch the latest metadata if userType is not available
        session?.reload().then(() => {
          const updatedMetadata = user?.publicMetadata as
            | UserPublicMetadata
            | undefined;
          setType(updatedMetadata?.userType ?? null);
        });
      }
    }
  }, [isSignedIn, session, user]);

  return { type };
};

export default useUserType;
