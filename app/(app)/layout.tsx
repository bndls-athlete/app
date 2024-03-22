import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300 ease-in-out">
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
