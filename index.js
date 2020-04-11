const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const active = new Map();
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const d = require("dotenv");
const Enmap = require("enmap")
const fs = require("fs")
client.commands = new Enmap();
client.aliases = new Enmap();
client.categories = fs.readdirSync("./commands/");
const mongoose = require("mongoose");

mongoose.connect(`mongodb://${config.mongo_atlas.username}:${config.mongo_atlas.password}@${config.mongo_atlas.shard.one},${config.mongo_atlas.shard.two},${config.mongo_atlas.shard.three}/${config.mongo_atlas.cluster}?ssl=true&replicaSet=${config.mongo_atlas.cluster}-shard-0&authSource=admin&retryWrites=true`,{ useNewUrlParser: true, useUnifiedTopology: true }).then(mon => {
  console.log(`Connected to the database!`);
}).catch((err) => {
        console.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });


d.config({
  path: __dirname + "/.env"
});

["commands"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});


const Youtube = require("simple-youtube-api");
const youtube = new Youtube(config.YOUTUBE_API_KEY);
const loop = new Map();
client.loop = loop;
client.yt = youtube;
client.skip = new Map();
client.on("ready", () => {
  client.user.setStatus("dnd")
  console.log(`Logged in as ${client.user.tag}. With ${client.guilds.size}. With ${client.users.size} users!`)
  //client.user.setActivity(`NEW YEAR+CHRISTMAS UPDATE | ${client.guilds.size} guilds!`)
 setInterval(() => {
   //client.user.setActivity(`Gosh Music! | ${client.guilds.size} guilds!`);
   client.user.setActivity(`Music | ${client.guilds.size} servers`)
 }, 60000);
 
  //client.channels.get("657167127379312643").send(`Shard ${client.shard.totalShards}`)
  
  
  
});

client.on("guildCreate", guild => {
  let embed = new Discord.RichEmbed()
  .setTitle(`I have been added to a new guild!`)
  .setDescription(`This guild has ${guild.memberCount} members.`)
  .addField("\u200b", `Owner: ${guild.owner}`)
  .addField("\u200b", `Owner id: ${guild.owner.id}`)
  .addField("\u200b", `Guild name: ${guild.name}`)
  .addField("\u200b", `Guild id: ${guild.id}`)
  .setFooter(`This guild was created at ${formatDate(guild.createdAt)}`)
  .setThumbnail(guild.displayAvatarURL)
  .setTimestamp()
})

client.on("guildDelete", guild => {
  let embed = new Discord.RichEmbed()
  .setTitle(`I have been removed from a guild!`)
  .setDescription(`This guild has ${guild.memberCount} members.`)
  .addField("\u200b", `Owner: ${guild.owner}`)
  .addField("\u200b", `Owner id: ${guild.owner.id}`)
  .addField("\u200b", `Guild name: ${guild.name}`)
  .addField("\u200b", `Guild id: ${guild.id}`)
  .setFooter(`This guild was created at ${formatDate(guild.createdAt)}`)
  .setThumbnail(guild.displayAvatarURL)
  .setTimestamp()
});

client.config = config;
const pr = require("./mongodb/prefix");
client.on("message", async message => {
  let prefix = client.config.prefix;
  
    let ops = {
      ownerID: config.owner,
      active: active
    };
    if (message.author.bot) return;
    if (message.isMentioned(client.user)) {
      const embed = new Discord.RichEmbed().setDescription(
        `Hello ${message.author}, My prefix is ${prefix} in this guild. use ${prefix} help to see my commands.`
      ).setColor('BLUE');
      message.channel.send(embed);
    }
    //if(!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();
  
    if (cmd.length === 0) return;
  
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
  
    if (command) command.run(client, message, args, ops, prefix);
  });
  
  //client.login(process.env.TOKEN);
  
  process.on("unhandledRejection", error =>
    console.error("Uncaught Promise Rejection", error)
  );
  
  client.login(config.token);

function formatDate(date) {
    return new Intl.DateTimeFormat("en-US").format(date);
}