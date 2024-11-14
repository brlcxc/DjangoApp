export const stringToSkewedPaletteColor = (
    str: string, 
    // targetPalette: { r: number, g: number, b: number }[], 
    skewAmount: number = 0.5
  ) => {

    let targetPalette = [
        { r: 241, g: 227, b: 243 },  // pale-purple: #F1E3F3
        { r: 194, g: 187, b: 240 },  // periwinkle: #C2BBF0
        { r: 246, g: 152, b: 187 },  // amaranth-pink: #F698BB
        { r: 98, g: 191, b: 237 },   // deep-sky-blue: #62BFED
        { r: 53, g: 144, b: 243 },   // dodger-blue: #3590F3
        { r: 247, g: 131, b: 121 },  // coral: #F78379
        { r: 254, g: 124, b: 112 }   // deep-coral: #FE7C70
      ];

    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
  
    let baseColor = { r: 0, g: 0, b: 0 };
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      if (i === 0) baseColor.r = value;
      if (i === 1) baseColor.g = value;
      if (i === 2) baseColor.b = value;
    }
  
    // Select a color from the target palette using the hash
    const targetColor = targetPalette[Math.abs(hash) % targetPalette.length];
  
    // Skew towards the selected palette color
    const skewedColor = {
      r: Math.round(baseColor.r * (1 - skewAmount) + targetColor.r * skewAmount),
      g: Math.round(baseColor.g * (1 - skewAmount) + targetColor.g * skewAmount),
      b: Math.round(baseColor.b * (1 - skewAmount) + targetColor.b * skewAmount),
    };
  
    return `#${((1 << 24) + (skewedColor.r << 16) + (skewedColor.g << 8) + skewedColor.b).toString(16).slice(1)}`;
  };