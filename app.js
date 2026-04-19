// --- CONFIGURATION ---
// CRM API (will work when Cloudflare Tunnel is configured)
const CRM_API = ''; // Will be set to tunnel URL later, e.g. 'https://crm.bitter.eng.br'
// Fallback: FormSubmit.co sends lead data to email (always works, no backend needed)
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/contato@bitter.eng.br';

// --- STATE ---
let currentVertical = 'SOLAR';

// --- DYNAMIC FIELDS CONFIG ---
const verticalFields = {
    'SOLAR': `
        <div class="form-row">
            <div class="form-group">
                <label for="consumo">Consumo médio (kWh)</label>
                <select id="consumo" name="consumo">
                    <option value="Ate 300kWh">Até 300kWh</option>
                    <option value="300-500kWh">300-500kWh</option>
                    <option value="500-1000kWh">500-1000kWh</option>
                    <option value="Acima de 1000kWh">Acima de 1000kWh</option>
                </select>
            </div>
            <div class="form-group">
                <label for="tipo_imovel">Tipo de Imóvel</label>
                <select id="tipo_imovel" name="tipo_imovel">
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label for="tipo_telhado">Tipo de Telhado</label>
            <select id="tipo_telhado" name="tipo_telhado">
                <option value="Ceramico">Cerâmico</option>
                <option value="Fibrocimento">Fibrocimento (Eternit)</option>
                <option value="Metalico">Metálico</option>
                <option value="Solo">Solo</option>
                <option value="Nao sei">Não sei informar</option>
            </select>
        </div>
    `,
    'COPEL': `
        <div class="form-group">
            <label for="finalidade">Finalidade</label>
            <select id="finalidade" name="finalidade">
                <option value="Nova Ligacao">Nova Ligação</option>
                <option value="Aumento de Carga">Aumento de Carga</option>
                <option value="Troca de Padrao">Troca de Padrão</option>
            </select>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="tipo_imovel_copel">Tipo de Imóvel</label>
                <select id="tipo_imovel_copel" name="tipo_imovel">
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Industrial">Industrial</option>
                </select>
            </div>
            <div class="form-group">
                <label for="urgencia">Urgência</label>
                <select id="urgencia" name="urgencia">
                    <option value="Normal">Normal</option>
                    <option value="Urgente">Urgente</option>
                </select>
            </div>
        </div>
    `,
    'ELETRICA': `
        <div class="form-row">
            <div class="form-group">
                <label for="tipo_inst">Tipo de Serviço</label>
                <select id="tipo_inst" name="tipo_inst">
                    <option value="Instalacao Nova">Instalação Nova</option>
                    <option value="Reforma">Reforma</option>
                    <option value="Adequacao">Adequação</option>
                </select>
            </div>
            <div class="form-group">
                <label for="acabamento">Nível de Acabamento</label>
                <select id="acabamento" name="acabamento">
                    <option value="Padrao">Padrão</option>
                    <option value="Alto Padrao">Alto Padrão</option>
                    <option value="Industrial">Industrial</option>
                </select>
            </div>
        </div>
    `,
    'LAUDO': `
        <div class="form-group">
            <label for="motivo_laudo">Motivo do Laudo</label>
            <select id="motivo_laudo" name="motivo_laudo">
                <option value="Exigencia Legal">Exigência Legal (Bombeiros/Prefeitura)</option>
                <option value="Seguro">Seguradora</option>
                <option value="Falha Tecnica">Diagnóstico de Falha/Curto</option>
                <option value="Outro">Outro</option>
            </select>
        </div>
        <div class="form-group">
            <label for="sintomas">Descrição Breve / Sintomas</label>
            <textarea id="sintomas" name="sintomas" rows="3" placeholder="Descreva brevemente a situação..."></textarea>
        </div>
    `
};

const verticalFAQs = {
    'SOLAR': `
        <div class="accordion-item">
            <button class="accordion-header">Quanto custa um sistema de energia solar? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>O investimento depende do seu consumo e tipo de imóvel. Solicite um orçamento gratuito e personalizado.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">A conta de luz vai zerar? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>O sistema pode reduzir em até 95%, mas taxas como iluminação pública (COSIP) e custo de disponibilidade sempre existem.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">Quanto tempo para instalar? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>O processo completo (projeto, aprovação COPEL e instalação) leva em média 30-60 dias.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">Vocês parcelam? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>Sim! Temos opções de pagamento facilitadas. Nosso consultor vai apresentar as condições.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">Vocês atendem fora de Foz do Iguaçu? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>Sim, atendemos toda a região oeste do Paraná e tríplice fronteira.</p>
            </div>
        </div>
    `,
    'COPEL': `
        <div class="accordion-item">
            <button class="accordion-header">Qual o prazo da COPEL para ligação? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>O prazo regulamentar varia conforme a solicitação, mas geralmente leva entre 3 e 5 dias úteis para vistoria após o pedido.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">Preciso trocar meu padrão atual? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>Depende da carga que será instalada e da condição do seu padrão atual. Faremos uma análise técnica para confirmar.</p>
            </div>
        </div>
    `,
    'ELETRICA': `
        <div class="accordion-item">
            <button class="accordion-header">Vocês emitem ART do projeto elétrico? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>Sim, todos os nossos projetos e execuções contam com a emissão da Anotação de Responsabilidade Técnica (ART) junto ao CREA.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">Atendem chamados de emergência? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>Nosso foco são projetos, obras e adequações programadas, mas avaliamos demandas urgentes para clientes cadastrados.</p>
            </div>
        </div>
    `,
    'LAUDO': `
        <div class="accordion-item">
            <button class="accordion-header">Qual a validade de um laudo elétrico? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>A validade varia de acordo com a exigência (Bombeiros, Seguradora), mas geralmente é recomendado refazer a cada ano ou após grandes reformas.</p>
            </div>
        </div>
        <div class="accordion-item">
            <button class="accordion-header">O laudo atende exigências do Corpo de Bombeiros? <i class="ph ph-caret-down"></i></button>
            <div class="accordion-content">
                <p>Sim, emitimos laudos com recolhimento de ART específicos para aprovação de projetos de prevenção a incêndio.</p>
            </div>
        </div>
    `
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initDynamicForm();
    initFAQ();
    initSmoothScroll();
});

// --- DYNAMIC FORM LOGIC ---
function initDynamicForm() {
    const dynamicContainer = document.getElementById('dynamicFields');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const verticalCards = document.querySelectorAll('.vertical-card');

    function renderFields(vertical) {
        currentVertical = vertical;
        // Animation trick: remove class, force reflow, add class
        dynamicContainer.classList.remove('dynamic-fields');
        void dynamicContainer.offsetWidth; 
        
        dynamicContainer.innerHTML = verticalFields[vertical] || '';
        dynamicContainer.classList.add('dynamic-fields');

        // Update tabs active state
        tabBtns.forEach(btn => {
            if(btn.dataset.tab === vertical) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Update cards active state
        verticalCards.forEach(card => {
            if(card.dataset.vertical === vertical) card.classList.add('active');
            else card.classList.remove('active');
        });

        // Update FAQs
        const faqContainer = document.getElementById('faqAccordion');
        if (faqContainer) {
            faqContainer.innerHTML = verticalFAQs[vertical] || '';
            initFAQ(); // Re-bind click events
        }
    }

    // Set initial
    renderFields(currentVertical);

    // Tab clicks
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            renderFields(btn.dataset.tab);
        });
    });

    // Make selectVertical available globally for the card onclicks
    window.selectVertical = function(vertical) {
        renderFields(vertical);
        // Scroll to form smoothly
        document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    };

    // Form Submission
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Gather ALL form data (base + dynamic fields)
        const formData = new FormData(form);
        const payload = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            city: formData.get('city'),
            product: currentVertical,
            origin: 'LANDING_PAGE',
        };
        // Capture dynamic fields
        const dynamicFields = {};
        formData.forEach((value, key) => {
            if (!['name','phone','email','city'].includes(key)) {
                dynamicFields[key] = value;
            }
        });
        payload.details = JSON.stringify(dynamicFields);

        let success = false;

        // Strategy 1: Try CRM API (when tunnel is configured)
        if (CRM_API) {
            try {
                const res = await fetch(`${CRM_API}/api/ingest`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) success = true;
            } catch (err) {
                console.warn('[CRM] API indisponível, usando fallback.', err);
            }
        }

        // Strategy 2: FormSubmit.co fallback (always works, sends email)
        if (!success) {
            try {
                const emailPayload = {
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email || 'Não informado',
                    message: `NOVO LEAD via Landing Page\n\nNome: ${payload.name}\nWhatsApp: ${payload.phone}\nE-mail: ${payload.email || 'N/A'}\nCidade: ${payload.city}\nServiço: ${payload.product}\nDetalhes: ${payload.details}`,
                    _subject: `🔥 Novo Lead: ${payload.name} — ${payload.product}`,
                    _template: 'table'
                };
                const res = await fetch(FORMSUBMIT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailPayload)
                });
                if (res.ok) success = true;
            } catch (err) {
                console.error('[FormSubmit] Fallback também falhou:', err);
            }
        }

        if (success) {
            showToast();
            form.reset();
            renderFields(currentVertical);
        } else {
            alert('Houve um erro ao enviar. Por favor, entre em contato pelo WhatsApp: (45) 99150-0513');
        }

        // Re-enable after 5s
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 5000);
    });
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// --- FAQ ACCORDION ---
function initFAQ() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Toggle current
            header.classList.toggle('active');
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = 0;
            }

            // Close others (optional, comment out if you want multiple open)
            headers.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });
}

// --- SMOOTH SCROLL FOR ANCHORS ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
