describe('Trabalho final - Automation Exercise', () => {
  let usuario;
  let limparConta;

  beforeEach(() => {
    const identificador =
      `${Date.now()}${Cypress._.random(100000, 999999)}`;

    usuario = {
      nome: 'Pessoa QA',
      primeiroNome: 'Pessoa',
      sobrenome: 'QA',
      email: `qa.${identificador}@example.com`,
      senha: `Teste@${identificador}`,
      endereco: '123 Test Street',
    };

    limparConta = false;

    cy.abrirInicio();
  });

  afterEach(() => {
    if (limparConta) {
      cy.limparContaPorApi(usuario);
    }
  });

  it('CT01 - Cadastrar uma pessoa e excluir a conta', () => {
    limparConta = true;

    cy.abrirLogin();

    cy.cadastrar(usuario);

    cy.excluirConta();
  });

  it('CT02 - Entrar com e-mail e senha corretos', () => {
    limparConta = true;

    cy.criarContaPorApi(usuario);

    cy.abrirLogin();

    cy.entrar(usuario);

    cy.validarUsuarioLogado(usuario.nome);

    cy.excluirConta();
  });

  it('CT03 - Recusar login com dados incorretos', () => {
    cy.abrirLogin();

    cy.entrar({
      email: usuario.email,
      senha: 'SenhaIncorreta123!',
    });

    cy.contains('Your email or password is incorrect!')
      .should('be.visible');
  });

  it('CT04 - Sair de uma conta autenticada', () => {
    limparConta = true;

    cy.criarContaPorApi(usuario);

    cy.abrirLogin();

    cy.entrar(usuario);

    cy.validarUsuarioLogado(usuario.nome);

    cy.get('a[href="/logout"]')
      .click();

    cy.location('pathname')
      .should('eq', '/login');

    cy.contains('h2', 'Login to your account')
      .should('be.visible');

    cy.get('a[href="/logout"]')
      .should('not.exist');
  });

  it('CT05 - Recusar cadastro com e-mail existente', () => {
    limparConta = true;

    cy.criarContaPorApi(usuario);

    cy.abrirLogin();

    cy.get('[data-qa="signup-name"]')
      .type(usuario.nome);

    cy.get('[data-qa="signup-email"]')
      .type(usuario.email);

    cy.get('[data-qa="signup-button"]')
      .click();

    cy.contains('Email Address already exist!')
      .should('be.visible');
  });

  it('CT08 - Exibir produtos e os detalhes do primeiro', () => {
    cy.get('a[href="/products"]')
      .click();

    cy.location('pathname')
      .should('eq', '/products');

    cy.contains('h2', 'All Products')
      .should('be.visible');

    cy.get('.features_items .product-image-wrapper')
      .should('have.length.greaterThan', 0);

    cy.get('.features_items .product-image-wrapper')
      .first()
      .within(() => {
        cy.get('.productinfo p')
          .invoke('text')
          .as('nomeProduto', { type: 'static' });

        cy.contains('a', 'View Product')
          .click();
      });

    cy.location('pathname')
      .should('include', '/product_details/');

    cy.get('@nomeProduto').then((nome) => {
      cy.get('.product-information h2')
        .should('have.text', nome);
    });

    cy.get('.product-information').within(() => {
      cy.contains('p', /Category:\s*\S+/)
        .should('be.visible');

      cy.contains('span', /Rs\.\s*\d+/)
        .should('be.visible');

      cy.contains('p', /Availability:\s*\S+/)
        .should('be.visible');

      cy.contains('p', /Condition:\s*\S+/)
        .should('be.visible');

      cy.contains('p', /Brand:\s*\S+/)
        .should('be.visible');
    });
  });

  it('CT09 - Buscar produtos pelo nome', () => {
    cy.get('a[href="/products"]')
      .click();

    cy.contains('h2', 'All Products')
      .should('be.visible');

    cy.get('#search_product')
      .type('Blue Top');

    cy.get('#submit_search')
      .click();

    cy.contains('h2', 'Searched Products')
      .should('be.visible');

    cy.get('.features_items .product-image-wrapper')
      .should('have.length.greaterThan', 0);

    cy.get('.features_items .productinfo p')
      .each(($nome) => {
        cy.wrap($nome)
          .should('be.visible');

        expect($nome.text().toLowerCase())
          .to.include('blue top');
      });
  });

  it('CT10 - Inscrever um e-mail na página inicial', () => {
    cy.get('#footer')
      .scrollIntoView();

    cy.contains('h2', 'Subscription')
      .should('be.visible');

    cy.get('#susbscribe_email')
      .type(usuario.email);

    cy.get('#subscribe')
      .click();

    cy.contains('You have been successfully subscribed!')
      .should('be.visible');
  });

  it('CT15 - Cadastrar antes do checkout e comprar', () => {
    limparConta = true;

    cy.abrirLogin();

    cy.cadastrar(usuario);

    cy.adicionarProdutoAoCarrinho();

    cy.finalizarCompra(usuario);

    cy.excluirConta();
  });

  it('CT16 - Fazer login antes do checkout e comprar', () => {
    limparConta = true;

    cy.criarContaPorApi(usuario);

    cy.abrirLogin();

    cy.entrar(usuario);

    cy.validarUsuarioLogado(usuario.nome);

    cy.adicionarProdutoAoCarrinho();

    cy.finalizarCompra(usuario);

    cy.excluirConta();
  });
});