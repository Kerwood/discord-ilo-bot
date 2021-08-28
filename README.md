# Discord iLO Bot

Build the image, and run with below environment variables. The channel ID will limit the bot to only respond in that specific channel.
```
docker build -t discord-ilo-bot .

docker run --name discord-ilo-bot \
  -e DISCORD_TOKEN=<discord-bot-token> \
  -e CHANNEL_ID=<discord-channel-id>
  -e ILO_URL=https://<ilo-aip> \
  -e ILO_USER=<ilo-username> \
  -e ILO_PASS=<ilo-password> \
  -d discord-ilo-bot
```
