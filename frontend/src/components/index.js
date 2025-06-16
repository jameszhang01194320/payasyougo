import mysql from 'mysql2';

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abc123",
    database: "ecom"
});

connection.connect((err) => {
    if (err) {
        console.error("link default:" + err.stack);
        return;
    }
    console.log("successful!");
});

connection.query("SELECT * FROM users", (err, result) => {
    if (err) {
        console.error("mistake:" + err.message);
        return;
    }
    console.log(result);
});

let sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
let params = ["char2", "aa3@yahoo.com", "123456", "asdf"];
connection.query(sql, params, (err, result) => {
    if (err) {
        console.error("mistake again:" + err.message);
        return;
    }
    console.log("success! Rows affected: " + result.affectedRows);
});

connection.end();
