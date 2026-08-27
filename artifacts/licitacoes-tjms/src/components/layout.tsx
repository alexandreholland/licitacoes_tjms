import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Contrast, Type, Building2, MapPin, Phone } from 'lucide-react';
import logoTjms from '@assets/logo-tjms_1787869887047.png';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [highContrast]);

  useEffect(() => {
    if (fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [fontSize]);

  const toggleContrast = () => setHighContrast(!highContrast);
  const toggleFontSize = () => setFontSize(prev => prev === 'normal' ? 'large' : 'normal');

  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background text-foreground transition-colors duration-200">
      {/* Top Accessibility Bar */}
      <div className="bg-primary text-primary-foreground py-1 px-4 md:px-8 flex justify-end items-center text-sm gap-4 border-b border-primary-foreground/10">
        <span className="hidden md:inline-block mr-auto font-medium tracking-wide text-primary-foreground/90">
          Tribunal de Justiça do Estado de Mato Grosso do Sul
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={toggleFontSize}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded px-1"
              aria-label="Aumentar ou diminuir fonte"
            >
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Acessibilidade de Fonte</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Alternar tamanho da fonte</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={toggleContrast}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded px-1"
              aria-label="Alternar alto contraste"
            >
              <Contrast className="h-4 w-4" />
              <span className="hidden sm:inline">Alto Contraste</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Alternar modo de alto contraste</TooltipContent>
        </Tooltip>
      </div>

      {/* Main Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1">
            <span className="flex shrink-0 items-center rounded-lg bg-primary px-2 py-1.5 shadow-sm">
              <img src={logoTjms} alt="Poder Judiciário — Tribunal de Justiça de Mato Grosso do Sul" className="h-11 w-[205px] object-contain" />
            </span>
            <div className="hidden sm:flex flex-col border-l-2 border-muted pl-4">
              <span className="font-bold text-lg leading-tight text-primary">Portal da Transparência</span>
              <span className="text-sm text-muted-foreground">Licitações e Contratações</span>
            </div>
          </Link>
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Início</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Transparência</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground" aria-current="page">Licitações</span>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-secondary" />
                <h3 className="font-bold text-lg leading-tight">Tribunal de Justiça<br/>de Mato Grosso do Sul</h3>
              </div>
              <p className="text-primary-foreground/80 text-sm mt-2 max-w-sm">
                Compromisso com a transparência, eficiência e legalidade nas contratações públicas.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-secondary uppercase tracking-wider text-sm mb-1">Contato Geral</h4>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/90">
                <MapPin className="h-5 w-5 shrink-0 text-secondary/80" />
                <span>Parque dos Poderes - Bloco 13<br/>Campo Grande, MS - CEP: 79031-902</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <Phone className="h-4 w-4 shrink-0 text-secondary/80" />
                <span>(67) 3314-1300</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-secondary uppercase tracking-wider text-sm mb-1">Horário de Atendimento</h4>
              <div className="text-sm text-primary-foreground/90 space-y-2">
              <p>Segunda a Sexta-feira</p>
                <p className="font-medium text-white">11:00 às 19:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Tribunal de Justiça de Mato Grosso do Sul. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="https://www.tjms.jus.br/transparencia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Portal da Transparência</a>
              <a href="https://www.tjms.jus.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Portal TJMS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
