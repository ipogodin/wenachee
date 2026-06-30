/**
 * Quiz configuration — add questions here.
 * correctAnswer: option id (1–5)
 * x, y: center of the circle in the image, as % of image dimensions (0–100)
 * punch: message shown when this option is selected (correct or wrong)
 * Images go in /static/quiz/.
 */
export const QUIZ = {
  title: 'Camp Quiz',
  timePerQuestion: 30,
  pointsPerQuestion: 10,

  questions: [
    {
      id: 'kh1',
      image: '/quiz/wen_quiz_kh1.png',
      correctAnswer: 5,
      timeoutMessage: "The blue hair girl is still waiting. And so is her bottle.",
      options: [
        { id: 1, label: 'Steak',         hint: 'A steak the size of a canoe paddle',                                             x: 20, y: 37, punch: "A canoe-paddle steak won't fit in the kayak. Rethink." },
        { id: 2, label: 'First Aid Kit', hint: 'A first aid kit for whatever happens after the "just one quick hike" idea',      x: 18, y: 78, punch: "She's adventurous, not clumsy. Well — mostly. Still wrong." },
        { id: 3, label: 'Cake',          hint: 'An emergency slice of cake for emotional stabilization',                         x: 82, y: 38, punch: "Valid for emotional survival. Not the answer she'd die without." },
        { id: 4, label: 'Coffee Beans',  hint: 'Coffee beans strong enough to restart civilization',                             x: 50, y: 86, punch: "Civilization runs on beans. She runs on something else." },
        { id: 5, label: 'Water Bottle',  hint: 'A water bottle with a suspicious red drink in it',                               x: 82, y: 78, punch: "Oh, that red water must be from France or Spain then. 🍷 Correct!" },
      ],
    },
    {
      id: 'alex1',
      image: '/quiz/wen_quiz_alex1.png',
      correctAnswer: 4,
      timeoutMessage: "Alex is already halfway up the trail in his Crocs. You missed it.",
      options: [
        { id: 1, label: 'Hiking Boots',  hint: 'Proper hiking boots — sensible, sturdy, very not-Alex',         x: 20, y: 37, punch: "Reasonable. Responsible. Completely not Alex's answer." },
        { id: 2, label: 'Headset',       hint: 'Noise-cancelling headset for blocking out bad vibes',           x: 18, y: 78, punch: "Useful for blocking wind, mosquitoes, and advice from people wearing real boots." },
        { id: 3, label: 'Backpack',      hint: 'A backpack with seventeen unnecessary pockets',                 x: 82, y: 38, punch: "Alex respects organization — but not enough to carry 17 pockets uphill." },
        { id: 4, label: 'Crocs',         hint: 'Crocs in Sport Mode™ — heel strap fully engaged',              x: 50, y: 86, punch: "When the heel strap is engaged, Alex becomes trail-certified. 🐊 Correct!" },
        { id: 5, label: 'Ranger Hat',    hint: 'A hat that makes him look like a national-park ranger',         x: 82, y: 78, punch: "Good for shade. Not powerful enough to defeat the Crocs." },
      ],
    },
    {
      id: 'sergii1',
      image: '/quiz/wen_quiz_sergii_1.png',
      correctAnswer: 2,
      timeoutMessage: "Sergii's food has already gone cold. You've failed him.",
      options: [
        { id: 1, label: 'Cold Food',       hint: 'A meal that is no longer lava-hot',                                                    x: 20, y: 37, punch: "Cold food is just food that gave up on itself. But not THE enemy." },
        { id: 2, label: 'Hot Food 1.3s',   hint: 'Food resting 2+ seconds off the griddle belongs in the garbage, effective immediately', x: 18, y: 78, punch: "Food that rests for more than 2 seconds outside of a griddle does not worth a garbage it will be put into right now. 🔥 Correct!" },
        { id: 3, label: 'Mosquito Bites',  hint: 'Turning into a walking mosquito buffet',                                               x: 82, y: 38, punch: "90% coverage builds character. But it's not what keeps him up at night." },
        { id: 4, label: 'Awkward Dancing', hint: 'Being forced to dance on the floating platform',                                        x: 50, y: 86, punch: "Dancing on a floating platform is brave. Sergii disagrees. Still wrong." },
        { id: 5, label: 'Warm Whiskey',    hint: 'A glass of disrespectfully warm whiskey',                                              x: 82, y: 78, punch: "Disrespectful to the whiskey. Truly. But not his top crime." },
      ],
    },
  ],
};
