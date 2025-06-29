import { config } from "dotenv";
import { TwitterApi } from "twitter-api-v2";

config(); // ✅ Load environment variables

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export async function createPost(status) {
  try {
    if (!status || typeof status !== "string") {
      console.warn("⚠️ Invalid status input:", status);
      return {
        content: [
          {
            type: "text",
            text: "Invalid tweet content provided."
          }
        ]
      };
    }

    console.log("📤 Attempting to tweet:", status);

    const result = await twitterClient.v2.tweet(status);

    console.log("✅ Tweet posted successfully:", result.data);

    return {
      content: [
        {
          type: "text",
          text: `Tweeted: ${status}`
        }
      ]
    };
  } catch (err) {
    console.error("❌ Error posting tweet:", err);

    return {
      content: [
        {
          type: "text",
          text: `Failed to post tweet: ${err.message}`
        }
      ]
    };
  }
}


// import { config } from "dotenv"
// import { TwitterApi } from "twitter-api-v2"
// config()

// const twitterClient = new TwitterApi({
//     appKey: process.env.TWITTER_API_KEY,
//     appSecret: process.env.TWITTER_API_SECRET,
//     accessToken: process.env.TWITTER_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// })

// export async function createPost(status) {
//   try {
//     console.log("📤 Tweeting:", status); // Optional logging

//     const result = await twitterClient.v2.tweet(status);

//     console.log("✅ Tweeted:", result.data);

//     return {
//       content: [
//         {
//           type: "text",
//           text: `Tweeted: ${status}`
//         }
//       ]
//     };
//   } catch (err) {
//     console.error("❌ Failed to tweet:", err); // Debug print
//     return {
//       content: [
//         {
//           type: "text",
//           text: `Failed to post tweet: ${err.message}`
//         }
//       ]
//     };
//   }
// }



// // export async function createPost(status) {
// //     const newPost = await twitterClient.v2.tweet(status)

// //     return {
// //         content: [
// //             {
// //                 type: "text",
// //                 text: `Tweeted: ${status}`
// //             }
// //         ]
// //     }
// // }