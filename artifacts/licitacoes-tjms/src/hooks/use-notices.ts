import { useState, useEffect } from 'react';

export type NoticeType = '#Aviso Inicial' | '#Prorrogação' | '#Republicação';
export type NoticeStatus = 'Em Andamento' | 'Prorrogado' | 'Republicado' | 'Encerrado';

export interface Notice {
  id: string;
  type: NoticeType;
  number: string;
  object: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  active: boolean;
  status?: NoticeStatus;
  avisoFile: string;
  trFile: string;
  createdAt: string;
}

const STORAGE_KEY = 'tjms_notices_v3';

const MOCK_DATA: Notice[] = [
  {
    id: '1',
    type: '#Prorrogação',
    number: 'AVISO DE CONTRATAÇÃO DIRETA Nº 038/2026 - FEADMP',
    object: 'REPUBLICAÇÃO Fornecimento de Kits APH tático completos',
    startDate: '2026-07-27T12:00:00',
    endDate: '2026-07-30T12:00:00',
    active: true,
    status: 'Prorrogado',
    avisoFile: 'aviso_038_2026.pdf',
    trFile: 'tr_038_2026.pdf',
    createdAt: '2026-07-27T12:00:00',
  },
  {
    id: '2',
    type: '#Republicação',
    number: 'AVISO DE CONTRATAÇÃO DIRETA - DISPENSA Nº 036/2026',
    object: 'Aquisição de moedas institucionais personalizadas, destinadas à distribuição a colaboradores, convidados e participantes de eventos institucionais, com o objetivo de fortalecer a identidade institucional e fomentar a cooperação interinstitucional',
    startDate: '2026-07-27T12:00:00',
    endDate: '2026-07-30T12:00:00',
    active: true,
    status: 'Republicado',
    avisoFile: 'aviso_036_2026.pdf',
    trFile: 'tr_036_2026.pdf',
    createdAt: '2026-07-27T12:00:00',
  },
  {
    id: '3',
    type: '#Aviso Inicial',
    number: 'AVISO DE CONTRATAÇÃO DIRETA - DISPENSA Nº 044/2026',
    object: 'Aquisição de material permanente (persianas) e fornecimento de serviços de instalação de persianas',
    startDate: '2026-07-27T12:00:00',
    endDate: '2026-07-30T12:00:00',
    active: true,
    status: 'Em Andamento',
    avisoFile: 'aviso_044_2026.pdf',
    trFile: 'tr_044_2026.pdf',
    createdAt: '2026-07-27T12:00:00',
  },
  {
    id: '4',
    type: '#Aviso Inicial',
    number: 'AVISO DE CONTRATAÇÃO DIRETA Nº 025/2026',
    object: 'Fornecimento de água mineral natural acondicionada em garrafões retornáveis de 20 litros',
    startDate: '2026-06-10T12:00:00',
    endDate: '2026-06-15T12:00:00',
    active: true,
    status: 'Encerrado',
    avisoFile: 'aviso_025_2026.pdf',
    trFile: 'tr_025_2026.pdf',
    createdAt: '2026-06-10T12:00:00',
  }
];

export const getNoticeStatus = (notice: Notice) => {
  const now = new Date();
  const endDate = new Date(notice.endDate);
  
  if (!notice.active) return 'Inativo';
  if (notice.status) return notice.status;
  if (now > endDate) return 'Encerrado';
  if (notice.type === '#Prorrogação') return 'Prorrogado';
  if (notice.type === '#Republicação') return 'Republicado';
  return 'Em Andamento';
};

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotices(parsed);
      } catch (e) {
        setNotices(MOCK_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
      }
    } else {
      setNotices(MOCK_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    }
    setIsLoaded(true);

    const handleNoticeUpdate = (event: Event) => {
      const nextNotices = (event as CustomEvent<Notice[]>).detail;
      if (Array.isArray(nextNotices)) setNotices(nextNotices);
    };
    window.addEventListener('tjms-notices-updated', handleNoticeUpdate);
    return () => window.removeEventListener('tjms-notices-updated', handleNoticeUpdate);
  }, []);

  const saveNotices = (newNotices: Notice[]) => {
    setNotices(newNotices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotices));
    window.dispatchEvent(new CustomEvent('tjms-notices-updated', { detail: newNotices }));
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'createdAt' | 'active'>) => {
    const newNotice: Notice = {
      ...notice,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      active: true,
    };
    saveNotices([newNotice, ...notices]);
  };

  const updateNotice = (id: string, updates: Partial<Omit<Notice, 'id' | 'createdAt'>>) => {
    saveNotices(
      notices.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  const deleteNotice = (id: string) => {
    // Logical delete
    saveNotices(
      notices.map((n) => (n.id === id ? { ...n, active: false } : n))
    );
  };

  return {
    notices: notices.filter(n => n.active), // Return only active ones by default
    allNotices: notices, // Include inactive if needed
    isLoaded,
    addNotice,
    updateNotice,
    deleteNotice,
  };
}
