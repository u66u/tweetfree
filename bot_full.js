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

await client.tweet({ content: 'this is a test' })
await client.tweet({ content: 'second test' })

// 2nd param is post id 
await client.execute('heart', { user: 'elonmusk', id: '1619770090530181120' })
await client.execute('retweet', { user: 'elonmusk', id: '1619770090530181120' })

const data = await client.getUser({ user: 'elonmusk' });
// {
//   followers: '127.8M',
//   following: '177',
//   joinedAt: 'June 2009',
//   tweets: '22.5K Tweets',
//   verified: true
// }
console.log(data)

const tweetEmitter = new tweetListener(client, 3000);

tweetEmitter.on('tweetCreate', async (tweet) => {
    // destroy the listener after receiving 1 tweet
    // WARNING: you will receive 20~ of the current tweets mentioning the username
    // WARNING: ^^ when running for the first time

    await tweetEmitter.stopListening();

    // create a tweet
    await client.tweet({ content: `hello ${tweet.author}, i have received your tweet saying: ${tweet.content}, turns out it had mentioned: ${tweet.mentioned}`})
})
// keep track of the stopping reason
tweetEmitter.on('stop', ((reason) => console.log(reason)))
})();