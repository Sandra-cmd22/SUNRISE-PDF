import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

// Tipo para os dados do formulário de coleta
export interface DadosColeta {
  // Creche/escola
  idCreche: string;
  professor: string;
  dataColeta: string;
  avaliador: string;
  // Criança
  nomeCrianca: string;
  idCrianca: string;
  dataNascimento: string;
  observacaoCrianca: string;
  // Acelerômetro
  idAcelerometro: string;
  dataColocacao: string;
  horaColocacao: string;
  dataRetirada: string;
  horaRetirada: string;
  // Altura/Peso
  altura1: string;
  altura2: string;
  altura3: string;
  peso1: string;
  peso2: string;
  peso3: string;
  observacaoAlturaPeso: string;
  // Supine Time UP and Go
  treinoSupine: string;
  tentativa1Supine: string;
  tentativa2Supine: string;
  observacaoSupine: string;
  // Equilíbrio
  pernaDireita30: string;
  pernaEsquerda30: string;
  observacaoEquilibrio: string;
  // Salto horizontal
  tentativa1Salto: string;
  tentativa2Salto: string;
  observacaoSalto: string;
  // Dinamômetro
  tentativaDireita1Din: string;
  tentativaEsquerda1Din: string;
  tentativaDireita2Din: string;
  tentativaEsquerda2Din: string;
  observacaoDinamometro: string;
  // Jogo dos 9 Pinos
  treinoDireita9P: string;
  tentativaDireita9P: string;
  treinoEsquerda9P: string;
  tentativaEsquerda9P: string;
  observacao9Pinos: string;
  // Mr. Ant
  pointScore: string;
  classificacaoAnt: string;
  numTentativasCorretas: string;
  horarioTerminoAnt: string;
  observacaoAnt: string;
  // Go-No Go
  precisaoGo: string;
  classificacaoGo: string;
  precisaoNoGo: string;
  horarioTerminoGo: string;
  icGo: string;
  observacaoGoNoGo: string;
  // Comentários
  comentarios: string;
}

/**
 * Salvar uma nova coleta no Supabase
 * @param dados - Dados do formulário de coleta
 * @returns Objeto com sucesso e dados/erro
 */
export async function salvarColeta(dados: DadosColeta) {
  try {
    const { data, error } = await supabase
      .from('coletas')
      .insert([
        {
          ...dados,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao salvar coleta:', error);
      return { sucesso: false, erro: error.message };
    }

    return { sucesso: true, dados: data };
  } catch (error) {
    console.error('Erro ao salvar coleta:', error);
    return { sucesso: false, erro: 'Erro inesperado ao salvar coleta' };
  }
}

/**
 * Listar todas as coletas do Supabase
 * @returns Objeto com sucesso e dados/erro
 */
export async function listarColetas() {
  try {
    const { data, error } = await supabase
      .from('coletas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar coletas:', error);
      return { sucesso: false, erro: error.message };
    }

    return { sucesso: true, dados: data };
  } catch (error) {
    console.error('Erro ao listar coletas:', error);
    return { sucesso: false, erro: 'Erro inesperado ao listar coletas' };
  }
}

/**
 * Buscar uma coleta específica por ID
 * @param id - ID da coleta
 * @returns Objeto com sucesso e dados/erro
 */
export async function buscarColeta(id: string) {
  try {
    const { data, error } = await supabase
      .from('coletas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar coleta:', error);
      return { sucesso: false, erro: error.message };
    }

    return { sucesso: true, dados: data };
  } catch (error) {
    console.error('Erro ao buscar coleta:', error);
    return { sucesso: false, erro: 'Erro inesperado ao buscar coleta' };
  }
}

/**
 * Atualizar uma coleta existente
 * @param id - ID da coleta
 * @param dados - Dados atualizados do formulário
 * @returns Objeto com sucesso e dados/erro
 */
export async function atualizarColeta(id: string, dados: DadosColeta) {
  try {
    const { data, error } = await supabase
      .from('coletas')
      .update(dados)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar coleta:', error);
      return { sucesso: false, erro: error.message };
    }

    return { sucesso: true, dados: data };
  } catch (error) {
    console.error('Erro ao atualizar coleta:', error);
    return { sucesso: false, erro: 'Erro inesperado ao atualizar coleta' };
  }
}

/**
 * Deletar uma coleta
 * @param id - ID da coleta
 * @returns Objeto com sucesso e dados/erro
 */
export async function deletarColeta(id: string) {
  try {
    const { error } = await supabase
      .from('coletas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar coleta:', error);
      return { sucesso: false, erro: error.message };
    }

    return { sucesso: true, dados: null };
  } catch (error) {
    console.error('Erro ao deletar coleta:', error);
    return { sucesso: false, erro: 'Erro inesperado ao deletar coleta' };
  }
}

/**
 * Exportar todas as coletas para Excel
 * Gera e baixa automaticamente o arquivo planilha-mae.xlsx
 * @returns Objeto com sucesso e dados/erro
 */
export async function exportarParaExcel() {
  try {
    // Buscar todas as coletas do Supabase
    const resultado = await listarColetas();

    if (!resultado.sucesso || !resultado.dados) {
      return { sucesso: false, erro: resultado.erro || 'Nenhuma coleta encontrada' };
    }

    const coletas = resultado.dados;

    if (coletas.length === 0) {
      return { sucesso: false, erro: 'Nenhuma coleta disponível para exportar' };
    }

    // Preparar dados para o Excel
    // Ordenar as colunas de forma lógica
    const dadosExcel = coletas.map((coleta: any) => ({
      // Metadados
      'ID': coleta.id,
      'Data de Criação': coleta.created_at ? new Date(coleta.created_at).toLocaleString('pt-BR') : '',
      
      // Creche/escola
      'ID Creche': coleta.idCreche || '',
      'Professor(a)': coleta.professor || '',
      'Data da Coleta': coleta.dataColeta || '',
      'Avaliador(a)': coleta.avaliador || '',
      
      // Criança
      'Nome da Criança': coleta.nomeCrianca || '',
      'ID da Criança': coleta.idCrianca || '',
      'Data de Nascimento': coleta.dataNascimento || '',
      'Observação Criança': coleta.observacaoCrianca || '',
      
      // Acelerômetro
      'ID Acelerômetro': coleta.idAcelerometro || '',
      'Data Colocação': coleta.dataColocacao || '',
      'Hora Colocação': coleta.horaColocacao || '',
      'Data Retirada': coleta.dataRetirada || '',
      'Hora Retirada': coleta.horaRetirada || '',
      
      // Altura/Peso
      'Altura 1 (cm)': coleta.altura1 || '',
      'Altura 2 (cm)': coleta.altura2 || '',
      'Altura 3 (cm)': coleta.altura3 || '',
      'Peso 1 (kg)': coleta.peso1 || '',
      'Peso 2 (kg)': coleta.peso2 || '',
      'Peso 3 (kg)': coleta.peso3 || '',
      'Observação Altura/Peso': coleta.observacaoAlturaPeso || '',
      
      // Supine Time UP and Go
      'Treino Supine (seg)': coleta.treinoSupine || '',
      'Tentativa 1 Supine (seg)': coleta.tentativa1Supine || '',
      'Tentativa 2 Supine (seg)': coleta.tentativa2Supine || '',
      'Observação Supine': coleta.observacaoSupine || '',
      
      // Equilíbrio
      'Perna Direita 30seg': coleta.pernaDireita30 || '',
      'Perna Esquerda 30seg': coleta.pernaEsquerda30 || '',
      'Observação Equilíbrio': coleta.observacaoEquilibrio || '',
      
      // Salto horizontal
      'Tentativa 1 Salto (cm)': coleta.tentativa1Salto || '',
      'Tentativa 2 Salto (cm)': coleta.tentativa2Salto || '',
      'Observação Salto': coleta.observacaoSalto || '',
      
      // Dinamômetro
      'Tentativa Direita 1 Din (kg)': coleta.tentativaDireita1Din || '',
      'Tentativa Esquerda 1 Din (kg)': coleta.tentativaEsquerda1Din || '',
      'Tentativa Direita 2 Din (kg)': coleta.tentativaDireita2Din || '',
      'Tentativa Esquerda 2 Din (kg)': coleta.tentativaEsquerda2Din || '',
      'Observação Dinamômetro': coleta.observacaoDinamometro || '',
      
      // Jogo dos 9 Pinos
      'Treino Direita 9P (seg)': coleta.treinoDireita9P || '',
      'Tentativa Direita 9P (seg)': coleta.tentativaDireita9P || '',
      'Treino Esquerda 9P (seg)': coleta.treinoEsquerda9P || '',
      'Tentativa Esquerda 9P (seg)': coleta.tentativaEsquerda9P || '',
      'Observação 9 Pinos': coleta.observacao9Pinos || '',
      
      // Mr. Ant
      'Point Score': coleta.pointScore || '',
      'Classificação Ant': coleta.classificacaoAnt || '',
      'Nº Tentativas Corretas': coleta.numTentativasCorretas || '',
      'Horário Término Ant': coleta.horarioTerminoAnt || '',
      'Observação Ant': coleta.observacaoAnt || '',
      
      // Go-No Go
      'Precisão Go (%)': coleta.precisaoGo || '',
      'Classificação Go': coleta.classificacaoGo || '',
      'Precisão No/Go (%)': coleta.precisaoNoGo || '',
      'Horário Término Go': coleta.horarioTerminoGo || '',
      'IC Go': coleta.icGo || '',
      'Observação Go-No Go': coleta.observacaoGoNoGo || '',
      
      // Comentários
      'Comentários': coleta.comentarios || ''
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExcel);

    // Ajustar largura das colunas
    const colWidths = Object.keys(dadosExcel[0]).map(key => ({
      wch: Math.max(key.length, 15) // Largura mínima de 15 caracteres
    }));
    ws['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Coletas');

    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    // Criar link de download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nome do arquivo com data atual
    const dataAtual = new Date().toISOString().split('T')[0];
    link.download = `planilha-mae-${dataAtual}.xlsx`;
    
    // Simular clique para download
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar memória
    URL.revokeObjectURL(url);

    return { 
      sucesso: true, 
      dados: { 
        totalColetas: coletas.length,
        nomeArquivo: `planilha-mae-${dataAtual}.xlsx`
      } 
    };
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    return { sucesso: false, erro: 'Erro inesperado ao exportar para Excel' };
  }
}

