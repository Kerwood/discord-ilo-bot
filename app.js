require('dotenv').config()
const Discord = require('discord.js')
const discordClient = new Discord.Client()
const axios = require('axios')
const discordToken = process.env.DISCORD_TOKEN
const https = require('https')
const agent = new https.Agent({
  rejectUnauthorized: false
})
const axiosInstance = axios.create({
  httpsAgent: agent,
  baseURL: process.env.ILO_URL,
  auth: {
    username: process.env.ILO_USER,
    password: process.env.ILO_PASS
  }
})

/* ###################################
#              Funtions              #
#################################### */

const getPowerState = () => {
  return axiosInstance.get('/redfish/v1/systems/1')
    .then(response => response.data.PowerState)
}

const logError = (msg, error) => {
  console.error(error.message)
  msg.channel.send('Something went wrong, check the captains log.')
}

const startServer = (state) => {
  if (state === 'On') return 'Server is already powered on!'
  return axiosInstance.post('/redfish/v1/systems/1', { Action: 'Reset', ResetType: 'On' })
    .then(() => 'Initiating Power Sequence.. ⚡')
}

const stopServer = (state) => {
  if (state === 'Off') return 'Server is already powered off!'
  return axiosInstance.post('/redfish/v1/systems/1', { Action: 'Reset', ResetType: 'PushPowerButton' })
    .then(() => 'Initiating Power Down! ⚡')
}

/* ###################################
#            Discord Client          #
#################################### */

discordClient.on('ready', () => {
  console.log('Discord Bot Ready!!')
})

discordClient.on('message', msg => {
  if (msg.channel.id !== process.env.CHANNEL_ID) return

  if (msg.content.toLowerCase() === '!startserver') {
    getPowerState()
      .then(state => startServer(state))
      .then(response => msg.channel.send(response))
      .catch(error => logError(msg, error))
  } else if (msg.content.toLowerCase() === '!stopserver') {
    getPowerState()
      .then(state => stopServer(state))
      .then(response => msg.channel.send(response))
      .catch(error => logError(msg, error))
  } else if (msg.content.toLowerCase() === '!status') {
    getPowerState()
      .then(state => msg.channel.send(`Power state is: **${state}**`))
      .catch(error => logError(msg, error))
  }
})

discordClient.on('disconnect', () => {
  console.log('Disconnected from Discord server')
})

discordClient.on('reconnecting', () => {
  console.log('Reconnecting to Discord server')
})

discordClient.login(discordToken)
