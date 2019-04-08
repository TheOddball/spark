const { Command } = require("discord.js-commando");

module.exports = class ApplicationChannel extends Command {
	constructor(client) {
		super(client, {
			name: "applicationchannel",
			memberName: "applicationchannel",
			group: "applications",
			description: "Get, set or remove the channel to react with approval/denial reactions in this guild.",
			aliases: ["appch"],
			userPermissions: ["MANAGE_CHANNELS"],
			args: [
				{
					key: "action",
					prompt: "Get, set or remove the application channel.",
					type: "string",
					oneOf: ["get", "set", "remove"],
					default: "get"
				},
				{
					key: "channel",
					prompt: "Channel to react in",
					type: "channel",
					default: ""
				}
			]
		});
	}

	async run(message, args) {
		const applicationChannel = message.guild.settings.get("applicationChannel");
		const requiredPermissions = ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"];
		if (args.action === "get" && !applicationChannel) {
			message.channel.send("No application channel set for this guild.");
		}
		else if (args.action === "get" && applicationChannel) {
			if (!message.guild.channels.has(applicationChannel)) {
				message.channel.send("Application channel does not exist, removing.");
				message.guild.settings.remove("applicationChannel");
			}
			else if (!message.guild.channels.get(applicationChannel).memberPermissions(this.client.user).has(requiredPermissions)) {
				message.channel.send("Bot has insufficient permissions in the current application channel, removing.");
				message.guild.settings.remove("applicationChannel");
			}
			else message.channel.send(`Application channel currently set to ${message.guild.channels.get(applicationChannel)}.`);
		}
		else if (args.action === "set") {
			if (!args.channel || args.channel.type !== "text")
				message.channel.send("Invalid channel specified.");
			else if (args.channel && applicationChannel === args.channel.id) {
				if (!message.guild.channels.get(applicationChannel).memberPermissions(this.client.user).has(requiredPermissions)) {
					message.channel.send("Bot has insufficient permissions in the given application channel, removing.");
					message.guild.settings.remove("applicationChannel");
				}
				else message.channel.send(`Application channel already set to ${args.channel}.`);
			}
			else if (args.channel && applicationChannel !== args.channel.id) {
				if (!args.channel.memberPermissions(this.client.user).has(requiredPermissions)) {
					message.channel.send("Bot has insufficient permissions in the given application channel, removing.");
					message.guild.settings.remove("applicationChannel");
				}
				else {
					message.guild.settings.set("applicationChannel", args.channel.id);
					message.channel.send(`Application channel successfully set to ${args.channel}.`);
				}
			}
		}
		else if (args.action === "remove") {
			message.guild.settings.remove("applicationChannel");
			message.channel.send("Application channel successfully removed.");
		}
	}
};