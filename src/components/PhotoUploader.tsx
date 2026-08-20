import React, { useRef, useState } from 'react';

interface PhotoUploaderProps {
  photoBase64: string | null;
  onPhotoSelected: (base64: string | null) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoBase64,
  onPhotoSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem (JPEG, PNG, WEBP).');
      return;
    }

    // Leitura e redimensionamento leve para performance ideal na IA
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          onPhotoSelected(compressed);
        } else {
          onPhotoSelected(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {photoBase64 ? (
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-zinc-950 p-2 shadow-2xl group">
          <div className="relative max-h-[360px] flex items-center justify-center overflow-hidden rounded-xl bg-black">
            <img
              src={photoBase64}
              alt="Foto da Tiragem de Tarot"
              className="max-h-[360px] w-auto object-contain rounded-lg shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                📸 Foto pronta para análise visual
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded-lg bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 text-xs font-medium border border-zinc-700 backdrop-blur-md transition-colors"
                >
                  Trocar foto
                </button>
                <button
                  type="button"
                  onClick={() => onPhotoSelected(null)}
                  className="px-3 py-1 rounded-lg bg-rose-950/80 text-rose-200 hover:bg-rose-900 text-xs font-medium border border-rose-800 backdrop-blur-md transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 md:p-10 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-zinc-700 hover:border-amber-400/70 bg-zinc-900/40 hover:bg-amber-500/5'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
            📷
          </div>

          <div>
            <h4 className="font-serif font-bold text-base text-zinc-100 mb-1">
              Tire uma foto ou envie a imagem da sua tiragem
            </h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Arraste e solte o arquivo aqui ou clique para selecionar. A IA identificará cada carta
              e sua orientação (normal/invertida).
            </p>
          </div>

          <button
            type="button"
            className="mt-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold font-serif transition-colors"
          >
            Selecionar arquivo ou Câmera
          </button>
        </div>
      )}
    </div>
  );
};
