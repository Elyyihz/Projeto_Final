document.addEventListener('DOMContentLoaded', function() {
    const estrelas = document.querySelectorAll('.estrelas-avaliacao .estrela');

    estrelas.forEach(estrela => {
        estrela.addEventListener('click', function() {
            const avaliacao = this.getAttribute('data-avaliacao');
            limparSelecao();
            selecionarEstrelas(avaliacao);
        });

        estrela.addEventListener('mouseover', function() {
            const avaliacao = this.getAttribute('data-avaliacao');
            limparSelecao();
            selecionarEstrelas(avaliacao);
        });

        estrela.addEventListener('mouseout', function() {
            limparSelecao();
            const estrelasSelecionadas = document.querySelectorAll('.estrela.selecionada');
            if (estrelasSelecionadas.length) {
                const ultimaEstrela = estrelasSelecionadas[estrelasSelecionadas.length - 1];
                selecionarEstrelas(ultimaEstrela.getAttribute('data-avaliacao'));
            }
        });
    });

    function limparSelecao() {
        estrelas.forEach(estrela => {
            estrela.classList.remove('selecionada');
        });
    }

    function selecionarEstrelas(avaliacao) {
        for (let i = 0; i < avaliacao; i++) {
            estrelas[i].classList.add('selecionada');
        }
    }
});

