const fs = require("fs");
const path = require("path");

// Read the sprite data from file
fs.readFile("atlas-data.json", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  const sprites = JSON.parse(data);
  const atlas = createAtlas(sprites);
  const jsCode = `window.atlas = { size: ${1024 * 8}, mappings: ${JSON.stringify(atlas)}, src: "atlases/atlas.png" }`;

  // Write the modified atlas object to file
  fs.writeFile("atlas.js", jsCode, (error) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log("Atlas saved to file");
  });
});

// Create the atlas object from the sprite data
function createAtlas(sprites) {
  const atlas = {};
  for (const sprite of sprites.frames) {
    const { x, y, w, h } = sprite.frame;

    const atlas_width = 8192;
    const atlas_height = 8192;

    const sprite_uv = [
      x / atlas_width, // Left
      1.0 - (y + h) / atlas_height, // Top (inverted)
      (x + w) / atlas_width, // Right
      1.0 - y / atlas_height, // Bottom (inverted)
    ];

    atlas[sprite.filename] = {
      uv: sprite_uv,
    };
  }
  return atlas;
}
