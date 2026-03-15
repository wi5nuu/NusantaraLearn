import { create } from 'zustand';

export interface DownloadPackage {
  id: string;
  title: string;
  size: string;
  description: string;
  status: 'installed' | 'downloading' | 'available';
  progress: number; // 0-1
  fileName?: string;
}

interface DownloadState {
  packages: DownloadPackage[];
  startDownload: (id: string) => void;
  setProgress: (id: string, progress: number) => void;
  finishDownload: (id: string) => void;
}

const INITIAL_PACKAGES: DownloadPackage[] = [
  {
    id: 'math',
    title: '📐 Matematika & Berhitung',
    size: '15.6 MB',
    description:
      'Lembar kerja matematika interaktif untuk latihan berhitung anak TK dan SD.',
    status: 'available',
    progress: 0,
    fileName: 'belajar-berhitung.pdf',
  },
  {
    id: 'literacy',
    title: '📖 Worksheet Alfabet Gratis',
    size: '10.6 MB',
    description:
      'Latihan menulis dan mengenal huruf alfabet dengan ilustrasi menarik.',
    status: 'available',
    progress: 0,
    fileName: 'Worksheet Alfabet Gratis.pdf',
  },
  {
    id: 'counting',
    title: '🐟 Berhitung Ikan (TK)',
    size: '1.0 MB',
    description:
      'Belajar berhitung menyenangkan dengan tema ikan untuk tingkat taman kanak-kanak.',
    status: 'available',
    progress: 0,
    fileName: 'Worksheet-Lembar-Belajar-Berhitung-Ikan-untuk-Anak-TK.pdf',
  },
];

export const useDownload = create<DownloadState>((set) => ({
  packages: INITIAL_PACKAGES,
  startDownload: (id) =>
    set((s) => ({
      packages: s.packages.map((p) =>
        p.id === id ? { ...p, status: 'downloading', progress: 0 } : p
      ),
    })),
  setProgress: (id, progress) =>
    set((s) => ({
      packages: s.packages.map((p) => (p.id === id ? { ...p, progress } : p)),
    })),
  finishDownload: (id) =>
    set((s) => ({
      packages: s.packages.map((p) =>
        p.id === id ? { ...p, status: 'installed', progress: 1 } : p
      ),
    })),
}));
