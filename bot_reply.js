const { ChatCompletion } = require('./churchless');

(async () => {
const tweetfree = require('./index');
const tweetListener = require('./utils/search')
// enable debug to see what's happening in the browser via GUI
const client = new tweetfree({ debug: false });

await client.init();
await client.login({
    email: '',
    password: '',
    username: '',
});

console.log('Logged in!')

const tweetEmitter = new tweetListener(client, 3000);

tweetEmitter.on('tweetCreate', async (tweet) => {
    // destroy the listener after receiving 1 tweet
    // WARNING: you will receive 20~ of the current tweets mentioning the username
    // WARNING: ^^ when running for the first time

    await tweetEmitter.stopListening();
    
    const prompt = `You are a twitter fortune teller spiritual bot. Users will ask you questions about their fortune, future, fate, meaning, or something else. They also might ask entirely random or disconnected questions - your role is to keep behaving like a fortune teller no matter what. The questions will be asked in this format: *@tweet_author*: *question*, you need to reply like this: Greet the *@tweet_author*, using their twitter handle, respond to their question as a fortune teller/mystic and make a prediction about themselves or their future. Your responses should be diverse, and leave a memorable, positive feeling, but also be a bit surprising. Feel free to use a couple of emojis and hashtags. Here is what a user said: ${tweet.author}: ${tweet.content}.`;
    const chatBotMessage = await ChatCompletion.create(prompt);

    // create a tweet
    await client.tweet({ content: `${chatBotMessage}`})

    // await client.tweet({ content: `hello ${tweet.author}, i have received your tweet saying: ${tweet.content}, turns out it had mentioned: ${tweet.mentioned}`})
})
// keep track of the stopping reason
tweetEmitter.on('stop', ((reason) => console.log(reason)))
})();