import { GenerationOptions } from '../types';

// @ts-ignore - Vite env variables
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || 'demo-key';
const API_URL = 'https://api.laozhang.ai/v1beta/models/gemini-3-pro-image-preview:generateContent';

// Debug logging for API key
if (API_KEY === 'demo-key') {
  console.warn('[GeminiService] API_KEY is still "demo-key". Please ensure VITE_GEMINI_API_KEY is set in your .env file and you have restarted the dev server.');
} else {
  console.log(`[GeminiService] API_KEY loaded (starts with: ${API_KEY.substring(0, 4)}...)`);
}

export interface GenerationRequest extends GenerationOptions {
  referenceImages?: string[]; // base64 array
  temperature?: number;
}

export interface EditRequest {
  instruction: string;
  originalImage: string; // base64
  referenceImages?: string[]; // base64 array
  maskImage?: string; // base64
  temperature?: number;
  seed?: number;
  aspectRatio?: string;
  imageSize?: string;
}

export interface SegmentationRequest {
  image: string; // base64
  query: string; // "the object at pixel (x,y)" or "the red car"
}

export class GeminiService {
  async generateImage(request: GenerationRequest): Promise<string[]> {
    try {
      const parts: any[] = [{ text: request.prompt }];

      // Add reference images if provided
      if (request.referenceImages && request.referenceImages.length > 0) {
        request.referenceImages.forEach(image => {
          parts.push({
            inlineData: {
              mimeType: "image/png",
              data: image,
            },
          });
        });
      }

      const body = {
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: request.aspectRatio || "1:1",
            imageSize: request.imageSize || "1K"
          }
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const images: string[] = [];

      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData) {
            images.push(part.inlineData.data);
          }
        }
      }

      return images;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Не удалось сгенерировать изображение. Пожалуйста, попробуйте снова.');
    }
  }

  async editImage(request: EditRequest): Promise<string[]> {
    try {
      const parts: any[] = [
        { text: this.buildEditPrompt(request) },
        {
          inlineData: {
            mimeType: "image/png",
            data: request.originalImage,
          },
        },
      ];

      // Add reference images if provided
      if (request.referenceImages && request.referenceImages.length > 0) {
        request.referenceImages.forEach(image => {
          parts.push({
            inlineData: {
              mimeType: "image/png",
              data: image,
            },
          });
        });
      }

      if (request.maskImage) {
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: request.maskImage,
          },
        });
      }

      const body = {
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: request.aspectRatio || "1:1",
            imageSize: request.imageSize || "1K"
          }
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const images: string[] = [];

      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData) {
            images.push(part.inlineData.data);
          }
        }
      }

      return images;
    } catch (error) {
      console.error('Error editing image:', error);
      throw new Error('Не удалось отредактировать изображение. Пожалуйста, попробуйте снова.');
    }
  }

  async segmentImage(request: SegmentationRequest): Promise<any> {
    try {
      const parts = [
        { text: `Analyze this image and create a segmentation mask for: ${request.query}

Return a JSON object with this exact structure:
{
  "masks": [
    {
      "label": "description of the segmented object",
      "box_2d": [x, y, width, height],
      "mask": "base64-encoded binary mask image"
    }
  ]
}

Only segment the specific object or region requested. The mask should be a binary PNG where white pixels (255) indicate the selected region and black pixels (0) indicate the background.` },
        {
          inlineData: {
            mimeType: "image/png",
            data: request.image,
          },
        },
      ];

      const body = {
        contents: [{ parts }]
      };

      // Note: Segmentation might use a different endpoint or model in a real scenario,
      // but following the pattern of using fetch for consistency.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error('Текстовый ответ от сегментации не получен');
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error segmenting image:', error);
      throw new Error('Не удалось сегментировать изображение. Пожалуйста, попробуйте снова.');
    }
  }

  private buildEditPrompt(request: EditRequest): string {
    const maskInstruction = request.maskImage 
      ? "\n\nIMPORTANT: Apply changes ONLY where the mask image shows white pixels (value 255). Leave all other areas completely unchanged. Respect the mask boundaries precisely and maintain seamless blending at the edges."
      : "";

    return `Edit this image according to the following instruction: ${request.instruction}

Maintain the original image's lighting, perspective, and overall composition. Make the changes look natural and seamlessly integrated.${maskInstruction}

Preserve image quality and ensure the edit looks professional and realistic.`;
  }
}

export const geminiService = new GeminiService();