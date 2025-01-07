import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCode, X } from "lucide-react";
import { useState } from "react";
import { DragDropZone } from "./DragDropZone";

interface FileUploadProps {
  value: File | null;
  onChange: (value: File | null) => void;
  label: string;
}

export function FileUpload({ value, onChange, label }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    onChange(file);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative p-4 border-2 border-dashed rounded-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <FileCode className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">{value.name}</span>
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <DragDropZone
            type="code"
            label={label}
            onDrop={handleFileChange}
          />
          <Input
            id="file-upload-code"
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}
      {error && <p className="text-sm text-destructive animate-fade-in">{error}</p>}
    </div>
  );
}