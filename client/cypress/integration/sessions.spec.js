/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
describe("sessions screen", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          sessions: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lesson: {
                    lessonId: "lesson1",
                    name: "lesson 1",
                    createdBy: "teacher 1",
                  },
                  sessionId: "session1",
                  classifierGrade: 1,
                  graderGrade: 1,
                  createdAt: "1/1/20000, 12:00:00 AM",
                  username: "user 1",
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lesson: {
                    lessonId: "lesson2",
                    name: "lesson 2",
                    createdBy: "teacher 2",
                  },
                  sessionId: "session2",
                  classifierGrade: 0.5,
                  graderGrade: null,
                  createdAt: "1/1/20000, 12:00:00 AM",
                  username: "user 2",
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
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

  it("displays session table with headers", () => {
    cy.visit("/sessions");
    cy.get("#column-header");
    cy.get("#column-header #lessonName").contains("Lesson");
    cy.get("#column-header #grade-link").contains("Grade");
    cy.get("#column-header #graderGrade").contains("Instructor Grade");
    cy.get("#column-header #classifierGrade").contains("Classifier Grade");
    cy.get("#column-header #createdAt").contains("Date");
    cy.get("#column-header #lessonCreatedBy").contains("Created By");
    cy.get("#column-header #username").contains("Username");
  });

  it("displays a list of sessions", () => {
    cy.visit("/sessions");
    cy.get("#sessions").children().should("have.length", 2);
    cy.get("#session-0 #lesson").contains("lesson 1");
    cy.get("#session-0 #instructor-grade").contains("100");
    cy.get("#session-0 #classifier-grade").contains("100");
    cy.get("#session-0 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#session-0 #creator").contains("teacher 1");
    cy.get("#session-0 #username").contains("user 1");
    cy.get("#session-1 #lesson").contains("lesson 2");
    cy.get("#session-1 #instructor-grade").contains("?");
    cy.get("#session-1 #classifier-grade").contains("50");
    cy.get("#session-1 #creator").contains("teacher 2");
    cy.get("#session-1 #username").contains("user 2");
  });

  it("opens edit for a session", () => {
    cy.visit("/sessions");
    cy.get("#session-0 #lesson a").click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("contain", "?lessonId=lesson1");
  });

  it("opens grade for a session", () => {
    cy.visit("/sessions");
    cy.get("#session-0 #grade").click();
    cy.location("pathname").should("contain", "/sessions/session");
    cy.location("search").should("contain", "?sessionId=session1");
  });

  it("displays an option to view already graded sessions", () => {
    cy.visit("/sessions");
    const option = cy.get("#show-graded-checkbox");
    option.should("not.have.attr", "checked");
    cy.get("#toggle-graded").click();
  });
});
