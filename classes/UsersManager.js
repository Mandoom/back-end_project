const fs = require('fs').promises; // File System for writing and reading files. // with promnises
const { Console } = require('console');
const path = require('path')  //for searching files at specific locations

class UserManager { // el proposito de esta clase encapsula las operaciones de management de usuarios, mas no la creacion de los mismos // this class purpose is user management without th
    constructor(filePath) {   // modelo de diseño de "repository"
        this.filePath = filePath;
    }
    // leer archivo -- read file: since we are woirking with remote files insted of arrays and ohbjects, we need to add "helper" methods to achieve our goals read file, and write/modify the data 
    // we wil retrieve data fromi a json file and the manipulate that data in JS and "replace" the content of that 
        async _readFile() {
                try {
                    const data = await fs.readFile(this.filePath, 'utf8')  // find and read the data of the filePath passed as parameter
                    return JSON.parse(data)        // We are working with arrray of objects so we work with JSON
                } catch (err) {
                    if (err.code === 'ENOENT') { // if there file dfosnt exist we work with an empty array
                        return [];
                    }
                    throw err; // display other errors
                    }
                }

        async _writeFile(data) { 
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8') //uses the filepath to write the result of other operations. json is indented 2 for better readability
                }    

        async _addUser(user) {
            try {
                const users = await this._readFile(); //read the file and store the data in json
                users.push(user); //add the new user to the array
                await this._writeFile(users); //write the data into the file
                console.log('File written successfully');
            } catch (error) {
                console.log('Theres been an error adding user: ', error);
            }
        }

        async _getUsers() {
            try {
                const users = await this._readFile();
                return users;
            } catch (error) {
                console.log('Theres been an error retrieving users: ', error);
                return [];

            }
        }

        async _deleteUser(userId) {
            try {
                const users = await this._readFile()
                const filteredUsers = users.filter(u => u.id !== userId)
                await this._writeFile(filteredUsers)
                console.log(`Usuario con ID ${userId} eliminado`)
 
            } catch (error) {
                console.log('Theres been an error eliminating users: ', error);
            }

        }

    }

