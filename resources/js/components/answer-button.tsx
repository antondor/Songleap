import { Button } from "@/components/ui/button";
import {GameResult, QuestionOption} from "@/components/options-grid";

interface AnswerButtonProps {
    option: QuestionOption;
    result: GameResult | null;
    isCorrect: boolean;
    disabled: boolean;
    onClick: (option: QuestionOption) => void;
}

export default function AnswerButton({option, result, isCorrect, disabled, onClick}: AnswerButtonProps) {
    return (
        <Button
            variant={isCorrect ? "success" : result ? "secondary" : "outline"}
            disabled={disabled || !!result}
            className="h-20 flex flex-col justify-center text-sm font-medium rounded-xl text-center"
            onClick={() => onClick(option)}
        >
            <span className="font-semibold">{option.artist}</span>
            <span className="text-muted-foreground">{option.title}</span>
        </Button>
    );
}
