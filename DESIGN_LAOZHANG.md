# Technical Design: Laozhang.ai API Integration

This document outlines the integration of the `gemini-3-pro-image-preview` model from `laozhang.ai` into the `NanoBananaEditor` project.

## 1. Type Definitions
Update [`NanoBananaEditor/src/types/index.ts`](NanoBananaEditor/src/types/index.ts) to include the new parameters.

```typescript
export type AspectRatio = '21:9' | '16:9' | '4:3' | '3:2' | '1:1' | '9:16' | '3:4' | '2:3' | '5:4' | '4:5';
export type ImageSize = '1K' | '2K' | '4K';

export interface GenerationParameters {
  seed?: number;
  temperature?: number;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
}
```

## 2. Service Layer Refactor
Refactor [`NanoBananaEditor/src/services/geminiService.ts`](NanoBananaEditor/src/services/geminiService.ts) to use `fetch` for direct API interaction, bypassing the SDK to support custom endpoints and parameters.

### Key Changes:
- **Endpoint**: `https://api.laozhang.ai/v1beta/models/gemini-3-pro-image-preview:generateContent`
- **Request Body Structure**:
  ```json
  {
    "contents": [{
      "parts": [{"text": "..."}]
    }],
    "generationConfig": {
      "responseModalities": ["IMAGE"],
      "imageConfig": {
        "aspectRatio": "...",
        "imageSize": "..."
      }
    }
  }
  ```
- **Implementation Detail**: Use `fetch` with `method: 'POST'` and include the `x-goog-api-key` header (or append `?key=` to the URL).

## 3. State Management
Update [`NanoBananaEditor/src/store/useAppStore.ts`](NanoBananaEditor/src/store/useAppStore.ts) to persist user preferences for aspect ratio and resolution.

### New State Properties:
- `aspectRatio: AspectRatio` (Default: `'1:1'`)
- `imageSize: ImageSize` (Default: `'1K'`)

### New Actions:
- `setAspectRatio: (ratio: AspectRatio) => void`
- `setImageSize: (size: ImageSize) => void`

## 4. UI Components
Modify [`NanoBananaEditor/src/components/PromptComposer.tsx`](NanoBananaEditor/src/components/PromptComposer.tsx) to add selectors for the new parameters.

### UI Additions:
- Add a dropdown or toggle group for **Aspect Ratio**.
- Add a dropdown or toggle group for **Resolution** (Image Size).
- Place these controls within the "Advanced Controls" section.

## 5. Implementation Plan
1.  **Types**: Add `AspectRatio` and `ImageSize` to `src/types/index.ts`.
2.  **Store**: Add `aspectRatio` and `imageSize` to `useAppStore.ts` with corresponding setters.
3.  **Service**: Rewrite `GeminiService.generateImage` to use `fetch` and the new request structure.
4.  **UI**: Update `PromptComposer.tsx` to include the new selectors and pass values to the service.
