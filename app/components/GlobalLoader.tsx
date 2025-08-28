import { Loader } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Loader className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
