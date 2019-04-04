const Discord = require('discord.js');
const client = new Discord.Client();

is_playing_sound = false;

const permitted_audio_formats = [".MP3", ".OGG", ".WAV", "FLAC", "MIDI", ".WMA", ".M4A"]

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
}); 

client.on('message', msg => {
    if(msg.member.id == client.user.id) return;

    check_for_attachments(msg);

    if(msg.content === ".stop") {
        let guild_snowflake = msg.guild.id;
        client.voiceConnections.get(guild_snowflake).disconnect();
        msg.delete();
    }

});

let check_for_attachments = function(msg) {
    if(!msg.attachments.first()) return;

    let attachment_URL = msg.attachments.first().url;
    if(attachment_URL) {
        let attachment_extension = attachment_URL.substr(attachment_URL.length - 4).toUpperCase();
        if(permitted_audio_formats.includes(attachment_extension)) {
            if(msg.member.voiceChannel) {
                msg.member.voiceChannel.join().then(connection => {
                    
                    let dispatch = connection.playArbitraryInput(attachment_URL);
                    msg.delete(1000);
                    
                }).catch(console.log);
            }    
        }
    }
}

client.login('Mjg4MDY1NjA3MDcxNjk0ODQ4.D3amDA.Q5XfZUUncZR6lJmPdk9cr0E_Amk');