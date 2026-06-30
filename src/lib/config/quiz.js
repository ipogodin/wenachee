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
      id: 'illia1',
      image: '/quiz/wen_quiz_illia.png',
      correctAnswer: 5,
      hotspotSize: 14,
      timeoutMessage: "The headache is spreading. Illia's pharmacy has left the building.",
      options: [
        { id: 1, label: 'Blue Cubes',         hint: 'Blue cubes of speed',                                   x: 17, y: 40, punch: "Incorrect. Illia may have energy, but it is mostly powered by logistics and mild panic." },
        { id: 2, label: 'Potato Starch',       hint: 'Potato starch',                                        x: 20, y: 67, punch: "Incorrect. Useful for cooking. Less useful during a headache." },
        { id: 3, label: 'Green Tobacco',       hint: 'Green tobacco',                                        x: 17, y: 92, punch: "Incorrect. Wrong pocket, wrong person, wrong survival strategy." },
        { id: 4, label: 'Electrolyte Tablets', hint: 'Electrolyte tablets that look way too suspicious',     x: 80, y: 50, punch: "Close in appearance, perhaps. But not the emergency item we are looking for." },
        { id: 5, label: 'Painkillers',         hint: "Painkillers — the group's unofficial mobile pharmacy",  x: 80, y: 82, punch: "Correct. Illia has apparently accepted his role as the group's unofficial mobile pharmacy. 💊" },
      ],
    },
    {
      id: 'alex1',
      image: '/quiz/wen_quiz_alex1.png',
      correctAnswer: 5,
      timeoutMessage: "Alex is already halfway up the trail in his Crocs. You missed it.",
      // kh1 spatial positions: 1=top-left, 2=bottom-left, 3=top-right, 4=bottom-center, 5=bottom-right
      // Alex's image "4. CROCS" sits in the bottom-right spot → option id 5
      options: [
        { id: 1, label: 'Hiking Boots', hint: 'Proper hiking boots — sensible, sturdy, very not-Alex',       x: 20, y: 37, punch: "Reasonable. Responsible. Completely not Alex's answer." },
        { id: 2, label: 'Backpack',     hint: 'A backpack with seventeen unnecessary pockets',               x: 18, y: 78, punch: "Alex respects organization — but not enough to carry 17 pockets uphill." },
        { id: 3, label: 'Headset',      hint: 'Noise-cancelling headset for blocking out bad vibes',         x: 82, y: 38, punch: "Useful for blocking wind, mosquitoes, and advice from people wearing real boots." },
        { id: 4, label: 'Ranger Hat',   hint: 'A hat that makes him look like a national-park ranger',       x: 50, y: 86, punch: "Good for shade. Not powerful enough to defeat the Crocs." },
        { id: 5, label: 'Crocs',        hint: 'Crocs in Sport Mode™ — heel strap fully engaged',            x: 82, y: 78, punch: "When the heel strap is engaged, Alex becomes trail-certified. 🐊 Correct!" },
      ],
    },
    {
      id: 'mom1',
      image: '/quiz/wen_quiz_mom1.png',
      correctAnswer: 5,
      timeoutMessage: "Mom is already thinking about everyone's comfort. You ran out of time doing the same.",
      options: [
        { id: 1, label: 'Nervously overthinking',               hint: 'She starts nervously overthinking',                   x: 15, y: 20, punch: "A strong sign, but Mom can overthink while completely relaxed too." },
        { id: 2, label: 'Stress-eating everything in reach',    hint: 'She begins stress-eating everything in reach',        x: 12, y: 63, punch: "Possible, but this may simply mean there are cookies nearby." },
        { id: 3, label: 'Quoting the greatest minds',          hint: 'She starts quoting the greatest minds of literature', x: 40, y: 85, punch: "A warning sign — but also potentially just a normal Tuesday." },
        { id: 4, label: 'Cannot look you in the eye',          hint: 'She suddenly cannot look you in the eye',             x: 85, y: 30, punch: "Suspicious, but not definitive. Maybe she is looking for the next person to help." },
        { id: 5, label: 'She is breathing',                    hint: 'She is breathing',                                    x: 82, y: 78, punch: "Correct. The moment Mom is awake and breathing, she is already thinking about everyone else's comfort." },
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
