import Navbar from "../components/Navbar";

function NotFoundPage() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-lg text-gray-600">The page you're looking for doesn't exist.</p>
      </div>
   </div>
  );
};

export default NotFoundPage;
