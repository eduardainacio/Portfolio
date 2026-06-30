document.addEventListener('DOMContentLoaded', () => {

    /* CAPTURA DE ELEMENTOS DO DOM */
    
    // Elementos da Barra de Navegação 
    const abas = document.querySelectorAll('.tab-link');
    const barraHorizontal = document.getElementById('barra-inferior');
    const menuToggle = document.getElementById('menu-toggle');
    const navAbas = document.getElementById('nav-abas');
    
    // Captura tags estruturais para mapeamento de rolagem
    const secoes = document.querySelectorAll('section, header, div[id]');

    // Elementos de captura de dados do Formulário de Contato
    const form = document.getElementById("formulario-contato");
    const inputNome = document.getElementById("nome");
    const inputEmail = document.getElementById("email");
    const txtMensagem = document.getElementById("mensagem");

    // Elementos da Modal de Alerta
    const modal = document.getElementById("modal-alerta");
    const modalCorpo = document.getElementById("modal-corpo");
    const modalMensagem = document.getElementById("modal-mensagem");
    const btnOk = document.getElementById("modal-btn-ok");

    /* RASTREADOR DE ROLAGEM DINÂMICO */

    // Função responsável por pintar a aba e a barra com a cor correta
    function ativarAbaVisual(abaAtiva) {
        // Reseta o estilo de todas as abas para o padrão inativo
        abas.forEach(aba => {
            aba.classList.remove('active'); // Remove estilos inline
            aba.style.backgroundColor = 'transparent';
            aba.style.color = ''; 
        });

        // Adiciona a classe de controle CSS para a aba selecionada
        abaAtiva.classList.add('active');
        
        // SÓ aplica as cores customizadas e a barra inferior se for tela de Computador
        if (window.innerWidth > 768) {
            const corDeFundo = abaAtiva.getAttribute('data-color');
            const corDoTexto = abaAtiva.getAttribute('data-text');

            abaAtiva.style.backgroundColor = corDeFundo;
            abaAtiva.style.color = corDoTexto;
            barraHorizontal.style.backgroundColor = corDeFundo;
            barraHorizontal.style.display = 'block'; // Garante que a barra aparece no PC
        } else {
            barraHorizontal.style.display = 'none'; // No celular ele esconde a barra inferior horizontal para não quebrar o layout
        }
    }

    // Configuração do "Vigiador" da rolagem por isolar uma faixa central de 20% na tela do usuário
    const opcoesRastreador = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', 
        threshold: 0 // Dispara assim que o primeiro pixel da seção interceptar a área de foco
    };

    const rastreadorDeSeção = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            // Verifica se a seção entrou em evidência na tela
            if (entrada.isIntersecting) {
                const idDaSecao = entrada.target.getAttribute('id');
                // Procura na barra de navegação o link do ID da seção
                const abaCorrespondente = document.querySelector(`.tab-link[href="#${idDaSecao}"]`);
                
                if (abaCorrespondente) {
                    ativarAbaVisual(abaCorrespondente); // Executa a estilização 
                }
            }
        });
    }, opcoesRastreador);

    // Inicializa e mapeia a observação em cada seção do portfólio
    secoes.forEach(secao => {
        if (secao.getAttribute('id')) {
            rastreadorDeSeção.observe(secao);
        }
    });

    /*  3. MENU HAMBÚRGUER */

    // Abre e fecha o menu ao clicar no botão hambúrguer - Adiciona ou remove a classe ".ativo"
    menuToggle.addEventListener('click', () => {
        navAbas.classList.toggle('ativo');
    });

    // Fecha o menu automaticamente quando você clica em qualquer link dele
    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            navAbas.classList.remove('ativo');
        });
    });


/*  4. FORMULÁRIO DE CONTATO & CONTROLE DA MENSAGEM FLUTUANTE */

    // Função auxiliar para exibir a mensagem personalizada
    function mostrarAlerta(texto, tipo) {
        modalMensagem.textContent = texto;
        
        // Limpa classes anteriores e aplica a nova (de sucesso ou erro)
        modalCorpo.className = "modal-conteudo " + tipo;
        
        // Remove a classe que esconde a modal para ela aprecer na tela
        modal.classList.remove("modal-escondido");
    }

    // Fecha a modal ao clicar no botão OK e deixa-la oculta de novo
    btnOk.addEventListener("click", function () {
        modal.classList.add("modal-escondido");
    });

    // Envio do formulário
    form.addEventListener("submit", function (evento) {
        // Impede o recarregamento padrão da página ao enviar
        evento.preventDefault();

        // Remove espaços em branco nas pontas para tratar os dados melhor
        const nome = inputNome.value.trim();
        const email = inputEmail.value.trim();
        const mensagem = txtMensagem.value.trim();

        // Validação de campos obrigatórios que estão vazios
        if (nome === "" || email === "" || mensagem === "") {
            mostrarAlerta("Por favor, preencha todos os campos obrigatórios!", "erro");
            return; // Interrompe a execução
        }

        // Validação do formato do e-mail usando Expressão Regular, vê se a string nao inicia com espaço, se possui @, e tem um dominio e extensão no final.
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (!regexEmail.test(email)) {
            mostrarAlerta("Por favor, insira um e-mail com formato válido (usuario@dominio.com).", "erro");
            return; // Interrompe a execução
        }
        
        //Gera um feedback de sucesso na tela
        mostrarAlerta("Mensagem enviada com sucesso!", "sucesso");

        form.reset(); //Limpeza dos campos do formulário depois do envio 
    });
});
