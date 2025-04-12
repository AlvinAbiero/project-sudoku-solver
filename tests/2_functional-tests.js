const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        assert.equal(
          res.body.solution,
          "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
        );
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
        value: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 2);
        assert.include(res.body.conflict, "row");
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
        value: "5",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.isAtLeast(res.body.conflict.length, 2);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
        coordinate: "A2",
        value: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 3);
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "column");
        assert.include(res.body.conflict, "region");
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X",
        coordinate: "A2",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.",
        coordinate: "A2",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "J2",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
        value: "0",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });

  // After all tests are complete, we can close the server connection
  // This is optional but good practice
  suiteTeardown(function () {
    // If you need to clean up any resources
  });
});
