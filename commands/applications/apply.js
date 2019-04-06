const { Command } = require("discord.js-commando");

module.exports = class Apply extends Command {
	constructor(client) {
		super(client, {
			name: "apply",
			memberName: "apply",
			group: "applications",
			description: "Apply for the Designer list.",
			args: [
				{
					key: "name",
					prompt: "Name you want to go by on the list",
					type: "string"
				},
				{
					key: "information",
					prompt: "Information about you, including your portfolio and contact details",
					type: "string"
				}
			]
		});
	}

	run(message, args) {
		const applicationChannel = message.guild.settings.get("applicationChannel");
		const requiredPermissions = ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"];
		if (!applicationChannel)
			message.channel.send("No application channel set. Ask a staff to enable it for this guild.");
		else if (applicationChannel) {
			if (!message.guild.channels.has(applicationChannel)) {
				message.channel.send("Application channel does not exist, removing.");
				message.guild.settings.remove("applicationChannel");
			}
			else if (!message.guild.channels.get(applicationChannel).memberPermissions(this.client.user).has(requiredPermissions)) {
				message.channel.send("Bot has insufficient permissions in the current application channel, removing.");
				message.guild.settings.remove("applicationChannel");
			}
		}
	}
};