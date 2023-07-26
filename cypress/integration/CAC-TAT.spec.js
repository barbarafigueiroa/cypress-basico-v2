/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", () => {
  const THREE_SECONDS_IN_MS = 3000;

  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("Verifica o título da aplicação", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", () => {
    const longText =
      "blablablablablablablablablablablablablablablablablablablablablablablablablablblablablablablabalbalablablablabalbalbalbalablabal......";

    cy.clock();

    cy.get("#firstName").type("Bárbara");
    cy.get("#lastName").type("Figueirôa");
    cy.get("#email").type("bfamorim@outlook.com", { delay: 0 });
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".success").should("not.be.visible");
  });

  it("Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();

    cy.get("#firstName").type("Bárbara");
    cy.get("#lastName").type("Figueirôa");
    cy.get("#email").type("bfamorim@outlook,com");
    cy.get("#open-text-area").type("testando...");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  Cypress._.times(8, () => {
    it("Campo telefone continua vazio quando preenchido com valor não-numérico", () => {
      cy.get("#phone").type("blablabla").should("have.value", "");
    });
  });

  it("Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();

    cy.get("#firstName").type("Bárbara");
    cy.get("#lastName").type("Figueirôa");
    cy.get("#email").type("bfamorim@outlook.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("testando...");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("Preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Bárbara")
      .should("have.value", "Bárbara")
      .clear()
      .should("have.value", "");

    cy.get("#lastName")
      .type("Figueirôa")
      .should("have.value", "Figueirôa")
      .clear()
      .should("have.value", "");

    cy.get("#email")
      .type("bfamorim@outlook.com")
      .should("have.value", "bfamorim@outlook.com")
      .clear()
      .should("have.value", "");

    cy.get("#phone")
      .type(81994204488)
      .should("have.value", "81994204488")
      .clear()
      .should("have.value", "");
  });

  it("Exibe mensagem de erro ao submter o formulário sem preencher os campos obrigatórios", () => {
    cy.clock();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("Envia o  forumulário com sucesso usando um comando customizado", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  it("Seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("Seleciona um produto (Mentoria) por seu value", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("Seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('Marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("Marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("Marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("Seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("Seleciona um arquivo simulando drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("Verifica que a política de privacidade abre em outra aba sem a necessidade de um click", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("Acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();

    cy.contains("CAC TAT - Política de privacidade").should("be.visible");
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("Preenche a area de texto usando o comando invoke", () => {
    const longText = Cypress._.repeat("blablablabla ", 20);

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("Faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should((resp) => {
      const { status, statusText, body } = resp;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it.only('Encontrando o gato escondido', ()=> {
    cy.get('#cat')
    .invoke('show')
    .should('be.visible')

    cy.get('#title')
    .invoke('text', 'CAT TAT')

    cy.get('#subtitle')
    .invoke('text', 'I 🧡 cats')

  })
});
