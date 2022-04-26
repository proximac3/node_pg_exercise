
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries(
  code text NOT NULL primary key,
  name text NOT NULL
);

CREATE TABLE industry_company(
  company_code text NOT NULL REFERENCES companies ON DELETE CASCADE UNIQUE,
  industry_code text NOT NULL REFERENCES industries ON DELETE CASCADE UNIQUE
);


INSERT INTO industries
  VALUES ('tech', 'Technology'),
          ('auto', 'Automitive'),
          ('aero', 'Aerospace');

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('tla', 'Tesla', 'automaker'),
         ('spx', 'Spacex', 'mars colonization');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);


INSERT INTO industry_company
  VALUES ('apple', 'tech'),
          ('tla', 'auto'),
          ('spx', 'aero');
