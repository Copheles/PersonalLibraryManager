import UnAuthorizedPage from "@/components/guard/unauthorized.guard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UnAuthorizedPage />
      {children}
    </>
  );
}
