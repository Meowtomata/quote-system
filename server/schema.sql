CREATE TABLE IF NOT EXISTS Sales_Associate (
    SA_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    User_ID TEXT UNIQUE,
    Password TEXT,
    Address TEXT,
    Accumulated_Commission REAL DEFAULT 0
);

-- Table: Quotes
CREATE TABLE IF NOT EXISTS Quotes (
    QU_ID INTEGER PRIMARY KEY AUTOINCREMENT, -- Quote ID
    SA_ID INTEGER,             -- Sales Associate ID
    CU_ID INTEGER,             -- Customer ID
    Status TEXT,
    Discount_Amount REAL,
    isPercentage INT,
    Created_Date DATE DEFAULT CURRENT_TIMESTAMP,
    Finalized_Date DATE,
    FOREIGN KEY (SA_ID) REFERENCES Sales_Associate(SA_ID)
);

-- Table: Line_Item
CREATE TABLE IF NOT EXISTS Line_Item (
    LI_ID INTEGER PRIMARY KEY,
    QU_ID INTEGER,
    Description TEXT,
    Price REAL,
    FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
);

-- Table: SecretNotes
CREATE TABLE IF NOT EXISTS SecretNotes (
    SN_ID INTEGER PRIMARY KEY,
    QU_ID INTEGER,
    NoteText TEXT,
    FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
);

INSERT INTO Sales_Associate (SA_ID, Name, User_ID, Password, Address)
VALUES (1, "Samantha", "Username123", "Password123", "123 Address Lane");
