import { useAuth } from "../context/AuthContext";
import { Github } from "lucide-react";

export function Login() {
  const { signInWithGithub } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">Sign In</h2>
        <button
          onClick={signInWithGithub}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 font-bold text-white bg-gray-800 rounded hover:bg-gray-900 focus:outline-none focus:shadow-outline"
        >
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
