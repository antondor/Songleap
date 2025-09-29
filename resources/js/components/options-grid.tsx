import AnswerButton from "@/components/answer-button";

export interface QuestionOption {
    artist: string;
    title: string;
}

export interface GameResult {
    winner: any;
    artist: string;
    title: string;
}

export default function OptionsGrid({options, result, onAnswer, disabled}: {
    options: QuestionOption[];
    result: GameResult | null;
    onAnswer: (opt: QuestionOption) => void;
    disabled: boolean;
}) {
    return (
        <div className="grid grid-cols-2 gap-3 mt-4 w-full">
            {options.map((opt, idx) => {
                const isCorrect =
                    result &&
                    opt.artist === result.artist &&
                    opt.title === result.title;

                return (
                    <AnswerButton
                        key={idx}
                        option={opt}
                        result={result}
                        isCorrect={!!isCorrect}
                        disabled={disabled}
                        onClick={onAnswer}
                    />
                );
            })}
        </div>
    );
}
