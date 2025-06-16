    import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./forum.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    }
});

const SignUp = {
    async createUser(username, password, email) {
        try {
            const existingUser = await this.checkUserExists(username, email);
            if (existingUser.exists) {
                return {
                    status: 409,
                    data: { message: existingUser.message }
                };
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;

            return new Promise((resolve, reject) => {
                db.run(query, [username, hashedPassword, email], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            });
        } catch (err) {
            throw err;
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

    async checkUserExists(username, email) {
        return new Promise((resolve, reject) => {
            const query = `SELECT username, email FROM users WHERE username = ? OR email = ?`;
            db.get(query, [username, email], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    resolve({ exists: true, message: 'Username already exists' });
                    if (row.username === username) {
                    } else {
                        resolve({ exists: true, message: 'Email already exists' });
                    }
                }
                resolve({ exists: false, message: '' });
            });
        });
    }
};

export default SignUp;