-- Table: Customer
CREATE TABLE Customer (
    CU_ID INT PRIMARY KEY
);

-- Table: Sales_Associate
CREATE TABLE Sales_Associate (
    SA_ID INT PRIMARY KEY,
    Name VARCHAR(100),
    User_ID VARCHAR(50) UNIQUE,
    Password VARCHAR(100),
    Address TEXT,
    Accumulated_Commission DECIMAL(10,2)
);

-- Table: Quotes
CREATE TABLE Quotes (
    QU_ID INT PRIMARY KEY,
    SA_ID INT,
    CU_ID INT,
    Status VARCHAR(50),
    Final_Price DECIMAL(10,2),
    Discount_Percentage DECIMAL(5,2),
    Discount_Amount DECIMAL(10,2),
    Created_Date DATE,
    Finalized_Date DATE,
    FOREIGN KEY (SA_ID) REFERENCES Sales_Associate(SA_ID),
    FOREIGN KEY (CU_ID) REFERENCES Customer(CU_ID)
);

-- Table: Line_Item
CREATE TABLE Line_Item (
    LI_ID INT PRIMARY KEY,
    QU_ID INT,
    Description TEXT,
    Price DECIMAL(10,2),
    FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
);

-- Table: Purchase_Order
CREATE TABLE Purchase_Order (
    PO_ID INT PRIMARY KEY,
    QU_ID INT,
    Final_Amount DECIMAL(10,2),
    Processing BOOLEAN,
    Date DATE,
    Sales_Commission DECIMAL(10,2),
    FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
);

-- Table: SecretNotes
CREATE TABLE SecretNotes (
    SN_ID INT PRIMARY KEY,
    QU_ID INT,
    NoteText TEXT,
    FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
);

-- Table: SalesCommission
CREATE TABLE SalesCommission (
    CO_ID INT PRIMARY KEY,
    SA_ID INT,
    Commision_Amount DECIMAL(10,2),
    Date_Earned DATE,
    FOREIGN KEY (SA_ID) REFERENCES Sales_Associate(SA_ID)
);
