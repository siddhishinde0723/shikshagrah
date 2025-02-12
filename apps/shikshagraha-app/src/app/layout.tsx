export const metadata = {
  title: 'Welcome to Shikshagraha',
  description: 'Welcome to Shikshagraha',
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
