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
import { ExternalLink, Search, Download, FileText, Settings, ShieldCheck, FileKey, BookOpen, Clock, Building, MessageCircle, Mail, Phone } from 'lucide-react';
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

  const statusColors: Record<string, string> = {
    'Em Andamento': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Encerrado': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
    'Prorrogado': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    'Republicado': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-12 relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>
        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm">Transparência Ativa</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              Licitações e Contratações Diretas
            </h1>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl">
              Acesso público a todos os editais, avisos, termos de referência e resultados das compras e contratações do Tribunal de Justiça de Mato Grosso do Sul.
            </p>
            <Button onClick={() => setAdminOpen(true)} variant="secondary" size="lg" className="gap-2 shadow-lg hover-elevate">
              <Settings className="h-5 w-5" />
              Painel do Gestor
            </Button>
          </div>
          <div className="hidden md:flex items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
             <ShieldCheck className="h-32 w-32 text-secondary opacity-90" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* External Links / Systems */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground/90">
          <Building className="h-5 w-5 text-secondary" />
          Sistemas e Manuais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="https://www.gov.br/compras/pt-br" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="h-full border-muted/50 hover:border-secondary/50 hover:shadow-md transition-all duration-300 hover-elevate">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  Compras.gov
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </CardTitle>
                <CardDescription>Portal de Compras do Governo</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-mono">UASG 929735</Badge>
              </CardContent>
            </Card>
          </a>

          <a href="https://www3.comprasnet.gov.br/sicaf-web/" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="h-full border-muted/50 hover:border-secondary/50 hover:shadow-md transition-all duration-300 hover-elevate">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  SICAF
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </CardTitle>
                <CardDescription>Cadastro de Fornecedores</CardDescription>
              </CardHeader>
              <CardContent>
                <FileKey className="h-8 w-8 text-muted-foreground/40 group-hover:text-secondary/60 transition-colors" />
              </CardContent>
            </Card>
          </a>

          <a href="https://www5.tjms.jus.br/licitacoes/" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="h-full border-muted/50 hover:border-secondary/50 hover:shadow-md transition-all duration-300 hover-elevate">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  SGC (Legado)
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </CardTitle>
                <CardDescription>Sistema de Gestão Antigo</CardDescription>
              </CardHeader>
              <CardContent>
                <Clock className="h-8 w-8 text-muted-foreground/40 group-hover:text-secondary/60 transition-colors" />
              </CardContent>
            </Card>
          </a>

          <a href="https://www.gov.br/compras/pt-br/acesso-a-informacao/manuais" target="_blank" rel="noopener noreferrer" className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <Card className="h-full border-muted/50 hover:border-secondary/50 hover:shadow-md transition-all duration-300 hover-elevate bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start text-primary">
                  Manuais
                  <BookOpen className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                </CardTitle>
                <CardDescription>Guias para fornecedores</CardDescription>
              </CardHeader>
              <CardContent>
                 <span className="text-sm text-primary/80 font-medium">Acessar documentação &rarr;</span>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>

      {/* Main Table Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dispensas de Licitação Tradicionais</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sem disputa eletrônica · avisos, prazos e documentos para consulta pública</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por objeto ou número..." 
                className="pl-9 bg-white dark:bg-card"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-white dark:bg-card">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Anos</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-card">
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

        <Card className="overflow-hidden border-border/50 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Tipo</TableHead>
                  <TableHead className="w-[130px]">Número/Ano</TableHead>
                  <TableHead className="min-w-[300px]">Objeto</TableHead>
                  <TableHead className="w-[180px]">Vigência</TableHead>
                  <TableHead className="w-[130px]">Situação</TableHead>
                  <TableHead className="text-right w-[200px]">Documentos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/30" />
                        Nenhum aviso encontrado com os filtros atuais.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotices.map((notice) => {
                    const status = getNoticeStatus(notice);
                    return (
                      <TableRow key={notice.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs whitespace-nowrap bg-background">
                            {notice.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-primary">{notice.number}</TableCell>
                        <TableCell className="text-sm text-foreground/90">{notice.object}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(notice.startDate), 'dd/MM/yyyy')} a <br/>
                          {format(new Date(notice.endDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${statusColors[status]} border shadow-none font-medium`}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => handleSimulateDownload(notice.avisoFile)}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              Aviso
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => handleSimulateDownload(notice.trFile)}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              TR
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 text-xs border-primary/20 hover:border-primary/50 text-primary w-full mt-1 bg-white"
                              onClick={() => handleSimulateDownload(`Arquivos_${notice.number.replace('/','_')}.zip`)}
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              Baixar todos
                            </Button>
                          </div>
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
      <section>
          <h2 className="text-xl font-bold mb-6 text-foreground/90">Canais de Atendimento e Informações</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/10 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                Departamento de Compras e Licitações
              </CardTitle>
              <CardDescription>Orientações sobre processos, editais e contratações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">(67) 3314-1329<br/>(67) 3314-1517</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:licitacao@tjms.jus.br" className="font-medium text-blue-700 hover:underline">
                  licitacao@tjms.jus.br
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                Coordenadoria de Compras
              </CardTitle>
              <CardDescription>Atendimento a fornecedores e dúvidas sobre cotações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">(67) 3314-1338</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <a href="https://wa.me/5567998256693?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20contrata%C3%A7%C3%B5es%20diretas" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-700 hover:underline">
                  Falar pelo WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:contratos@tjms.jus.br" className="font-medium text-blue-700 hover:underline">
                  contratos@tjms.jus.br
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-secondary/20 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                Horário e Atendimento Institucional
              </CardTitle>
              <CardDescription>Expediente da Coordenadoria de Compras.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white p-2 rounded-full shadow-sm text-secondary-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-semibold">11:00 às 19:00 horas</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Horário de Brasília / TJMS. Observe o prazo final indicado em cada aviso para o recebimento de propostas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Panel Modal/Sheet */}
      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />
    </Layout>
  );
}
