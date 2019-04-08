const { Command } = require("discord.js-commando");

module.exports = class ArchiveChannel extends Command {
	constructor(client) {
		super(client, {
			name: "archivechannel",
			memberName: "archivechannel",
			group: "applications",
			description: "Get, set or remove the archive channel for this guild.",
			aliases: ["archch"],
			userPermissions: ["MANAGE_CHANNELS"],
			args: [
				{
					key: "action",
					prompt: "Get, set or remove the archive channel.",
					type: "string",
					oneOf: ["get", "set", "remove"],
					default: "get"
				},
				{
					key: "channel",
					prompt: "Channel to repost archives in",
					type: "channel",
					default: ""
				}
			]
		});
	}

	async run(message, args) {
		const archiveChannel = message.guild.settings.get("archiveChannel");
		const requiredPermissions = ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"];
		if (args.action === "get" && !archiveChannel) {
			message.channel.send("No archive channel set for this guild.");
		}
		else if (args.action === "get" && archiveChannel) {
			if (!message.guild.channels.has(archiveChannel)) {
				message.channel.send("Archive channel does not exist, removing.");
				message.guild.settings.remove("archiveChannel");
			}
			else if (!message.guild.channels.get(archiveChannel).memberPermissions(this.client.user).has(requiredPermissions)) {
				message.channel.send("Bot has insufficient permissions in the current archive channel, removing.");
				message.guild.settings.remove("archiveChannel");
			}
			else message.channel.send(`Archive channel currently set to ${message.guild.channels.get(archiveChannel)}.`);
		}
		else if (args.action === "set") {
			if (!args.channel || args.channel.type !== "text")
				message.channel.send("Invalid channel specified.");
			else if (args.channel && archiveChannel === args.channel.id) {
				if (!message.guild.channels.get(archiveChannel).memberPermissions(this.client.user).has(requiredPermissions)) {
					message.channel.send("Bot has insufficient permissions in the given archive channel, removing.");
					message.guild.settings.remove("archiveChannel");
				}
				else message.channel.send(`Archive channel already set to ${args.channel}.`);
			}
			else if (args.channel && archiveChannel !== args.channel.id) {
				if (!args.channel.memberPermissions(this.client.user).has(requiredPermissions)) {
					message.channel.send("Bot has insufficient permissions in the given archive channel, removing.");
					message.guild.settings.remove("archiveChannel");
				}
				else {
					message.guild.settings.set("archiveChannel", args.channel.id);
					message.channel.send(`Archive channel successfully set to ${args.channel}.`);
				}
			}
		}
		else if (args.action === "remove") {
			message.guild.settings.remove("archiveChannel");
			message.channel.send("Archive channel successfully removed.");
		}
	}
};