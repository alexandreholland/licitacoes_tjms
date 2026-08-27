import { useState, useRef } from 'react';
import { useNotices, Notice, NoticeType } from '@/hooks/use-notices';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, CalendarClock, UploadCloud, FileType, CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminPanel({ open, onOpenChange }: AdminPanelProps) {
  const { allNotices, addNotice, updateNotice, deleteNotice } = useNotices();
  const { toast } = useToast();
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [type, setType] = useState<NoticeType>('#Aviso Inicial');
  const [number, setNumber] = useState('');
  const [object, setObject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [avisoFile, setAvisoFile] = useState<File | null>(null);
  const [trFile, setTrFile] = useState<File | null>(null);

  const fileInputRefAviso = useRef<HTMLInputElement>(null);
  const fileInputRefTr = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setType('#Aviso Inicial');
    setNumber('');
    setObject('');
    setStartDate('');
    setEndDate('');
    setAvisoFile(null);
    setTrFile(null);
    setEditingId(null);
  };

  const handleOpenForm = (notice?: Notice) => {
    if (notice) {
      setType(notice.type);
      setNumber(notice.number);
      setObject(notice.object);
      setStartDate(notice.startDate.split('T')[0]);
      setEndDate(notice.endDate.split('T')[0]);
      setEditingId(notice.id);
    } else {
      resetForm();
    }
    setView('form');
  };

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/pkcs7-signature', 'application/zip', 'application/x-zip-compressed'];
    const validExtensions = ['.pdf', '.p7s', '.zip'];
    const isExtensionValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !isExtensionValid) {
      toast({
        title: 'Formato inválido',
        description: 'Apenas arquivos PDF, P7S e ZIP são permitidos.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é de 50MB.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setter(file);
    } else if (e.target) {
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || !object || !startDate || !endDate) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos textuais.',
        variant: 'destructive',
      });
      return;
    }

    if (!editingId && (!avisoFile || !trFile)) {
      toast({
        title: 'Arquivos obrigatórios',
        description: 'Faça o upload do Aviso e do Termo de Referência.',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: 'Datas inválidas',
        description: 'A data de término deve ser posterior à data de início.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      type,
      number,
      object,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status: undefined,
      avisoFile: avisoFile ? avisoFile.name : (editingId ? allNotices.find(n => n.id === editingId)?.avisoFile || '' : ''),
      trFile: trFile ? trFile.name : (editingId ? allNotices.find(n => n.id === editingId)?.trFile || '' : ''),
    };

    if (editingId) {
      updateNotice(editingId, payload);
      toast({
        title: 'Aviso atualizado',
        description: 'O aviso foi atualizado com sucesso.',
      });
    } else {
      addNotice(payload);
      toast({
        title: 'Aviso criado',
        description: 'O novo aviso foi publicado com sucesso.',
      });
    }

    setView('list');
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja desativar este aviso?')) {
      deleteNotice(id);
      toast({
        title: 'Aviso desativado',
        description: 'O aviso foi removido da listagem pública.',
      });
    }
  };

  const handleProrogue = (notice: Notice) => {
    setType('#Prorrogação');
    setNumber(notice.number);
    setObject(notice.object);
    setStartDate(notice.startDate.split('T')[0]);
    // Set end date empty to force new entry
    setEndDate('');
    setEditingId(notice.id); // Or actually maybe prorogue creates a NEW record? The prompt says "prorogue dates". If we just edit it, we can set type to Prorrogação and change end date. Let's do that.
    setView('form');
    toast({
      title: 'Modo Prorrogação',
      description: 'Ajuste a nova data final para a prorrogação.',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl flex flex-col p-0 border-l-4 border-l-primary">
        <div className="p-6 border-b bg-[#f1f3f4] dark:bg-muted/30">
          <SheetHeader>
            <SheetTitle className="text-xl text-primary font-bold">Painel do Gestor</SheetTitle>
            <SheetDescription>
              Gerencie as publicações de Licitações e Contratações Diretas.
            </SheetDescription>
          </SheetHeader>
        </div>

        {view === 'list' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-card">
              <h3 className="font-semibold">Avisos Cadastrados</h3>
              <Button onClick={() => handleOpenForm()} size="sm" className="gap-2 rounded-sm">
                <Plus className="h-4 w-4" />
                Novo Aviso
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4 bg-muted/10">
              <div className="space-y-4">
                {allNotices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum aviso cadastrado.
                  </div>
                )}
                {allNotices.map((notice) => (
                  <div key={notice.id} className={`bg-card p-4 rounded-sm border shadow-xs transition-opacity ${!notice.active ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={notice.active ? 'default' : 'secondary'} className={notice.active ? 'bg-primary' : ''}>
                          {notice.type}
                        </Badge>
                        <span className="font-bold">{notice.number}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleProrogue(notice)} disabled={!notice.active} title="Prorrogar">
                          <CalendarClock className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(notice)} disabled={!notice.active} title="Editar">
                          <Edit2 className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(notice.id)} disabled={!notice.active} title="Desativar">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3 text-muted-foreground">{notice.object}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Vigência: {format(new Date(notice.startDate), 'dd/MM/yyyy')} a {format(new Date(notice.endDate), 'dd/MM/yyyy')}</span>
                      <span>{notice.active ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {view === 'form' && (
          <ScrollArea className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{editingId ? 'Editar Aviso' : 'Novo Aviso'}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setView('list'); resetForm(); }}>
                  <X className="h-4 w-4 mr-2" /> Cancelar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo do Aviso</Label>
                  <Select value={type} onValueChange={(v: NoticeType) => setType(v)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#Aviso Inicial">#Aviso Inicial</SelectItem>
                      <SelectItem value="#Prorrogação">#Prorrogação</SelectItem>
                      <SelectItem value="#Republicação">#Republicação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="number">Número / Ano</Label>
                  <Input id="number" value={number} onChange={e => setNumber(e.target.value)} placeholder="Ex: 001/2026" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="object">Objeto (Descrição Detalhada)</Label>
                <Textarea 
                  id="object" 
                  value={object} 
                  onChange={e => setObject(e.target.value)} 
                  placeholder="Descreva o objeto da licitação ou contratação..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <FileType className="h-4 w-4" /> Documentos (PDF, P7S, ZIP - Máx 50MB)
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avisoFile" className="text-sm">Aviso ou Edital</Label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        id="avisoFile" 
                        type="file" 
                        accept=".pdf,.p7s,.zip,application/pdf,application/pkcs7-signature,application/zip" 
                        ref={fileInputRefAviso}
                        onChange={e => handleFileChange(e, setAvisoFile)}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" onClick={() => fileInputRefAviso.current?.click()} className="w-full justify-start text-muted-foreground">
                        <UploadCloud className="h-4 w-4 mr-2" />
                        {avisoFile ? avisoFile.name : (editingId ? 'Manter arquivo atual' : 'Selecionar arquivo...')}
                      </Button>
                      {avisoFile && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trFile" className="text-sm">Termo de Referência / Projeto Básico</Label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        id="trFile" 
                        type="file" 
                        accept=".pdf,.p7s,.zip,application/pdf,application/pkcs7-signature,application/zip" 
                        ref={fileInputRefTr}
                        onChange={e => handleFileChange(e, setTrFile)}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" onClick={() => fileInputRefTr.current?.click()} className="w-full justify-start text-muted-foreground">
                        <UploadCloud className="h-4 w-4 mr-2" />
                        {trFile ? trFile.name : (editingId ? 'Manter arquivo atual' : 'Selecionar arquivo...')}
                      </Button>
                      {trFile && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setView('list'); resetForm(); }}>Cancelar</Button>
                <Button type="submit">{editingId ? 'Salvar Alterações' : 'Publicar Aviso'}</Button>
              </div>
            </form>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
