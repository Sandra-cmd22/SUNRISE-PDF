import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



export default function QuestionarioPais() {
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    // Identificação da região
    regiao: '',
    area: '',
    formaAplicacao: '',
    nomeEntrevistador: '',
    // Identificação da criança
    nomeCrianca: '',
    horarioEntrada: '',
    horarioSaida: '',
    nomeCreche: '',
    idCreche: '',
    idCrianca: '',
    nomeResponsavel: '',
    endereco: '',
    telefone: '',
    email: '',
    // Informações da criança
    q1DataNascimento: '',
    q2Idade: '',
    q3Relacao: '',
    q3OutroEspecificar: '',
    q4Sexo: '',
    q5EnderecoCompleto: '',
    q6DataNascimentoResp: '',
    q7IdadeResp: '',
    q8Escolaridade: '',
    q9aCategoria: '',
    q9aOutra: '',
    q9bNascimento: '',
    // Atividade física
    q10Participou: '',
    q11HorasSemana: '',
    q11MinutosSemana: '',
    q12HorasFimSemana: '',
    q12MinutosFimSemana: '',
    q13HorasSemana: '',
    q13MinutosSemana: '',
    q14HorasFimSemana: '',
    q14MinutosFimSemana: '',
    q15aSaiu: '',
    q15bOnde: [] as string[],
    q15bOutro: '',
    q15bOutroLugar: '',
    q15cMotivos: [] as string[],
    q15cOutro: '',
    q16Horas: '',
    q16Minutos: '',
    q17Frequencia: '',
    q18Frequencia: '',
    q19Frequencia: '',
    q20Frequencia: '',
    q21Frequencia: '',
    q22Frequencia: '',
    q23Frequencia: '',
    q24Frequencia: '',
    q25Utiliza: '',
    q25aTempo: '',
    q26Possui: '',
    q26aConcordancia: '',
    q26bIdade: '',
    q27Horas: '',
    q27Minutos: '',
    q28aCochila: '',
    q28aInicioHr: '',
    q28aInicioMin: '',
    q28aFimHr: '',
    q28aFimMin: '',
    q29aConsistente: '',
    q29bRotina: '',
    q30aHr: '',
    q30aMin: '',
    q30bHr: '',
    q30bMin: '',
    q31Qualidade: '',
    q32aNaoDormiu: '',
    q32bMotivos: [] as string[],
    q32b1Outro: '',
    q33aSozinha: '',
    q33bOutrasCriancas: '',
    q33b1Criancas: '',
    q33b2Adultos: '',
    q33cCriancas: '',
    q33c1Criancas: '',
    q33c2Adultos: '',
    q34Frequencia: '',
    // Fontes alimentares
    q35DaDinheiro: '',
    q35bDias: '',
    q36aLevaComida: '',
    q36bCafeManha: '',
    q36bAlmoco: '',
    q36bJantar: '',
    q36bLanches: '',
    q37DietaEspecial: '',
    q37aEspecifique: '',
    // Diversidade alimentar
    q38Graos: '',
    q38Leguminosas: '',
    q38Lacticinios: '',
    q38Carnes: '',
    q38Ovos: '',
    q38FrutasVitaminaA: '',
    q38OutrasFrutas: '',
    // Comportamento alimentar
    q39FrequenciaTV: '',
    q40FrequenciaMesa: '',
    q41FrequenciaFamilia: '',
    q42FrequenciaDiferentes: '',
    q43FrequenciaLanches: '',
    q44Frequencia: '',
    // Insegurança alimentar
    q45aFicouSemDinheiro: '',
    q45bReducaoRefeicoes: '',
    q45cForaComFome: '',
    q46Comentarios: '',
    q47DataAplicacao: '',
    // ECD - Desenvolvimento primeira infância
    ecd1Andar: '',
    ecd2SaltarLevantando: '',
    ecd3Vestir: '',
    ecd4Abotoar: '',
    ecd5Dizer10: '',
    ecd6Frases3: '',
    ecd7Frases5: '',
    ecd8UtilizarCorretamente: '',
    ecd9MostrarObjeto: '',
    ecd10Reconhecer5Letras: '',
    ecd11EscreverNome: '',
    ecd12Reconhecer1a5: '',
    ecd13Pedir3Objetos: '',
    ecd14Contar10: '',
    ecd15Executar: '',
    ecd16Perguntar: '',
    ecd17Oferecer: '',
    ecd18DarBem: '',
    ecd19Frequencia: '',
    ecd20Comparacao: '',
    comentariosFinais: '',
    dataAplicacaoFinal: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxToggle = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [field]: newArray });
  };

  const handleEnviarPlanilha = async () => {
    try {
      // Preparar dados para envio
      const dadosParaPlanilha = {
        timestamp: new Date().toISOString(),
        ...Object.keys(formData).reduce((acc, key) => {
          const value = formData[key as keyof typeof formData];
          if (Array.isArray(value)) {
            acc[key] = value.join('; ');
          } else {
            acc[key] = String(value ?? '');
          }
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
      link.setAttribute('download', `questionario-pais-${formData.idCrianca || 'dados'}.csv`);
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
      loadingMsg.textContent = 'Gerando PDF de todas as páginas...';
      document.body.appendChild(loadingMsg);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10; // mm

      // Salvar a página atual
      const originalPage = currentPage;

      // Iterar por todas as páginas
      for (let page = 1; page <= 8; page++) {
        setCurrentPage(page);
        
        // Aguardar um momento para a renderização
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capturar a página atual como canvas
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
              // Forçar largura próxima à A4 para melhorar proporção no PDF
              (clonedElement as HTMLElement).style.maxWidth = '794px';
              (clonedElement as HTMLElement).style.width = '794px';
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

            // Remover parênteses de labels de checkbox/radio
            const allLabels = clonedDoc.querySelectorAll('label');
            allLabels.forEach((lab: any) => {
              const txt = (lab.textContent || '');
              const cleaned = txt.replace(/\(\s*[Xx]?\s*\)\s*/g, '').replace(/\s{2,}/g, ' ').trim();
              lab.textContent = cleaned;
            });

            // Limpar ( )/(X) restantes em nós de texto dentro do formulário
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

            // Garantir que os valores dos campos apareçam no PDF (substituir por spans)
            const fields = clonedDoc.querySelectorAll('input, textarea, select');
            fields.forEach((el: any) => {
              if (el.tagName === 'TEXTAREA') {
                const val = el.value || '';
                el.value = val;
                el.textContent = val;
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
          },
          ignoreElements: (element) => {
            // Ignorar elementos que possam ter cores oklch problemáticas
            return false;
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;
        let renderWidth = availableWidth;
        let renderHeight = (canvas.height * renderWidth) / canvas.width;
        if (renderHeight > availableHeight) {
          renderHeight = availableHeight;
          renderWidth = (canvas.width * renderHeight) / canvas.height;
        }
        const x = (pageWidth - renderWidth) / 2;
        const fullImgHeightMm = (canvas.height * renderWidth) / canvas.width;
        let heightLeft = fullImgHeightMm;
        let position = margin;

        // Se não for a primeira iteração, adicionar nova página
        if (page > 1) {
          pdf.addPage();
        }

        // Adicionar imagem da página com margens e proporção
        pdf.addImage(imgData, 'PNG', x, position, renderWidth, fullImgHeightMm);
        heightLeft -= availableHeight;

        // Se a página for muito longa, adicionar páginas extras
        while (heightLeft > 0) {
          position = margin + (heightLeft - fullImgHeightMm);
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', x, position, renderWidth, fullImgHeightMm);
          heightLeft -= availableHeight;
        }
      }

      // Restaurar a página original
      setCurrentPage(originalPage);

      // Salvar PDF
      pdf.save('questionario-pais-sunrise.pdf');

      // Remover mensagem de loading
      document.body.removeChild(loadingMsg);

      alert('PDF gerado com sucesso com todas as 8 páginas!');
      console.log('Dados do formulário:', formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
      // Remover mensagem de loading em caso de erro
      const loadingMsg = document.querySelector('div[style*="position: fixed"]');
      if (loadingMsg) document.body.removeChild(loadingMsg);
    }
  };

  const nextPage = () => {
    if (currentPage < 8) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={styles.form} className="qp-responsive">
      <style>
        {`
          /* Tablet */
          @media (max-width: 1024px) {
            .qp-responsive { padding: 1.25rem 1rem !important; }
            .qp-responsive h1 { font-size: 1.1rem !important; }
            .qp-responsive h2 { font-size: 0.9rem !important; }
            .qp-responsive label { font-size: 0.8rem !important; }
            .qp-responsive input,
            .qp-responsive textarea { font-size: 0.8rem !important; padding: 0.45rem 0.5rem !important; }
            .qp-responsive .checkboxRow { gap: 0.6rem !important; }
            .qp-responsive .checkboxColumn { gap: 0.4rem !important; }
            .qp-responsive .timeInput { gap: 0.2rem !important; }
            .qp-responsive .navButton { padding: 0.6rem 1.1rem !important; font-size: 0.85rem !important; }
          }

          /* Ajuste para checkboxes em telas pequenas */
          @media (max-width: 645px) {
            .qp-responsive label[style*="checkboxLabelInline"],
            .qp-responsive label[style*="checkboxLabelBlock"] {
              display: flex !important;
              align-items: center !important;
              gap: 0.5rem !important;
            }
            .qp-responsive input[type="checkbox"] {
              flex-shrink: 0 !important;
              margin: 0 !important;
              vertical-align: middle !important;
            }
          }

          /* Mobile */
          @media (max-width: 640px) {
            .qp-responsive { padding: 1rem 0.75rem !important; }
            .qp-responsive h1 { font-size: 1rem !important; }
            .qp-responsive h2 { font-size: 0.85rem !important; }
            .qp-responsive .${''}section { padding: 0.75rem !important; }
            .qp-responsive label { font-size: 0.78rem !important; }
            .qp-responsive input,
            .qp-responsive textarea { width: 100% !important; font-size: 0.78rem !important; padding: 0.4rem 0.5rem !important; }
            .qp-responsive .checkboxRow { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }
            .qp-responsive .checkboxColumn { gap: 0.35rem !important; }
            .qp-responsive .timeInput { flex-direction: column !important; align-items: flex-start !important; gap: 0.3rem !important; }
            .qp-responsive .navigation { flex-direction: column !important; gap: 0.75rem !important; }
            .qp-responsive .navButton { width: 100% !important; text-align: center !important; }
            .qp-responsive .pageIndicator { order: -1; }
          }
        `}
      </style>
      {/* Logos removidos conforme solicitado */}

      <h1 style={styles.mainTitle}>QUESTIONÁRIO – PAIS/RESPONSÁVEL</h1>

      {/* Página 1 */}
      {currentPage === 1 && (
        <div>
          {/* Identificação da região */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>IDENTIFICAÇÃO DA REGIÃO E FORMA DE APLICAÇÃO</h2>
            
            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Região:</label>
              <div style={styles.checkboxRow}>
                {['Sudeste', 'Sul', 'Nordeste', 'Norte', 'Centro-Oeste'].map(opcao => (
                  <label key={opcao} style={styles.checkboxLabelInline}>
                    <input
                      type="checkbox"
                      checked={formData.regiao === opcao}
                      onChange={() => handleInputChange('regiao', formData.regiao === opcao ? '' : opcao)}
                      style={styles.checkbox}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Área:</label>
              <div style={styles.checkboxRow}>
                {['urbana', 'rural'].map(opcao => (
                  <label key={opcao} style={styles.checkboxLabelInline}>
                    <input
                      type="checkbox"
                      checked={formData.area === opcao}
                      onChange={() => handleInputChange('area', formData.area === opcao ? '' : opcao)}
                      style={styles.checkbox}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Forma de aplicação:</label>
              <div style={styles.checkboxRow}>
                {['presencial', 'telefone'].map(opcao => (
                  <label key={opcao} style={styles.checkboxLabelInline}>
                    <input
                      type="checkbox"
                      checked={formData.formaAplicacao === opcao}
                      onChange={() => handleInputChange('formaAplicacao', formData.formaAplicacao === opcao ? '' : opcao)}
                      style={styles.checkbox}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Nome do entrevistador/avaliador:</label>
              <input
                type="text"
                value={formData.nomeEntrevistador}
                onChange={(e) => handleInputChange('nomeEntrevistador', e.target.value)}
                style={styles.input}
              />
            </div>
          </section>

          {/* Identificação da criança */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>IDENTIFICAÇÃO DA CRIANÇA</h2>
            
            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Nome da criança:</label>
              <input
                type="text"
                value={formData.nomeCrianca}
                onChange={(e) => handleInputChange('nomeCrianca', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Horário da creche/escola da criança:</label>
              <div style={styles.horarioRow}>
                <span>entrada: </span>
                <input
                  type="text"
                  value={formData.horarioEntrada}
                  onChange={(e) => handleInputChange('horarioEntrada', e.target.value)}
                  style={styles.inputSmall}
                  placeholder="__h__min"
                />
                <span>saída: </span>
                <input
                  type="text"
                  value={formData.horarioSaida}
                  onChange={(e) => handleInputChange('horarioSaida', e.target.value)}
                  style={styles.inputSmall}
                  placeholder="__h__min"
                />
              </div>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Nome da Creche/Escola:</label>
              <input
                type="text"
                value={formData.nomeCreche}
                onChange={(e) => handleInputChange('nomeCreche', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>ID da Creche/Escola:</label>
              <input
                type="text"
                value={formData.idCreche}
                onChange={(e) => handleInputChange('idCreche', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>ID da criança:</label>
              <input
                type="text"
                value={formData.idCrianca}
                onChange={(e) => handleInputChange('idCrianca', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Nome do responsável:</label>
              <input
                type="text"
                value={formData.nomeResponsavel}
                onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Endereço de residência:</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Telefone (DDD):</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={styles.input}
              />
            </div>
          </section>

          {/* Informações da criança */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>INFORMAÇÕES DA CRIANÇA E DO RESPONSÁVEL</h2>
            
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                Este questionário deve ser respondido por um responsável que more na mesma casa da criança participante no estudo. O
                responsável pela criança será aquele que a acompanhe, cuide diariamente e more na mesma casa que ela. Se a
                guarda for compartilhada, o responsável deverá responder do questionário de acordo com o que é comum, o que
                ocorre com maior frequência no tempo em que está com a criança; sem se preocupar com a rotina na casa do outro
                responsável. Anotar a guarda compartilhada nos comentários.
              </p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>1. Qual é a data de nascimento da criança (dia/mês/ano)?</label>
              <input
                type="date"
                value={formData.q1DataNascimento}
                onChange={(e) => handleInputChange('q1DataNascimento', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                2. Se a data de nascimento for desconhecida, qual é a idade da criança em anos (idade em anos completos)?
              </label>
              <input
                type="number"
                value={formData.q2Idade}
                onChange={(e) => handleInputChange('q2Idade', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>3. Qual a relação do responsável com a criança que participa do estudo?</label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'mae', label: '( 1 ) Mãe' },
                  { value: 'pai', label: '( 2 ) Pai' },
                  { value: 'avo', label: '( 3 ) Avó' },
                  { value: 'avoo', label: '( 4 ) Avô' },
                  { value: 'legal', label: '( 5 ) Responsável Legal' },
                  { value: 'outro', label: '( 6 ) Outro' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input
                      type="checkbox"
                      checked={formData.q3Relacao === opcao.value}
                      onChange={() => handleInputChange('q3Relacao', formData.q3Relacao === opcao.value ? '' : opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
              {formData.q3Relacao === 'outro' && (
                <input
                  type="text"
                  value={formData.q3OutroEspecificar}
                  onChange={(e) => handleInputChange('q3OutroEspecificar', e.target.value)}
                  style={styles.input}
                  placeholder="(especifique)"
                />
              )}
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                4. Qual é o sexo da criança? ( 1 ) Masculino ( 2 ) Feminino ( 88 ) Prefere não responder
              </label>
              <div style={styles.checkboxRow}>
                {[
                  { value: 'masculino', label: '( 1 ) Masculino' },
                  { value: 'feminino', label: '( 2 ) Feminino' },
                  { value: 'prefere_nao', label: '( 88 ) Prefere não responder' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelInline}>
                    <input
                      type="checkbox"
                      checked={formData.q4Sexo === opcao.value}
                      onChange={() => handleInputChange('q4Sexo', formData.q4Sexo === opcao.value ? '' : opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
              <p style={styles.note}>Nota: verificar se é o mesmo sexo do termo de consentimento</p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>5. Qual é seu endereço completo com CEP?</label>
              <textarea
                value={formData.q5EnderecoCompleto}
                onChange={(e) => handleInputChange('q5EnderecoCompleto', e.target.value)}
                style={styles.textarea}
              />
            </div>
          </section>
        </div>
      )}

      {/* Página 2 */}
      {currentPage === 2 && (
        <div>
          <section style={styles.section}>
            <div style={styles.question}>
              <label style={styles.questionLabel}>
                6. Qual é a data de nascimento do responsável pela criança(dia/mês/ano)?
              </label>
              <input
                type="date"
                value={formData.q6DataNascimentoResp}
                onChange={(e) => handleInputChange('q6DataNascimentoResp', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                7. Se o responsável não souber a data de nascimento, qual é a idade (anos)?
              </label>
              <input
                type="number"
                value={formData.q7IdadeResp}
                onChange={(e) => handleInputChange('q7IdadeResp', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                8. Qual é o grau de escolaridade completo mais alto atingido por um dos responsáveis da criança que viva na mesma casa
                da criança?
              </label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'sem', label: '( 1 ) Sem escolaridade' },
                  { value: 'fund1', label: '( 2 ) Ensino FUNDAMENTAL I (1º ao 5º ano / primário: 1ª a 4ª série/1º grau)' },
                  { value: 'fund2', label: '( 3 ) Ensino FUNDAMENTAL II (6º ao 9º ano/ ginásio: 6ª a 8ª série/1º grau)' },
                  { value: 'medio', label: '( 4 ) Ensino MÉDIO (Colegial/2º grau)' },
                  { value: 'tecnico', label: '( 5 ) Ensino TÉCNICO' },
                  { value: 'superior', label: '( 6 ) Ensino SUPERIOR' },
                  { value: 'nao_sabe', label: '( 88 ) Não sabe' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input
                      type="checkbox"
                      checked={formData.q8Escolaridade === opcao.value}
                      onChange={() => handleInputChange('q8Escolaridade', formData.q8Escolaridade === opcao.value ? '' : opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                9a. Na nossa sociedade, as pessoas são geralmente descritas pela sua cor da pele ou identificação racial. Nossa raça pode
                influenciar a forma como somos tratados por outras pessoas e instituições e afetar a nossa saúde. Qual categoria (OU
                CATEGORIAS) melhor descreve a respeito da sua criança?Assinale todas que se aplicarem:
              </label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'preto', label: '( 1 ) Preto' },
                  { value: 'branco', label: '( 2 ) Branco' },
                  { value: 'pardo', label: '( 3 ) Pardo' },
                  { value: 'amarelo', label: '( 4 ) Amarelo' },
                  { value: 'indigena', label: '( 5 ) Indígena' },
                  { value: 'nao_sei', label: '( 9 ) Não sei' },
                  { value: 'prefere_nao', label: '( 10 ) Prefere não responder' },
                  { value: 'outra', label: '( 11 ) Outra categoria' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input
                      type="checkbox"
                      checked={formData.q9aCategoria === opcao.value}
                      onChange={() => handleInputChange('q9aCategoria', formData.q9aCategoria === opcao.value ? '' : opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
              {formData.q9aCategoria === 'outra' && (
                <input
                  type="text"
                  value={formData.q9aOutra}
                  onChange={(e) => handleInputChange('q9aOutra', e.target.value)}
                  style={styles.input}
                  placeholder="(especificar)"
                />
              )}
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>9b. Onde os pais da criança nasceram?</label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'dois_brasil', label: '( 1 ) Os dois nasceram no Brasil' },
                  { value: 'um_5anos', label: '( 2 ) Pelo menos um dos pais nasceu fora do Brasil e se mudou para o Brasil há menos de 5 anos' },
                  { value: 'um_5_10', label: '( 3 ) Pelo menos um dos pais nasceu fora do Brasil e se mudou para o Brasil entre 5 e 10 anos' },
                  { value: 'um_mais10', label: '( 4 ) Pelo menos um dos pais nasceu fora do Brasil e se mudou para o Brasil há mais de 10 anos' },
                  { value: 'nao_sabe', label: '( 88 ) Não sabe/prefere não responder' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input
                      type="checkbox"
                      checked={formData.q9bNascimento === opcao.value}
                      onChange={() => handleInputChange('q9bNascimento', formData.q9bNascimento === opcao.value ? '' : opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>ATIVIDADE FÍSICA, COMPORTAMENTO SEDENTÁRIO, TEMPO DE TELA E SONO</h2>
            
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                As próximas perguntas são direcionadas ao comportamento da criança (atividade física, tempo de tela,
                comportamento sedentário e sono). Por favor, informe as <strong>horas e minutos diários</strong> para todas as questões. Exemplo: 1 hora
                e 30 minutos.
              </p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                10. Na última semana, nos dias que você e a sua criança de 3 ou 4 anos que participa deste estudo estiveram juntos, a criança
                passou mais de uma hora seguida sentada em um carro, em um carrinho de bebê ou na garupa de uma moto?
              </label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.q10Participou === 'sim'}
                    onChange={() => handleInputChange('q10Participou', formData.q10Participou === 'sim' ? '' : 'sim')}
                    style={styles.checkbox}
                  />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.q10Participou === 'nao'}
                    onChange={() => handleInputChange('q10Participou', formData.q10Participou === 'nao' ? '' : 'nao')}
                    style={styles.checkbox}
                  />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                11. Durante <strong>um dia típico de semana (um dia normal de segunda a sexta-feira)</strong>, quanto tempo a sua criança passa como
                passageiro de um carro, de um ônibus, de uma moto ou garupa de uma bicicleta?
              </label>
              <div style={styles.timeInput}>
                <span>Número de horas e minutos: </span>
                <input
                  type="text"
                  value={formData.q11HorasSemana}
                  onChange={(e) => handleInputChange('q11HorasSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>h</span>
                <input
                  type="text"
                  value={formData.q11MinutosSemana}
                  onChange={(e) => handleInputChange('q11MinutosSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                12. Durante <strong>um dia típico de final de semana (um dia normal de sábado ou domingo)</strong>, quanto tempo a sua criança passa
                como passageiro de um carro, de um ônibus, de uma moto ou garupa de uma bicicleta?
              </label>
              <div style={styles.timeInput}>
                <span>Número de horas e minutos: </span>
                <input
                  type="text"
                  value={formData.q12HorasFimSemana}
                  onChange={(e) => handleInputChange('q12HorasFimSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>h</span>
                <input
                  type="text"
                  value={formData.q12MinutosFimSemana}
                  onChange={(e) => handleInputChange('q12MinutosFimSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                13. Durante <strong>um dia típico de semana (um dia normal de segunda a sexta-feira)</strong>, quanto tempo a sua criança
                passa/permanece fora de casa? POR EXEMPLO, FICOU O PERÍODO DA MANHÃ NA CASA DA AVÓ E O PERÍODO DA
                TARDE NA ESCOLA, ASSIM, FICANDO 16 HORAS FORA DE CASA.
              </label>
              <div style={styles.timeInput}>
                <input
                  type="text"
                  value={formData.q13HorasSemana}
                  onChange={(e) => handleInputChange('q13HorasSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>hrs</span>
                <input
                  type="text"
                  value={formData.q13MinutosSemana}
                  onChange={(e) => handleInputChange('q13MinutosSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                14. Durante <strong>um dia típico de final de semana (um dia normal de sábado ou domingo)</strong>, quanto tempo a sua criança
                passa/permanece fora de casa? POR EXEMPLO, FICOU O PERÍODO DA MANHÃ NA CASA DOS AVÓS (DAS 9H
                ÀS 12H) E À NOITE PERMANECEU OS PAIS NO MERCADO (2H), TOTALIZANDO 5 HORAS.
              </label>
              <div style={styles.timeInput}>
                <input
                  type="text"
                  value={formData.q14HorasFimSemana}
                  onChange={(e) => handleInputChange('q14HorasFimSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>hrs</span>
                <input
                  type="text"
                  value={formData.q14MinutosFimSemana}
                  onChange={(e) => handleInputChange('q14MinutosFimSemana', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                15a. Nos últimos três dias, a sua criança saiu de casa para brincar? (ou sozinha, ou com um adulto, ou com outra criança)?
              </label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.q15aSaiu === 'sim'}
                    onChange={() => handleInputChange('q15aSaiu', formData.q15aSaiu === 'sim' ? '' : 'sim')}
                    style={styles.checkbox}
                  />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input
                    type="checkbox"
                    checked={formData.q15aSaiu === 'nao'}
                    onChange={() => handleInputChange('q15aSaiu', formData.q15aSaiu === 'nao' ? '' : 'nao')}
                    style={styles.checkbox}
                  />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>15b. Se sim, onde a sua criança foi?</label>
              <p style={styles.subLabel}>Selecione quantas respostas considerar adequadas:</p>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'casa', label: '( 1 ) Na própria casa (jardim, quintal)' },
                  { value: 'amigo', label: '( 2 ) Para a casa de um amigo/parente' },
                  { value: 'parque', label: '( 3 ) Para um parque, uma praça ou playground (parquinho)' },
                  { value: 'piscina', label: '( 4 ) Para uma piscina, rio, barragem, praia' },
                  { value: 'rua', label: '( 5 ) Para a rua' },
                  { value: 'floresta', label: '( 6 ) Para uma floresta, ambiente de natureza' },
                  { value: 'outro', label: '( 7 ) Para outro lugar?' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input
                      type="checkbox"
                      checked={formData.q15bOnde.includes(opcao.value)}
                      onChange={() => handleCheckboxToggle('q15bOnde', opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
              {formData.q15bOnde.includes('outro') && (
                <input
                  type="text"
                  value={formData.q15bOutro}
                  onChange={(e) => handleInputChange('q15bOutro', e.target.value)}
                  style={styles.input}
                  placeholder="(especificar)"
                />
              )}
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>15b₁. Algum outro lugar não mencionado?</label>
              <input
                type="text"
                value={formData.q15bOutroLugar}
                onChange={(e) => handleInputChange('q15bOutroLugar', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                15c. Nos últimos três dias, a sua criança <strong>Não foi/Não teve permissão para ir/Não</strong> foi levada para brincar fora de casa por causa
                de <strong>(selecione quantas respostas considerar adequadas)</strong>:
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Página 3 */}
      {currentPage === 3 && (
        <div>
          <section style={styles.section}>
            <div style={styles.question}>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'calor', label: '( 1 ) Calor' },
                  { value: 'frio', label: '( 2 ) Frio' },
                  { value: 'chuva', label: '( 3 ) Chuva' },
                  { value: 'poluicao_ar', label: '( 4 ) Poluição do ar (com fumaça, ou escura, ou com fedor)' },
                  { value: 'poluicao_agua', label: '( 5 ) Poluição da água' },
                  { value: 'barulho', label: '( 6 ) Barulho ou aglomeração' },
                  { value: 'lixo', label: '( 7 ) Lixo, rua' },
                  { value: 'agitacao', label: '( 8 ) Agitação social (inquietação social, manifestações, por exemplo)' },
                  { value: 'violencia', label: '( 9 ) Perigos com violência (crimes e sequestros)' },
                  { value: 'trafego', label: '( 10 ) Perigos com tráfego de carros' },
                  { value: 'outro_motivo', label: '( 11 ) Algum outro motivo não mencionado' },
                  { value: 'nao_relevante', label: '( 12 ) Não relevante' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input
                      type="checkbox"
                      checked={formData.q15cMotivos.includes(opcao.value)}
                      onChange={() => handleCheckboxToggle('q15cMotivos', opcao.value)}
                      style={styles.checkbox}
                    />
                    {opcao.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>15c₁. Algum outro motivo não mencionado? (por favor, especifique)</label>
              <input
                type="text"
                value={formData.q15cOutro}
                onChange={(e) => handleInputChange('q15cOutro', e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                16. Num período de 24 horas da última semana, quanto tempo a sua criança de 3 ou 4 anos que participa do estudo passou
                sentada ou deitada usando qualquer dispositivo de tela eletrônico (como celular, tablet, vídeo game) para assistir televisão ou
                filmes, ou vídeos na internet? Por favor, registre o resultado com a maior precisão possível.
              </label>
              <div style={styles.timeInput}>
                <span>Número de horas e minutos: </span>
                <input
                  type="text"
                  value={formData.q16Horas}
                  onChange={(e) => handleInputChange('q16Horas', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>h</span>
                <input
                  type="text"
                  value={formData.q16Minutos}
                  onChange={(e) => handleInputChange('q16Minutos', e.target.value)}
                  style={styles.inputTime}
                  placeholder="__"
                />
                <span>min</span>
              </div>
            </div>

            {[
              { num: '17', text: 'Com qual frequência você usa um dispositivo eletrônico com tela para educar a sua criança?', field: 'q17Frequencia' },
              { num: '18', text: 'Com qual frequência você usa dispositivo eletrônico com tela para acalmar a sua criança quando ela está chateada?', field: 'q18Frequencia' },
              { num: '19', text: 'Com qual frequência você usa dispositivo eletrônico com tela para manter a sua criança ocupada enquanto você faz as suas coisas?', field: 'q19Frequencia' },
              { num: '20', text: 'Com qual frequência você usa o celular para fazer chamadas, escrever mensagens, verificar e-mail ou assistir vídeos durante as refeições com a sua criança?', field: 'q20Frequencia' },
              { num: '21', text: 'Com qual frequência você usa o celular para fazer chamadas, escrever mensagens, verificar e-mail ou assistir vídeos durante as brincadeiras com a sua criança?', field: 'q21Frequencia' },
              { num: '22', text: 'Com qual frequência você usa o celular para fazer chamadas, escrever mensagens, verificar e-mail ou assistir vídeos durante momentos de lazer/viagens com a sua criança?', field: 'q22Frequencia' },
              { num: '23', text: 'Com qual frequência você usa o celular para fazer chamadas, escrever mensagens, verificar e-mail ou assistir vídeos enquanto caminha com a sua criança?', field: 'q23Frequencia' },
              { num: '24', text: 'Com que frequência você usa o celular para fazer chamadas, escrever mensagens, verificar e-mail ou assistir vídeos durante a rotina em que a sua criança vai dormir?', field: 'q24Frequencia' }
            ].map(questao => (
              <div key={questao.num} style={styles.question}>
                <label style={styles.questionLabel}>{questao.num}. {questao.text}</label>
                <div style={styles.checkboxColumn}>
                  {[
                    { value: 'nunca', label: '( 1 ) Nunca' },
                    { value: 'menos_uma', label: '( 2 ) Menos do que uma vez por semana' },
                    { value: 'uma_vez', label: '( 3 ) Uma vez por semana' },
                    { value: 'maioria', label: '( 4 ) Na maioria dos dias' },
                    { value: 'todos', label: '( 5 ) Todos os dias' },
                    { value: 'nao_sei', label: '( 88 ) Não sei' }
                  ].map(opcao => (
                    <label key={opcao.value} style={styles.checkboxLabelBlock}>
                      <input
                        type="checkbox"
                        checked={formData[questao.field as keyof typeof formData] === opcao.value}
                        onChange={() => handleInputChange(questao.field, formData[questao.field as keyof typeof formData] === opcao.value ? '' : opcao.value)}
                        style={styles.checkbox}
                      />
                      {opcao.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={styles.question}>
              <label style={styles.questionLabel}>
                25. A sua criança utiliza equipamentos eletrônicos de tela (por exemplo, televisão, videogame, computador, tablet ou
                smartphone/celular) duas horas antes de ir para a cama dormir? <strong>Se não ou não sabe, por favor avance para a
                questão número 26.</strong>
              </label>
              <input
                type="text"
                value={formData.q25Utiliza}
                onChange={(e) => handleInputChange('q25Utiliza', e.target.value)}
                style={styles.input}
              />
            </div>
          </section>
        </div>
      )}

      {/* Página 4 */}
      {currentPage === 4 && (
        <div>
          <section style={styles.section}>
            <div style={styles.question}>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q25Utiliza === 'sim'} onChange={() => handleInputChange('q25Utiliza', formData.q25Utiliza === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q25Utiliza === 'nao'} onChange={() => handleInputChange('q25Utiliza', formData.q25Utiliza === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q25Utiliza === 'nao_sei'} onChange={() => handleInputChange('q25Utiliza', formData.q25Utiliza === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 88 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>25a. Se sim, quão perto/próximo da hora de dormir a sua criança geralmente usa esses equipamentos?</label>
              <div style={styles.checkboxColumn}>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q25aTempo === 'menos_30'} onChange={() => handleInputChange('q25aTempo', formData.q25aTempo === 'menos_30' ? '' : 'menos_30')} style={styles.checkbox} />
                  ( 1 ) Menos de 30 minutos antes de dormir
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q25aTempo === '30_a_1h'} onChange={() => handleInputChange('q25aTempo', formData.q25aTempo === '30_a_1h' ? '' : '30_a_1h')} style={styles.checkbox} />
                  ( 2 ) De 30 minutos até 1 hora antes de dormir
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q25aTempo === '1_a_2h'} onChange={() => handleInputChange('q25aTempo', formData.q25aTempo === '1_a_2h' ? '' : '1_a_2h')} style={styles.checkbox} />
                  ( 3 ) Entre 1 e 2 horas antes de dormir
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>26. A sua criança possui equipamentos eletrônicos com tela no quarto onde ela dorme (por exemplo, televisão, videogame, computador, tablet ou smartphone/ celão e possível usar os equipamentos).</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q26Possui === 'sim'} onChange={() => handleInputChange('q26Possui', formData.q26Possui === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q26Possui === 'nao'} onChange={() => handleInputChange('q26Possui', formData.q26Possui === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>26a. Por favor, indique a sua concordância com a seguinte afirmação: "Considerando os últimos 6 meses, os hábitos de uso tela da sua criança (uso de TV, videogame, computador, tablet, celular/smartphone) são problemáticos' (por exemplo, difícil parar de usar; a quantidade de tempo só tem aumentado; fica frustrado e/ou desmotivado quando não pode usar os equipamentos).</label>
              <div style={styles.checkboxColumn}>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'discordo_fortemente'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'discordo_fortemente' ? '' : 'discordo_fortemente')} style={styles.checkbox} />
                  Discordo fortemente
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'discordo'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'discordo' ? '' : 'discordo')} style={styles.checkbox} />
                  Discordo
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'nem_discordo'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'nem_discordo' ? '' : 'nem_discordo')} style={styles.checkbox} />
                  Nem discordo, nem concordo
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'concordo'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'concordo' ? '' : 'concordo')} style={styles.checkbox} />
                  Concordo
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'concordo_fortemente'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'concordo_fortemente' ? '' : 'concordo_fortemente')} style={styles.checkbox} />
                  Concordo fortemente
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'nao_sabe'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'nao_sabe' ? '' : 'nao_sabe')} style={styles.checkbox} />
                  Não sabe
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26aConcordancia === 'nao_aplica'} onChange={() => handleInputChange('q26aConcordancia', formData.q26aConcordancia === 'nao_aplica' ? '' : 'nao_aplica')} style={styles.checkbox} />
                  Não se aplica
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>26b. Com qual idade a sua criança começou a usar equipamentos eletrônicos com tela?</label>
              <div style={styles.checkboxColumn}>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26bIdade === '0_12'} onChange={() => handleInputChange('q26bIdade', formData.q26bIdade === '0_12' ? '' : '0_12')} style={styles.checkbox} />
                  0-12 meses (até 1 ano)
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26bIdade === '13_18'} onChange={() => handleInputChange('q26bIdade', formData.q26bIdade === '13_18' ? '' : '13_18')} style={styles.checkbox} />
                  13-18 meses (acima de 1 ano até 1 ano e meio)
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26bIdade === 'mais_18'} onChange={() => handleInputChange('q26bIdade', formData.q26bIdade === 'mais_18' ? '' : 'mais_18')} style={styles.checkbox} />
                  Mais de 18 meses (acima de 1 ano e meio)
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.q26bIdade === 'nao_usa'} onChange={() => handleInputChange('q26bIdade', formData.q26bIdade === 'nao_usa' ? '' : 'nao_usa')} style={styles.checkbox} />
                  Não usa equipamentos eletrônicos com tela
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>27. Quantas horas a sua criança dorme em um dia típico/normal num período de 24 horas (incluindo cochilos)?<br />Por favor, registre o número de horas e minutos por dia. Exemplo: 12 horas e 30 minutos</label>
              <div style={styles.timeInput}>
                <input type="text" value={formData.q27Horas} onChange={(e) => handleInputChange('q27Horas', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>hr</span>
                <input type="text" value={formData.q27Minutos} onChange={(e) => handleInputChange('q27Minutos', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>28a. A sua criança costuma cochilar? Se NÃO, por favor, pule para a questão 29</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q28aCochila === 'sim'} onChange={() => handleInputChange('q28aCochila', formData.q28aCochila === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q28aCochila === 'nao'} onChange={() => handleInputChange('q28aCochila', formData.q28aCochila === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>28a₁ Qual é o horário do cochilo da sua criança?</label>
              <div style={styles.timeInput}>
                <span>28a₁ Início: </span>
                <input type="text" value={formData.q28aInicioHr} onChange={(e) => handleInputChange('q28aInicioHr', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>hr</span>
                <input type="text" value={formData.q28aInicioMin} onChange={(e) => handleInputChange('q28aInicioMin', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>min</span>
                <span style={{ marginLeft: '1rem' }}>28a₂ Fim: </span>
                <input type="text" value={formData.q28aFimHr} onChange={(e) => handleInputChange('q28aFimHr', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>hr</span>
                <input type="text" value={formData.q28aFimMin} onChange={(e) => handleInputChange('q28aFimMin', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>29a. A sua criança tem um horário de dormir consistente? (horário de dormir à noite?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q29aConsistente === 'sim'} onChange={() => handleInputChange('q29aConsistente', formData.q29aConsistente === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim, não varia mais que 30 min por dia
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q29aConsistente === 'nao'} onChange={() => handleInputChange('q29aConsistente', formData.q29aConsistente === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não, varia mais que 30min por dia
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>29b. A sua criança tem uma rotina para acordar/levantar?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q29bRotina === 'sim'} onChange={() => handleInputChange('q29bRotina', formData.q29bRotina === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim, não varia mais que 30 min por dia
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q29bRotina === 'nao'} onChange={() => handleInputChange('q29bRotina', formData.q29bRotina === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não, varia mais que 30min por dia
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>30a. A que horas a sua criança vai para a cama dormir?</label>
              <div style={styles.timeInput}>
                <span>Formato 24h: </span>
                <input type="text" value={formData.q30aHr} onChange={(e) => handleInputChange('q30aHr', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>hr</span>
                <input type="text" value={formData.q30aMin} onChange={(e) => handleInputChange('q30aMin', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>30b. A que horas a sua criança acorda pela manhã?</label>
              <div style={styles.timeInput}>
                <span>Formato 24h: </span>
                <input type="text" value={formData.q30bHr} onChange={(e) => handleInputChange('q30bHr', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>hr</span>
                <input type="text" value={formData.q30bMin} onChange={(e) => handleInputChange('q30bMin', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span>min</span>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>31. Numa escala de 1 a 7, com o número mais alto indicando maior qualidade, como você classificaria a qualidade do sono da sua criança?</label>
              <p style={styles.subLabel}>1: indica que a sua criança tem muita dificuldade para se acalmar, acorda muitas vezes durante a noite por períodos prolongados e é muito inquieta (remexe-se, vira-se, tira a roupa de cama);</p>
              <input type="text" value={formData.q31Qualidade} onChange={(e) => handleInputChange('q31Qualidade', e.target.value)} style={styles.input} placeholder="Escala de 1 a 7" />
            </div>
          </section>
        </div>
      )}

      {/* Página 5 */}
      {currentPage === 5 && (
        <div>
          <section style={styles.section}>
            <div style={styles.question}>
              <p style={styles.infoText}>7: indica que a sua criança se acalma e dorme após alguns minutos; dorme a noite toda e tem um sono muito profundo.</p>
              <div style={styles.checkboxRow}>
                {[1, 2, 3, 4, 5, 6, 7, 88].map(num => (
                  <label key={num} style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q31Qualidade === num.toString()} onChange={() => handleInputChange('q31Qualidade', formData.q31Qualidade === num.toString() ? '' : num.toString())} style={styles.checkbox} />
                    ( {num} ){num === 88 ? ' Não sei' : ''}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>32a. Nos últimos 3 dias, a sua criança NÃO dormiu o suficiente? Ou a criança tem dormido por tempo suficiente, ou seja, caso NÃO (OPÇÃO NÃO), pule para a questão 33.</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q32aNaoDormiu === 'sim'} onChange={() => handleInputChange('q32aNaoDormiu', formData.q32aNaoDormiu === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q32aNaoDormiu === 'nao'} onChange={() => handleInputChange('q32aNaoDormiu', formData.q32aNaoDormiu === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>32b. Se sim, por quê? (escolha quantas respostas considerar adequadas):</label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'barulhos_fora', label: '( 1 ) Barulhos fora de casa (como barulhos de tráfego de carros/de trens/barulhos na rua)' },
                  { value: 'barulho_dentro', label: '( 2 ) Barulho dentro de casa' },
                  { value: 'muito_quente', label: '( 3 ) Muito quente' },
                  { value: 'muito_frio', label: '( 4 ) Muito frio' },
                  { value: 'muita_luz', label: '( 5 ) Muita luz entrando e iluminando o quarto' },
                  { value: 'outra', label: '( 6 ) Outra (especifique)' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input type="checkbox" checked={formData.q32bMotivos.includes(opcao.value)} onChange={() => handleCheckboxToggle('q32bMotivos', opcao.value)} style={styles.checkbox} />
                    {opcao.label}
                  </label>
                ))}
              </div>
              {formData.q32bMotivos.includes('outra') && (
                <input type="text" value={formData.q32b1Outro} onChange={(e) => handleInputChange('q32b1Outro', e.target.value)} style={styles.input} placeholder="32b₁. Outra (especifique):" />
              )}
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>33a. A sua criança dorme sozinha no seu próprio quarto? (O quarto é só dela?) Caso sim, pule para a questão 34</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q33aSozinha === 'sim'} onChange={() => handleInputChange('q33aSozinha', formData.q33aSozinha === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q33aSozinha === 'nao'} onChange={() => handleInputChange('q33aSozinha', formData.q33aSozinha === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>33b. Quantas pessoas dormem no mesmo quarto que a sua criança?</label>
              <div style={styles.checkboxRow}>
                <span>outras crianças  outros adultos</span>
              </div>
              <div style={styles.timeInput}>
                <span>33b₁ Nº de crianças: </span>
                <input type="text" value={formData.q33b1Criancas} onChange={(e) => handleInputChange('q33b1Criancas', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span style={{ marginLeft: '1rem' }}>33b₂ Nº de adultos (mais de 18 anos): </span>
                <input type="text" value={formData.q33b2Adultos} onChange={(e) => handleInputChange('q33b2Adultos', e.target.value)} style={styles.inputTime} placeholder="__" />
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>33c. Em caso negativo, quantas pessoas dividem a cama com a sua criança?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q33cCriancas === 'nao_relevante'} onChange={() => handleInputChange('q33cCriancas', formData.q33cCriancas === 'nao_relevante' ? '' : 'nao_relevante')} style={styles.checkbox} />
                  ( 0 ) Não é relevante
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q33cCriancas === 'outras'} onChange={() => handleInputChange('q33cCriancas', formData.q33cCriancas === 'outras' ? '' : 'outras')} style={styles.checkbox} />
                  ( 1 ) outras crianças
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q33cCriancas === 'adultos'} onChange={() => handleInputChange('q33cCriancas', formData.q33cCriancas === 'adultos' ? '' : 'adultos')} style={styles.checkbox} />
                  ( 2 ) outros adultos
                </label>
              </div>
              <div style={styles.timeInput}>
                <span>33c₁ Nº de crianças: </span>
                <input type="text" value={formData.q33c1Criancas} onChange={(e) => handleInputChange('q33c1Criancas', e.target.value)} style={styles.inputTime} placeholder="__" />
                <span style={{ marginLeft: '1rem' }}>33c₂ Nº de adultos (mais de 18 anos): </span>
                <input type="text" value={formData.q33c2Adultos} onChange={(e) => handleInputChange('q33c2Adultos', e.target.value)} style={styles.inputTime} placeholder="__" />
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>34. Com que frequência a sua criança tem uma rotina para dormir (ex: hora do banho, dizer boa noite, contar histórias, etc.)?</label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'nunca', label: '( 1 ) Nunca' },
                  { value: '2x', label: '( 2 ) Menos de uma vez por semana' },
                  { value: '3x', label: '( 3 ) Uma vez por semana' },
                  { value: 'maioria', label: '( 4 ) Na maioria dos dias' },
                  { value: 'todos', label: '( 5 ) Todos os dias' },
                  { value: 'nao_sei', label: '( 88 ) Não sei' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input type="checkbox" checked={formData.q34Frequencia === opcao.value} onChange={() => handleInputChange('q34Frequencia', formData.q34Frequencia === opcao.value ? '' : opcao.value)} style={styles.checkbox} />
                    {opcao.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.sectionTitle}>FONTES ALIMENTARES</h3>
              <p style={styles.infoText}>
                Este bloco se refere à aquisição de alimentos e ao consumo destes pela criança, assim, inclui questões sobre alimentação na escola e restrições alimentares.
              </p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>35. Você dá dinheiro para a sua criança comprar comida? (comida/lanche em qualquer contexto: escola, mercado, etc.) Caso não, pule para a questão 36a</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q35DaDinheiro === 'sim'} onChange={() => handleInputChange('q35DaDinheiro', formData.q35DaDinheiro === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q35DaDinheiro === 'nao'} onChange={() => handleInputChange('q35DaDinheiro', formData.q35DaDinheiro === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>35b. Em caso negativo, quantos dias por semana?</label>
              <input type="text" value={formData.q35bDias} onChange={(e) => handleInputChange('q35bDias', e.target.value)} style={styles.input} placeholder="__ dias" />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>36a. A sua criança leva alguma comida/lanche para a escola? Caso não, pule para a questão 37</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q36aLevaComida === 'sim'} onChange={() => handleInputChange('q36aLevaComida', formData.q36aLevaComida === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q36aLevaComida === 'nao'} onChange={() => handleInputChange('q36aLevaComida', formData.q36aLevaComida === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>36b. Em caso afirmativo, quais refeições?</label>
              <div style={styles.mealTable}>
                {[
                  { label: 'Café da manhã:', field: 'q36bCafeManha' },
                  { label: 'Almoço:', field: 'q36bAlmoco' },
                  { label: 'Jantar:', field: 'q36bJantar' },
                  { label: 'Lanches:', field: 'q36bLanches' }
                ].map(meal => (
                  <div key={meal.field} style={styles.mealRow}>
                    <span style={styles.mealLabel}>{meal.label}</span>
                    <div style={styles.mealOptions}>
                      {['1x', '2x', '3x', '4x', '5x', 'nao_faz'].map(freq => (
                        <label key={freq} style={styles.checkboxLabelInline}>
                          <input type="checkbox" checked={formData[meal.field as keyof typeof formData] === freq} onChange={() => handleInputChange(meal.field, formData[meal.field as keyof typeof formData] === freq ? '' : freq)} style={styles.checkbox} />
                          {freq === 'nao_faz' ? 'Não faz' : `${freq} semana`}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>37. A sua criança segue alguma dieta especial ou tem restrição alimentar? (ex: alimentos sem lactose e sem glúten)</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q37DietaEspecial === 'sim'} onChange={() => handleInputChange('q37DietaEspecial', formData.q37DietaEspecial === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q37DietaEspecial === 'nao'} onChange={() => handleInputChange('q37DietaEspecial', formData.q37DietaEspecial === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>37a. Em caso afirmativo, especifique?</label>
              <input type="text" value={formData.q37aEspecifique} onChange={(e) => handleInputChange('q37aEspecifique', e.target.value)} style={styles.input} />
            </div>
          </section>
        </div>
      )}

      {/* Página 6 */}
      {currentPage === 6 && (
        <div>
          <section style={styles.section}>
            <div style={styles.infoBox}>
              <h3 style={styles.sectionTitle}>DIVERSIDADE ALIMENTAR</h3>
              <p style={styles.infoText}>
                O bloco investiga a diversidade do consumo alimentar da criança, ou seja, alimentos consumidos em casa, na escola ou em qualquer outro contexto.
              </p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>38. A sua criança comeu algum dos seguintes tipos de alimentos ontem, durante o dia ou à noite?</label>
              <p style={styles.subLabel}>(ex: pão macarrão, massas em geral, mandioca, beterraba, cenoura, batata, arroz, milho,, polvilho, farinhas diversas-trigo, aveia, mandioca, rosca, biscoito)</p>
              
              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- grãos, raízes, tubérculos</span>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Graos === 'sim'} onChange={() => handleInputChange('q38Graos', formData.q38Graos === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Graos === 'nao'} onChange={() => handleInputChange('q38Graos', formData.q38Graos === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Graos === 'nao_sei'} onChange={() => handleInputChange('q38Graos', formData.q38Graos === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>

              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- Leguminosas</span>
                <p style={styles.subLabel}>(ex: feijão, ervilha, lentilha, nozes ou sementes)</p>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Leguminosas === 'sim'} onChange={() => handleInputChange('q38Leguminosas', formData.q38Leguminosas === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Leguminosas === 'nao'} onChange={() => handleInputChange('q38Leguminosas', formData.q38Leguminosas === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Leguminosas === 'nao_sei'} onChange={() => handleInputChange('q38Leguminosas', formData.q38Leguminosas === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>

              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- Lacticínios/produtos lácteos</span>
                <p style={styles.subLabel}>(ex: queijo, requeijão, creme, sorvete, quefir, leite e iogurte. Exceto: manteiga e creme de leite)</p>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Lacticinios === 'sim'} onChange={() => handleInputChange('q38Lacticinios', formData.q38Lacticinios === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Lacticinios === 'nao'} onChange={() => handleInputChange('q38Lacticinios', formData.q38Lacticinios === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Lacticinios === 'nao_sei'} onChange={() => handleInputChange('q38Lacticinios', formData.q38Lacticinios === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>

              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- Carnes</span>
                <p style={styles.subLabel}>(ex: carne de boi, peixe, aves, carne de porco, carne de fígado/miúdos. Carnes de açougue ou peixaria. Não entram os embutidos como linguiça, salsicha, nuggets, presunto, peito de peru, etc.)</p>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Carnes === 'sim'} onChange={() => handleInputChange('q38Carnes', formData.q38Carnes === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Carnes === 'nao'} onChange={() => handleInputChange('q38Carnes', formData.q38Carnes === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Carnes === 'nao_sei'} onChange={() => handleInputChange('q38Carnes', formData.q38Carnes === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>

              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- Ovos</span>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Ovos === 'sim'} onChange={() => handleInputChange('q38Ovos', formData.q38Ovos === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Ovos === 'nao'} onChange={() => handleInputChange('q38Ovos', formData.q38Ovos === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38Ovos === 'nao_sei'} onChange={() => handleInputChange('q38Ovos', formData.q38Ovos === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>

              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- Frutas e vegetais ricos em vitamina A</span>
                <p style={styles.subLabel}>(Vegetais de folhas escuras amarelos e laranjas, e frutas cor de laranja, não cítricas). Ex: Exemplos: couve, espinafre, pimentão, tomate, abóbora, manga, mamão, goiaba vermelha, pequi, cenoura</p>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38FrutasVitaminaA === 'sim'} onChange={() => handleInputChange('q38FrutasVitaminaA', formData.q38FrutasVitaminaA === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38FrutasVitaminaA === 'nao'} onChange={() => handleInputChange('q38FrutasVitaminaA', formData.q38FrutasVitaminaA === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38FrutasVitaminaA === 'nao_sei'} onChange={() => handleInputChange('q38FrutasVitaminaA', formData.q38FrutasVitaminaA === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>

              <div style={styles.foodGroup}>
                <span style={styles.foodLabel}>- Outras frutas e vegetais</span>
                <p style={styles.subLabel}>(ex: maçã, banana, laranja, pera, chuchu, abobrinha, quiabo, repolho, couve-flor, brócolis, alface, cupuaçu, bocaiuva)</p>
                <div style={styles.checkboxRow}>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38OutrasFrutas === 'sim'} onChange={() => handleInputChange('q38OutrasFrutas', formData.q38OutrasFrutas === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                    ( 1 ) Sim
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38OutrasFrutas === 'nao'} onChange={() => handleInputChange('q38OutrasFrutas', formData.q38OutrasFrutas === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                    ( 0 ) Não
                  </label>
                  <label style={styles.checkboxLabelInline}>
                    <input type="checkbox" checked={formData.q38OutrasFrutas === 'nao_sei'} onChange={() => handleInputChange('q38OutrasFrutas', formData.q38OutrasFrutas === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                    ( 88 ) Não sei
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.sectionTitle}>COMPORTAMENTO ALIMENTAR EM CASA</h3>
            </div>

            {[
              { num: '39', text: 'Com que frequência a TV ou outro equipamento eletrônico (incluindo com tela) costuma estar ligado durante as refeições?', field: 'q39FrequenciaTV' },
              { num: '40', text: 'Com qual frequência você senta à mesa com a sua criança durante as refeições?', field: 'q40FrequenciaMesa' },
              { num: '41', text: 'Com qual frequência toda a família senta-se à mesa durante uma refeição principal?', field: 'q41FrequenciaFamilia' },
              { num: '42', text: 'Com qual frequência a sua criança come ou bebe alimentos e bebidas diferentes daqueles que você consome durante as refeições e lanches?', field: 'q42FrequenciaDiferentes' },
              { num: '43', text: 'Com qual frequência a sua criança come lanches como batatas fritas, biscoitos, bolos, balas, doces e chocolates entre as refeições?', field: 'q43FrequenciaLanches' }
            ].map(questao => (
              <div key={questao.num} style={styles.question}>
                <label style={styles.questionLabel}>{questao.num}. {questao.text}</label>
                <div style={styles.checkboxColumn}>
                  {[
                    { value: 'nunca', label: '( 1 ) Nunca' },
                    { value: 'raramente', label: '( 2 ) Raramente' },
                    { value: 'uma_vez', label: '( 3 ) Uma vez por semana' },
                    { value: 'maioria', label: '( 4 ) Na maioria dos dias' },
                    { value: 'todos', label: '( 5 ) Todos os dias' },
                    { value: 'nao_sei', label: '( 6 ) Não sei' }
                  ].map(opcao => (
                    <label key={opcao.value} style={styles.checkboxLabelBlock}>
                      <input type="checkbox" checked={formData[questao.field as keyof typeof formData] === opcao.value} onChange={() => handleInputChange(questao.field, formData[questao.field as keyof typeof formData] === opcao.value ? '' : opcao.value)} style={styles.checkbox} />
                      {opcao.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* Página 7 */}
      {currentPage === 7 && (
        <div>
          <section style={styles.section}>
            <div style={styles.question}>
              <label style={styles.questionLabel}>44. Com qual frequência a sua criança toma bebidas açucaradas e doces (ex: leites com achocolatado, sucos de frutas industrializados, refrigerantes)</label>
              <div style={styles.checkboxColumn}>
                {[
                  { value: 'nunca', label: '( 1 ) Nunca' },
                  { value: 'raramente', label: '( 2 ) Raramente' },
                  { value: 'uma_vez', label: '( 3 ) Uma vez por semana' },
                  { value: 'maioria', label: '( 4 ) Na maioria dos dias' },
                  { value: 'todos', label: '( 5 ) Todos os dias' },
                  { value: 'nao_sei', label: '( 6 ) Não sei' }
                ].map(opcao => (
                  <label key={opcao.value} style={styles.checkboxLabelBlock}>
                    <input type="checkbox" checked={formData.q44Frequencia === opcao.value} onChange={() => handleInputChange('q44Frequencia', formData.q44Frequencia === opcao.value ? '' : opcao.value)} style={styles.checkbox} />
                    {opcao.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.sectionTitle}>INSEGURANÇA ALIMENTAR</h3>
              <p style={styles.infoText}>
                Neste bloco, as questões são sobre a dificuldade em se obter alimentos, problema enfrentado por muitas famílias e agravado com a crise devido à pandemia de COVID-19.
              </p>
              <p style={styles.infoText}>
                <strong>Considere o último mês como referência para as perguntas a seguir</strong>
              </p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>45a. A sua família já ficou sem dinheiro para comprar comida?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q45aFicouSemDinheiro === 'sim'} onChange={() => handleInputChange('q45aFicouSemDinheiro', formData.q45aFicouSemDinheiro === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q45aFicouSemDinheiro === 'nao'} onChange={() => handleInputChange('q45aFicouSemDinheiro', formData.q45aFicouSemDinheiro === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 0 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>45b. Você já reduziu o tamanho das refeições ou pulou refeições por não ter dinheiro suficiente para comprar comida?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q45bReducaoRefeicoes === 'sim'} onChange={() => handleInputChange('q45bReducaoRefeicoes', formData.q45bReducaoRefeicoes === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q45bReducaoRefeicoes === 'nao'} onChange={() => handleInputChange('q45bReducaoRefeicoes', formData.q45bReducaoRefeicoes === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>45c. Você vai para a cama com fome por não ter dinheiro suficiente para comprar comida?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q45cForaComFome === 'sim'} onChange={() => handleInputChange('q45cForaComFome', formData.q45cForaComFome === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.q45cForaComFome === 'nao'} onChange={() => handleInputChange('q45cForaComFome', formData.q45cForaComFome === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>46. Comentários:</label>
              <textarea value={formData.q46Comentarios} onChange={(e) => handleInputChange('q46Comentarios', e.target.value)} style={styles.textarea} />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>47. Data da aplicação (Dia/Mês/Ano):</label>
              <input type="date" value={formData.q47DataAplicacao} onChange={(e) => handleInputChange('q47DataAplicacao', e.target.value)} style={styles.input} />
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.sectionTitle}>ECD12030 – ÍNDICE DE DESENVOLVIMENTO NA PRIMEIRA INFÂNCIA</h3>
              <p style={styles.infoText}>
                Gostaria de lhe perguntar sobre algumas atividades que a sua criança consegue fazer atualmente. Tenha presente que as crianças podem desenvolver-se e aprender a ritmos diferentes. Por exemplo, algumas começam a falar mais cedo do que outras, ou podem já dizer algumas palavras, mas ainda não formar frases. Não há problema se neste momento a sua criança ainda não for capaz de executar todas as coisas sobre as quais lhe vou perguntar. Pode consultar-me se tiver alguma dúvida acerca da resposta a dar.
              </p>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD1. Sua criança é capaz de andar numa superfície irregular, por exemplo, numa rua acidentada ou inclinada, sem cair?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd1Andar === 'sim'} onChange={() => handleInputChange('ecd1Andar', formData.ecd1Andar === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd1Andar === 'nao'} onChange={() => handleInputChange('ecd1Andar', formData.ecd1Andar === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd1Andar === 'nao_sei'} onChange={() => handleInputChange('ecd1Andar', formData.ecd1Andar === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD2. Sua criança é capaz de saltar levantando ambos os pés do chão?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd2SaltarLevantando === 'sim'} onChange={() => handleInputChange('ecd2SaltarLevantando', formData.ecd2SaltarLevantando === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd2SaltarLevantando === 'nao'} onChange={() => handleInputChange('ecd2SaltarLevantando', formData.ecd2SaltarLevantando === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd2SaltarLevantando === 'nao_sei'} onChange={() => handleInputChange('ecd2SaltarLevantando', formData.ecd2SaltarLevantando === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD3. Sua criança é capaz de se vestir, isto é, de pôr as calças e uma camiseta, sem ajuda? (se a criança colocar somente uma peça sozinha, a resposta é não).</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd3Vestir === 'sim'} onChange={() => handleInputChange('ecd3Vestir', formData.ecd3Vestir === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd3Vestir === 'nao'} onChange={() => handleInputChange('ecd3Vestir', formData.ecd3Vestir === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd3Vestir === 'nao_sei'} onChange={() => handleInputChange('ecd3Vestir', formData.ecd3Vestir === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD4. Sua criança é capaz de abotoar e desabotoar (colocar e tirar o botão de dentro da casa; não só botões de pressão) botões sem ajuda?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd4Abotoar === 'sim'} onChange={() => handleInputChange('ecd4Abotoar', formData.ecd4Abotoar === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd4Abotoar === 'nao'} onChange={() => handleInputChange('ecd4Abotoar', formData.ecd4Abotoar === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd4Abotoar === 'nao_sei'} onChange={() => handleInputChange('ecd4Abotoar', formData.ecd4Abotoar === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD5. Sua criança é capaz de dizer 10 ou mais palavras, como "mamá" ou "bola"?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd5Dizer10 === 'sim'} onChange={() => handleInputChange('ecd5Dizer10', formData.ecd5Dizer10 === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd5Dizer10 === 'nao'} onChange={() => handleInputChange('ecd5Dizer10', formData.ecd5Dizer10 === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd5Dizer10 === 'nao_sei'} onChange={() => handleInputChange('ecd5Dizer10', formData.ecd5Dizer10 === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD6. Sua criança é capaz de falar utilizando frases de 3 ou mais palavras que se combinam entre si, por exemplo, "Eu quero água" ou "A casa é grande"? <strong>Se não ou não sei, pule para a questão ECD8</strong></label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd6Frases3 === 'sim'} onChange={() => handleInputChange('ecd6Frases3', formData.ecd6Frases3 === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd6Frases3 === 'nao'} onChange={() => handleInputChange('ecd6Frases3', formData.ecd6Frases3 === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd6Frases3 === 'nao_sei'} onChange={() => handleInputChange('ecd6Frases3', formData.ecd6Frases3 === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD7. Sua criança é capaz de falar utilizando frases de 5 ou mais palavras que se combinam entre si, por exemplo, "A casa é muito grande"?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd7Frases5 === 'sim'} onChange={() => handleInputChange('ecd7Frases5', formData.ecd7Frases5 === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd7Frases5 === 'nao'} onChange={() => handleInputChange('ecd7Frases5', formData.ecd7Frases5 === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd7Frases5 === 'nao_sei'} onChange={() => handleInputChange('ecd7Frases5', formData.ecd7Frases5 === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Página 8 */}
      {currentPage === 8 && (
        <div>
          <section style={styles.section}>
            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD8. Sua criança é capaz de utilizar corretamente qualquer uma das palavras "eu", "você", "ela" ou "ele", por exemplo, "Eu quero água" ou "Ele come arroz"?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd8UtilizarCorretamente === 'sim'} onChange={() => handleInputChange('ecd8UtilizarCorretamente', formData.ecd8UtilizarCorretamente === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd8UtilizarCorretamente === 'nao'} onChange={() => handleInputChange('ecd8UtilizarCorretamente', formData.ecd8UtilizarCorretamente === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd8UtilizarCorretamente === 'nao_sei'} onChange={() => handleInputChange('ecd8UtilizarCorretamente', formData.ecd8UtilizarCorretamente === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD9. Se mostrar à sua criança um objeto que (ele/ela) conhece bem, como um copo ou um animal, (ele/ela) é capaz de dizer o seu nome sistematicamente?</label>
              <p style={styles.subLabel}>Por "sistematicamente" queremos dizer que (ele/ela) usa a mesma palavra para se referir ao mesmo objeto, ainda que a palavra que empregue não seja de todo correta.</p>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd9MostrarObjeto === 'sim'} onChange={() => handleInputChange('ecd9MostrarObjeto', formData.ecd9MostrarObjeto === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd9MostrarObjeto === 'nao'} onChange={() => handleInputChange('ecd9MostrarObjeto', formData.ecd9MostrarObjeto === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd9MostrarObjeto === 'nao_sei'} onChange={() => handleInputChange('ecd9MostrarObjeto', formData.ecd9MostrarObjeto === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD10. Sua criança é capaz de reconhecer pelo menos 5 letras do alfabeto?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd10Reconhecer5Letras === 'sim'} onChange={() => handleInputChange('ecd10Reconhecer5Letras', formData.ecd10Reconhecer5Letras === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd10Reconhecer5Letras === 'nao'} onChange={() => handleInputChange('ecd10Reconhecer5Letras', formData.ecd10Reconhecer5Letras === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd10Reconhecer5Letras === 'nao_sei'} onChange={() => handleInputChange('ecd10Reconhecer5Letras', formData.ecd10Reconhecer5Letras === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD11. Sua criança é capaz de escrever o seu nome? (escrila com lápis, caneta, etc.; Não inclui escrever o nome com letras móveis ou no celular, tablet, etc.)</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd11EscreverNome === 'sim'} onChange={() => handleInputChange('ecd11EscreverNome', formData.ecd11EscreverNome === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd11EscreverNome === 'nao'} onChange={() => handleInputChange('ecd11EscreverNome', formData.ecd11EscreverNome === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd11EscreverNome === 'nao_sei'} onChange={() => handleInputChange('ecd11EscreverNome', formData.ecd11EscreverNome === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD12. Sua criança é capaz de reconhecer todos os números de 1 a 5? (i.e.: a criança, quando olha o número dois, o algarismo 2 é capaz de reconhecê-lo? Não inclui falar os números mostrados nos dedos)</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd12Reconhecer1a5 === 'sim'} onChange={() => handleInputChange('ecd12Reconhecer1a5', formData.ecd12Reconhecer1a5 === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd12Reconhecer1a5 === 'nao'} onChange={() => handleInputChange('ecd12Reconhecer1a5', formData.ecd12Reconhecer1a5 === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd12Reconhecer1a5 === 'nao_sei'} onChange={() => handleInputChange('ecd12Reconhecer1a5', formData.ecd12Reconhecer1a5 === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD13. Se pedir à sua criança que lhe dê 3 objetos, como 3 pedras ou 3 feijões, (ele/ela) lhe dá a quantidade correta?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd13Pedir3Objetos === 'sim'} onChange={() => handleInputChange('ecd13Pedir3Objetos', formData.ecd13Pedir3Objetos === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd13Pedir3Objetos === 'nao'} onChange={() => handleInputChange('ecd13Pedir3Objetos', formData.ecd13Pedir3Objetos === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd13Pedir3Objetos === 'nao_sei'} onChange={() => handleInputChange('ecd13Pedir3Objetos', formData.ecd13Pedir3Objetos === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD14. Sua criança é capaz de contar 10 objetos, por exemplo, 10 dedos ou 10 cubos, sem se enganar?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd14Contar10 === 'sim'} onChange={() => handleInputChange('ecd14Contar10', formData.ecd14Contar10 === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd14Contar10 === 'nao'} onChange={() => handleInputChange('ecd14Contar10', formData.ecd14Contar10 === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd14Contar10 === 'nao_sei'} onChange={() => handleInputChange('ecd14Contar10', formData.ecd14Contar10 === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD15. Sua criança é capaz de executar uma atividade, como colorir ou brincar com blocos de construção, sem pedir repetidamente ajuda ou desistir depressa demais?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd15Executar === 'sim'} onChange={() => handleInputChange('ecd15Executar', formData.ecd15Executar === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd15Executar === 'nao'} onChange={() => handleInputChange('ecd15Executar', formData.ecd15Executar === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd15Executar === 'nao_sei'} onChange={() => handleInputChange('ecd15Executar', formData.ecd15Executar === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD16. Sua criança pergunta por pessoas familiares, além dos pais, quando elas estão ausentes, por exemplo, "Onde está a vovó?".</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd16Perguntar === 'sim'} onChange={() => handleInputChange('ecd16Perguntar', formData.ecd16Perguntar === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd16Perguntar === 'nao'} onChange={() => handleInputChange('ecd16Perguntar', formData.ecd16Perguntar === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd16Perguntar === 'nao_sei'} onChange={() => handleInputChange('ecd16Perguntar', formData.ecd16Perguntar === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD17. Sua criança oferece-se para ajudar alguém que pareça precisar de ajuda?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd17Oferecer === 'sim'} onChange={() => handleInputChange('ecd17Oferecer', formData.ecd17Oferecer === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd17Oferecer === 'nao'} onChange={() => handleInputChange('ecd17Oferecer', formData.ecd17Oferecer === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd17Oferecer === 'nao_sei'} onChange={() => handleInputChange('ecd17Oferecer', formData.ecd17Oferecer === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD18. Sua criança se dá bem com outras crianças?</label>
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd18DarBem === 'sim'} onChange={() => handleInputChange('ecd18DarBem', formData.ecd18DarBem === 'sim' ? '' : 'sim')} style={styles.checkbox} />
                  ( 1 ) Sim
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd18DarBem === 'nao'} onChange={() => handleInputChange('ecd18DarBem', formData.ecd18DarBem === 'nao' ? '' : 'nao')} style={styles.checkbox} />
                  ( 2 ) Não
                </label>
                <label style={styles.checkboxLabelInline}>
                  <input type="checkbox" checked={formData.ecd18DarBem === 'nao_sei'} onChange={() => handleInputChange('ecd18DarBem', formData.ecd18DarBem === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD19. Com que frequência (ele/ela) (nome) parece muito triste ou deprimido(a)? Diria que: diariamente, semanalmente, mensalmente, algumas vezes por ano ou nunca? (Não é abordado porque algo foi negado)</label>
              <div style={styles.checkboxColumn}>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd19Frequencia === 'diariamente'} onChange={() => handleInputChange('ecd19Frequencia', formData.ecd19Frequencia === 'diariamente' ? '' : 'diariamente')} style={styles.checkbox} />
                  ( 1 ) Diariamente
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd19Frequencia === 'semanalmente'} onChange={() => handleInputChange('ecd19Frequencia', formData.ecd19Frequencia === 'semanalmente' ? '' : 'semanalmente')} style={styles.checkbox} />
                  ( 2 ) Semanalmente
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd19Frequencia === 'mensalmente'} onChange={() => handleInputChange('ecd19Frequencia', formData.ecd19Frequencia === 'mensalmente' ? '' : 'mensalmente')} style={styles.checkbox} />
                  ( 3 ) Mensalmente
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd19Frequencia === 'algumas'} onChange={() => handleInputChange('ecd19Frequencia', formData.ecd19Frequencia === 'algumas' ? '' : 'algumas')} style={styles.checkbox} />
                  ( 4 ) Algumas vezes por ano
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd19Frequencia === 'nunca'} onChange={() => handleInputChange('ecd19Frequencia', formData.ecd19Frequencia === 'nunca' ? '' : 'nunca')} style={styles.checkbox} />
                  ( 5 ) Nunca
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd19Frequencia === 'nao_sei'} onChange={() => handleInputChange('ecd19Frequencia', formData.ecd19Frequencia === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>ECD20. Em comparação com crianças da mesma idade, com que frequência o(a) (nome) dá pontapés, morde ou bate em outras crianças ou adultos? Diria que: nunca, com frequência igual ou menor, com frequência maior ou com frequência muito maior</label>
              <div style={styles.checkboxColumn}>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd20Comparacao === 'nunca'} onChange={() => handleInputChange('ecd20Comparacao', formData.ecd20Comparacao === 'nunca' ? '' : 'nunca')} style={styles.checkbox} />
                  ( 1 ) NUNCA
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd20Comparacao === 'igual_menor'} onChange={() => handleInputChange('ecd20Comparacao', formData.ecd20Comparacao === 'igual_menor' ? '' : 'igual_menor')} style={styles.checkbox} />
                  ( 2 ) Com frequência IGUAL ou MENOR
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd20Comparacao === 'maior'} onChange={() => handleInputChange('ecd20Comparacao', formData.ecd20Comparacao === 'maior' ? '' : 'maior')} style={styles.checkbox} />
                  ( 3 ) Com frequência MAIOR
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd20Comparacao === 'muito_maior'} onChange={() => handleInputChange('ecd20Comparacao', formData.ecd20Comparacao === 'muito_maior' ? '' : 'muito_maior')} style={styles.checkbox} />
                  ( 4 ) Com frequência MUITO MAIOR
                </label>
                <label style={styles.checkboxLabelBlock}>
                  <input type="checkbox" checked={formData.ecd20Comparacao === 'nao_sei'} onChange={() => handleInputChange('ecd20Comparacao', formData.ecd20Comparacao === 'nao_sei' ? '' : 'nao_sei')} style={styles.checkbox} />
                  ( 8 ) Não sei
                </label>
              </div>
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>Comentários:</label>
              <textarea value={formData.comentariosFinais} onChange={(e) => handleInputChange('comentariosFinais', e.target.value)} style={styles.textarea} />
            </div>

            <div style={styles.question}>
              <label style={styles.questionLabel}>Data da aplicação (Dia/Mês/Ano):</label>
              <input type="date" value={formData.dataAplicacaoFinal} onChange={(e) => handleInputChange('dataAplicacaoFinal', e.target.value)} style={styles.input} />
            </div>
          </section>
        </div>
      )}

      {/* Navegação */}
      <div style={styles.navigation}>
        <button
          type="button"
          onClick={prevPage}
          disabled={currentPage === 1}
          style={{
            ...styles.navButton,
            ...(currentPage === 1 ? styles.navButtonDisabled : {})
          }}
        >
          ← Página Anterior
        </button>
        
        <span style={styles.pageIndicator}>Página {currentPage} de 8</span>
        
        {currentPage < 8 ? (
          <button
            type="button"
            onClick={nextPage}
            style={styles.navButton}
          >
            Próxima Página →
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              style={styles.submitButton}
            >
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
        )}
      </div>
    </form>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#ffffff'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '2rem'
  },
  logo: {
    height: '80px',
    width: 'auto'
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #333',
    paddingBottom: '0.5rem'
  },
  section: {
    marginBottom: '1.5rem',
    border: '1px solid #333',
    padding: '1rem'
  },
  sectionTitle: {
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    textAlign: 'center'
  },
  fieldRow: {
    marginBottom: '0.75rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem'
  },
  fieldLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.35rem',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none'
  },
  inputSmall: {
    width: '80px',
    padding: '0.35rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    marginLeft: '0.25rem',
    marginRight: '0.5rem'
  },
  inputTime: {
    width: '50px',
    padding: '0.35rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    marginLeft: '0.25rem',
    marginRight: '0.25rem',
    textAlign: 'center'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    minHeight: '60px',
    resize: 'vertical'
  },
  checkboxRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center'
  },
  checkboxColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  checkboxLabelInline: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#333'
  },
  checkboxLabelBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#333',
    lineHeight: '1.4'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#613789',
    flexShrink: 0,
    marginTop: '0.15rem'
  },
  horarioRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem'
  },
  timeInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.85rem'
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px'
  },
  infoText: {
    fontSize: '0.8rem',
    lineHeight: '1.5',
    margin: 0,
    color: '#333'
  },
  question: {
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee'
  },
  questionLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.5rem',
    display: 'block',
    lineHeight: '1.4'
  },
  subLabel: {
    fontSize: '0.75rem',
    color: '#666',
    marginBottom: '0.5rem',
    display: 'block',
    fontStyle: 'italic'
  },
  note: {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '0.35rem',
    fontStyle: 'italic'
  },
  placeholderPage: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    minHeight: '300px'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid #ddd'
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    color: '#ffffff',
    borderWidth: '0',
    borderStyle: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  navButtonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.5
  },
  pageIndicator: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333'
  },
  submitButton: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    color: '#ffffff',
    borderWidth: '0',
    borderStyle: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  mealTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  mealRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem'
  },
  mealLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    minWidth: '120px'
  },
  mealOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    flex: 1
  },
  foodGroup: {
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #eee'
  },
  foodLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  }
};
