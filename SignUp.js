const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');

const SignUp = {
    async createUser(username, password, email) {
        const db = new sqlite3.Database('./forum.db');
        try {
            console.log('Creating user:', { username, email }); // Debug log

            const existingUser = await this.checkUserExists(db, username, email);
            if (existingUser.exists) {
                throw new Error(existingUser.message);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully'); // Debug log

            return new Promise((resolve, reject) => {
                const query = 'INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)';
                db.run(query, [username, hashedPassword, email], function(err) {
                    if (err) {
                        console.error('Database error:', err); // Debug log
                        reject(err);
                        return;
                    }
                    console.log('User created with ID:', this.lastID); // Debug log
                    resolve(this.lastID);
                });
            });
        } finally {
            db.close();
        }
    },

    async handleSignIn(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const errorDiv = document.getElementById('error-message');
        const signInButton = document.querySelector('button[type="submit"]');

        try {
            errorDiv.style.display = 'none';
            signInButton.disabled = true;

            if (!this.validateInput(username, password, email)) {
                return;
            }

            const result = await this.createUser(username, password, email);
            if (result.status === 409) {
                errorDiv.textContent = result.data.message;
                errorDiv.style.display = 'block';
                return result;
            }

            db.close((err) => {
                if (err) console.error('Error closing database:', err);
            });

            return {
                status: 201,
                data: {
                    message: 'User created successfully',
                    userId: result
                }
            };

        } catch (error) {
            console.error('Sign in error:', error);
            errorDiv.textContent = 'An error occurred during sign in';
            errorDiv.style.display = 'block';
            return {
                status: 500,
                data: { message: 'Internal server error' }
            };
        } finally {
            signInButton.disabled = false;
        }
    },

    validateInput(username, password, email) {
        const errorDiv = document.getElementById('error-message');
        // missing fields 
        if (!username || !password || !email) {
            errorDiv.textContent = 'Un nom d\'utilisateur, un mot de passe et un email sont requis'; 
            errorDiv.style.display = 'block';
            return false;
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorDiv.textContent = 'Veuillez entrer une adresse email valide';
            errorDiv.style.display = 'block';
            return false;
        }
        // pass
        if (password.length < 8) {
            errorDiv.textContent = 'Votre mot de passe doit comporter au moins 8 caractères';
            errorDiv.style.display = 'block';
            return false;
        }
        // pass clause
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            errorDiv.textContent = 'Votre mot de passe doit contenir au moins une lettre et un chiffre';
            errorDiv.style.display = 'block';
            return false;
        }

        return true;
    },

    async checkUserExists(db, username, email) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Username, Email FROM users WHERE Username = ? OR Email = ?`;
            db.get(query, [username, email], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    if (row.Username === username) {
                        resolve({ exists: true, message: 'Utilisateur existes déja' });
                    } else {
                        resolve({ exists: true, message: 'Email existes déja' });
                    }
                } else {
                    resolve({ exists: false, message: '' });
                }
            });
        });
    }
};

module.exports = SignUp;