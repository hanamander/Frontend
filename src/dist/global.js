export const SCREEN_WIDTH = 1920;
export const SCREEN_HEIGHT = 1080;

export const TAG_LENGTH = 100;
export const TAG_MIN1 = 1000;
export const TAG_MAX1 = 1100;
export const TAG_MIN2 = 2000;
export const TAG_MAX2 = 2100;

export const MAIN_PADDING = 24;

export const TABLE_HEAD_COLOR = "#f5f5dc";

export const EQ_COLORS = { EQ1: "red", EQ2: "orange", EQ3: "yellow", EQ4: "green", EQ5: "blue", EQ6: "purple" };

export const SERVER_URL = "http://127.0.0.1:3001";

export const deepCopy = (object) =>
{
    if (typeof object !== "object" || object === null)
    {
        return object;
    }

    const deepCopyObject = {};

    for (let key in object)
    {
        deepCopyObject[key] = deepCopy(object[key]);
    }

    return deepCopyObject;
};
