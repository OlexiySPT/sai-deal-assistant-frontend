export const metadata = {
  title: 'SAI Deal Assistant BFF',
  description: 'Backend for Frontend API Gateway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}