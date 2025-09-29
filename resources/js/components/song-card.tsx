import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface SongCardProps {
    cover: string;
    audio: string;
}

export default function SongCard({ cover, audio }: SongCardProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="relative rounded-xl overflow-hidden shadow-md">
            <img
                src={cover}
                alt="cover"
                className="object-cover w-full h-full"
            />
            <button
                onClick={toggleAudio}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
            >
                {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                ) : (
                    <Play className="w-12 h-12 text-white" />
                )}
            </button>
            <audio
                ref={audioRef}
                src={audio}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}
