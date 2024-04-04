// declarations
const url = "https://mhw-db.com/weapons";
const fs = require('fs');
let hasCached = false;
const weaponTypes = [
    'great-sword', 'long-sword', 'sword-and-shield',
    'dual-blades', 'hammer', 'hunting-horn',
    'lance', 'gunlance', 'switch-axe',
    'charge-blade', 'insect-glaive', 'light-bowgun',
    'heavy-bowgun', 'bow'
];

/**
 * caches the weapons data
 * @param {*} filename 
 * @param {*} data 
 */
function cacheData(filename, data) {
    try {
        fs.writeFile(filename, data, (error) => {
            if (error) throw error;
            console.log("Weapon data cached successfully.");
        })
    } catch (error) {
        console.error(`An error occured while trying to write ${filename}`, error.message);
    }
}

/**
 * reads a cached data
 * @param {*} filename 
 * @returns 
 */
function readCache(filename) {
    try {
        let data = fs.readFileSync(filename);
        console.log("Read file succesfully");
        return JSON.parse(data);
    } catch (error) {
        console.error(`An error occured while trying to read ${filename}`, error.message);
    }
}

/**
 * returns all weapon data
 */
async function getAllWeapons() {
    if (!hasCached) {
        hasCached = true;
        let response = await fetch(url);
        let data = await response.json();
        cacheData("weapons.json", JSON.stringify(data));
        return data;
    }
    
    return readCache("weapons.json");
}

/**
 * returns all weapons within this category
 * @param {} category 
 * @returns 
 */
async function getSpecificWeapon(category) {
     if (!fs.existsSync(`${category}.json`)) {
        let encoded = encodeURIComponent(category);
        let response = await fetch(`${url}?q={"type":"${encoded}"}`);
        let data = await response.json();
        cacheData(`${category}.json`, JSON.stringify(data));
        return data;
      }

      return readCache(`${category}.json`);
} 