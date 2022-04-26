A discord bot that tracks Funding contracts in order to notify the team / community when significant things happen wrt the citadel price.

## Prerequisites

- [Node.js & NPM](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

### Setup

```console
mv src/config.template.json src/config.json
yarn
```

Then complete the config.json file with proper parameters.

### Running

```console
yarn start
```

# Configure Bot On Server

Add the bot to your server using this [link](https://discord.com/api/oauth2/authorize?client_id=966739160666882108&permissions=0&scope=bot).

Set the proper permissions for the bot in the channel you want it to work.
Restrict it to only that channel.

### Start the bot on target channel

```
!start-price-tracker
```

### Stop the bot on target channel - Only the user who start it could stop it

```
!stop-price-tracker
```

### Set the role you want to notify when price flag is on.

```
!set-notify-role YOUR_TARGET_ROLE_NAME
```
