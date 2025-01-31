`npm start` -> starts server
`npm run dev` -> starts development server

Both of these commands depend on the following JSON attributes in package.json
```json
"start": "node server"
"dev": "nodemon" server" 
```

where 'server' is the name of our entry point file (in this case our file is named server.js)
