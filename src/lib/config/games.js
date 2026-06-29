/**
 * Games configuration — update names, images, and text here.
 * Images go in /static/characters/. Set `image` to null to use placeholder.
 */

export const RIVER_CROSSING = {
  title: 'River Crossing',
  subtitle: 'Get the whole crew across safely',
  location: 'Wenatchee River · 47.808°N, 120.726°W',
  intro: 'The boat fits one passenger at a time. Some campers can\'t be left alone together — figure out the right order!',
  ferrymanName: 'River Guide',
  ferrymanEmoji: '🧑‍✈️',

  characters: [
    {
      id: 'A',
      name: 'Camper A',        // ← replace with real name
      image: null,              // ← replace with '/characters/person_a.png'
      placeholder: 'A',
      color: '#ff6b35',
    },
    {
      id: 'B',
      name: 'Camper B',
      image: null,
      placeholder: 'B',
      color: '#ffd23f',
    },
    {
      id: 'C',
      name: 'Camper C',
      image: null,
      placeholder: 'C',
      color: '#06d6a0',
    },
  ],

  // Pairs that cannot be left alone without the guide present
  conflicts: [
    {
      pair: ['A', 'B'],
      reason: 'They\'ll argue the entire time',   // ← customise the reason
    },
    {
      pair: ['B', 'C'],
      reason: 'Absolute chaos guaranteed',
    },
  ],

  scoring: {
    optimal: 7,      // minimum possible moves
    threeStars: 7,
    twoStars: 10,
  },

  winMessages: [
    'Everyone made it! 🎉',
    'The crew is across! 🛶',
    'Mission accomplished! 🏕',
  ],
};

export const GAMES_HUB = {
  title: 'Camp Games',
  subtitle: 'Collect points, climb the leaderboard',
  games: [
    {
      id: 'river',
      title: 'River Crossing',
      description: 'Logic puzzle — get the crew across without any fights',
      emoji: '🛶',
      path: '/games/river',
      available: true,
      maxPoints: 3,
    },
    {
      id: 'quiz',
      title: 'Camp Quiz',
      description: 'How well do you know the crew and the lake?',
      emoji: '❓',
      path: '/games/quiz',
      available: false,
      comingSoon: true,
      maxPoints: 10,
    },
  ],
};
