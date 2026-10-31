// Confere se a página inicial está disponível.
Cypress.Commands.add('abrirInicio', () => {
  cy.visit('/');

  cy.get('#header')
    .should('be.visible');

  cy.get('a[href="/login"]')
    .should('be.visible');
});

// Abre a tela de cadastro e login.
Cypress.Commands.add('abrirLogin', () => {
  cy.get('a[href="/login"]')
    .click();

  cy.contains('h2', 'Login to your account')
    .should('be.visible');

  cy.contains('h2', 'New User Signup!')
    .should('be.visible');
});

// Preenche o formulário de login.
Cypress.Commands.add('entrar', (usuario) => {
  cy.get('[data-qa="login-email"]')
    .type(usuario.email);

  cy.get('[data-qa="login-password"]')
    .type(usuario.senha, { log: false });

  cy.get('[data-qa="login-button"]')
    .click();
});

// Confere o nome da pessoa conectada.
Cypress.Commands.add('validarUsuarioLogado', (nome) => {
  cy.contains('a', `Logged in as ${nome}`)
    .should('be.visible');
});

// Cadastra uma conta pela interface.
// Pré-condição: estar na tela de cadastro e login.
Cypress.Commands.add('cadastrar', (usuario) => {
  cy.get('[data-qa="signup-name"]')
    .type(usuario.nome);

  cy.get('[data-qa="signup-email"]')
    .type(usuario.email);

  cy.get('[data-qa="signup-button"]')
    .click();

  cy.contains('Enter Account Information', {
    matchCase: false,
  }).should('be.visible');

  cy.get('#id_gender2')
    .check();

  cy.get('[data-qa="name"]')
    .should('have.value', usuario.nome);

  cy.get('[data-qa="email"]')
    .should('have.value', usuario.email);

  cy.get('[data-qa="password"]')
    .type(usuario.senha, { log: false });

  cy.get('[data-qa="days"]')
    .select('10');

  cy.get('[data-qa="months"]')
    .select('5');

  cy.get('[data-qa="years"]')
    .select('1990');

  cy.get('#newsletter')
    .check();

  cy.get('#optin')
    .check();

  cy.get('[data-qa="first_name"]')
    .type(usuario.primeiroNome);

  cy.get('[data-qa="last_name"]')
    .type(usuario.sobrenome);

  cy.get('[data-qa="company"]')
    .type('Empresa de Testes');

  cy.get('[data-qa="address"]')
    .type(usuario.endereco);

  cy.get('[data-qa="address2"]')
    .type('Apartamento 10');

  cy.get('[data-qa="country"]')
    .select('Canada');

  cy.get('[data-qa="state"]')
    .type('Ontario');

  cy.get('[data-qa="city"]')
    .type('Toronto');

  cy.get('[data-qa="zipcode"]')
    .type('M5V 2T6');

  cy.get('[data-qa="mobile_number"]')
    .type('4165550100');

  cy.get('[data-qa="create-account"]')
    .click();

  cy.get('[data-qa="account-created"]')
    .should('be.visible')
    .and('contain.text', 'Account Created!');

  cy.get('[data-qa="continue-button"]')
    .click();

  cy.validarUsuarioLogado(usuario.nome);
});

// Exclui a conta pela interface.
Cypress.Commands.add('excluirConta', () => {
  cy.get('a[href="/delete_account"]')
    .click();

  cy.get('[data-qa="account-deleted"]')
    .should('be.visible')
    .and('contain.text', 'Account Deleted!');

  cy.get('[data-qa="continue-button"]')
    .click();
});

// Prepara uma conta para os cenários que exigem
// uma pessoa já cadastrada.
// Isso é preparação de dados, não o teste de cadastro.
Cypress.Commands.add('criarContaPorApi', (usuario) => {
  cy.request({
    method: 'POST',
    url: '/api/createAccount',

    form: true,

    body: {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: 'Mrs',
      birth_date: '10',
      birth_month: '5',
      birth_year: '1990',
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: 'Empresa de Testes',
      address1: usuario.endereco,
      address2: 'Apartamento 10',
      country: 'Canada',
      zipcode: 'M5V 2T6',
      state: 'Ontario',
      city: 'Toronto',
      mobile_number: '4165550100',
    },
  }).then((resposta) => {
    expect(resposta.status).to.eq(200);

    const corpo = typeof resposta.body === 'string'
      ? JSON.parse(resposta.body)
      : resposta.body;

    expect(corpo.responseCode).to.eq(201);
    expect(corpo.message).to.eq('User created!');
  });
});

// Remove os dados de teste ao final.
// Uma conta já excluída pela interface pode retornar 404.
Cypress.Commands.add('limparContaPorApi', (usuario) => {
  cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',

    form: true,
    failOnStatusCode: false,

    body: {
      email: usuario.email,
      password: usuario.senha,
    },
  }).then((resposta) => {
    expect(resposta.status).to.eq(200);

    const corpo = typeof resposta.body === 'string'
      ? JSON.parse(resposta.body)
      : resposta.body;

    expect(corpo.responseCode).to.be.oneOf([200, 404]);
  });
});

// Adiciona uma unidade do produto de ID 1.
Cypress.Commands.add('adicionarProdutoAoCarrinho', () => {
  cy.visit('/product_details/1');

  cy.get('.product-information')
    .should('be.visible');

  cy.get('#quantity')
    .clear()
    .type('1');

  cy.contains('button', 'Add to cart')
    .click();

  cy.get('#cartModal')
    .should('be.visible')
    .within(() => {
      cy.contains('a', 'View Cart')
        .click();
    });

  cy.location('pathname')
    .should('eq', '/view_cart');

  cy.get('#product-1')
    .should('be.visible');

  cy.get('#product-1 .cart_quantity')
    .should('contain.text', '1');
});

// Confere o checkout e preenche um pagamento fictício.
Cypress.Commands.add('finalizarCompra', (usuario) => {
  cy.contains('a', 'Proceed To Checkout')
    .click();

  cy.location('pathname')
    .should('eq', '/checkout');

  cy.contains('Address Details')
    .should('be.visible');

  cy.contains('Review Your Order')
    .should('be.visible');

  cy.get('#address_delivery')
    .should('contain.text', usuario.endereco)
    .and('contain.text', usuario.primeiroNome)
    .and('contain.text', usuario.sobrenome);

  cy.get('#address_invoice')
    .should('contain.text', usuario.endereco);

  cy.get('#product-1')
    .should('be.visible');

  cy.get('textarea[name="message"]')
    .type('Compra fictícia do trabalho de automação.');

  cy.contains('a', 'Place Order')
    .click();

  cy.get('[data-qa="name-on-card"]')
    .type(usuario.nome);

  cy.get('[data-qa="card-number"]')
    .type('4111111111111111');

  cy.get('[data-qa="cvc"]')
    .type('123');

  cy.get('[data-qa="expiry-month"]')
    .type('12');

  cy.get('[data-qa="expiry-year"]')
    .type('2030');

  cy.get('[data-qa="pay-button"]')
    .click();

  cy.location('pathname')
    .should('include', '/payment_done/');

  cy.get('[data-qa="order-placed"]')
    .should('be.visible')
    .and('contain.text', 'Order Placed!');

  cy.contains('Congratulations! Your order has been confirmed!')
    .should('be.visible');
});