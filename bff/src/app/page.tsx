export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>SAI Deal Assistant BFF</h1>
      <p>Backend for Frontend - API Gateway</p>
      <p>Status: <span style={{ color: 'green' }}>Running</span></p>
      <p>All requests to /api/* are proxied to the backend.</p>
    </main>
  );
}