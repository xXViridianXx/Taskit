export default class Activity {

    constructor(itemName, categoryNames, subCategory, indScore) {
        this.itemName = itemName;
        this.categoryNames = categoryNames;
        this.subCategory = subCategory;
        this.indScore = indScore;
    }
}

const CATEGORY_SCORE_MAP = new Map();
// Set all scores to 0
CATEGORY_SCORE_MAP.set("Walk", 0);
CATEGORY_SCORE_MAP.set("Meditation", 0);
CATEGORY_SCORE_MAP.set("Nature Hike", 0);
CATEGORY_SCORE_MAP.set("Bike", 0);
CATEGORY_SCORE_MAP.set("Gym", 0);
CATEGORY_SCORE_MAP.set("Swim", 0);
CATEGORY_SCORE_MAP.set("Soccer", 0);
CATEGORY_SCORE_MAP.set("Basketball", 0);
CATEGORY_SCORE_MAP.set("Baseball", 0);
CATEGORY_SCORE_MAP.set("Run", 0);
CATEGORY_SCORE_MAP.set("Yoga", 0);
CATEGORY_SCORE_MAP.set("Dance", 0);
CATEGORY_SCORE_MAP.set("Calisthenics", 0);
CATEGORY_SCORE_MAP.set("Climbing", 0);
CATEGORY_SCORE_MAP.set("Volleyball", 0);
CATEGORY_SCORE_MAP.set("Golf", 0);
CATEGORY_SCORE_MAP.set("Focused Meditation", 0);
CATEGORY_SCORE_MAP.set("Breathing Exercises", 0);
CATEGORY_SCORE_MAP.set("Journaling", 0);
CATEGORY_SCORE_MAP.set("Read", 0);
CATEGORY_SCORE_MAP.set("Watch a show", 0);
CATEGORY_SCORE_MAP.set("Phone break", 0);
CATEGORY_SCORE_MAP.set("Tomorrow's to-do list creation", 0);
CATEGORY_SCORE_MAP.set("Stretch", 0);
CATEGORY_SCORE_MAP.set("Hot shower/bath", 0);
CATEGORY_SCORE_MAP.set("Talk through your day", 0);
CATEGORY_SCORE_MAP.set("Puzzle", 0);
CATEGORY_SCORE_MAP.set("Coloring/Craft", 0);

// Create instances with scores from CATEGORY_SCORE_MAP
const walk = new Activity("Walk", ["Active"], ["Outdoors", "Low Intensity"], CATEGORY_SCORE_MAP.get("Walk"));
const natureHike = new Activity("Nature Hike", ["Active"], ["Outdoors", "Medium Intensity"], CATEGORY_SCORE_MAP.get("Nature Hike"));
const bike = new Activity("Bike", ["Active"], ["Outdoors", "Medium Intensity"], CATEGORY_SCORE_MAP.get("Bike"));
const gym = new Activity("Gym", ["Active"], ["Indoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Gym"));
const swim = new Activity("Swim", ["Active"], ["Indoors", "Medium Intensity"], CATEGORY_SCORE_MAP.get("Swim"));
const soccer = new Activity("Soccer", ["Active"], ["Outdoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Soccer"));
const basketball = new Activity("Basketball", ["Active"], ["Indoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Basketball"));
const baseball = new Activity("Baseball", ["Active"], ["Outdoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Baseball"));
const run = new Activity("Run", ["Active"], ["Outdoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Run"));
const yoga = new Activity("Yoga", ["Active"], ["Indoors", "Low Intensity"], CATEGORY_SCORE_MAP.get("Yoga"));
const dance = new Activity("Dance", ["Active"], ["Indoors", "Medium Intensity"], CATEGORY_SCORE_MAP.get("Dance"));
const calisthenics = new Activity("Calisthenics", ["Active"], ["Indoors", "Medium Intensity"], CATEGORY_SCORE_MAP.get("Calisthenics"));
const climbing = new Activity("Climbing", ["Active"], ["Indoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Climbing"));
const volleyball = new Activity("Volleyball", ["Active"], ["Outdoors", "High Intensity"], CATEGORY_SCORE_MAP.get("Volleyball"));
const golf = new Activity("Golf", ["Active"], ["Outdoors", "Low Intensity"], CATEGORY_SCORE_MAP.get("Golf"));

const focusedMeditation = new Activity("Focused Meditation", ["Mindfulness"], ["Meditation"], CATEGORY_SCORE_MAP.get("Meditation"));
const breathingExercises = new Activity("Breathing Exercises", ["Mindfulness"], ["Meditation"], CATEGORY_SCORE_MAP.get("Breathing Exercises"));
const musicListening = new Activity("Music Listening", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Music Listening"));
const journaling = new Activity("Journaling", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Journaling"));
const read = new Activity("Read", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Read"));
const watchShow = new Activity("Watch a Show", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Watch a show"));
const phoneBreak = new Activity("Phone Break", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Phone break"));
const tmrToDo = new Activity("Tomorrow's To-Do List Creation", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Tomorrow's to-do list creation"));
const stretch = new Activity("Stretch", ["Mindfulness"], ["Low Intensity"], CATEGORY_SCORE_MAP.get("Stretch"));
const hotShower = new Activity("Hot Shower/Bath", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Hot shower/bath"));
const talkThrough = new Activity("Talk Through Your Day", ["Mindfulness"], [], CATEGORY_SCORE_MAP.get("Talk through your day"));

const puzzle = new Activity("Puzzle", ["Mindfulness"], [], 0);
const coloringCraft = new Activity("Coloring/Craft", ["Mindfulness"], [], 0);

export const itemList = [walk, natureHike, bike, gym, swim, soccer, basketball, baseball, run, yoga, dance, calisthenics, climbing, volleyball, golf, focusedMeditation, breathingExercises, musicListening, journaling, read, watchShow, phoneBreak, tmrToDo, stretch, hotShower, talkThrough, puzzle, coloringCraft];
