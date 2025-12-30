export interface Asset {
  id: string;
  type: 'original' | 'mask' | 'output';
  url: string;
  mime: string;
  width: number;
  height: number;
  checksum: string;
}

export interface Generation {
  id: string;
  prompt: string;
  parameters: {
    seed?: number;
    temperature?: number;
    aspectRatio?: string;
    imageSize?: string;
  };
  sourceAssets: Asset[];
  outputAssets: Asset[];
  modelVersion: string;
  timestamp: number;
  costEstimate?: number;
}

export interface Edit {
  id: string;
  parentGenerationId: string;
  maskAssetId?: string;
  maskReferenceAsset?: Asset;
  instruction: string;
  outputAssets: Asset[];
  timestamp: number;
}

export interface Project {
  id: string;
  title: string;
  generations: Generation[];
  edits: Edit[];
  createdAt: number;
  updatedAt: number;
}

export interface SegmentationMask {
  id: string;
  imageData: ImageData;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  feather: number;
}

export interface BrushStroke {
  id: string;
  points: number[];
  brushSize: number;
  color: string;
}

export interface PromptHint {
  category: 'subject' | 'scene' | 'action' | 'style' | 'camera' | 'объект' | 'сцена' | 'действие' | 'стиль' | 'камера';
  text: string;
  example: string;
}

export type AspectRatio = '21:9' | '16:9' | '4:3' | '3:2' | '1:1' | '9:16' | '3:4' | '2:3' | '5:4' | '4:5';

export type ImageSize = '1K' | '2K' | '4K';

export interface GenerationOptions {
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  prompt: string;
  negativePrompt?: string;
  numImages?: number;
  seed?: number;
}