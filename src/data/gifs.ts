export interface GifItem {
  id: string;
  title: string;
  category: string;
  url: string;
  previewUrl: string;
}

export const GIF_CATEGORIES = [
  'Trending',
  'Reactions',
  'Funny',
  'Love',
  'Gaming',
  'Memes',
  'Cool',
  'Party',
  'Thumbs Up',
  'Dancing',
  'Sad',
  'Anime',
];

export const CURATED_GIFS: GifItem[] = [
  // Trending / Reactions
  {
    id: 'g_trend_1',
    title: 'Thumbs Up Cool',
    category: 'Trending',
    url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/111ebonMs90YLu/200w.gif',
  },
  {
    id: 'g_trend_2',
    title: 'Mind Blown',
    category: 'Trending',
    url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/200w.gif',
  },
  {
    id: 'g_trend_3',
    title: 'Popcorn Chill',
    category: 'Trending',
    url: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/200w.gif',
  },
  {
    id: 'g_trend_4',
    title: 'Confused Travolta',
    category: 'Trending',
    url: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/200w.gif',
  },
  {
    id: 'g_trend_5',
    title: 'High Five Excitement',
    category: 'Trending',
    url: 'https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/200w.gif',
  },
  {
    id: 'g_trend_6',
    title: 'Nodding Yes Agree',
    category: 'Trending',
    url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/200w.gif',
  },

  // Reactions
  {
    id: 'g_react_1',
    title: 'Shocked Wow',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/5VKbvrjxpVJCM/200w.gif',
  },
  {
    id: 'g_react_2',
    title: 'Clapping Bravo',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/200w.gif',
  },
  {
    id: 'g_react_3',
    title: 'Facepalm Sigh',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/XsUtdIe80mng4/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/XsUtdIe80mng4/200w.gif',
  },
  {
    id: 'g_react_4',
    title: 'Cheering Yeah',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/200w.gif',
  },
  {
    id: 'g_react_5',
    title: 'Eye Roll',
    category: 'Reactions',
    url: 'https://media.giphy.com/media/Rhhr8D5mKSXL9cXriV/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/Rhhr8D5mKSXL9cXriV/200w.gif',
  },

  // Funny
  {
    id: 'g_fun_1',
    title: 'Laughing Out Loud Dog',
    category: 'Funny',
    url: 'https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/200w.gif',
  },
  {
    id: 'g_fun_2',
    title: 'Hahaha Cat',
    category: 'Funny',
    url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/ICOgUNjpvO0PC/200w.gif',
  },
  {
    id: 'g_fun_3',
    title: 'Silly Dance Move',
    category: 'Funny',
    url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/blSTtZehjAZ8I/200w.gif',
  },
  {
    id: 'g_fun_4',
    title: 'Funny Smile Chuckle',
    category: 'Funny',
    url: 'https://media.giphy.com/media/kC8N6DPOkbqWTxkNTe/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/kC8N6DPOkbqWTxkNTe/200w.gif',
  },

  // Love & Friendship
  {
    id: 'g_love_1',
    title: 'Heart Floating Cute',
    category: 'Love',
    url: 'https://media.giphy.com/media/26FLdmG4ALHNRxijC/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26FLdmG4ALHNRxijC/200w.gif',
  },
  {
    id: 'g_love_2',
    title: 'Warm Hug Cute',
    category: 'Love',
    url: 'https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3M4NpbLCTxBqU/200w.gif',
  },
  {
    id: 'g_love_3',
    title: 'Flying Kisses',
    category: 'Love',
    url: 'https://media.giphy.com/media/l41lT4n6ylgW2hh04/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/l41lT4n6ylgW2hh04/200w.gif',
  },
  {
    id: 'g_love_4',
    title: 'Sparkling Heart Eyes',
    category: 'Love',
    url: 'https://media.giphy.com/media/MeIucajx7YeLA2lfnd/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/MeIucajx7YeLA2lfnd/200w.gif',
  },

  // Gaming
  {
    id: 'g_game_1',
    title: 'GG Well Played',
    category: 'Gaming',
    url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/200w.gif',
  },
  {
    id: 'g_game_2',
    title: 'Gamer Rage Quit',
    category: 'Gaming',
    url: 'https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/11tTNkNy1SdXGg/200w.gif',
  },
  {
    id: 'g_game_3',
    title: 'Victory Royale Dance',
    category: 'Gaming',
    url: 'https://media.giphy.com/media/SG5paY6WxH6Ki2lWys/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/SG5paY6WxH6Ki2lWys/200w.gif',
  },
  {
    id: 'g_game_4',
    title: 'Controller Focus Pro',
    category: 'Gaming',
    url: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/13HgwGsXF0aiGY/200w.gif',
  },

  // Memes
  {
    id: 'g_meme_1',
    title: 'Roll Safe Smart Brain',
    category: 'Memes',
    url: 'https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/d3mlE7uhX8KFgEmY/200w.gif',
  },
  {
    id: 'g_meme_2',
    title: 'This is Fine Dog Fire',
    category: 'Memes',
    url: 'https://media.giphy.com/media/9M5jK4GXmD5o1irGrF/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/9M5jK4GXmD5o1irGrF/200w.gif',
  },
  {
    id: 'g_meme_3',
    title: 'Deal With It Shades',
    category: 'Memes',
    url: 'https://media.giphy.com/media/xTiTnHXbRoaZ1B1Ec8/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/xTiTnHXbRoaZ1B1Ec8/200w.gif',
  },
  {
    id: 'g_meme_4',
    title: 'Success Kid Fist',
    category: 'Memes',
    url: 'https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/nXxOjZrbnbRxS/200w.gif',
  },

  // Cool & Party
  {
    id: 'g_cool_1',
    title: 'Party Confetti Disco',
    category: 'Party',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/200w.gif',
  },
  {
    id: 'g_cool_2',
    title: 'Celebration Fireworks',
    category: 'Party',
    url: 'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/200w.gif',
  },
  {
    id: 'g_cool_3',
    title: 'Dancing Vibes',
    category: 'Dancing',
    url: 'https://media.giphy.com/media/mFYTaY7G6GCJa/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/mFYTaY7G6GCJa/200w.gif',
  },
  {
    id: 'g_anime_1',
    title: 'Anime Sparkle Wow',
    category: 'Anime',
    url: 'https://media.giphy.com/media/10uEX5kfeodYgo/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/10uEX5kfeodYgo/200w.gif',
  },
  {
    id: 'g_anime_2',
    title: 'Anime Happy Run',
    category: 'Anime',
    url: 'https://media.giphy.com/media/11c7UUfN4eoHF6/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/11c7UUfN4eoHF6/200w.gif',
  },
  {
    id: 'g_sad_1',
    title: 'Sad Rain Cry',
    category: 'Sad',
    url: 'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/L95W4wv8nnb9K/200w.gif',
  },
];
