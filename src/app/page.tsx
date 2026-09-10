import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-gray-800">Company AI Assistant</h1>
      </header>
      <div className="flex-1 overflow-hidden relative">
        <Chat />
      </div>
    </main>
  );
}
