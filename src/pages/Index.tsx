import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { InputTypeSelector } from "@/components/InputTypeSelector";
import { ComparisonResult } from "@/components/ComparisonResult";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileUpload } from "@/components/FileUpload";
import { convertImageToText, convertCodeToText } from "@/utils/textConversion";
import { compareTexts } from "@/utils/comparison";

type InputType = "text" | "image" | "code";

const Index = () => {
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [studentImage, setStudentImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [originalInputType, setOriginalInputType] = useState<InputType>("text");
  const [studentInputType, setStudentInputType] = useState<InputType>("text");
  const { toast } = useToast();

  const convertToText = async (
    type: InputType,
    content: string | File | null
  ): Promise<string> => {
    if (!content) return "";
    setConverting(true);

    try {
      switch (type) {
        case "text":
          return content as string;
        case "image":
          return await convertImageToText(content as string);
        case "code":
          if (content instanceof File) {
            return await convertCodeToText(content);
          }
          return "";
        default:
          return "";
      }
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "Failed to convert content to text",
        variant: "destructive",
      });
      return "";
    } finally {
      setConverting(false);
    }
  };

  const compareAnswers = async () => {
    try {
      setLoading(true);
      
      const originalText = await convertToText(
        originalInputType,
        originalInputType === "text" ? originalAnswer : 
        originalInputType === "image" ? originalImage :
        originalFile
      );

      const studentText = await convertToText(
        studentInputType,
        studentInputType === "text" ? studentAnswer :
        studentInputType === "image" ? studentImage :
        studentFile
      );

      if (!originalText || !studentText) {
        toast({
          title: "Missing Input",
          description: "Please provide both answers to compare",
          variant: "destructive",
        });
        return;
      }

      const similarityScore = await compareTexts(originalText, studentText);
      setSimilarity(similarityScore);
      
      toast({
        title: "Comparison Complete",
        description: `Similarity score: ${similarityScore.toFixed(2)}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compare answers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen font-satoshi">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Simpli-Check</h1>
        <ThemeToggle />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 ">
        <Card className="">
          <CardHeader>
            <CardTitle>Original Answer</CardTitle>
            <InputTypeSelector
              selectedType={originalInputType}
              onChange={setOriginalInputType}
              label=""
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {renderInput(originalInputType, true)}
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Student Answer</CardTitle>
            <InputTypeSelector
              selectedType={studentInputType}
              onChange={setStudentInputType}
              label=""
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {renderInput(studentInputType, false)}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Button
          onClick={compareAnswers}
          disabled={loading || converting}
          className="w-full max-w-md"
        >
          {converting ? "Converting..." : loading ? "Comparing..." : "Compare Answers"}
        </Button>

        <ComparisonResult similarity={similarity} loading={loading || converting} />
      </div>
    </div>
  );

  function renderInput(type: InputType, isOriginal: boolean) {
    switch (type) {
      case "text":
        return (
          <Textarea
            placeholder={`Enter the ${isOriginal ? "original" : "student's"} answer...`}
            value={isOriginal ? originalAnswer : studentAnswer}
            onChange={(e) =>
              isOriginal
                ? setOriginalAnswer(e.target.value)
                : setStudentAnswer(e.target.value)
            }
            className="min-h-[200px] bg-background focus-visible:ring-1 placeholder:text-muted-foreground text-base md:text-sm resize-none"
          />
        );
      case "image":
        return (
          <ImageUpload
            value={isOriginal ? originalImage : studentImage}
            onChange={isOriginal ? setOriginalImage : setStudentImage}
            label={`Upload ${isOriginal ? "Original" : "Student"} Answer Image`}
          />
        );
      case "code":
        return (
          <FileUpload
            value={isOriginal ? originalFile : studentFile}
            onChange={isOriginal ? setOriginalFile : setStudentFile}
            label={`Upload ${isOriginal ? "Original" : "Student"} Code File`}
          />
        );
    }
  }
};

export default Index;