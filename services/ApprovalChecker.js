const BaseService = require("../helpers/BaseService.js");
const { RichEmbed } = require("discord.js");
const DiscordColors = require("../helpers/DiscordColors.js");

module.exports = class ApprovalChecker extends BaseService {
	constructor(client) {
		super(client, {
			name: "Approval Checker Service",
			description: "Reacts on messages sent in the approval channel, and listens for reactions to approve or deny an application.",
			enabled: true
		});
	}

	async onMessageReactionAdd(ctx) {
		if (!ctx.guild) return;

		const approverRole = ctx.guild.settings.get("approverRole");
		if (!approverRole || !ctx.guild.roles.has(approverRole) || !ctx.member.roles.has(approverRole)) return;

		const applicationChannel = ctx.guild.settings.get("applicationChannel");
		if (!applicationChannel || !ctx.guild.channels.has(applicationChannel)) return;
		if (ctx.channel.id !== applicationChannel) return;

		const archiveChannel = ctx.guild.settings.get("archiveChannel");
		if (!archiveChannel || !ctx.guild.channels.has(archiveChannel)) return;

		const requiredPermissions = ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"];
		if (!ctx.guild.channels.get(archiveChannel).memberPermissions(this.client.user).has(requiredPermissions)) return;

		if (!["✅", "❌"].includes(ctx.reaction.emoji.toString())) return;

		// TODO: Attachments

		await ctx.message.delete();

		await ctx.message.author.send(new RichEmbed({
			thumbnail: { url: ctx.user.displayAvatarURL },
			author: { name: `Your application was ${ctx.reaction.emoji.toString() === "✅" ? "approved" : "denied"}!` },
			title: "Message Content",
			description: ctx.message.cleanContent || "[No message content]",
			fields: [{
				name: `${ctx.reaction.emoji.toString() === "✅" ? "Approved" : "Denied"} by`,
				value: ctx.user.toString()
			}],
			color: ctx.reaction.emoji.toString() === "✅" ? DiscordColors.GREEN : DiscordColors.RED
		}));

		ctx.guild.channels.get(archiveChannel).send(new RichEmbed({
			thumbnail: { url: ctx.message.author.displayAvatarURL },
			author: { name: `Application successfully ${ctx.reaction.emoji.toString() === "✅" ? "approved" : "denied"}.` },
			title: "Message Content",
			description: ctx.message.cleanContent || "[No message content]",
			fields: [{
				name: `${ctx.reaction.emoji.toString() === "✅" ? "Approved" : "Denied"} by`,
				value: ctx.user.toString()
			}],
			color: ctx.reaction.emoji.toString() === "✅" ? DiscordColors.GREEN : DiscordColors.RED
		}));
	}

	async onMessage(ctx) {
		if (!ctx.guild) return;

		const approverRole = ctx.guild.settings.get("approverRole");
		if (!approverRole || !ctx.guild.roles.has(approverRole)) return;

		const archiveChannel = ctx.guild.settings.get("archiveChannel");
		if (!archiveChannel || !ctx.guild.channels.has(archiveChannel)) return;

		const applicationChannel = ctx.guild.settings.get("applicationChannel");
		if (!applicationChannel || !ctx.guild.channels.has(applicationChannel)) return;
		if (ctx.channel.id !== applicationChannel) return;

		const requiredPermissions = ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"];
		if (!ctx.guild.channels.get(applicationChannel).memberPermissions(this.client.user).has(requiredPermissions)) return;

		await ctx.message.react("✅");
		await ctx.message.react("❌");
	}
};