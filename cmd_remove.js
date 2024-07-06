const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config();

var clientId = process.env.CLIENT_ID;
var token = process.env.CLIENT_TOKEN;

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);