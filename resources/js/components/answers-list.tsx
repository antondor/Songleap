import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import {QuestionOption} from "@/components/options-grid";

export interface Answer {
    userId: number;
    osu_id: number;
    username: string;
    isCorrect: boolean | null;
    chosen: QuestionOption;
}

export default function AnswersList({ answers }: { answers: Answer[] }) {
    if (answers.length === 0) {
        return <p className="text-muted-foreground text-sm">No answers yet…</p>
    }

    return (
        <ul className="space-y-2">
            {answers.map((a, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://a.ppy.sh/${a.osu_id}`}
                            alt={a.username}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{a.username}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs text-center">
                            <div className="flex flex-col">
                                <span className="font-semibold">{a.chosen.artist}</span>
                                <span className="text-muted-foreground">{a.chosen.title}</span>
                            </div>
                        </Badge>
                        {a.isCorrect
                            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                            : <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                </li>
            ))}
        </ul>
    );
}
