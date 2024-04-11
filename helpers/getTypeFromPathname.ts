export const getTypeFromPathname = (pathname: string) => {
  const pathSegments = pathname.split("/");
  return pathSegments.length > 1 ? pathSegments[1] : "";
};
