const { Command } = require("discord.js-commando");

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			memberName: "ping",
			group: "misc",
			description: "Get the ping of the bot."
		});
	}

	async run(message) {
		const pingMsg = await message.channel.send("Pinging ...");
		return pingMsg.edit(`Message Ping: ${Math.round(pingMsg.createdTimestamp - message.createdTimestamp)}ms | Websocket Ping: ${Math.round(this.client.ping)}ms`);
	}
};