export const metadata = { title: 'Student Dashboard' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f7fafc' }}>
        {children}
      </body>
    </html>
  );
}
