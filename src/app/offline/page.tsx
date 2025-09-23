export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">You are offline</h1>
        <p className="text-gray-600">Please check your internet connection and try again.</p>
      </div>
    </main>
  );
}


