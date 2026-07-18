import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}