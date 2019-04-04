const Discord = require('discord.js');
const client = new Discord.Client();

is_playing_sound = false;

const permitted_audio_formats = [".MP3", ".OGG", ".WAV", "FLAC", "MIDI", ".WMA", ".M4A"]

let in_blackjack_game = false;
let current_blackjack_player_id;
let current_dealer_hand = 0;
let current_player_hand = 0;

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
    // set timeout
    // min card is 2
    if(msg.content === ".blackjack") {
        if(!in_blackjack_game) {
            in_blackjack_game = true;
            msg.reply(`Game starting now!`);
            current_blackjack_player_id = msg.member.id;
            current_dealer_hand += generate_blackjack_value();
            current_player_hand += generate_blackjack_value();
            msg.reply(`Your hand is currently a ${current_player_hand}, .hit or .stick?`);
        } else {
            msg.reply(`Already playing a blackjack game with ${current_blackjack_player_id}`);
        }
    }

    if(msg.content === ".hit") {
        if(msg.member.id != current_blackjack_player_id) return msg.reply("You're not the player currently in a game!");

        
        current_player_hand += generate_blackjack_value();
        if(current_player_hand === 21) {
            msg.reply("21! You win!");
            return end_blackjack_game();
        } 
        if(current_player_hand > 21) {
            msg.reply("Bust, https://i.imgur.com/RtteDyZ.jpg");
            return end_blackjack_game();
        }
        
        msg.reply(`Your hand is currently a ${current_player_hand}, .hit or .stick?`);

    }

    if(msg.content === ".stick") {
        msg.reply("Only faggots don't hit. You lose!");
        end_blackjack_game();
    }

});

let end_blackjack_game = () => {
    current_blackjack_player_id = null;
    current_dealer_hand = 0;
    current_player_hand = 0;
};

let generate_blackjack_value = () => {
    return Math.floor(Math.random() * (Math.floor(10) - Math.ceil(2) + 1)) + Math.ceil(2);
}

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