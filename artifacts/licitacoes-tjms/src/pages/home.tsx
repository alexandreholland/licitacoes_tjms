import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout';
import { useNotices, getNoticeStatus } from '@/hooks/use-notices';
import { AdminPanel } from '@/components/admin-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, BookOpen, Building2, Clock3, Download, ExternalLink, FileKey, Info, Mail, MessageCircle, Phone, Search, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);
  const { notices, isLoaded } = useNotices();
  const { toast } = useToast();
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [yearFilter, setYearFilter] = useState('Todos');

  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      const matchSearch = search === '' || 
        notice.object.toLowerCase().includes(search.toLowerCase()) || 
        notice.number.toLowerCase().includes(search.toLowerCase());
        
      const status = getNoticeStatus(notice);
      let matchStatus = true;
      if (statusFilter === 'Em Andamento (Abertos)') matchStatus = status === 'Em Andamento';
      else if (statusFilter === 'Prorrogados') matchStatus = status === 'Prorrogado';
      else if (statusFilter === 'Republicados') matchStatus = status === 'Republicado';
      else if (statusFilter === 'Encerrados') matchStatus = status === 'Encerrado';
      
      const year = new Date(notice.startDate).getFullYear().toString();
      const matchYear = yearFilter === 'Todos' || year === yearFilter;

      return matchSearch && matchStatus && matchYear;
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [notices, search, statusFilter, yearFilter]);

  const handleSimulateDownload = (filename: string) => {
    toast({
      title: 'Download Iniciado',
      description: `O arquivo ${filename} está sendo baixado...`,
    });
    // Simulating download time
    setTimeout(() => {
      toast({
        title: 'Download Concluído',
        description: `${filename} baixado com sucesso.`,
      });
    }, 1500);
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <Layout>
      <section id="inicio" className="portal-page-intro">
        <div className="portal-page-intro-copy">
          <p className="portal-eyebrow">Portal da Transparência <span>/</span> Compras públicas</p>
          <h1>Licitações e Contratações Diretas</h1>
          <p>
            Consulte avisos, termos de referência, prazos e documentos das contratações diretas realizadas pelo Tribunal de Justiça de Mato Grosso do Sul.
          </p>
        </div>
        <div className="portal-page-intro-actions">
          <span className="portal-update-note"><Info /> Transparência ativa</span>
          <Button onClick={() => setAdminOpen(true)} size="sm" className="portal-primary-button gap-2">
            <Settings className="h-4 w-4" />
            Painel do Gestor
          </Button>
        </div>
      </section>
      {/* External Links / Systems */}
      <section id="sistemas" className="portal-section">
        <div className="portal-section-heading">
          <div>
            <p className="portal-eyebrow">Acesso rápido</p>
            <h2><Building2 /> Sistemas e Manuais</h2>
          </div>
          <span className="portal-section-caption">Links externos oficiais</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="https://www.gov.br/compras/pt-br" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="portal-card h-full">
              <CardHeader className="portal-card-header">
                <CardTitle className="portal-card-title flex justify-between items-start">
                  Compras.gov
                  <ExternalLink className="portal-card-icon" />
                </CardTitle>
                <CardDescription>Portal de Compras do Governo</CardDescription>
              </CardHeader>
              <CardContent className="portal-card-content">
                <Badge variant="secondary" className="portal-code-badge">UASG 929735</Badge>
              </CardContent>
            </Card>
          </a>

          <a href="https://www3.comprasnet.gov.br/sicaf-web/" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="portal-card h-full">
              <CardHeader className="portal-card-header">
                <CardTitle className="portal-card-title flex justify-between items-start">
                  SICAF
                  <ExternalLink className="portal-card-icon" />
                </CardTitle>
                <CardDescription>Cadastro de Fornecedores</CardDescription>
              </CardHeader>
              <CardContent className="portal-card-content">
                <FileKey className="h-6 w-6 text-primary/50 group-hover:text-secondary transition-colors" />
              </CardContent>
            </Card>
          </a>

          <a href="https://www5.tjms.jus.br/licitacoes/" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="portal-card h-full">
              <CardHeader className="portal-card-header">
                <CardTitle className="portal-card-title flex justify-between items-start">
                  SGC (Legado)
                  <ExternalLink className="portal-card-icon" />
                </CardTitle>
                <CardDescription>Sistema de Gestão Antigo</CardDescription>
              </CardHeader>
              <CardContent className="portal-card-content">
                <Clock3 className="h-6 w-6 text-primary/50 group-hover:text-secondary transition-colors" />
              </CardContent>
            </Card>
          </a>

          <a href="https://www.gov.br/compras/pt-br/acesso-a-informacao/manuais" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="portal-card portal-card-featured h-full">
              <CardHeader className="portal-card-header">
                <CardTitle className="portal-card-title flex justify-between items-start text-primary">
                  Manuais
                  <BookOpen className="portal-card-icon text-primary/70" />
                </CardTitle>
                <CardDescription>Guias para fornecedores</CardDescription>
              </CardHeader>
              <CardContent className="portal-card-content">
                 <span className="portal-card-link">Acessar documentação <ArrowRight /></span>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>
      {/* Main Table Section */}
      <section id="contratacoes" className="portal-section">
        <div className="portal-section-heading portal-section-heading-table">
          <div>
            <p className="portal-eyebrow">Consulta pública</p>
            <h2>Dispensas de Licitação Tradicionais</h2>
            <p className="portal-section-description">Sem disputa eletrônica · avisos, prazos e documentos para consulta pública</p>
          </div>
          <div className="portal-results-note">
            <span>{filteredNotices.length} registros encontrados</span>
            <span>Atualizado em tempo real</span>
          </div>
        </div>
        <div className="portal-filter-bar">
          <label className="portal-search-field">
            <span className="sr-only">Buscar por objeto ou número</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por objeto ou número..." 
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
          </label>
          <div className="portal-filter-select">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Anos</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="portal-filter-select portal-filter-select-status">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Status</SelectItem>
                <SelectItem value="Em Andamento (Abertos)">Em Andamento</SelectItem>
                <SelectItem value="Prorrogados">Prorrogados</SelectItem>
                <SelectItem value="Republicados">Republicados</SelectItem>
                <SelectItem value="Encerrados">Encerrados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="portal-table-card">
          <div className="overflow-x-auto">
            <Table className="portal-reference-table">
              <TableHeader className="portal-table-header">
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Objeto</TableHead>
                  <TableHead>Prazo inicial</TableHead>
                  <TableHead>Prazo final</TableHead>
                  <TableHead className="text-center">Anexo(s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/30" />
                        Nenhum aviso encontrado com os filtros atuais.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotices.map((notice) => {
                    return (
                      <TableRow key={notice.id} className="portal-table-row">
                        <TableCell className="portal-number-cell">
                          {notice.type} - {notice.number}
                        </TableCell>
                        <TableCell className="text-sm text-foreground/90 leading-relaxed">{notice.object}</TableCell>
                        <TableCell className="portal-date-cell">
                          {format(new Date(notice.startDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="portal-date-cell">
                          {format(new Date(notice.endDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="portal-attachment-button"
                            onClick={() => handleSimulateDownload(`Arquivos_${notice.number.replace('/','_')}.zip`)}
                            aria-label={`Baixar anexos de ${notice.number}`}
                            title="Baixar anexos"
                          >
                            <Download />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>
      {/* Contact Section */}
      <section id="atendimento" className="portal-section portal-section-last">
        <div className="portal-section-heading">
          <div>
            <p className="portal-eyebrow">Fale conosco</p>
            <h2>Canais de Atendimento e Informações</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="portal-contact-card">
            <CardHeader className="portal-card-header">
              <CardTitle className="portal-card-title text-primary flex items-center gap-2">
                Departamento de Compras e Licitações
              </CardTitle>
              <CardDescription>Orientações sobre processos, editais e contratações.</CardDescription>
            </CardHeader>
            <CardContent className="portal-contact-content">
              <div className="flex items-center gap-3 text-sm">
                <div className="portal-contact-icon text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">(67) 3314-1329<br/>(67) 3314-1517</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="portal-contact-icon text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:licitacao@tjms.jus.br" className="font-medium text-blue-700 dark:text-blue-300 hover:underline">
                  licitacao@tjms.jus.br
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="portal-contact-card">
            <CardHeader className="portal-card-header">
              <CardTitle className="portal-card-title text-primary flex items-center gap-2">
                Coordenadoria de Compras
              </CardTitle>
              <CardDescription>Atendimento a fornecedores e dúvidas sobre cotações.</CardDescription>
            </CardHeader>
            <CardContent className="portal-contact-content">
              <div className="flex items-center gap-3 text-sm">
                <div className="portal-contact-icon text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">(67) 3314-1338</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="portal-contact-icon text-emerald-700">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <a href="https://wa.me/5567998256693?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20contrata%C3%A7%C3%B5es%20diretas" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-700 dark:text-emerald-300 hover:underline">
                  Falar pelo WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="portal-contact-icon text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:contratos@tjms.jus.br" className="font-medium text-blue-700 dark:text-blue-300 hover:underline">compras@tjms.jus.br</a>
              </div>
            </CardContent>
          </Card>

          <Card className="portal-contact-card portal-contact-card-highlight">
            <CardHeader className="portal-card-header">
              <CardTitle className="portal-card-title text-primary flex items-center gap-2">Horário de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="portal-contact-content">
              <div className="flex items-center gap-3 text-sm">
                <div className="portal-contact-icon text-primary">
                  <Clock3 className="h-4 w-4" />
                </div>
                <span className="font-semibold">11h às 19h (horário de Brasília)</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">Observe o prazo final indicado em cada aviso para o recebimento de propostas.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Admin Panel Modal/Sheet */}
      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />
    </Layout>
  );
}
