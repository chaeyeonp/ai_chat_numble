// Teams 메세지 전송 함수

describe("Login", () => {
  it("login and logout validation", () => {
    cy.visit("http://localhost:3000/");
    cy.get('input[name="login_input"]')
      .should("exist")
      // TODO :https://platform.openai.com/account/api-keys 발급 받아 변경 필요
      .type("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");

    cy.get("#login_button").should("exist").click();
    cy.url().should("include", "chatlist");
    cy.wait(1000);

    cy.get("#plus_button").should("exist").click();
    cy.get('input[name="room_name"]').should("exist").type("test_room");
    cy.get('input[name="room_members"]').should("exist").type("5");
    cy.get("#create_button").click();

    cy.get("#test_room").should("exist").click();
    cy.get('input[name="chat_input"]').should("exist").type("What is cypress?");
    cy.get("#back_button").should("exist").click();

    cy.get("#modify_button").should("exist").click();
    cy.get("#edit_delete_button").should("exist").click();

    cy.url().should("include", "chatlist");
  });
});
