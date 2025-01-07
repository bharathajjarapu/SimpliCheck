import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";
import { DragDropZone } from "./DragDropZone";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative animate-fade-in">
          <img
            src={value}
            alt="Uploaded image"
            className="max-h-[200px] rounded-lg object-contain"
          />
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
            type="image"
            label={label}
            onDrop={handleFileChange}
          />
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}
      {error && <p className="text-sm text-destructive animate-fade-in">{error}</p>}
    </div>
  );
}