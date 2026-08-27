import { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'wouter';
import {
  Accessibility,
  ChevronDown,
  ChevronRight,
  Contrast,
  Eye,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Type,
  X,
} from 'lucide-react';
import logoTjms from '@assets/logo-tjms_1787869887047.png';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="portal-utility-bar">
        <div className="portal-container portal-utility-inner">
          <span className="portal-utility-brand">Poder Judiciário de Mato Grosso do Sul</span>
          <div className="portal-utility-links">
            <a href="https://www.tjms.jus.br/" target="_blank" rel="noopener noreferrer">Portal TJMS</a>
            <a href="https://www.tjms.jus.br/transparencia" target="_blank" rel="noopener noreferrer">Transparência</a>
            <a href="mailto:direcao-geral@tjms.jus.br">Fale Conosco</a>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleFontSize} aria-label="Aumentar ou diminuir fonte">
                  <Type className="h-3.5 w-3.5" />
                  <span>Acessibilidade</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Alternar tamanho da fonte</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleContrast} aria-label="Alternar alto contraste">
                  <Contrast className="h-3.5 w-3.5" />
                  <span>Alto contraste</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Alternar modo de alto contraste</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <header className="portal-header">
        <div className="portal-container portal-header-main">
          <Link href="/" className="portal-brand-lockup">
            <span className="portal-logo-frame">
              <img src={logoTjms} alt="Poder Judiciário — Tribunal de Justiça de Mato Grosso do Sul" />
            </span>
            <span className="portal-brand-copy">
              <strong>Tribunal de Justiça</strong>
              <span>Mato Grosso do Sul</span>
            </span>
          </Link>

          <div className="portal-header-tools">
            <div className="hidden md:flex flex-col items-end gap-1 text-right">
              <span className="portal-header-kicker">Portal Institucional</span>
              <span className="portal-header-title">Licitações e Contratações Diretas</span>
            </div>
            <a className="portal-header-search" href="#contratacoes">
              <Search className="h-4 w-4" />
              <span>Consulta pública</span>
            </a>
          </div>
        </div>

        <div className="portal-nav-wrap">
          <div className="portal-container">
            <button
              type="button"
              className="portal-mobile-nav-toggle md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="portal-main-nav"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              Menu principal
            </button>
            <nav id="portal-main-nav" aria-label="Navegação principal" className={`portal-main-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
              <a href="#inicio" onClick={() => setMobileMenuOpen(false)}>Institucional <ChevronDown /></a>
              <a href="#sistemas" onClick={() => setMobileMenuOpen(false)}>Consulta <ChevronDown /></a>
              <a href="#contratacoes" onClick={() => setMobileMenuOpen(false)}>Serviços <ChevronDown /></a>
              <a href="#contratacoes" onClick={() => setMobileMenuOpen(false)}>Licitações</a>
              <a href="#atendimento" onClick={() => setMobileMenuOpen(false)}>Contato <ChevronDown /></a>
              <a href="https://www.tjms.jus.br/" target="_blank" rel="noopener noreferrer">Área Restrita <ExternalLink /></a>
            </nav>
          </div>
        </div>

        <div className="portal-breadcrumb-bar">
          <div className="portal-container">
            <nav aria-label="Breadcrumb" className="portal-breadcrumb">
              <Link href="/">Início</Link>
              <ChevronRight />
              <Link href="/">Transparência</Link>
              <ChevronRight />
              <span aria-current="page">Licitações e Contratações</span>
            </nav>
          </div>
        </div>
      </header>

      <aside className="portal-accessibility-rail" aria-label="Ferramentas de acessibilidade">
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={toggleFontSize} aria-label="Alternar tamanho da fonte"><Type /></button>
          </TooltipTrigger>
          <TooltipContent side="left">Tamanho da fonte</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={toggleContrast} aria-label="Alternar alto contraste"><Eye /></button>
          </TooltipTrigger>
          <TooltipContent side="left">Alto contraste</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href="mailto:ouvidoria@tjms.jus.br" aria-label="Entrar em contato com a Ouvidoria"><Accessibility /></a>
          </TooltipTrigger>
          <TooltipContent side="left">Ouvidoria</TooltipContent>
        </Tooltip>
      </aside>

      <main className="flex-1 w-full bg-background">
        <div className="portal-container portal-main-content">
          {children}
        </div>
      </main>

      <footer className="portal-footer">
        <div className="portal-container">
          <div className="portal-footer-grid">
            <div className="portal-footer-brand">
              <span className="portal-logo-frame portal-logo-frame-footer">
                <img src={logoTjms} alt="" aria-hidden="true" />
              </span>
              <p>Portal de Licitações e Contratações Diretas do Tribunal de Justiça de Mato Grosso do Sul.</p>
            </div>
            <div>
              <h3>Institucional</h3>
              <a href="https://www.tjms.jus.br/" target="_blank" rel="noopener noreferrer">Portal TJMS</a>
              <a href="https://www.tjms.jus.br/transparencia" target="_blank" rel="noopener noreferrer">Portal da Transparência</a>
              <a href="https://www.tjms.jus.br/telefones-uteis" target="_blank" rel="noopener noreferrer">Telefones úteis</a>
            </div>
            <div>
              <h3>Endereço</h3>
              <p><MapPin /> Parque dos Poderes, Bloco 13<br />Campo Grande/MS · CEP 79031-902</p>
              <p><Phone /> (67) 3314-1300</p>
            </div>
            <div>
              <h3>Atendimento</h3>
              <p><Mail /> licitacao@tjms.jus.br</p>
              <p>Segunda a sexta-feira<br /><strong>11h às 19h</strong></p>
            </div>
          </div>
          <div className="portal-footer-bottom">
            <span>© {new Date().getFullYear()} Tribunal de Justiça de Mato Grosso do Sul</span>
            <span>Conteúdo acessível · Transparência pública</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
