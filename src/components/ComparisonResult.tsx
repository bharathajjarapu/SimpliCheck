import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ComparisonResultProps {
  similarity: number | null;
  loading: boolean;
}

export function ComparisonResult({ similarity, loading }: ComparisonResultProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Processing...</span>
      </div>
    );
  }

  if (similarity === null) return null;

  return (
    <Card className="w-full max-w-md animate-slide-in">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Similarity Score</span>
            <span>{similarity.toFixed(2)}%</span>
          </div>
          <Progress value={similarity} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}