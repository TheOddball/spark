const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");

module.exports = class ApproverRole extends Command {
	constructor(client) {
		super(client, {
			name: "approverrole",
			description: "Get, set or remove an approver role. Applications can only be approved by people with this role.",
			group: "applications",
			memberName: "approverrole",
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			args: [
				{
					key: "action",
					prompt: "Get, set or remove the approver role for this guild.",
					type: "string",
					oneOf: ["get", "set", "remove"]
				},
				{
					key: "role",
					prompt: "Role to allow application approvals for.",
					type: "role",
					default: "none"
				}
			]
		});
	}

	run(message, args) {
		const approverRole = message.guild.settings.get("approverRole");
		if (args.action === "set") {
			if (!(args.role instanceof Role))
				return message.channel.send("Invalid role specified.");
			message.guild.settings.set("approverRole", args.role.id);
			message.channel.send(`Approver role successfully set to ${args.role.name}.`);
		}
		else if (args.action === "get") {
			if (!approverRole)
				message.channel.send("No approver role set.");
			else if (!message.guild.roles.has(approverRole)) {
				message.guild.settings.remove("approverRole");
				message.channel.send("Approver role not found.");
			}
			else message.channel.send(`Approver role currently set to ${message.guild.roles.get(approverRole).name}.`);
		}
		else if (args.action === "remove") {
			message.guild.settings.remove("approverRole");
			message.channel.send("Approver role successfully removed.");
		}
	}
};