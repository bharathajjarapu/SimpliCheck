import { Button } from "@/components/ui/button";
import { FileText, Image, MessageSquare, FileCode } from "lucide-react";

interface InputTypeSelectorProps {
  selectedType: "text" | "image" | "code";
  onChange: (type: "text" | "image" | "code") => void;
  label: string;
}

export function InputTypeSelector({ selectedType, onChange, label }: InputTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Button
          variant={selectedType === "text" ? "default" : "outline"}
          onClick={() => onChange("text")}
          size="sm"
          className="animate-fade-in"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Text
        </Button>
        <Button
          variant={selectedType === "image" ? "default" : "outline"}
          onClick={() => onChange("image")}
          size="sm"
          className="animate-fade-in"
        >
          <Image className="mr-2 h-4 w-4" />
          Image
        </Button>
        <Button
          variant={selectedType === "code" ? "default" : "outline"}
          onClick={() => onChange("code")}
          size="sm"
          className="animate-fade-in"
        >
          <FileCode className="mr-2 h-4 w-4" />
          Code
        </Button>
      </div>
    </div>
  );
}