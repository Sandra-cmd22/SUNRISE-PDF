import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function FormularioColeta() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    // Creche/escola
    idCreche: '',
    professor: '',
    dataColeta: '',
    avaliador: '',
    // Criança
    nomeCrianca: '',
    idCrianca: '',
    dataNascimento: '',
    observacaoCrianca: '',
    // Acelerômetro
    idAcelerometro: '',
    dataColocacao: '',
    horaColocacao: '',
    dataRetirada: '',
    horaRetirada: '',
    // Altura/Peso
    altura1: '',
    altura2: '',
    altura3: '',
    peso1: '',
    peso2: '',
    peso3: '',
    observacaoAlturaPeso: '',
    // Supine Time UP and Go
    treinoSupine: '',
    tentativa1Supine: '',
    tentativa2Supine: '',
    observacaoSupine: '',
    // Equilíbrio
    pernaDireita30: '',
    pernaEsquerda30: '',
    observacaoEquilibrio: '',
    // Salto horizontal
    tentativa1Salto: '',
    tentativa2Salto: '',
    observacaoSalto: '',
    // Dinamômetro
    tentativaDireita1Din: '',
    tentativaEsquerda1Din: '',
    tentativaDireita2Din: '',
    tentativaEsquerda2Din: '',
    observacaoDinamometro: '',
    // Jogo dos 9 Pinos
    treinoDireita9P: '',
    tentativaDireita9P: '',
    treinoEsquerda9P: '',
    tentativaEsquerda9P: '',
    observacao9Pinos: '',
    // Mr. Ant
    pointScore: '',
    classificacaoAnt: '',
    numTentativasCorretas: '',
    horarioTerminoAnt: '',
    observacaoAnt: '',
    // Go-No Go
    precisaoGo: '',
    classificacaoGo: '',
    precisaoNoGo: '',
    horarioTerminoGo: '',
    icGo: '',
    observacaoGoNoGo: '',
    // Comentários
    comentarios: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnviarPlanilha = async () => {
    try {
      // Preparar dados para envio
      const dadosParaPlanilha = {
        timestamp: new Date().toISOString(),
        ...formData
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
      link.setAttribute('download', `formulario-coleta-${formData.idCrianca || 'dados'}.csv`);
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
      loadingMsg.textContent = 'Gerando PDF colorido...';
      document.body.appendChild(loadingMsg);

      // Capturar o formulário como canvas
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // OCULTAR OS BOTÕES NO PDF
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach((btn: any) => {
            btn.style.display = 'none';
          });

          // Garantir que os valores dos campos apareçam no PDF
          const fields = clonedDoc.querySelectorAll('input, textarea, select');
          fields.forEach((el: any) => {
            if (el.tagName === 'TEXTAREA') {
              const val = el.value || '';
              el.value = val;
              el.textContent = val;
              // Substituir por span para garantir renderização do valor
              const span = clonedDoc.createElement('span');
              span.textContent = val;
              span.style.display = 'inline-block';
              span.style.whiteSpace = 'pre-wrap';
              span.style.border = '1px solid #d0d0d0';
              span.style.borderRadius = '6px';
              span.style.padding = '0.2rem 0.3rem';
              span.style.fontSize = '7px';
              span.style.minHeight = '22px';
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
                // Renderizar checkbox como símbolo sem parênteses
                const span = clonedDoc.createElement('span');
                span.textContent = el.checked ? '☑' : '☐';
                span.style.display = 'inline-block';
                span.style.fontSize = '10px';
                span.style.marginRight = '0.25rem';
                el.parentNode && el.parentNode.replaceChild(span, el);
              } else {
                const val = el.value || '';
                el.value = val;
                el.setAttribute('value', val);
                // Substituir por span para garantir renderização
                const span = clonedDoc.createElement('span');
                span.textContent = val;
                span.style.display = 'inline-block';
                span.style.border = '1px solid #d0d0d0';
                span.style.borderRadius = '6px';
                span.style.padding = '0.2rem 0.3rem';
                span.style.fontSize = '7px';
                span.style.minHeight = '22px';
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
              // Mostrar o texto da option selecionada
              const selected = el.options && el.options[el.selectedIndex];
              const span = clonedDoc.createElement('span');
              span.textContent = selected ? selected.text : '';
              span.style.display = 'inline-block';
              span.style.border = '1px solid #d0d0d0';
              span.style.borderRadius = '6px';
              span.style.padding = '0.2rem 0.3rem';
              span.style.fontSize = '7px';
              span.style.minHeight = '22px';
              el.parentNode && el.parentNode.replaceChild(span, el);
            }
          });

          // Remover gradiente dos títulos para o PDF
          const headings = clonedDoc.querySelectorAll('h1, h2');
          headings.forEach((h: any) => {
            h.style.background = 'none';
            // Alguns navegadores usam as propriedades abaixo para gradiente em texto
            (h.style as any).WebkitBackgroundClip = '';
            (h.style as any).WebkitTextFillColor = '';
            h.style.backgroundClip = '';
            h.style.color = '#333';
          });

          // Limpar parênteses dos rótulos de checkbox/radio
          const allLabels = clonedDoc.querySelectorAll('label');
          allLabels.forEach((lab: any) => {
            const txt = (lab.textContent || '');
            const cleaned = txt.replace(/\(\s*[Xx]?\s*\)\s*/g, '').replace(/\s{2,}/g, ' ').trim();
            lab.textContent = cleaned;
          });

          // Remover ( )/(X) de quaisquer nós de texto dentro do formulário clonado
          const formNode = clonedDoc.querySelector('form');
          if (formNode) {
            const walker = clonedDoc.createTreeWalker(formNode, NodeFilter.SHOW_TEXT, null);
            const toEdit: Text[] = [];
            while (walker.nextNode()) {
              const tn = walker.currentNode as Text;
              if (/\(\s*[Xx]?\s*\)/.test(tn.nodeValue || '')) {
                toEdit.push(tn);
              }
            }
            toEdit.forEach((tn) => {
              tn.nodeValue = (tn.nodeValue || '').replace(/\(\s*[Xx]?\s*\)/g, '').replace(/\s{2,}/g, ' ');
            });
          }

          // Aplicar estilos inline básicos e COMPACTAR para caber em uma folha
          const clonedElement = clonedDoc.querySelector('form');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.backgroundColor = '#f5f5f7';
            (clonedElement as HTMLElement).style.fontFamily = 'Poppins, sans-serif';
            (clonedElement as HTMLElement).style.padding = '0.4rem 0.6rem';
            // Forçar largura próxima à A4 para melhorar proporção no PDF
            (clonedElement as HTMLElement).style.maxWidth = '794px';
            (clonedElement as HTMLElement).style.width = '794px';
          }

          // Converter ID da criança para CAIXA ALTA
          const idCriancaInputs = clonedDoc.querySelectorAll('input[name="idCrianca"]');
          idCriancaInputs.forEach((input: any) => {
            if (input.value) {
              input.value = input.value.toUpperCase();
              input.style.textTransform = 'uppercase';
            }
          });

          // Aplicar estilos compactados mantendo cores
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el: any) => {
            // Compactar seções
            if (el.tagName === 'SECTION') {
              el.style.padding = '0.35rem 0.5rem';
              el.style.marginBottom = '0.3rem';
              el.style.borderRadius = '6px';
            }

            // Títulos compactados mas mantendo gradiente
            if (el.tagName === 'H1') {
              el.style.fontSize = '12px';
              el.style.marginBottom = '0.5rem';
              el.style.padding = '0';
            }

            if (el.tagName === 'H2') {
              el.style.fontSize = '9px';
              el.style.marginBottom = '0.35rem';
              el.style.padding = '0.25rem 0';
            }

            // Inputs com largura controlada
            if (el.tagName === 'INPUT') {
              el.style.padding = '0.2rem 0.3rem';
              el.style.fontSize = '7px';
              el.style.minHeight = '22px';
              el.style.height = '22px';
              el.style.width = 'auto';
              el.style.maxWidth = '100%';
            }

            // Textareas compactados
            if (el.tagName === 'TEXTAREA') {
              el.style.padding = '0.2rem 0.3rem';
              el.style.fontSize = '7px';
              el.style.minHeight = '35px';
              el.style.width = '100%';
            }

            // Labels compactados
            if (el.tagName === 'LABEL') {
              el.style.fontSize = '6.5px';
              el.style.marginBottom = '0.1rem';
            }

            // Ajustar grids e layouts
            const hasGridStyle = el.style.display === 'grid' || el.style.gridTemplateColumns;
            if (hasGridStyle) {
              el.style.gap = '0.3rem';
            }

            // Ajustar divs com twoColumns
            if (el.style.display === 'grid' && el.style.gridTemplateColumns === '1fr 1fr') {
              el.style.gap = '0.3rem';
              el.style.marginBottom = '0.25rem';
            }
          });
        }
      });

      // Criar PDF ajustando para caber com margens e manter proporção
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10; // mm
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      // Cálculo do tamanho renderizado mantendo proporção
      let renderWidth = availableWidth;
      let renderHeight = (canvas.height * renderWidth) / canvas.width;
      if (renderHeight > availableHeight) {
        renderHeight = availableHeight;
        renderWidth = (canvas.width * renderHeight) / canvas.height;
      }

      const x = (pageWidth - renderWidth) / 2;
      const fullImgHeightMm = (canvas.height * renderWidth) / canvas.width; // altura total da imagem na escala escolhida
      let heightLeft = fullImgHeightMm;
      let position = margin;

      // Primeira página
      pdf.addImage(imgData, 'PNG', x, position, renderWidth, fullImgHeightMm);
      heightLeft -= availableHeight;

      // Páginas adicionais
      while (heightLeft > 0) {
        position = margin + (heightLeft - fullImgHeightMm);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', x, position, renderWidth, fullImgHeightMm);
        heightLeft -= availableHeight;
      }

      // Salvar PDF com nome incluindo ID da criança
      const nomeArquivo = formData.idCrianca 
        ? `formulario-coleta-${formData.idCrianca.toUpperCase()}.pdf`
        : 'formulario-coleta-sunrise.pdf';
      pdf.save(nomeArquivo);

      // Remover mensagem de loading
      document.body.removeChild(loadingMsg);

      alert('PDF colorido gerado com sucesso!');
      console.log('Dados do formulário:', formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={styles.form} className="fc-responsive">
      <style>
        {`
          /* Tablet */
          @media (max-width: 1024px) {
            .fc-responsive { padding: 1.25rem 1rem !important; }
            .fc-responsive h1 { font-size: 1.25rem !important; }
            .fc-responsive h2 { font-size: 0.95rem !important; }
            .fc-responsive label { font-size: 0.8rem !important; }
            .fc-responsive input,
            .fc-responsive textarea { font-size: 0.85rem !important; }
            .fc-responsive .submitButton, .fc-responsive .spreadsheetButton { padding: 0.75rem 2rem !important; }
          }

          /* Mobile */
          @media (max-width: 640px) {
            .fc-responsive { padding: 1rem 0.75rem !important; }
            .fc-responsive h1 { font-size: 1.1rem !important; }
            .fc-responsive h2 { font-size: 0.9rem !important; }
            /* Empilhar sessões e colunas */
            .fc-responsive div[style*="grid-template-columns: 1fr 1fr"],
            .fc-responsive div[style*="grid-template-columns: 1fr 1fr 1fr"],
            .fc-responsive div[style*="repeat(4, 1fr)"] {
              display: flex !important;
              flex-direction: column !important;
              gap: 0.6rem !important;
            }
            .fc-responsive .submitContainer { flex-direction: column !important; }
            .fc-responsive .submitButton, .fc-responsive .spreadsheetButton { width: 100% !important; }
            .fc-responsive label { font-size: 0.78rem !important; }
            .fc-responsive input,
            .fc-responsive textarea { font-size: 0.8rem !important; padding: 0.45rem 0.6rem !important; width: 100% !important; box-sizing: border-box; }
          }
        `}
      </style>
      <h1 style={styles.mainTitle}>Formulário de Coleta de dados SUNRISE - Brasil</h1>
      
      {/* Seções lado a lado: Creche/escola e Criança */}
      <div style={styles.row}>
        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>Creche/escola</h2>
          <div style={styles.compactGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID do creche/escola:</label>
              <input
                type="text"
                name="idCreche"
                value={formData.idCreche}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Professor(a):</label>
              <input
                type="text"
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Data da coleta:</label>
              <input
                type="date"
                name="dataColeta"
                value={formData.dataColeta}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome do avaliador(a):</label>
              <input
                type="text"
                name="avaliador"
                value={formData.avaliador}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </section>

        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>Criança</h2>
          <div style={styles.compactGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome da criança:</label>
              <input
                type="text"
                name="nomeCrianca"
                value={formData.nomeCrianca}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID da criança:</label>
              <input
                type="text"
                name="idCrianca"
                value={formData.idCrianca}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Data de nascimento:</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Observação:</label>
              <input
                type="text"
                name="observacaoCrianca"
                value={formData.observacaoCrianca}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Seção: 1. Acelerômetro */}
      <section style={styles.sectionFull}>
        <h2 style={styles.sectionTitle}>1. Acelerômetro</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label}>ID Acelerômetro (Identificação e serial number):</label>
          <input
            type="text"
            name="idAcelerometro"
            value={formData.idAcelerometro}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inlineRow}>
          <div style={styles.inputGroupInline}>
            <label style={styles.label}>Data de colocação: __/__/____</label>
            <input
              type="date"
              name="dataColocacao"
              value={formData.dataColocacao}
              onChange={handleChange}
              style={styles.inputSmall}
            />
          </div>
          <div style={styles.inputGroupInline}>
            <label style={styles.label}>Hora da colocação: __h__min</label>
            <input
              type="time"
              name="horaColocacao"
              value={formData.horaColocacao}
              onChange={handleChange}
              style={styles.inputSmall}
            />
          </div>
          <div style={styles.inputGroupInline}>
            <label style={styles.label}>Data de retirada: __/__/____</label>
            <input
              type="date"
              name="dataRetirada"
              value={formData.dataRetirada}
              onChange={handleChange}
              style={styles.inputSmall}
            />
          </div>
          <div style={styles.inputGroupInline}>
            <label style={styles.label}>Hora da retirada: __h__min</label>
            <input
              type="time"
              name="horaRetirada"
              value={formData.horaRetirada}
              onChange={handleChange}
              style={styles.inputSmall}
            />
          </div>
        </div>
      </section>

      {/* Seções lado a lado: 2. Altura/Peso e 3. Supine Time UP and Go */}
      <div style={styles.row}>
        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>2. Altura/Peso</h2>
          <div style={styles.threeColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Altura 1 (cm)</label>
              <input
                type="number"
                step="0.01"
                name="altura1"
                value={formData.altura1}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Altura 2 (cm)</label>
              <input
                type="number"
                step="0.01"
                name="altura2"
                value={formData.altura2}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Altura 3 (cm)</label>
              <input
                type="number"
                step="0.01"
                name="altura3"
                value={formData.altura3}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.threeColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Peso 1 (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso1"
                value={formData.peso1}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Peso 2 (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso2"
                value={formData.peso2}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Peso 3 (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso3"
                value={formData.peso3}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoAlturaPeso"
              value={formData.observacaoAlturaPeso}
              onChange={handleChange}
              style={styles.textareaSmall}
              placeholder="Altura: Medir a 3ª vez se as primeiras duas medidas diferirem mais de 0,5 cm..."
            />
          </div>
        </section>

        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>3. Supine Time UP and Go – Levantar e Ir</h2>
          <div style={styles.threeColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Treino (seg)</label>
              <input
                type="number"
                step="0.01"
                name="treinoSupine"
                value={formData.treinoSupine}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa 1 (seg)</label>
              <input
                type="number"
                step="0.01"
                name="tentativa1Supine"
                value={formData.tentativa1Supine}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa 2 (seg)</label>
              <input
                type="number"
                step="0.01"
                name="tentativa2Supine"
                value={formData.tentativa2Supine}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoSupine"
              value={formData.observacaoSupine}
              onChange={handleChange}
              style={styles.textareaSmall}
              placeholder="A cada criança é dada uma tentativa treino. O treino é REGISTRADO..."
            />
          </div>
        </section>
      </div>

      {/* Seções lado a lado: 4. Salto horizontal e 5. Equilíbrio */}
      <div style={styles.row}>
        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>4. Salto horizontal</h2>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa 1 (cm)</label>
              <input
                type="number"
                step="0.1"
                name="tentativa1Salto"
                value={formData.tentativa1Salto}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa 2 (cm)</label>
              <input
                type="number"
                step="0.1"
                name="tentativa2Salto"
                value={formData.tentativa2Salto}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoSalto"
              value={formData.observacaoSalto}
              onChange={handleChange}
              style={styles.textareaSmall}
              placeholder="Registre a distância com precisão de cm..."
            />
          </div>
        </section>

        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>5. Equilíbrio em uma perna</h2>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Perna Direita (30 seg)</label>
              <input
                type="number"
                step="0.01"
                name="pernaDireita30"
                value={formData.pernaDireita30}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Perna Esquerda (30 seg)</label>
              <input
                type="number"
                step="0.01"
                name="pernaEsquerda30"
                value={formData.pernaEsquerda30}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoEquilibrio"
              value={formData.observacaoEquilibrio}
              onChange={handleChange}
              style={styles.textareaSmall}
              placeholder="A cada criança é dada UMA tentativa TREINO..."
            />
          </div>
        </section>
      </div>

      {/* Seções lado a lado: 6. Jogo dos 9 Pinos e 7. Dinamômetro */}
      <div style={styles.row}>
        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>6. Jogo dos 9 Pinos</h2>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Treino Direita (seg):</label>
              <input
                type="number"
                step="0.01"
                name="treinoDireita9P"
                value={formData.treinoDireita9P}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa Direita (seg):</label>
              <input
                type="number"
                step="0.01"
                name="tentativaDireita9P"
                value={formData.tentativaDireita9P}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Treino Esquerda (seg):</label>
              <input
                type="number"
                step="0.01"
                name="treinoEsquerda9P"
                value={formData.treinoEsquerda9P}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa Esquerda (seg):</label>
              <input
                type="number"
                step="0.01"
                name="tentativaEsquerda9P"
                value={formData.tentativaEsquerda9P}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacao9Pinos"
              value={formData.observacao9Pinos}
              onChange={handleChange}
              style={styles.textareaSmall}
              placeholder="Registre o tempo com precisão de 0,01s..."
            />
          </div>
        </section>

        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>7. Dinamômetro – Preensão Manual</h2>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa Direita 1 (kg):</label>
              <input
                type="number"
                step="0.1"
                name="tentativaDireita1Din"
                value={formData.tentativaDireita1Din}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa Esquerda 1 (kg):</label>
              <input
                type="number"
                step="0.1"
                name="tentativaEsquerda1Din"
                value={formData.tentativaEsquerda1Din}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa Direita 2 (kg):</label>
              <input
                type="number"
                step="0.1"
                name="tentativaDireita2Din"
                value={formData.tentativaDireita2Din}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tentativa Esquerda 2 (kg):</label>
              <input
                type="number"
                step="0.1"
                name="tentativaEsquerda2Din"
                value={formData.tentativaEsquerda2Din}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoDinamometro"
              value={formData.observacaoDinamometro}
              onChange={handleChange}
              style={styles.textareaSmall}
              placeholder="Registre a força com precisão de 0,5 kg..."
            />
          </div>
        </section>
      </div>

      {/* Seções lado a lado: 8. Mr. Ant e 9. Go-No Go */}
      <div style={styles.row}>
        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>8. Mr. Ant – Sr. Formiga</h2>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Point score:</label>
              <input
                type="number"
                name="pointScore"
                value={formData.pointScore}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Classificação:</label>
              <div style={styles.checkboxInline}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.classificacaoAnt === 'abaixo'}
                    onChange={() => setFormData({ ...formData, classificacaoAnt: formData.classificacaoAnt === 'abaixo' ? '' : 'abaixo' })}
                    style={styles.checkbox}
                  />
                  abaixo do esperado
                </label>
              </div>
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>n. de tentativas corretas:</label>
              <input
                type="number"
                name="numTentativasCorretas"
                value={formData.numTentativasCorretas}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>&nbsp;</label>
              <div style={styles.checkboxInline}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.classificacaoAnt === 'dentro'}
                    onChange={() => setFormData({ ...formData, classificacaoAnt: formData.classificacaoAnt === 'dentro' ? '' : 'dentro' })}
                    style={styles.checkbox}
                  />
                  dentro do esperado
                </label>
              </div>
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Horário Término:</label>
              <input
                type="time"
                name="horarioTerminoAnt"
                value={formData.horarioTerminoAnt}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>&nbsp;</label>
              <div style={styles.checkboxInline}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={false}
                    readOnly
                    style={styles.checkbox}
                  />
                  abaixo do esperado
                </label>
              </div>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoAnt"
              value={formData.observacaoAnt}
              onChange={handleChange}
              style={styles.textareaSmall}
            />
          </div>
        </section>

        <section style={styles.sectionHalf}>
          <h2 style={styles.sectionTitle}>9. Go-No Go (peixe e tubarão)</h2>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>% Go (precisão tocar):</label>
              <input
                type="number"
                step="0.01"
                name="precisaoGo"
                value={formData.precisaoGo}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Classificação:</label>
              <div style={styles.checkboxInline}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.classificacaoGo === 'abaixo'}
                    onChange={() => setFormData({ ...formData, classificacaoGo: formData.classificacaoGo === 'abaixo' ? '' : 'abaixo' })}
                    style={styles.checkbox}
                  />
                  abaixo do esperado
                </label>
              </div>
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>% No/Go (precisão tocar):</label>
              <input
                type="number"
                step="0.01"
                name="precisaoNoGo"
                value={formData.precisaoNoGo}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>&nbsp;</label>
              <div style={styles.checkboxInline}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.classificacaoGo === 'dentro'}
                    onChange={() => setFormData({ ...formData, classificacaoGo: formData.classificacaoGo === 'dentro' ? '' : 'dentro' })}
                    style={styles.checkbox}
                  />
                  dentro do esperado
                </label>
              </div>
            </div>
          </div>
          <div style={styles.twoColumns}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Horário Término:</label>
              <input
                type="time"
                name="horarioTerminoGo"
                value={formData.horarioTerminoGo}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>&nbsp;</label>
              <div style={styles.checkboxInline}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={false}
                    readOnly
                    style={styles.checkbox}
                  />
                  abaixo do esperado
                </label>
              </div>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>IC:</label>
            <input
              type="text"
              name="icGo"
              value={formData.icGo}
              onChange={handleChange}
              style={{ ...styles.input, maxWidth: '80px' }}
              maxLength={2}
              placeholder="00"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Observação:</label>
            <textarea
              name="observacaoGoNoGo"
              value={formData.observacaoGoNoGo}
              onChange={handleChange}
              style={styles.textareaSmall}
            />
          </div>
        </section>
      </div>

      {/* Seção: Comentários */}
      <section style={styles.sectionFull}>
        <h2 style={styles.sectionTitle}>Comentários</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Comentários:</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            style={styles.textareaSmall}
          />
        </div>
      </section>

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
    fontFamily: "'Poppins', sans-serif"
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  sectionHalf: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
  },
  sectionFull: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    marginBottom: '1rem'
  },
  sectionTitle: {
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '600'
  },
  compactGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  threeColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  inlineRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    marginTop: '0.75rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  inputGroupInline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  label: {
    color: '#333',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    minHeight: '36px'
  },
  inputSmall: {
    padding: '0.4rem 0.6rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    minHeight: '32px'
  },
  textareaSmall: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    minHeight: '60px',
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
  },
  checkboxInline: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '36px'
  },
  checkboxLabelInline: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    color: '#333',
    fontWeight: '400'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#613789',
    marginRight: '-0.25rem'
  }
};
