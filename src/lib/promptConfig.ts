export type GenreKey =
  | "chillhop"
  | "lofi"
  | "neosoul"
  | "rnb"
  | "hiphop"
  | "gospel"
  | "edm"
  | "trap"
  | "orchestra"
  | "dubstep"
  | "reggae"
  | "electronica";

export const GENRES: Record<GenreKey, string> = {
  chillhop: "Chillhop",
  lofi: "Lo-Fi",
  neosoul: "Neo-Soul",
  rnb: "R&B",
  hiphop: "Hip-Hop",
  gospel: "Gospel",
  edm: "EDM",
  trap: "Trap",
  orchestra: "Orchestra",
  dubstep: "Dubstep",
  reggae: "Reggae",
  electronica: "Electronica",
};

export type SectionId =
  | "core"
  | "rhythm"
  | "bass"
  | "melodic"
  | "texture"
  | "production";

export type Section = {
  id: SectionId;
  name: string;
  categories: string[];
};

export const SECTIONS: Section[] = [
  {
    id: "core",
    name: "Core Foundation",
    categories: ["Genre/Style", "BPM/Tempo", "Key/Scale", "Time Signature"],
  },
  {
    id: "rhythm",
    name: "Rhythm Section",
    categories: [
      "Drum Kit Style",
      "Kick Pattern",
      "Snare/Clap Style",
      "Hi-hat Pattern",
    ],
  },
  {
    id: "bass",
    name: "Bass Foundation",
    categories: [
      "Bass Type",
      "Bass Pattern/Style",
      "Bass Tone/Character",
      "Bass Accents",
    ],
  },
  {
    id: "melodic",
    name: "Melodic Elements",
    categories: [
      "Lead Instrument",
      "Chord Progression",
      "Harmonic Movement",
      "Secondary Melodic",
    ],
  },
  {
    id: "texture",
    name: "Texture & Atmosphere",
    categories: [
      "Ambient Elements",
      "Vocal/Lyrical",
      "Sound Effects",
      "Spatial Elements",
    ],
  },
  {
    id: "production",
    name: "Production & Character",
    categories: [
      "Mix Style",
      "Effects Processing",
      "Overall Vibe",
      "Era/Time Period",
    ],
  },
];

export type OptionMatrix = {
  [sectionId in SectionId]?: {
    [category: string]: {
      [genre in GenreKey | "default"]?: string[];
    };
  };
};

export const OPTION_MATRIX: OptionMatrix = {
  core: {
    "Genre/Style": {
      chillhop: ["Chillhop", "Jazzy Chillhop", "Ambient Chillhop"],
      lofi: ["Lo-Fi Hip-Hop", "Dusty Lo-Fi", "Bedroom Lo-Fi"],
      neosoul: ["Neo-Soul", "Alternative Soul", "Contemporary Soul"],
      rnb: ["Contemporary R&B", "Classic R&B", "Alt R&B"],
      hiphop: ["Boom Bap", "Trap", "Conscious Hip-Hop"],
      gospel: ["Traditional Gospel", "Contemporary Gospel", "Neo Gospel"],
      edm: ["House", "Progressive House", "Deep House"],
      trap: ["Classic Trap", "Melodic Trap", "Hardwave"],
      orchestra: ["Symphonic", "Chamber Orchestra", "Modern Classical"],
      dubstep: ["Melodic Dubstep", "Heavy Dubstep", "Future Bass"],
      reggae: ["Roots Reggae", "Dancehall", "Reggae Fusion"],
      electronica: ["Ambient Electronic", "Downtempo", "IDM"],
    },
    "BPM/Tempo": {
      chillhop: ["70-80 BPM", "80-90 BPM", "90-100 BPM"],
      lofi: ["60-70 BPM", "70-80 BPM", "80-90 BPM"],
      neosoul: ["85-95 BPM", "95-105 BPM", "105-115 BPM"],
      rnb: ["90-100 BPM", "100-110 BPM", "110-120 BPM"],
      hiphop: ["85-95 BPM", "130-140 BPM (Trap)", "90-100 BPM"],
      gospel: ["100-110 BPM", "110-120 BPM", "120-130 BPM"],
      edm: ["120-128 BPM", "128-132 BPM", "132-140 BPM"],
      trap: ["130-140 BPM", "140-150 BPM", "150-160 BPM"],
      orchestra: ["60-80 BPM", "80-100 BPM", "100-120 BPM"],
      dubstep: ["140 BPM", "150 BPM", "160 BPM"],
      reggae: ["60-90 BPM", "90-110 BPM", "110-130 BPM"],
      electronica: ["80-120 BPM", "120-140 BPM", "140-160 BPM"],
    },
    "Key/Scale": {
      chillhop: ["C Major", "A Minor", "F Major"],
      lofi: ["D Minor", "F Major", "Bb Major"],
      neosoul: ["E Minor", "A Major", "D Major"],
      rnb: ["Bb Major", "G Minor", "Eb Major"],
      hiphop: ["C Minor", "E Minor", "F# Minor"],
      gospel: ["Ab Major", "Db Major", "F Major"],
      edm: ["A Minor", "C Major", "G Minor"],
      trap: ["C# Minor", "F Minor", "G# Minor"],
      orchestra: ["D Major", "B Minor", "F# Major"],
      dubstep: ["E Minor", "A Minor", "D Minor"],
      reggae: ["A Major", "D Major", "G Major"],
      electronica: ["C Minor", "F Minor", "Bb Minor"],
    },
    "Time Signature": {
      chillhop: ["4/4", "6/8", "7/8"],
      lofi: ["4/4", "Swing 4/4", "Half-Time"],
      neosoul: ["4/4", "Neo-Soul Swing", "6/8"],
      rnb: ["4/4", "R&B Swing", "Half-Time Shuffle"],
      hiphop: ["4/4", "Trap Timing", "Boom Bap Swing"],
      gospel: ["4/4", "Gospel Shuffle", "12/8"],
      edm: ["4/4", "Straight 4/4", "Dance Timing"],
      trap: ["4/4", "Half-Time", "Double-Time"],
      orchestra: ["4/4", "3/4", "6/8"],
      dubstep: ["4/4", "Half-Time", "Double-Time"],
      reggae: ["4/4", "One Drop", "Steppers"],
      electronica: ["4/4", "7/8", "5/4"],
    },
  },
  rhythm: {
    "Drum Kit Style": {
      chillhop: ["Vintage Acoustic", "Lo-Fi Electronic", "Jazz Brushes"],
      lofi: ["Dusty Vinyl", "Analog Drum Machine", "Tape Saturated"],
      neosoul: ["Live Acoustic", "Hybrid Electronic", "Vintage Ludwig"],
      rnb: ["Tight & Punchy", "808 Hybrid", "Live Drums"],
      hiphop: ["Punchy Sampled", "808 Heavy", "Vintage Breaks"],
      gospel: ["Live Acoustic", "Punchy Modern", "Vintage Gospel"],
      edm: ["Electronic Punchy", "Layered Samples", "Analog Drums"],
      trap: ["Heavy 808 Kit", "Hybrid Trap Kit", "Minimal Trap Kit"],
      orchestra: [
        "Timpani & Percussion",
        "Concert Percussion",
        "Orchestral Drums",
      ],
      dubstep: ["Electronic Heavy", "Hybrid Kit", "Glitch Drums"],
      reggae: ["One Drop Kit", "Steppers Kit", "Digital Reggae"],
      electronica: ["Programmed", "Glitch Beats", "Ambient Percussion"],
    },
    "Kick Pattern": {
      chillhop: ["Laid-back Swing", "Subtle Sidestick", "Minimal Thump"],
      lofi: ["Muffled Thump", "Vintage 808", "Cardboard Kick"],
      neosoul: ["Neo-Soul Groove", "Syncopated Kick", "Ghost Kick"],
      rnb: ["Punchy 808", "Sub Heavy", "Syncopated Pattern"],
      hiphop: ["Booming 808", "Punchy Kick", "Sub Heavy Kick"],
      gospel: ["Gospel Chops", "Four on Floor", "Syncopated Gospel"],
      edm: ["Four on Floor", "Deep House Kick", "Punchy Dance"],
      trap: ["Punchy 808", "Distorted Kick", "Sub Kick"],
      orchestra: ["Timpani Rolls", "Orchestral Hits", "Subtle Timpani"],
      dubstep: ["Heavy Drop Kick", "Distorted 808", "Sub Bass Kick"],
      reggae: ["One Drop", "Steppers", "Rockers"],
      electronica: ["Minimal Kick", "Glitch Pattern", "Ambient Pulse"],
    },
    "Snare/Clap Style": {
      chillhop: ["Soft Rimshot", "Snappy Snare", "Brush Snare"],
      lofi: ["Dusty Snare", "Vinyl Clap", "Taped Rim"],
      neosoul: ["Tight Pop", "Ghosted Snare", "Brush Accents"],
      rnb: ["Snappy Clap", "Tight Snare", "Layered Clap"],
      hiphop: ["Cracked Snare", "Snare+Clap Stack", "Gritty Rim"],
      gospel: ["Live Crack", "Gospel Rimshot", "Snare Rolls"],
      edm: ["Bright Clap", "Layered Snare", "Synthetic Clap"],
      trap: ["Snare+Clap", "Snare Roll", "Rim Tap"],
      orchestra: ["Snare Drum", "Side Stick", "Military Roll"],
      dubstep: ["Aggressive Snare", "Metallic Clap", "Layered Crack"],
      reggae: ["Loose Snare", "Clap Off-beat", "Side Stick"],
      electronica: ["Synthetic Snare", "Glitch Clap", "Click Snare"],
    },
    "Hi-hat Pattern": {
      chillhop: ["Swing 8ths", "Loose 16ths", "Sparse Hats"],
      lofi: ["Dusty 8ths", "Lazy 16ths", "Open Hat Accents"],
      neosoul: ["Swung 16ths", "Ghosted 32nds", "Offbeat Hats"],
      rnb: ["Tight 16ths", "Syncopated 8ths", "Open Hat on 4"],
      hiphop: ["Trap 1/16 Rolls", "Straight 8ths", "Triplet Rolls"],
      gospel: ["Live 8ths", "Open on 4", "Syncopated 16ths"],
      edm: ["Straight 16ths", "Offbeat Open Hat", "Shaker 16ths"],
      trap: ["1/32 Rolls", "Triplet Rolls", "Open Hat Stabs"],
      orchestra: ["Cymbal Swells", "Closed Hat Ticks", "Ride Patterns"],
      dubstep: ["Stuttered 16ths", "Triplet Stabs", "Offbeat Open"],
      reggae: ["Offbeat Open Hat", "Sparse 8ths", "Shaker Groove"],
      electronica: ["Glitchy 16ths", "Randomized Hats", "Granular Hats"],
    },
  },
  bass: {
    "Bass Type": {
      chillhop: ["Warm Synth", "Upright Bass", "Electric Bass"],
      lofi: ["Warm 808", "Muffled Synth Bass", "Analog Sub"],
      neosoul: ["Fender Bass", "Synth Bass", "Upright Bass"],
      rnb: ["Sub Bass", "Analog Synth", "Electric Bass"],
      hiphop: ["Deep 808", "Synth Bass", "Sampled Bass"],
      gospel: ["Electric Bass", "Synth Bass", "Upright Bass"],
      edm: ["Deep Sub", "Synth Bass", "Reese Bass"],
      trap: ["Sliding 808", "Reese Bass", "Sub-Bass"],
      orchestra: ["Double Bass", "Cello Section", "Contrabass"],
      dubstep: ["Wobble Bass", "Sub Bass", "Distorted Bass"],
      reggae: ["Electric Bass", "Synth Bass", "Dub Bass"],
      electronica: ["Analog Bass", "FM Bass", "Modular Bass"],
    },
    "Bass Pattern/Style": {
      chillhop: ["Laid-back Groove", "Walking Hints", "Syncopated Dots"],
      lofi: ["Simple Root Notes", "Held Subs", "Lazy Groove"],
      neosoul: ["Syncopated Neo Groove", "Slides & Ghosts", "Pocket Groove"],
      rnb: ["Smooth Legato", "Syncopated R&B", "Octave Jumps"],
      hiphop: ["Booming Root-5ths", "808 Sustains", "Syncopated Hits"],
      gospel: ["Walking Gospel", "Pentatonic Runs", "Octave Walks"],
      edm: ["Sidechained 1/8", "Offbeat Bass", "Arp Bass"],
      trap: ["808 Slides", "Sparse 808s", "Triplet 808s"],
      orchestra: ["Pizzicato Pattern", "Long Sustains", "Arco Ostinato"],
      dubstep: ["Wobble Pattern", "LFO Swells", "Syncopated Growls"],
      reggae: ["One Drop Bass", "Syncopated Skank", "Walking Dub"],
      electronica: ["Sequenced 16ths", "FM Pulses", "Modulated Pattern"],
    },
    "Bass Tone/Character": {
      chillhop: ["Warm", "Round", "Vintage"],
      lofi: ["Muffled", "Dusty", "Tape-warped"],
      neosoul: ["Smooth", "Velvety", "Thick"],
      rnb: ["Subby", "Polished", "Clean Low-End"],
      hiphop: ["Deep 808", "Gritty", "Punchy"],
      gospel: ["Clean Low-End", "Warm Analog", "Present"],
      edm: ["Clean Sub", "Bright", "Reese Edge"],
      trap: ["Distorted 808", "Pure Sub", "Dark Sub"],
      orchestra: ["Wooden", "Rich", "Resonant"],
      dubstep: ["Growly", "Distorted", "Talking"],
      reggae: ["Fat", "Dubby", "Round"],
      electronica: ["Analog", "FM", "Textured"],
    },
    "Bass Accents": {
      default: ["Slides", "Ghost Notes", "Octaves"],
    },
  },
  melodic: {
    "Lead Instrument": {
      chillhop: ["Electric Piano", "Mellow Synth", "Jazz Guitar"],
      lofi: ["Dusty Piano", "Warm Rhodes", "Vintage Synth"],
      neosoul: ["Fender Rhodes", "Wurlitzer", "Neo-Soul Guitar"],
      rnb: ["Modern Keys", "Vintage Rhodes", "Smooth Guitar"],
      hiphop: ["Dark Synths", "Piano Samples", "Brass Stabs"],
      gospel: ["Hammond Organ", "Gospel Piano", "Electric Piano"],
      edm: ["Lead Synth", "Pluck Synth", "Arp Synth"],
      trap: ["Dark Synth Lead", "Melodic Bell", "Sampled Melody"],
      orchestra: ["Violin Section", "Piano", "Flute"],
      dubstep: ["Supersaw Lead", "Pluck Lead", "Vocal Chops"],
      reggae: ["Electric Guitar", "Organ", "Melodica"],
      electronica: ["Analog Lead", "FM Synth", "Granular Synth"],
    },
    "Chord Progression": {
      chillhop: ["ii–V–I in Jazz Keys", "I–vi–IV–V", "iv–V–I Modal"],
      lofi: ["I–iv", "vi–IV", "i–VII–VI"],
      neosoul: ["Extended ii–V–I", "IVmaj7–V7–iii7", "Chromatic Passing"],
      rnb: ["I–V–vi–IV", "vi–IV–I–V", "ii–V–I"],
      hiphop: ["i–VI–VII", "i–iv", "i–v–VI"],
      gospel: ["I–IV–V", "I–vi–IV–V", "IV–V–I"],
      edm: ["vi–IV–I–V", "I–V–vi–IV", "i–VI–III–VII"],
      trap: ["i–VI", "i–VII–VI", "i–iv–VI"],
      orchestra: ["I–IV–V–I", "i–iv–V", "I–vi–ii–V"],
      dubstep: ["i–VI–VII", "i–v–VI", "VI–VII–i"],
      reggae: ["I–V–vi–IV", "I–IV–V", "ii–V–I"],
      electronica: ["i–VI–III", "I–V–vi", "Modal Loop"],
    },
    "Harmonic Movement": {
      chillhop: ["Smooth Voice Leading", "Modal Interchange", "Passing Tones"],
      lofi: ["Static Harmony", "Slow Movements", "Sparse Changes"],
      neosoul: ["Extended Voicings", "Chromatic Approach", "Altered Dominants"],
      rnb: ["Subtle Extensions", "Borrowed Chords", "Suspended Resolutions"],
      hiphop: ["Minimal Harmony", "Sampled Changes", "Pedal Tones"],
      gospel: ["Circle of Fifths", "Call-and-Response", "Turnarounds"],
      edm: ["Looped Harmony", "Build/Release", "Suspended Pads"],
      trap: ["Drone Harmony", "Minor Modal", "Pitch Bends"],
      orchestra: ["Counterpoint", "Thematic Development", "Modulation"],
      dubstep: ["Sparse Harmony", "Tonal Shifts", "Suspense Holds"],
      reggae: ["I–IV Movement", "Offbeat Cadence", "Simple Turnarounds"],
      electronica: ["Evolving Texture", "Phased Harmony", "Minimal Changes"],
    },
    "Secondary Melodic": {
      chillhop: ["Counter-melody Keys", "Muted Guitar Licks", "Soft Sax Lines"],
      lofi: ["Bell Motifs", "Tape Keys", "Whistle Lead"],
      neosoul: ["Background Vocals", "Guitar Fills", "Rhodes Layers"],
      rnb: ["Harmony Stacks", "Synth Counterline", "Guitar Riffs"],
      hiphop: ["Vocal Chop Hook", "Synth Stabs", "Sampled Motif"],
      gospel: ["Choir Pads", "Organ Fills", "Horn Lines"],
      edm: ["Arp Counterline", "Pluck Layer", "Vocal Chop Topline"],
      trap: ["Bell Counter", "Pluck Arp", "Choir Stabs"],
      orchestra: ["Flute Counter", "Viola Line", "Horn Countermelody"],
      dubstep: ["Lead Layer", "Vocal Chop Fills", "Pluck Arp"],
      reggae: ["Guitar Skanks", "Organ Bubble", "Melodica Fills"],
      electronica: ["Textural Motif", "Sequenced Arp", "Granular Lead"],
    },
  },
  texture: {
    "Ambient Elements": {
      chillhop: ["Warm Pads", "Subtle Strings", "Vinyl Texture"],
      lofi: ["Analog Strings", "Dusty Atmosphere", "Tape Saturation"],
      neosoul: ["Lush Strings", "Warm Organ", "Analog Pads"],
      rnb: ["Lush Pads", "Smooth Strings", "Warm Atmosphere"],
      hiphop: ["Dark Atmosphere", "Urban Textures", "Minimal Pads"],
      gospel: ["Church Atmosphere", "Warm Reverb", "Inspirational Pads"],
      edm: ["Atmospheric Pads", "Sweep FX", "Ambient Layers"],
      trap: ["Dark Ambient Pads", "Reverb Drones", "Filtered Noise"],
      orchestra: ["String Section", "Brass Section", "Woodwinds"],
      dubstep: ["Atmospheric Pads", "Reverb Swells", "Noise Sweeps"],
      reggae: ["Dub Echoes", "Reverb Tails", "Atmospheric Pads"],
      electronica: ["Ambient Textures", "Field Recordings", "Drone Layers"],
    },
    "Vocal/Lyrical": {
      default: [
        "Instrumental (no vocals)",
        "Vocal chops",
        "Lead vocal",
        "Background harmonies",
      ],
    },
    "Sound Effects": {
      chillhop: ["Vinyl Noise", "Reverse Cymbals", "Cassette Stops"],
      lofi: ["Tape Hiss", "Button Clicks", "Field Noise"],
      neosoul: ["Subtle Whooshes", "Room Noise", "Reverse Swells"],
      rnb: ["Reverse FX", "Impact Hits", "Ear Candy FX"],
      hiphop: ["Tape Stop", "Record Stops", "Vocal Stutters"],
      gospel: ["Room Ambience", "Breath FX", "Subtle Rises"],
      edm: ["Risers", "Downlifters", "Impacts"],
      trap: ["Risers", "808 Booms", "Glitches"],
      orchestra: ["Cymbal Rolls", "Sub Drops", "Hall Swells"],
      dubstep: ["Growl FX", "Risers", "Impacts"],
      reggae: ["Dub Echo FX", "Spring Reverb FX", "Tape Delay Hits"],
      electronica: ["Glitch FX", "Bitcrush FX", "Granular Swells"],
    },
    "Spatial Elements": {
      chillhop: ["Wide Pads", "Roomy Drums", "Subtle Delay Tails"],
      lofi: ["Tape Wow Flutter", "Narrow Mono", "Springy Space"],
      neosoul: ["Warm Room Verb", "Stereo Keys", "Short Delay"],
      rnb: ["Plate Vocals", "Tight Room", "Stereo Spread"],
      hiphop: ["Tight Room", "Mono Focus", "Slap Delay"],
      gospel: ["Large Hall", "Plate Verb", "Roomy Drums"],
      edm: ["Wide Stereo", "Long Reverb", "Ping-pong Delay"],
      trap: ["Wide 808", "Short Room", "Stereo FX"],
      orchestra: ["Concert Hall", "Stage Ambience", "Wide Strings"],
      dubstep: ["Wide Leads", "Long FX Tails", "Mid/Side Width"],
      reggae: ["Dub Delays", "Spring Reverb", "Stereo Space"],
      electronica: ["Granular Space", "Diffused Reverb", "MS Width"],
    },
  },
  production: {
    "Mix Style": {
      chillhop: ["Clean & Warm", "Lo-Fi Dusty", "Vintage Analog"],
      lofi: ["Dusty Vintage", "Analog Compressed", "Tape Warped"],
      neosoul: ["Warm Analog", "Live Studio", "Vintage Console"],
      rnb: ["Modern Polish", "Vintage Warmth", "Contemporary Mix"],
      hiphop: ["Hard & Punchy", "Lo-Fi Dusty", "Modern Clean"],
      gospel: ["Live Church", "Vintage Gospel", "Modern Worship"],
      edm: ["Loud & Punchy", "Clean Digital", "Analog Warmth"],
      trap: ["Loud and Punchy", "Dark and Gritty", "Polished Mainstream"],
      orchestra: ["Concert Hall", "Studio Recording", "Live Performance"],
      dubstep: ["Loud & Aggressive", "Clean & Punchy", "Distorted & Heavy"],
      reggae: ["Dub Style", "Clean & Punchy", "Vintage Analog"],
      electronica: ["Clean Digital", "Analog Warmth", "Experimental"],
    },
    "Effects Processing": {
      chillhop: ["Tape Saturation", "Light Compression", "Gentle Sidechain"],
      lofi: ["Heavy Tape", "Bitcrush", "Wow & Flutter"],
      neosoul: ["Analog Saturation", "Glue Compression", "Subtle Chorus"],
      rnb: ["Parallel Compression", "De-ess & EQ", "Saturation Bus"],
      hiphop: ["Hard Clip", "Bitcrush Sprinkles", "Parallel Drum Comp"],
      gospel: ["Hall Reverb", "Parallel Drum Bus", "Tape Glue"],
      edm: ["Sidechain Pump", "OTT", "Stereo Imaging"],
      trap: ["808 Distortion", "Transient Shaping", "Sidechain Ducking"],
      orchestra: ["Natural Reverb", "Minimal Compression", "Spot Mics Blend"],
      dubstep: ["OTT & Distortion", "LFO Modulation", "Stereo FX Chains"],
      reggae: ["Spring Reverb", "Tape Delay", "Dub Filters"],
      electronica: ["Granular FX", "Modulation FX", "Saturation"],
    },
    "Overall Vibe": {
      chillhop: ["Relaxed & Chill", "Contemplative", "Nostalgic"],
      lofi: ["Dreamy & Nostalgic", "Melancholic", "Cozy & Intimate"],
      neosoul: ["Soulful & Smooth", "Sophisticated", "Emotional & Deep"],
      rnb: ["Smooth & Sensual", "Emotional & Powerful", "Contemporary Cool"],
      hiphop: ["Aggressive & Hard", "Dark & Moody", "Confident & Bold"],
      gospel: ["Uplifting & Joyful", "Spiritual & Moving", "Celebratory"],
      edm: ["Energetic & Uplifting", "Emotional Progressive", "Dance Euphoric"],
      trap: ["Aggressive & Dark", "Energetic and Hype", "Melancholic and Wavy"],
      orchestra: [
        "Majestic & Grand",
        "Emotional & Dramatic",
        "Peaceful & Serene",
      ],
      dubstep: ["Aggressive & Intense", "Emotional & Melodic", "Dark & Heavy"],
      reggae: [
        "Laid-back & Groovy",
        "Uplifting & Positive",
        "Spiritual & Deep",
      ],
      electronica: [
        "Atmospheric & Dreamy",
        "Experimental & Abstract",
        "Minimal & Clean",
      ],
    },
    "Era/Time Period": {
      chillhop: ["Modern Chill", "90s Boom Bap Vibe", "2000s Neo Soul"],
      lofi: ["Cassette 90s", "Bedroom 2010s", "Vintage 70s"],
      neosoul: ["2000s Neo Soul", "Modern Neo Soul", "90s R&B/Soul"],
      rnb: ["90s R&B", "2000s Contemporary", "Modern R&B"],
      hiphop: ["90s Boom Bap", "2000s Underground", "Modern Trap Era"],
      gospel: ["Traditional", "90s Contemporary", "Modern Worship"],
      edm: ["2010s Progressive", "Modern EDM", "Early 2000s House"],
      trap: ["2010s Trap", "Modern Trap", "Phonk Influence"],
      orchestra: ["Romantic Era", "Modern Film Score", "Baroque Influence"],
      dubstep: ["2010s Brostep", "Melodic 2014", "Modern Hybrid Bass"],
      reggae: ["70s Roots", "80s Dancehall", "Modern Reggae Fusion"],
      electronica: ["Early IDM 90s", "2000s Glitch", "Modern Downtempo"],
    },
  },
};

export function getOptions(
  sectionId: SectionId,
  category: string,
  genre: GenreKey
): string[] {
  const sec = OPTION_MATRIX[sectionId];
  const cat = sec?.[category];
  if (!cat) return [];
  return cat[genre] || cat["default"] || [];
}
