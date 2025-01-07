import Tesseract from 'tesseract.js';

export async function convertImageToText(imageData: string): Promise<string> {
  try {
    console.log('Converting image to text...');
    const { data: { text } } = await Tesseract.recognize(imageData, 'eng');
    console.log('Image conversion complete');
    return text;
  } catch (error) {
    console.error('Error converting image:', error);
    throw new Error('Failed to convert image to text');
  }
}

export async function convertCodeToText(file: File): Promise<string> {
  try {
    console.log('Converting file to text...');
    let text = '';
    
    // For text-based files
    try {
      text = await file.text();
    } catch (error) {
      console.error('Error reading file as text:', error);
      // If text conversion fails, return file info
      text = `File Name: ${file.name}\nFile Type: ${file.type}\nFile Size: ${(file.size / 1024).toFixed(2)} KB`;
    }
    
    console.log('File conversion complete');
    return text;
  } catch (error) {
    console.error('Error converting file:', error);
    throw new Error('Failed to convert file to text');
  }
}