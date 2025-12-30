import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { PromptHint } from '../types';
import { Button } from './ui/Button';

const promptHints: PromptHint[] = [
  {
    category: 'объект',
    text: 'Будьте конкретны в описании главного объекта',
    example: '"Винтажный красный велосипед" вместо просто "велосипед"'
  },
  {
    category: 'сцена',
    text: 'Опишите окружение и обстановку',
    example: '"в переулке с булыжной мостовой в золотой час"'
  },
  {
    category: 'действие',
    text: 'Добавьте движение или активность',
    example: '"велосипедист едет по лужам"'
  },
  {
    category: 'стиль',
    text: 'Укажите художественный стиль или настроение',
    example: '"кинематографичная фотография, атмосферное освещение"'
  },
  {
    category: 'камера',
    text: 'Добавьте детали ракурса и камеры',
    example: '"снято на 85-мм объектив, малая глубина резкости"'
  }
];

const categoryColors: Record<string, string> = {
  'объект': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  'сцена': 'bg-green-500/10 border-green-500/30 text-green-400',
  'действие': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  'стиль': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  'камера': 'bg-pink-500/10 border-pink-500/30 text-pink-400',
};

interface PromptHintsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PromptHints: React.FC<PromptHintsProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-100">
              Советы по качеству промптов
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          
          <div className="space-y-4">
            {promptHints.map((hint, index) => (
              <div key={index} className="space-y-2">
                <div className={`inline-block px-2 py-1 rounded text-xs border ${categoryColors[hint.category]}`}>
                  {hint.category}
                </div>
                <p className="text-sm text-gray-300">{hint.text}</p>
                <p className="text-sm text-gray-500 italic">{hint.example}</p>
              </div>
            ))}
            
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mt-6">
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">Лучшая практика:</strong> Пишите полными предложениями, описывающими всю сцену целиком,
                а не просто ключевыми словами. Представьте, что вы "рисуете картину словами".
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};