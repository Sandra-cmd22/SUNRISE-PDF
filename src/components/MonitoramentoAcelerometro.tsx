import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MonitoramentoAcelerometro() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    nomeCrianca: '',
    id: '',
    numeroSerie: '',
    dataColocacaoRetirada: '',
    // Dados por dia (8 dias)
    dias: Array.from({ length: 8 }, () => ({
      data: '',
      horarioAcordou: '',
      cochilouDia: '',
      horarioCochiloDia: '',
      cochilouMonitor: '',
      motivoCochilouMonitor: '',
      horarioDormiu: '',
      dormiuMonitor: '',
      motivoDormiuMonitor: '',
      removeuMonitor: '',
      motivoRemoveu: '',
      horarioRemoveu: '',
      foiEscola: '',
      horarioEscola: '',
      diaTipico: ''
    })),
    comentarios: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDayChange = (dayIndex: number, field: string, value: string) => {
    const newDias = [...formData.dias];
    newDias[dayIndex] = { ...newDias[dayIndex], [field]: value };
    setFormData({ ...formData, dias: newDias });
  };

  const handleEnviarPlanilha = async () => {
    try {
      // Preparar dados para envio
      const dadosParaPlanilha = {
        timestamp: new Date().toISOString(),
        nomeCrianca: formData.nomeCrianca,
        id: formData.id,
        numeroSerie: formData.numeroSerie,
        dataColocacaoRetirada: formData.dataColocacaoRetirada,
        comentarios: formData.comentarios,
        ...formData.dias.reduce((acc, dia, index) => {
          acc[`dia${index + 1}_data`] = dia.data;
          acc[`dia${index + 1}_horarioAcordou`] = dia.horarioAcordou;
          acc[`dia${index + 1}_cochilouDia`] = dia.cochilouDia;
          acc[`dia${index + 1}_horarioCochiloDia`] = dia.horarioCochiloDia;
          acc[`dia${index + 1}_cochilouMonitor`] = dia.cochilouMonitor;
          acc[`dia${index + 1}_motivoCochilouMonitor`] = dia.motivoCochilouMonitor;
          acc[`dia${index + 1}_horarioDormiu`] = dia.horarioDormiu;
          acc[`dia${index + 1}_dormiuMonitor`] = dia.dormiuMonitor;
          acc[`dia${index + 1}_motivoDormiuMonitor`] = dia.motivoDormiuMonitor;
          acc[`dia${index + 1}_removeuMonitor`] = dia.removeuMonitor;
          acc[`dia${index + 1}_motivoRemoveu`] = dia.motivoRemoveu;
          acc[`dia${index + 1}_horarioRemoveu`] = dia.horarioRemoveu;
          acc[`dia${index + 1}_foiEscola`] = dia.foiEscola;
          acc[`dia${index + 1}_horarioEscola`] = dia.horarioEscola;
          acc[`dia${index + 1}_diaTipico`] = dia.diaTipico;
          return acc;
        }, {} as Record<string, string>)
      };

      // Converter para CSV
      const headers = Object.keys(dadosParaPlanilha).join(',');
      const values = Object.values(dadosParaPlanilha).map(v => 
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',');
      const csv = `${headers}\n${values}`;

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `monitoramento-acelerometro-${formData.id || 'dados'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Dados exportados para CSV com sucesso!\n\nPara enviar para Google Sheets:\n1. Abra sua planilha no Google Sheets\n2. Arquivo > Importar > Upload\n3. Selecione o arquivo CSV baixado');
      
      console.log('Dados exportados:', dadosParaPlanilha);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Por favor, tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;

    try {
      // Mostrar mensagem de processamento
      const loadingMsg = document.createElement('div');
      loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 2rem; border-radius: 8px; z-index: 9999; font-family: Poppins, sans-serif;';
      loadingMsg.textContent = 'Gerando PDF...';
      document.body.appendChild(loadingMsg);

      // Capturar o formulário como canvas
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // OCULTAR OS BOTÕES NO PDF
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach((btn: any) => {
            btn.style.display = 'none';
          });

          // Remover estilos que causam problemas com oklch
          const clonedElement = clonedDoc.querySelector('form');
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#ffffff';
            // Remover forçagem de largura para não distorcer em paisagem
            (clonedElement as HTMLElement).style.maxWidth = '';
            (clonedElement as HTMLElement).style.width = '';
          }

          // Remover gradiente dos títulos para o PDF
          const headings = clonedDoc.querySelectorAll('h1, h2');
          headings.forEach((h: any) => {
            h.style.background = 'none';
            (h.style as any).WebkitBackgroundClip = '';
            (h.style as any).WebkitTextFillColor = '';
            h.style.backgroundClip = '';
            h.style.color = '#333';
          });

          // (Sem limpeza de parênteses no clone para este formulário)

          // Garantir que os valores dos campos apareçam no PDF
          const fields = clonedDoc.querySelectorAll('input, textarea, select');
          fields.forEach((el: any) => {
            if (el.tagName === 'TEXTAREA') {
              const val = el.value || '';
              el.value = val;
              el.textContent = val;
              const span = clonedDoc.createElement('span');
              span.textContent = val;
              span.style.display = 'block';
              span.style.whiteSpace = 'pre-wrap';
              span.style.border = '1px solid #ccc';
              span.style.borderRadius = '4px';
              span.style.padding = '0.45rem 0.5rem';
              span.style.fontSize = '0.7rem';
              span.style.width = '100%';
              span.style.boxSizing = 'border-box';
              span.style.lineHeight = '1.2';
              span.style.minHeight = '36px';
              el.parentNode && el.parentNode.replaceChild(span, el);
            } else if (el.tagName === 'INPUT') {
              const type = (el.getAttribute('type') || '').toLowerCase();
              if (type === 'checkbox' || type === 'radio') {
                el.checked = !!el.checked;
                if (el.checked) {
                  el.setAttribute('checked', 'checked');
                } else {
                  el.removeAttribute('checked');
                }
                // Manter input real (checkbox) e melhorar legibilidade
                (el as HTMLElement).style.transform = 'scale(1.1)';
                (el as HTMLElement).style.transformOrigin = 'left center';
              } else {
                const val = el.value || '';
                el.value = val;
                el.setAttribute('value', val);
                const span = clonedDoc.createElement('span');
                span.textContent = val;
                span.style.display = 'block';
                span.style.border = '1px solid #ccc';
                span.style.borderRadius = '4px';
                span.style.padding = '0.45rem 0.5rem';
                span.style.fontSize = '0.7rem';
                span.style.width = '100%';
                span.style.boxSizing = 'border-box';
                span.style.lineHeight = '1.2';
                span.style.minHeight = '36px';
                el.parentNode && el.parentNode.replaceChild(span, el);
              }
            } else if (el.tagName === 'SELECT') {
              const value = el.value;
              el.value = value;
              Array.from(el.options || []).forEach((opt: any) => {
                if (opt.value === value) {
                  opt.selected = true;
                  opt.setAttribute('selected', 'selected');
                } else {
                  opt.selected = false;
                  opt.removeAttribute('selected');
                }
              });
              const selected = el.options && el.options[el.selectedIndex];
              const span = clonedDoc.createElement('span');
              span.textContent = selected ? selected.text : '';
              span.style.display = 'block';
              span.style.border = '1px solid #ccc';
              span.style.borderRadius = '4px';
              span.style.padding = '0.45rem 0.5rem';
              span.style.fontSize = '0.7rem';
              span.style.width = '100%';
              span.style.boxSizing = 'border-box';
              span.style.lineHeight = '1.2';
              span.style.minHeight = '36px';
              el.parentNode && el.parentNode.replaceChild(span, el);
            }
          });
        },
        ignoreElements: (element) => {
          // Ignorar elementos que possam ter cores oklch problemáticas
          return false;
        }
      });

      // Criar PDF (landscape) com ajuste por razão
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const pageWidth = (pdf as any).internal.pageSize.getWidth();
      const pageHeight = (pdf as any).internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const x = (pageWidth - imgWidth * ratio) / 2;
      const y = (pageHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');

      // Salvar PDF
      pdf.save('monitoramento-acelerometro-sunrise.pdf');

      // Remover mensagem de loading
      document.body.removeChild(loadingMsg);

      alert('PDF gerado com sucesso!');
      console.log('Dados do formulário:', formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={styles.form} className="ma-responsive">
      <style>
        {`
          /* Mobile: quebrar cabeçalho em coluna e manter ordem Nome -> ID -> Data */
          @media (max-width: 640px) {
            .ma-responsive .header-row { display: flex !important; flex-direction: column !important; gap: 0.75rem !important; }
            .ma-responsive .header-field { width: 100% !important; }
            .ma-responsive .headerInput { width: 100% !important; box-sizing: border-box; }
            .ma-responsive .mainTitle { font-size: 1rem !important; }
          }
        `}
      </style>
      <h1 style={styles.mainTitle}>
        Monitoramento do uso do acelerômetro (n. de série{' '}
        <input
          type="text"
          value={formData.numeroSerie}
          onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
          style={styles.inlineTitleInput}
          placeholder="_______________"
        />
        )
      </h1>

      {/* Campos de cabeçalho */}
      <div style={styles.headerRow} className="header-row">
        <div style={styles.headerField} className="header-field">
          <label style={styles.headerLabel}>Nome da criança:</label>
          <input
            type="text"
            value={formData.nomeCrianca}
            onChange={(e) => handleInputChange('nomeCrianca', e.target.value)}
            style={styles.headerInput}
            className="headerInput"
          />
        </div>
        <div style={styles.headerField} className="header-field">
          <label style={styles.headerLabel}>ID:</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            style={styles.headerInput}
            className="headerInput"
          />
        </div>
        <div style={styles.headerField} className="header-field">
          <label style={styles.headerLabel}>Data de colocação e retirada:</label>
          <input
            type="text"
            value={formData.dataColocacaoRetirada}
            onChange={(e) => handleInputChange('dataColocacaoRetirada', e.target.value)}
            style={styles.headerInput}
            className="headerInput"
          />
        </div>
      </div>

      {/* Tabela principal */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thQuestion}></th>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((dia) => (
                <th key={dia} style={styles.thDay}>
                  Dia {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Linha: Data */}
            <tr>
              <td style={styles.tdQuestion}>Data</td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdInput}>
                  <input
                    type="text"
                    value={dia.data}
                    onChange={(e) => handleDayChange(index, 'data', e.target.value)}
                    style={styles.cellInput}
                    placeholder="__/__/__"
                  />
                </td>
              ))}
            </tr>

            {/* Linha: Horário que acordou */}
            <tr>
              <td style={styles.tdQuestion}>Horário que acordou: ex 8:40</td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdInput}>
                  <input
                    type="time"
                    value={dia.horarioAcordou}
                    onChange={(e) => handleDayChange(index, 'horarioAcordou', e.target.value)}
                    style={styles.cellInput}
                  />
                </td>
              ))}
            </tr>

            {/* Linha: A criança cochilou durante o dia? */}
            <tr>
              <td style={styles.tdQuestion}>
                A criança cochilou durante o dia?<br />
                Caso sim, anotar o horário: ex 16h-17h
              </td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdCheckbox}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.cochilouDia === 'sim'}
                        onChange={() => handleDayChange(index, 'cochilouDia', dia.cochilouDia === 'sim' ? '' : 'sim')}
                        style={styles.checkbox}
                      />
                      sim
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.cochilouDia === 'nao'}
                        onChange={() => handleDayChange(index, 'cochilouDia', dia.cochilouDia === 'nao' ? '' : 'nao')}
                        style={styles.checkbox}
                      />
                      não
                    </label>
                  </div>
                  <div style={styles.subField}>
                    <span style={styles.subLabel}>Horário:</span>
                    <input
                      type="text"
                      value={dia.horarioCochiloDia}
                      onChange={(e) => handleDayChange(index, 'horarioCochiloDia', e.target.value)}
                      style={styles.cellInputSmall}
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Linha: A criança cochilou com o monitor? */}
            <tr>
              <td style={styles.tdQuestion}>
                A criança cochilou com o monitor? Caso não, por quê?
              </td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdCheckbox}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.cochilouMonitor === 'sim'}
                        onChange={() => handleDayChange(index, 'cochilouMonitor', dia.cochilouMonitor === 'sim' ? '' : 'sim')}
                        style={styles.checkbox}
                      />
                      sim
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.cochilouMonitor === 'nao'}
                        onChange={() => handleDayChange(index, 'cochilouMonitor', dia.cochilouMonitor === 'nao' ? '' : 'nao')}
                        style={styles.checkbox}
                      />
                      não
                    </label>
                  </div>
                  <div style={styles.subField}>
                    <span style={styles.subLabel}>Motivo:</span>
                    <input
                      type="text"
                      value={dia.motivoCochilouMonitor}
                      onChange={(e) => handleDayChange(index, 'motivoCochilouMonitor', e.target.value)}
                      style={styles.cellInputSmall}
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Linha: Horário que dormiu */}
            <tr>
              <td style={styles.tdQuestion}>Horário que dormiu (à noite): ex 20:50</td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdInput}>
                  <input
                    type="time"
                    value={dia.horarioDormiu}
                    onChange={(e) => handleDayChange(index, 'horarioDormiu', e.target.value)}
                    style={styles.cellInput}
                  />
                </td>
              ))}
            </tr>

            {/* Linha: A criança dormiu com o monitor? */}
            <tr>
              <td style={styles.tdQuestion}>
                A criança dormiu com o monitor?<br />
                Caso não, por quê?
              </td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdCheckbox}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.dormiuMonitor === 'sim'}
                        onChange={() => handleDayChange(index, 'dormiuMonitor', dia.dormiuMonitor === 'sim' ? '' : 'sim')}
                        style={styles.checkbox}
                      />
                      sim
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.dormiuMonitor === 'nao'}
                        onChange={() => handleDayChange(index, 'dormiuMonitor', dia.dormiuMonitor === 'nao' ? '' : 'nao')}
                        style={styles.checkbox}
                      />
                      não
                    </label>
                  </div>
                  <div style={styles.subField}>
                    <span style={styles.subLabel}>Motivo:</span>
                    <input
                      type="text"
                      value={dia.motivoDormiuMonitor}
                      onChange={(e) => handleDayChange(index, 'motivoDormiuMonitor', e.target.value)}
                      style={styles.cellInputSmall}
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Linha: A criança removeu o monitor */}
            <tr>
              <td style={styles.tdQuestion}>
                A criança removeu o monitor para realizar alguma atividade (anote a razão e o período, horário que retirou e que recolocou o monitor)<br />
                ex: natação 10h às 11h
              </td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdCheckbox}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.removeuMonitor === 'sim'}
                        onChange={() => handleDayChange(index, 'removeuMonitor', dia.removeuMonitor === 'sim' ? '' : 'sim')}
                        style={styles.checkbox}
                      />
                      sim
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.removeuMonitor === 'nao'}
                        onChange={() => handleDayChange(index, 'removeuMonitor', dia.removeuMonitor === 'nao' ? '' : 'nao')}
                        style={styles.checkbox}
                      />
                      não
                    </label>
                  </div>
                  <div style={styles.subField}>
                    <span style={styles.subLabel}>Motivo:</span>
                    <input
                      type="text"
                      value={dia.motivoRemoveu}
                      onChange={(e) => handleDayChange(index, 'motivoRemoveu', e.target.value)}
                      style={styles.cellInputSmall}
                    />
                  </div>
                  <div style={styles.subField}>
                    <span style={styles.subLabel}>Horário:</span>
                    <input
                      type="text"
                      value={dia.horarioRemoveu}
                      onChange={(e) => handleDayChange(index, 'horarioRemoveu', e.target.value)}
                      style={styles.cellInputSmall}
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Linha: A criança foi para a escola hoje? */}
            <tr>
              <td style={styles.tdQuestion}>
                A criança foi para a escola hoje?<br />
                Horário de permanência na escola (das 13h às 18h, por exemplo)
              </td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdCheckbox}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.foiEscola === 'sim'}
                        onChange={() => handleDayChange(index, 'foiEscola', dia.foiEscola === 'sim' ? '' : 'sim')}
                        style={styles.checkbox}
                      />
                      sim
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.foiEscola === 'nao'}
                        onChange={() => handleDayChange(index, 'foiEscola', dia.foiEscola === 'nao' ? '' : 'nao')}
                        style={styles.checkbox}
                      />
                      não
                    </label>
                  </div>
                  <input
                    type="text"
                    value={dia.horarioEscola}
                    onChange={(e) => handleDayChange(index, 'horarioEscola', e.target.value)}
                    style={styles.cellInputSmall}
                    placeholder="Horário"
                  />
                </td>
              ))}
            </tr>

            {/* Linha: Este foi um dia típico? */}
            <tr>
              <td style={styles.tdQuestion}>Este foi um dia típico, comum?</td>
              {formData.dias.map((dia, index) => (
                <td key={index} style={styles.tdCheckbox}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.diaTipico === 'sim'}
                        onChange={() => handleDayChange(index, 'diaTipico', dia.diaTipico === 'sim' ? '' : 'sim')}
                        style={styles.checkbox}
                      />
                      sim
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={dia.diaTipico === 'nao'}
                        onChange={() => handleDayChange(index, 'diaTipico', dia.diaTipico === 'nao' ? '' : 'nao')}
                        style={styles.checkbox}
                      />
                      não
                    </label>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comentários */}
      <div style={styles.comentariosSection}>
        <label style={styles.comentariosLabel}>Você tem algum comentário sobre o uso do monitor?</label>
        <textarea
          value={formData.comentarios}
          onChange={(e) => handleInputChange('comentarios', e.target.value)}
          style={styles.comentariosTextarea}
        />
      </div>

      {/* Botões de Envio */}
      <div style={styles.submitContainer}>
        <button type="submit" style={styles.submitButton}>
          Enviar Formulário PDF
        </button>
        <button 
          type="button" 
          onClick={handleEnviarPlanilha}
          style={styles.spreadsheetButton}
        >
          Enviar para Planilha
        </button>
      </div>
    </form>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#ffffff',
    borderRadius: '8px'
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.25rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  inlineTitleInput: {
    border: 'none',
    borderBottom: '1px solid #333',
    outline: 'none',
    fontSize: '1.25rem',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
    width: '200px',
    padding: '0.25rem'
  },
  headerRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 2fr',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'end'
  },
  headerField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  headerLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#333'
  },
  headerInput: {
    padding: '0.5rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    minHeight: '36px'
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '1.5rem',
    border: '2px solid #333',
    borderRadius: '4px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.7rem'
  },
  thQuestion: {
    border: '1px solid #333',
    padding: '0.5rem',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
    textAlign: 'left',
    minWidth: '200px',
    width: '200px'
  },
  thDay: {
    border: '1px solid #333',
    padding: '0.5rem',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
    textAlign: 'center',
    minWidth: '100px'
  },
  tdQuestion: {
    border: '1px solid #333',
    padding: '0.5rem',
    backgroundColor: '#f9f9f9',
    fontWeight: '500',
    verticalAlign: 'top',
    fontSize: '0.7rem',
    lineHeight: '1.3'
  },
  tdInput: {
    border: '1px solid #333',
    padding: '0.35rem',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  tdCheckbox: {
    border: '1px solid #333',
    padding: '0.35rem',
    verticalAlign: 'top'
  },
  cellInput: {
    width: '100%',
    padding: '0.35rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    textAlign: 'center'
  },
  cellInputSmall: {
    width: '100%',
    padding: '0.25rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    marginTop: '0.25rem'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    marginBottom: '0.25rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.65rem',
    color: '#333'
  },
  checkbox: {
    width: '12px',
    height: '12px',
    cursor: 'pointer',
    accentColor: '#613789'
  },
  subField: {
    marginTop: '0.25rem'
  },
  subLabel: {
    fontSize: '0.65rem',
    fontWeight: '500',
    color: '#333',
    display: 'block',
    marginBottom: '0.15rem'
  },
  comentariosSection: {
    marginBottom: '1.5rem'
  },
  comentariosLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.5rem'
  },
  comentariosTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical'
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap'
  },
  submitButton: {
    padding: '0.875rem 2.5rem',
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
    minHeight: '44px'
  },
  spreadsheetButton: {
    padding: '0.875rem 2.5rem',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
    minHeight: '44px'
  }
};
