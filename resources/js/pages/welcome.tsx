import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { route } from "ziggy-js";

export default function LoginPage() {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 px-4">
                {/* Header / Logo */}
                <header className="mb-16 text-center">
                    <img
                        src="/static/images/logo.jpg"
                        alt="Songleap Logo"
                        className="mx-auto h-16 w-16 rounded-full shadow-lg"
                    />
                    <h1 className="text-4xl font-extrabold mt-4 text-purple-800">
                        Welcome to Songleap
                    </h1>
                    <p className="mt-2 text-purple-600 max-w-md mx-auto">
                        Your hub for exploring ranked osu! songs. Log in with your osu! account to start discovering
                        and tracking your favorite tracks.
                    </p>
                </header>

                <div className="w-full max-w-sm">
                    <Button
                        asChild
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg transition-all flex items-center justify-center"
                    >
                        <a href={route("auth.osu")}>
                            Login with osu!
                            <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                        </a>
                    </Button>
                </div>

                <footer className="mt-24 text-center text-sm text-purple-700/70">
                    <p>
                        Built with love ❤️ for the osu! community.
                    </p>
                    <p className="mt-1">
                        <a href="https://github.com/antondor" className="underline hover:text-purple-900">
                            GitHub
                        </a>{" "}
                        |{" "}
                        <a href="https://discord.gg" className="underline hover:text-purple-900">
                            Discord
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
}
