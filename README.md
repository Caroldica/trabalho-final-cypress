# Trabalho final — Automação Web com Cypress

Autora: Carolina Araújo

## Objetivo
Automatizar os casos 1, 2, 3, 4, 5, 8, 9, 10, 15 e 16
do site Automation Exercise.

## Tecnologias
JavaScript, Cypress, cypress-mochawesome-reporter
e GitHub Actions.

## Instalação
Abra o terminal na pasta do projeto e execute:
npm ci

## Executar os dez testes
npm run test:final

## Abrir a interface do Cypress
npm run cy:open

## Organização
cypress/e2e: casos de teste.
cypress/support: comandos reutilizáveis e suporte.
.github/workflows: execução pelo GitHub Actions.

## Relatórios
Localmente: cypress/reports/index.html.
No GitHub Actions: baixar o artefato relatorio-cypress.

## Resultado validado
A execução conferida em 31/10/2026 apresentou
10 testes aprovados e nenhuma falha.

## Repositório
https://github.com/Caroldica/trabalho-final-cypress

## Aplicação e casos de referência
https://automationexercise.com
https://automationexercise.com/test_cases