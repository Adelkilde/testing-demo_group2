import lib from "./lib";
import db from "./db";
import mail from "./mail";

describe("absolute", () => {
  it("should return a positive number if the input is positive", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if the input is negative", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return 0 if the input is 0", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe("greet", () => {
  it("should return the greeting message with the name", () => {
    const result = lib.greet("John");
    expect(result).toMatch(/John/);
    expect(result).toContain("Welcome");
  });
});

describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    const result = lib.getCurrencies();
    expect(result).toEqual(expect.arrayContaining(["USD", "AUD", "EUR"]));
  });
});

describe("getProduct", () => {
  it("should return the product with the given id", () => {
    const result = lib.getProduct(1);
    expect(result).toEqual({ id: 1, price: 10 });
  });
});

describe("registerUser", () => {
  it("should throw an error if the username is falsy", () => {
    const falsyValues = [null, undefined, NaN, "", 0, false];
    falsyValues.forEach((value) => {
      expect(() => lib.registerUser(value)).toThrow();
    });
  });

  it("should return a user object if valid username is passed", () => {
    const result = lib.registerUser("john");
    expect(result).toMatchObject({ username: "john" });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe("applyDiscount", () => {
  it("should apply 10% discount if the customer has more than 10 points", () => {
    db.getCustomerSync = function (customerId) {
      console.log("Fake reading customer...");
      return { id: customerId, points: 20 };
    };

    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

describe("notifyCustomer", () => {
  it("should send an email to the customer", () => {
    db.getCustomerSync = function (customerId) {
      return { email: "a" };
    };

    let mailSent = false;
    mail.send = function (email, message) {
      mailSent = true;
    };

    lib.notifyCustomer({ customerId: 1 });

    expect(mailSent).toBe(true);
  });
});
