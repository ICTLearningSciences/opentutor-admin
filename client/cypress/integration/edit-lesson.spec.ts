describe("lesson screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          lesson: {
            lessonId: "lesson",
            name: "lesson",
            introduction: "introduction",
            question: "question",
            conclusion: ["conclusion"],
            expectations: [
              {
                expectation: "expectation 1",
                hints: [
                  {
                    text: "hint 1.1",
                  },
                ],
              },
            ],
            isTrainable: true,
            lastTrainedAt: "",
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("loads edit page ", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
  });

  it("new lesson has default values", () => {
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#lesson-name").should("have", "Display name for the lesson");
    cy.get("#lesson-creator").should("have", "Guest");
    cy.get("#intro").should(
      "have",
      "Introduction to the lesson,  e.g. 'This is a lesson about RGB colors'"
    );
    cy.get("#question").should(
      "have",
      "Question the student needs to answer, e.g. 'What are the colors in RGB?'"
    );
    cy.get("#expectations").children().should("have.length", 1);
    cy.get("#expectation-0 #edit-expectation").should(
      "have",
      "Add a short ideal answer for an expectation, e.g. 'Red'"
    );
    cy.get("#expectation-0 #hints").children().should("have.length", 1);
    cy.get("#hint-0 #edit-hint").should(
      "have",
      "Add a hint to help for the expectation, e.g. 'One of them starts with R'"
    );
    cy.get("#conclusions").children().should("have.length", 1);
    cy.get("#conclusion-0 #edit-conclusion").should(
      "have",
      "Add a conclusion statement, e.g. 'In summary,  RGB colors are red, green, and blue'"
    );
  });

  it("edits a new lesson", () => {
    cy.visit("/lessons/edit?lessonId=new");
    cy.get("#lesson-name").fill("Review Diode Current Flow");
    cy.get("#lesson-id").fill("review-diode-current-flow");
    cy.get("#intro").fill(
      "This is a warm up question on the behavior of P-N junction diodes."
    );
    cy.get("#question").fill(
      "With a DC input source, does current flow in the same or the opposite direction of the diode arrow?"
    );
    cy.get("#expectation-0 #edit-expectation").fill(
      "Current flows in the same direction as the arrow."
    );
    cy.get("#expectation-0 #hint-0 #edit-hint").fill(
      "What is the current direction through the diode when the input signal is DC input?"
    );
    cy.get("#conclusion-0 #edit-conclusion").fill(
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );

    cy.get("#lesson-name").should("have", "Review Diode Current Flow");
    cy.get("#lesson-id").should("have", "review-diode-current-flow");
    cy.get("#lesson-creator").should("have", "Guest");
    cy.get("#intro").should(
      "have",
      "This is a warm up question on the behavior of P-N junction diodes."
    );
    cy.get("#question").should(
      "have",
      "With a DC input source, does current flow in the same or the opposite direction of the diode arrow?"
    );
    cy.get("#expectation-0 #edit-expectation").should(
      "have",
      "Current flows in the same direction as the arrow."
    );
    cy.get("#expectation-0 #hint-0 #edit-hint").should(
      "have",
      "What is the current direction through the diode when the input signal is DC input?"
    );
    cy.get("#conclusion-0 #edit-conclusion").should(
      "have",
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );
  });

  it("can expand and collapse an expectation", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // expectation is expanded by default
    cy.get("#expectation-0 #edit-expectation");
    cy.get("#expectation-0 #hints");
    cy.get("#hint-0 #edit-hint");
    // collapsing an expectation hides hints
    cy.get("#expectation-0 #expand").click();
    cy.get("#expectation-0 #edit-expectation");
    cy.get("#expectation-0 #hints").should("not.exist");
    // expanding an expectation reveals hints
    cy.get("#expectation-0 #expand").click();
    cy.get("#expectation-0 #edit-expectation");
    cy.get("#expectation-0 #hints");
    cy.get("#hint-0 #edit-hint");
  });

  it("adds and deletes an expectation", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // must have at least 1 expectation
    cy.get("#expectations").children().should("have.length", 1);
    cy.get("#expectation-0 #delete").should("not.exist");
    // add and delete
    cy.get("#add-expectation").click();
    cy.get("#expectations").children().should("have.length", 2);
    cy.get("#expectation-0 #delete").click();
    cy.get("#expectations").children().should("have.length", 1);
  });

  it("adds and deletes a hint", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // must have at least 1 hint
    cy.get("#hints").children().should("have.length", 1);
    cy.get("#hint-0 #delete").should("not.exist");
    // add and delete
    cy.get("#add-hint").click();
    cy.get("#hints").children().should("have.length", 2);
    cy.get("#hint-0 #delete").click();
    cy.get("#hints").children().should("have.length", 1);
  });

  it("adds and deletes a conclusion", () => {
    cy.visit("/lessons/edit?lessonId=new");
    // must have at least 1 conclusion
    cy.get("#conclusions").children().should("have.length", 1);
    cy.get("#conclusion-0 #delete").should("not.exist");
    // add and delete
    cy.get("#add-conclusion").click();
    cy.get("#conclusions").children().should("have.length", 2);
    cy.get("#conclusion-0 #delete").click();
    cy.get("#conclusions").children().should("have.length", 1);
  });

  it("save button by default not visible", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#save-button").should("not.visible");
  });

  it("making an edit toggles save button visable", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").should("be.visible");
  });

  it("makes an edit and clicks on save", () => {
    cy.visit("/lessons/edit?lessonId=lesson");
    cy.get("#lesson-name").fill("{backspace}");
    cy.get("#save-button").click();
    // TODO: there are no expectatons here, not a meaningful test
  });
});