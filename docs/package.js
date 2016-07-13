(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2016 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# honegar\nA sweet sweet honeypot of a game.\n\nIn scope comprable to Dwarf Fortress but with a few differences in philosophy.\n\nThis game will be open and accessible. Web based, playable in the browser. It\nwill be collaborative. We'll explore many of the same themes: society building,\nemergent behavior from complex systems, fantasy and rpg elements, autonamous\nagents, procedural generation.\n\n## Features\n\nBirth and death\n\nLineage and family trees\n\nCultural evolution\n\nHistory and legends\n\nProcedurally generated songs and music that you can hear, rendered in MIDI.\n\nNatural and synthetic drugs, hallucinogens, alcohol.\n\nDrunk Driving\n\nProcedurally generated books\n\nBasic perceptual modelling of autonamous agents.\n\nRoles like surveyor and planner can designate work for others.\n\nLaws, legal system, jurisdictions, detection and enforcibility of crimes.\n\nEmergent economics: asset bubbles and crashes.\n\nWater, magma, oil\n\nCollectivist and individualist societies\n\nEvolutionary selection of laws, social customs, prejudices.\n\nMental illness, depression bi-polar disorder.\n\nDisease and medicine.\n\nProcedurally generated sex acts.\n\nWar, famine, capitalism, class struggle\n\nReligious texts encouraging and prohibiting certain actions (expect to see an\nemergence of memetics and proselytizing)\n\nEcosystems, plants, fungus, trees, animals.\n\nProperty ownership, rent seeking.\n\nDebt backed securites.\n\nCollaborative networked play\n\nPlugins and user generated subsystems.\n\nTeach an old dog new tricks.\n\n## Scenarios\n\nA goblin is put to death for violating an emergent law by telling a procedurally\ngenerated joke.\n\nSpring rains and favorable weather cause an immense bloom of flowers, causing a\nboom and then bust in the bee population.\n\nRowdy elf teens get high off of cave fungus.\n\nAlcohol is prohibited and the local sheriff comissions a posse to destroy all\nthe stills.\n\nA famine causes waves of migrant gnomes to spread forth throughout the land\nsharing their culture and over hundreds of years assimilating into different\nsocieties to varying degrees. Some are always treated as second class citizens\nwhile others arriving among more tolerant cultures are equals and can own land\nand property.\n\n## Overview\n\nThis is vast in scope, but the goal will be to find the simplest systems that\ncan be composed together to create vibrant emergent behavior.\n\nHopefully will be a never ending source of fun work!\n",
      "mode": "100644",
      "type": "blob"
    },
    "canvas.coffee": {
      "path": "canvas.coffee",
      "content": "TouchCanvas = require \"touch-canvas\"\n\nmodule.exports = (game) ->\n  canvas = TouchCanvas\n    width: 512\n    height: 288\n\n  canvas.on \"touch\", (e) ->\n    Tools[game.activeTool()].touch(e, game)\n\n  canvas.on \"move\", (e) ->\n    Tools[game.activeTool()].move(e, game)\n\n  canvas.on \"release\", (e) ->\n    Tools[game.activeTool()].release(e, game)\n\n  return canvas\n\nSimpleTool = (touch) ->\n  touch: touch\n  move: ->\n  release: ->\n\nTools =\n  pan: do ->\n    startPos = null\n    initialPan = null\n\n    touch: (e, game) ->\n      viewport = game.viewport()\n\n      startPos = e\n      initialPan =\n        x: viewport.x\n        y: viewport.y\n\n    move: ({x, y}, game) ->\n      viewport = game.viewport()\n\n      if startPos\n        {x:sX, y:sY} = startPos\n        deltaX = (sX - x) * viewport.width\n        deltaY = (sY - y) * viewport.height\n\n        viewport.x = initialPan.x + deltaX\n        viewport.y = initialPan.y + deltaY\n\n    release: (e, game) ->\n      startPos = null\n\n  inspect: SimpleTool (e, game) ->\n    p = worldPosition(e, game.viewport())\n\n    c = game.world().entityAt(p)\n\n    if c\n      game.inspectedCharacter c\n\nworldPosition = ({x, y}, viewport) ->\n    x: viewport.x + (x * viewport.width)|0\n    y: viewport.y + (y * viewport.height)|0\n",
      "mode": "100644",
      "type": "blob"
    },
    "culture/data/cities/ca.json": {
      "path": "culture/data/cities/ca.json",
      "content": "[\"Adelanto\",\"Agoura Hills\",\"Alameda\",\"Albany\",\"Alhambra\",\"Aliso Viejo\",\"Alturas\",\"Amador City\",\"American Canyon\",\"Anaheim\",\"Anderson\",\"Angels Camp\",\"Antioch\",\"Apple Valley\",\"Arcadia\",\"Arcata\",\"Arroyo Grande\",\"Artesia\",\"Arvin\",\"Atascadero\",\"Atherton\",\"Atwater\",\"Auburn\",\"Avalon\",\"Avenal\",\"Azusa\",\"Bakersfield\",\"Baldwin Park\",\"Banning\",\"Barstow\",\"Beaumont\",\"Bell\",\"Bell Gardens\",\"Bellflower\",\"Belmont\",\"Belvedere\",\"Benicia\",\"Berkeley\",\"Beverly Hills\",\"Big Bear Lake\",\"Biggs\",\"Bishop\",\"Blue Lake\",\"Blythe\",\"Bradbury\",\"Brawley\",\"Brea\",\"Brentwood\",\"Brisbane\",\"Buellton\",\"Buena Park\",\"Burbank\",\"Burlingame\",\"Calabasas\",\"Calexico\",\"California City\",\"Calimesa\",\"Calipatria\",\"Calistoga\",\"Camarillo\",\"Campbell\",\"Canyon Lake\",\"Capitola\",\"Carlsbad\",\"Carmel-by-the-Sea\",\"Carpinteria\",\"Carson\",\"Cathedral City\",\"Ceres\",\"Cerritos\",\"Chico\",\"Chino\",\"Chino Hills\",\"Chowchilla\",\"Chula Vista\",\"Citrus Heights\",\"Claremont\",\"Clayton\",\"Clearlake\",\"Cloverdale\",\"Clovis\",\"Coachella\",\"Coalinga\",\"Colfax\",\"Colma\",\"Colton\",\"Colusa\",\"Commerce\",\"Compton\",\"Concord\",\"Corcoran\",\"Corning\",\"Corona\",\"Coronado\",\"Corte Madera\",\"Costa Mesa\",\"Cotati\",\"Covina\",\"Crescent City\",\"Cudahy\",\"Culver City\",\"Cupertino\",\"Cypress\",\"Daly City\",\"Dana Point\",\"Danville\",\"Davis\",\"Del Mar\",\"Del Rey Oaks\",\"Delano\",\"Desert Hot Springs\",\"Diamond Bar\",\"Dinuba\",\"Dixon\",\"Dorris\",\"Dos Palos\",\"Downey\",\"Duarte\",\"Dublin\",\"Dunsmuir\",\"East Palo Alto\",\"Eastvale\",\"El Cajon\",\"El Centro\",\"El Cerrito\",\"El Monte\",\"El Segundo\",\"Elk Grove\",\"Emeryville\",\"Encinitas\",\"Escalon\",\"Escondido\",\"Etna\",\"Eureka\",\"Exeter\",\"Fairfax\",\"Fairfield\",\"Farmersville\",\"Ferndale\",\"Fillmore\",\"Firebaugh\",\"Folsom\",\"Fontana\",\"Fort Bragg\",\"Fort Jones\",\"Fortuna\",\"Foster City\",\"Fountain Valley\",\"Fowler\",\"Fremont\",\"Fresno\",\"Fullerton\",\"Galt\",\"Garden Grove\",\"Gardena\",\"Gilroy\",\"Glendale\",\"Glendora\",\"Goleta\",\"Gonzales\",\"Grand Terrace\",\"Grass Valley\",\"Greenfield\",\"Gridley\",\"Grover Beach\",\"Guadalupe\",\"Gustine\",\"Half Moon Bay\",\"Hanford\",\"Hawaiian Gardens\",\"Hawthorne\",\"Hayward\",\"Healdsburg\",\"Hemet\",\"Hercules\",\"Hermosa Beach\",\"Hesperia\",\"Hidden Hills\",\"Highland\",\"Hillsborough\",\"Hollister\",\"Holtville\",\"Hughson\",\"Huntington Beach\",\"Huntington Park\",\"Huron\",\"Imperial\",\"Imperial Beach\",\"Indian Wells\",\"Indio\",\"Industry\",\"Inglewood\",\"Ione\",\"Inskip\",\"Irvine\",\"Irwindale\",\"Isleton\",\"Jackson\",\"Jurupa Valley\",\"Kerman\",\"King City\",\"Kingsburg\",\"La Cañada Flintridge\",\"La Habra\",\"La Habra Heights\",\"La Mesa\",\"La Mirada\",\"La Palma\",\"La Puente\",\"La Quinta\",\"La Verne\",\"Lafayette\",\"Laguna Beach\",\"Laguna Hills\",\"Laguna Niguel\",\"Laguna Woods\",\"Lake Elsinore\",\"Lake Forest\",\"Lakeport\",\"Lakewood\",\"Lancaster\",\"Larkspur\",\"Lathrop\",\"Lawndale\",\"Lemon Grove\",\"Lemoore\",\"Lincoln\",\"Lindsay\",\"Live Oak\",\"Livermore\",\"Livingston\",\"Lodi\",\"Loma Linda\",\"Lomita\",\"Lompoc\",\"Long Beach\",\"Loomis\",\"Los Alamitos\",\"Los Altos\",\"Los Altos Hills\",\"Los Angeles\",\"Los Banos\",\"Los Gatos\",\"Loyalton\",\"Lynwood\",\"Madera\",\"Malibu\",\"Mammoth Lakes\",\"Manhattan Beach\",\"Manteca\",\"Maricopa\",\"Marina\",\"Martinez\",\"Marysville\",\"Maywood\",\"McFarland\",\"Mendota\",\"Menifee\",\"Menlo Park\",\"Merced\",\"Mill Valley\",\"Millbrae\",\"Milpitas\",\"Mission Viejo\",\"Modesto\",\"Monrovia\",\"Montague\",\"Montclair\",\"Monte Sereno\",\"Montebello\",\"Monterey\",\"Monterey Park\",\"Moorpark\",\"Moraga\",\"Moreno Valley\",\"Morgan Hill\",\"Morro Bay\",\"Mount Shasta\",\"Mountain View\",\"Murrieta\",\"Napa\",\"National City\",\"Needles\",\"Nevada City\",\"Newark\",\"Newman\",\"Newport Beach\",\"Norco\",\"Norwalk\",\"Novato\",\"Oakdale\",\"Oakland\",\"Oakley\",\"Oceanside\",\"Ojai\",\"Ontario\",\"Orange\",\"Orange Cove\",\"Orinda\",\"Orland\",\"Oroville\",\"Oxnard\",\"Pacific Grove\",\"Pacifica\",\"Palm Desert\",\"Palm Springs\",\"Palmdale\",\"Palo Alto\",\"Palos Verdes Estates\",\"Paradise\",\"Paramount\",\"Parlier\",\"Pasadena\",\"Paso Robles\",\"Patterson\",\"Perris\",\"Petaluma\",\"Pico Rivera\",\"Piedmont\",\"Pinole\",\"Pismo Beach\",\"Pittsburg\",\"Placentia\",\"Placerville\",\"Pleasant Hill\",\"Pleasanton\",\"Plymouth\",\"Point Arena\",\"Pomona\",\"Port Hueneme\",\"Porterville\",\"Portola\",\"Portola Valley\",\"Poway\",\"Rancho Cordova\",\"Rancho Cucamonga\",\"Rancho Mirage\",\"Rancho Palos Verdes\",\"Rancho Santa Margarita\",\"Red Bluff\",\"Redding\",\"Redlands\",\"Redondo Beach\",\"Redwood City\",\"Reedley\",\"Rialto\",\"Richmond\",\"Ridgecrest\",\"Rio Dell\",\"Rio Vista\",\"Ripon\",\"Riverbank\",\"Riverside\",\"Rocklin\",\"Rohnert Park\",\"Rolling Hills\",\"Rolling Hills Estates\",\"Rosemead\",\"Roseville\",\"Ross\",\"Sacramento\",\"St. Helena\",\"Salinas\",\"San Anselmo\",\"San Bernardino\",\"San Bruno\",\"San Carlos\",\"San Clemente\",\"San Diego\",\"San Dimas\",\"San Fernando\",\"San Francisco\",\"San Gabriel\",\"San Jacinto\",\"San Joaquin\",\"San Jose\",\"San Juan Bautista\",\"San Juan Capistrano\",\"San Leandro\",\"San Luis Obispo\",\"San Marcos\",\"San Marino\",\"San Mateo\",\"San Pablo\",\"San Rafael\",\"San Ramon\",\"Sand City\",\"Sanger\",\"Santa Ana\",\"Santa Barbara\",\"Santa Clara\",\"Santa Clarita\",\"Santa Cruz\",\"Santa Fe Springs\",\"Santa Maria\",\"Santa Monica\",\"Santa Paula\",\"Santa Rosa\",\"Santee\",\"Saratoga\",\"Sausalito\",\"Scotts Valley\",\"Seal Beach\",\"Seaside\",\"Sebastopol\",\"Selma\",\"Shafter\",\"Shasta Lake\",\"Sierra Madre\",\"Signal Hill\",\"Simi Valley\",\"Solana Beach\",\"Soledad\",\"Solvang\",\"Sonoma\",\"Sonora\",\"South El Monte\",\"South Gate\",\"South Lake Tahoe\",\"South Pasadena\",\"South San Francisco\",\"Stanton\",\"Stockton\",\"Suisun City\",\"Sunnyvale\",\"Susanville\",\"Sutter Creek\",\"Taft\",\"Tehachapi\",\"Tehama\",\"Temecula\",\"Temple City\",\"Thousand Oaks\",\"Tiburon\",\"Torrance\",\"Tracy\",\"Trinidad\",\"Truckee\",\"Tulare\",\"Tulelake\",\"Turlock\",\"Tustin\",\"Twentynine Palms\",\"Ukiah\",\"Union City\",\"Upland\",\"Vacaville\",\"Vallejo\",\"Ventura\",\"Vernon\",\"Victorville\",\"Villa Park\",\"Visalia\",\"Vista\",\"Walnut\",\"Walnut Creek\",\"Wasco\",\"Waterford\",\"Watsonville\",\"Weed\",\"West Covina\",\"West Hollywood\",\"West Sacramento\",\"Westlake Village\",\"Westminster\",\"Westmorland\",\"Wheatland\",\"Whittier\",\"Wildomar\",\"Williams\",\"Willits\",\"Willows\",\"Windsor\",\"Winters\",\"Woodlake\",\"Woodland\",\"Woodside\",\"Yorba Linda\",\"Yountville\",\"Yreka\",\"Yuba City\",\"Yucaipa\",\"Yucca Valley\"]\n",
      "mode": "100644",
      "type": "blob"
    },
    "culture/data/names/anglo-saxon.coffee": {
      "path": "culture/data/names/anglo-saxon.coffee",
      "content": "# Names extracted from http://www.babynameguide.com/categoryanglo-saxon.asp?strGender=&strAlpha=A&strCat=Anglo-Saxon&strOrder=Name\n\nmodule.exports =\n  male: [[\"Aart\",\"Like an eagle\",\"English\"],[\"Ace\",\"Unity\",\"Latin\"],[\"Acey\",\"Unity\",\"Latin\"],[\"Acton\",\"Town by the oak tree\",\"Old English\"],[\"Acwel\",\"Kills\",\"Unknown\"],[\"Acwellen\",\"Kills\",\"Unknown\"],[\"Aidan\",\"Little fiery one\",\"Irish\"],[\"Aiken\",\"Oaken\",\"English\"],[\"Alban\",\"Town on the white hill\",\"Latin\"],[\"Alden\",\"Old and wise protector\",\"Old English\"],[\"Aldin\",\"Old and wise protector\",\"Old English\"],[\"Aldred\",\"Wise counselor\",\"English\"],[\"Aldwyn\",\"Old friend\",\"English\"],[\"Alfred\",\"Wise counselor\",\"Old English\"],[\"Algar\",\"Noble spearman\",\"German\"],[\"Alger\",\"Noble spearman\",\"German\"],[\"Almund\",\"Defender of the temple\",\"Unknown\"],[\"Alton\",\"From the old town\",\"Old English\"],[\"Alwin\",\"Noble friend\",\"German\"],[\"Anson\",\"Divine\",\"German\"],[\"Archard\",\"Sacred\",\"Unknown\"],[\"Archerd\",\"Sacred\",\"Unknown\"],[\"Archibald\",\"Bold\",\"German\"],[\"Arian\",\"Echanted\",\"Greek\"],[\"Arlice\",\"Honorable\",\"Unknown\"],[\"Arlys\",\"Honorable\",\"Unknown\"],[\"Arlyss\",\"Honorable\",\"Unknown\"],[\"Artair\",\"Bear\",\"Scottish\"],[\"Arth\",\"Rock\",\"English\"],[\"Aston\",\"Eastern settlement\",\"English\"],[\"Audley\",\"Prosperous guardian or old friend\",\"English\"],[\"Averil\",\"Wild boar\",\"English\"],[\"Averill\",\"Wild boar\",\"English\"],[\"Avery\",\"Elf ruler\",\"English\"],[\"Banning\",\"Small and fair\",\"Irish\"],[\"Bar\",\"From the birch meadow\",\"English\"],[\"Barclay\",\"From the birch tree meadow\",\"English\"],[\"Barney\",\"Son of comfort\",\"English\"],[\"Barrett\",\"Commerce\",\"French\"],[\"Barton\",\"From the barley settlement\",\"Old English\"],[\"Basil\",\"Kingly\",\"Latin\"],[\"Baxter\",\"Baker\",\"Old English\"],[\"Bede\",\"Prayer\",\"English\"],[\"Berkeley\",\"From the birch tree meadow\",\"English\"],[\"Bernard\",\"Brave as a bear\",\"German\"],[\"Bertram\",\"Bright raven\",\"English\"],[\"Betlic\",\"Splendid\",\"English\"],[\"Boden\",\"Messenger\",\"French\"],[\"Boniface\",\"To do good\",\"Latin\"],[\"Bordan\",\"From the boar valley\",\"English\"],[\"Borden\",\"From the boar valley\",\"English\"],[\"Brant\",\"Proud\",\"Old English\"],[\"Brecc\",\"Freckled\",\"Irish\"],[\"Brice\",\"Strength or valor\",\"Welsh\"],[\"Brigham\",\"Dwells at the bridge\",\"Old English\"],[\"Bron\",\"Brown or dark\",\"English\"],[\"Bronson\",\"Son of the dark man\",\"English\"],[\"Brun\",\"Dark skinned\",\"German\"],[\"Bryce\",\"Strength or valor\",\"Welsh\"],[\"Burgess\",\"Town dweller\",\"English\"],[\"Burton\",\"From the fortified town\",\"Old English\"],[\"Byron\",\"At the cowshed\",\"Old English\"],[\"Camden\",\"From the winding valley\",\"Scottish\"],[\"Camdene\",\"From the winding valley\",\"Scottish\"],[\"Cary\",\"Descendant of the dark one\",\"Welsh\"],[\"Cecil\",\"Dim sighted or blind\",\"Latin\"],[\"Cerdic\",\"Beloved\",\"Welsh\"],[\"Chad\",\"Warrior\",\"Old English\"],[\"Chapman\",\"Merchant\",\"English\"],[\"Chester\",\"Rocky fortress\",\"Old English\"],[\"Clifford\",\"Ford near the cliff\",\"Old English\"],[\"Clive\",\"Cliff by the river\",\"Old English\"],[\"Colby\",\"Dark or dark haired\",\"Old English\"],[\"Corey\",\"Dweller near a hollow\",\"Irish\"],[\"Cosmo\",\"Order or harmony\",\"Greek\"],[\"Courtland\",\"From the court's land\",\"English\"],[\"Courtnay\",\"Courtier or court attendant\",\"English\"],[\"Courtney\",\"Courtier or court attendant\",\"English\"],[\"Creighton\",\"Dweller by the rocks\",\"English\"],[\"Cyril\",\"Master or Lord\",\"Greek\"],[\"Daegal\",\"Dweller by the dark stream\",\"English\"],[\"Dalston\",\"From Dougal's place\",\"English\"],[\"Delbert\",\"Bright as day\",\"English\"],[\"Dell\",\"Hollow or valley\",\"Old English\"],[\"Deman\",\"Man\",\"Scandinavian\"],[\"Denby\",\"From the Danish settlement\",\"Scandinavian\"],[\"Denton\",\"Settlement in the valley\",\"Old English\"],[\"Derian\",\"Small rocky hill\",\"English\"],[\"Desmond\",\"From south Munster\",\"Irish\"],[\"Devon\",\"Poet\",\"Irish\"],[\"Devyn\",\"Poet\",\"Irish\"],[\"Dougal\",\"Dark stranger\",\"Scottish\"],[\"Douglas\",\"Dark stream or dark river\",\"Scottish\"],[\"Drew\",\"Manly\",\"English\"],[\"Dudley\",\"The people's meadow\",\"Old English\"],[\"Duke\",\"Leader\",\"French\"],[\"Durwin\",\"Friend of the deer\",\"English\"],[\"Durwyn\",\"Friend of the deer\",\"English\"],[\"Eamon\",\"Wealthy guardian\",\"Irish\"],[\"Earl\",\"Nobleman\",\"English\"],[\"Earle\",\"Nobleman\",\"English\"],[\"Eddison\",\"Son of Edward\",\"English\"],[\"Edgar\",\"Lucky spearman\",\"Old English\"],[\"Edgard\",\"Lucky spearman\",\"Old English\"],[\"Edlin\",\"Wealthy friend\",\"English\"],[\"Edlyn\",\"Wealthy friend\",\"English\"],[\"Edmond\",\"Prosperous protector\",\"Old English\"],[\"Edmund\",\"Prosperous protector\",\"Old English\"],[\"Edric\",\"Wealthy ruler\",\"English\"],[\"Edsel\",\"Rich mans house\",\"English\"],[\"Edson\",\"Son of Edward\",\"English\"],[\"Edward\",\"Wealthy guardian\",\"Old English\"],[\"Edwin\",\"Prosperous friend\",\"Old English\"],[\"Edwyn\",\"Prosperous friend\",\"Old English\"],[\"Egbert\",\"Bright sword\",\"English\"],[\"Eldon\",\"Foreign hill\",\"Old English\"],[\"Eldred\",\"Old and wise advisor\",\"English\"],[\"Eldrid\",\"Old and wise advisor\",\"English\"],[\"Eldwin\",\"Old and wise friend\",\"English\"],[\"Eldwyn\",\"Old and wise friend\",\"English\"],[\"Elmer\",\"Noble\",\"Old English\"],[\"Emmet\",\"Industrious\",\"German\"],[\"Erian\",\"Enchanted\",\"Greek\"],[\"Erol\",\"Courageous\",\"Turkish\"],[\"Errol\",\"Wanderer\",\"Latin\"],[\"Esmond\",\"Wealthy protector\",\"English\"],[\"Faran\",\"Baker\",\"Arabic\"],[\"Felix\",\"Fortunate or happy\",\"Latin\"],[\"Fenton\",\"Marshland farm\",\"Old English\"],[\"Feran\",\"Traveler\",\"Old english\"],[\"Finian\",\"Light skinned\",\"Irish\"],[\"Firman\",\"Firm or strong\",\"French\"],[\"Fleming\",\"Dutchman from Flanders\",\"Old English\"],[\"Fletcher\",\"Arrow maker\",\"Old English\"],[\"Floyd\",\"Gray or white haired\",\"English\"],[\"Ford\",\"Dweller near the ford\",\"Old English\"],[\"Freeman\",\"Free man\",\"English\"],[\"Gaderian\",\"Gathers\",\"Unknown\"],[\"Galan\",\"Healer\",\"Greek\"],[\"Gar\",\"Spear\",\"English\"],[\"Gareth\",\"Gentle\",\"Welsh\"],[\"Garr\",\"Spear\",\"English\"],[\"Garrett\",\"Mighty with a spear\",\"Irish\"],[\"Garvin\",\"Friend in battle\",\"Old English\"],[\"Geoff\",\"Peaceful\",\"English\"],[\"Geoffrey\",\"Peaceful\",\"English\"],[\"Geraint\",\"Old\",\"English\"],[\"Gerard\",\"Brave with a spear\",\"Old English\"],[\"Gervaise\",\"Honorable\",\"French\"],[\"Giles\",\"Shield bearer\",\"French\"],[\"Godric\",\"Rules with God\",\"Unknown\"],[\"Godwine\",\"Friend of God\",\"Old English\"],[\"Gordie\",\"Hill near the meadow\",\"Old English\"],[\"Gordon\",\"Hill near the meadow\",\"Old English\"],[\"Gordy\",\"Hill near the meadow\",\"Old English\"],[\"Graeme\",\"Grand home\",\"Scottish\"],[\"Graham\",\"Grand home\",\"English\"],[\"Grahem\",\"Grand home\",\"English\"],[\"Gram\",\"Grand home\",\"English\"],[\"Grimm\",\"Fierce\",\"English\"],[\"Grimme\",\"Fierce\",\"English\"],[\"Grindan\",\"Sharp\",\"Unknown\"],[\"Hall\",\"That which is covered\",\"Old English\"],[\"Ham\",\"Hot\",\"Hebrew\"],[\"Holt\",\"Forest\",\"English\"],[\"Hugh\",\"Bright mind\",\"English\"],[\"Ingram\",\"Angel\",\"Old English\"],[\"Irwin\",\"Sea friend\",\"English\"],[\"Irwyn\",\"Sea friend\",\"English\"],[\"Ivor\",\"Archer's bow\",\"Scandinavian\"],[\"Jarvis\",\"Servant with a spear\",\"German\"],[\"Jeffrey\",\"Divinely peaceful\",\"Old English\"],[\"Judd\",\"Praised\",\"Hebrew\"],[\"Kendrick\",\"Royal ruler\",\"Scottish\"],[\"Kendryek\",\"Son of henry\",\"Irish\"],[\"Kenric\",\"Royal ruler\",\"English\"],[\"Kenton\",\"The royal settlement\",\"Old English\"],[\"Kenway\",\"Brave warrior\",\"Old English\"],[\"Kim\",\"Warrior chief\",\"Old English\"],[\"Kimball\",\"Warrior chief\",\"English\"],[\"King\",\"Monarch\",\"Old English\"],[\"Kingsley\",\"From the King's meadow\",\"Old English\"],[\"Kipp\",\"From the pointed hill\",\"Old English\"],[\"Landry\",\"Ruler\",\"Old English\"],[\"Lang\",\"Tall man\",\"Scandinavian\"],[\"Lange\",\"Tall man\",\"Scandinavian\"],[\"Lar\",\"Crowned with laurels\",\"Scandinavian\"],[\"Leanian\",\"Lion man or brave as a lion\",\"Greek\"],[\"Leax\",\"Salmon\",\"Unknown\"],[\"Leighton\",\"From the meadow farm\",\"Old English\"],[\"Leland\",\"From the meadow land\",\"Old English\"],[\"Leng\",\"Tall man\",\"Scandinavian\"],[\"Lex\",\"Defender of mankind\",\"Greek\"],[\"Lin\",\"Lives by the linden tree hill\",\"English\"],[\"Linn\",\"Lives by the linden tree hill\",\"English\"],[\"Lister\",\"Dyer\",\"English\"],[\"Lloyd\",\"Grey haired\",\"Welsh\"],[\"Lucan\",\"Bringer of light\",\"Old English\"],[\"Lunden\",\"From London\",\"English\"],[\"Lyn\",\"Waterfall\",\"English\"],[\"Lyndon\",\"Lives by the linden tree hill\",\"Old English\"],[\"Lynn\",\"Waterfall\",\"English\"],[\"Magen\",\"Protector\",\"Hebrew\"],[\"Mann\",\"Hero\",\"German\"],[\"Mannix\",\"Monk\",\"Irish\"],[\"Manton\",\"From the hero's town\",\"English\"],[\"Maxwell\",\"Dweller by the spring\",\"Scottish\"],[\"Merlin\",\"Sea hill\",\"Celtic\"],[\"Merton\",\"Sea town\",\"English\"],[\"Montgomery\",\"From the wealthy man's mountain\",\"Old English\"],[\"Morton\",\"Town by thr moor\",\"Old English\"],[\"Ned\",\"Wealthy guardian\",\"English\"],[\"Nerian\",\"Protects\",\"Unknown\"],[\"Neville\",\"New town\",\"French\"],[\"Newton\",\"From the new town\",\"English\"],[\"Nodin\",\"Wind\",\"American\"],[\"Norman\",\"Norseman\",\"French\"],[\"Norris\",\"Northerner\",\"French\"],[\"Norton\",\"From the north farm\",\"English\"],[\"Norvel\",\"From the north town\",\"English\"],[\"Norville\",\"From the north town\",\"French\"],[\"Nyle\",\"Island\",\"English\"],[\"Octe\",\"A son of Hengist\",\"Unknown\"],[\"Odel\",\"Forested hill\",\"English\"],[\"Odell\",\"Forested hill\",\"English\"],[\"Odi\",\"Ruler\",\"Scandinavian\"],[\"Odin\",\"God of all\",\"Old Norse\"],[\"Odon\",\"Ruler\",\"Scandinavian\"],[\"Ody\",\"Ruler\",\"Scandinavian\"],[\"Orde\",\"Beginning\",\"Latin\"],[\"Ormod\",\"Bear mountain\",\"English\"],[\"Orson\",\"Bear like\",\"Latin\"],[\"Orville\",\"Golden village\",\"French\"],[\"Orvin\",\"Brave friend or spear friend\",\"English\"],[\"Orvyn\",\"Brave friend or spear friend\",\"English\"],[\"Osmond\",\"Divine protection\",\"Old English\"],[\"Osric\",\"Divine ruler\",\"English\"],[\"Oswald\",\"Divine power\",\"Old English\"],[\"Oswin\",\"Divine friend\",\"Old English\"],[\"Page\",\"Attendent\",\"French\"],[\"Paige\",\"Attendent\",\"French\"],[\"Patton\",\"Warrior's town\",\"Old English\"],[\"Pax\",\"Peaceful\",\"Latin\"],[\"Paxton\",\"Peaceful town\",\"Latin\"],[\"Payne\",\"Man from the country\",\"Latin\"],[\"Pearce\",\"Rock\",\"English\"],[\"Pearson\",\"Son of Peter\",\"English\"],[\"Perry\",\"Dweller by the pear tree\",\"English\"],[\"Pierce\",\"Rock\",\"English\"],[\"Piers\",\"Lover of horses\",\"English\"],[\"Putnam\",\"Dweller by the pond\",\"English\"],[\"Ramm\",\"Ram\",\"English\"],[\"Rand\",\"Wolf's shield\",\"Old English\"],[\"Randolf\",\"Wolf shield\",\"Scandinavian\"],[\"Rawlins\",\"Famous in the land\",\"French\"],[\"Ray\",\"Dear brook\",\"English\"],[\"Rice\",\"Noble or rich\",\"English\"],[\"Ripley\",\"Meadow near the river\",\"English\"],[\"Ro\",\"Red haired\",\"English\"],[\"Roan\",\"Tree with red berries\",\"English\"],[\"Roe\",\"Deer\",\"English\"],[\"Row\",\"Red haired\",\"English\"],[\"Rowan\",\"Tree with red berries\",\"English\"],[\"Rowe\",\"Red haired\",\"English\"],[\"Roweson\",\"Son of the redhead\",\"English\"],[\"Rowson\",\"Son of the redhead\",\"English\"],[\"Ryce\",\"Powerful\",\"English\"],[\"Seaton\",\"Town near the sea\",\"English\"],[\"Seaver\",\"Fierce stronghold\",\"English\"],[\"Selwin\",\"Friend at court\",\"English\"],[\"Selwyn\",\"Friend at court\",\"English\"],[\"Sener\",\"Bringer of joy\",\"Turkish\"],[\"Sever\",\"Fierce stronghold\",\"English\"],[\"Seward\",\"Sea gaurdian\",\"Old English\"],[\"Sheldon\",\"Farm on the ledge\",\"Old English\"],[\"Shelley\",\"From the ledge meadow\",\"Old English\"],[\"Shelny\",\"From the ledge farm\",\"Old English\"],[\"Shepard\",\"Shepherd\",\"English\"],[\"Shephard\",\"Shepherd\",\"English\"],[\"Sheply\",\"From the sheep meadow\",\"English\"],[\"Sherard\",\"Of glorious valor\",\"English\"],[\"Sherwin\",\"Quick as the wind\",\"English\"],[\"Sherwyn\",\"Quick as the wind\",\"English\"],[\"Steadman\",\"Dwells at the farm\",\"English\"],[\"Stedman\",\"Dwells at the farm\",\"English\"],[\"Stepan\",\"Exalts\",\"Russian\"],[\"Stewart\",\"Steward\",\"Old English\"],[\"Stewert\",\"Steward\",\"Old English\"],[\"Stillman\",\"Quiet\",\"English\"],[\"Stilwell\",\"From the tranquil stream\",\"English\"],[\"Storm\",\"Tempestuous\",\"English\"],[\"Stuart\",\"Steward\",\"Old English\"],[\"Sutton\",\"Southern town\",\"Old English\"],[\"Tamar\",\"Palm tree\",\"Hebrew\"],[\"Tedman\",\"Protector of the land\",\"Old English\"],[\"Tedmund\",\"Protector of the land\",\"Old English\"],[\"Teller\",\"Storyteller\",\"Old English\"],[\"Tolan\",\"From the taxed land\",\"Old English\"],[\"Toland\",\"From the taxed land\",\"Old English\"],[\"Torr\",\"Watchtower\",\"Old English\"],[\"Trace\",\"Harvester\",\"Greek\"],[\"Tracey\",\"Harvester\",\"Greek\"],[\"Tracy\",\"Harvester\",\"Greek\"],[\"Tredan\",\"Tramples\",\"English\"],[\"Treddian\",\"Leaves\",\"English\"],[\"Upton\",\"From the high town\",\"Old English\"],[\"Verge\",\"Staff bearer\",\"Latin\"],[\"Vernon\",\"Youthful or springlike\",\"Latin\"],[\"Virgil\",\"Staff bearer\",\"Latin\"],[\"Wallace\",\"From Wales\",\"English\"],[\"Wallis\",\"From Wales\",\"English\"],[\"Ward\",\"Watchman\",\"Old English\"],[\"Ware\",\"Cautious\",\"Old English\"],[\"Whitney\",\"From the white island\",\"Old English\"],[\"Wilbur\",\"Walled stronghold\",\"Old English\"],[\"Wilfrid\",\"Resolute peacemaker\",\"English\"],[\"Winchell\",\"Bend in the road\",\"Old English\"],[\"Winston\",\"Friendly town\",\"Old English\"],[\"Woodrow\",\"Dweller by the wood\",\"Old English\"],[\"Wylie\",\"Enchanting\",\"English\"],[\"Wyman\",\"Fighter\",\"English\"],[\"Wynchell\",\"Drawer of water\",\"English\"],[\"Wyne\",\"Friend\",\"English\"]]\n  female: [[\"Acca\",\"Unity\",\"Latin\"],[\"Afra\",\"Young doe\",\"Hebrew\"],[\"Afton\",\"From Afton\",\"English\"],[\"Ainsley\",\"My own meadow\",\"Scottish\"],[\"Aisly\",\"Dwells at the ash tree meadow\",\"Scottish\"],[\"Alberta\",\"Noble and bright\",\"German\"],[\"Alodia\",\"Rich\",\"Unknown\"],[\"Alodie\",\"Rich\",\"Unknown\"],[\"Althena\",\"Healer\",\"Greek\"],[\"Amity\",\"Friendship\",\"Latin\"],[\"Annis\",\"Pure\",\"English\"],[\"Antonia\",\"Priceless, inestimable or praiseworthy\",\"Latin\"],[\"Ara\",\"Opinionated\",\"Arabic\"],[\"Ardith\",\"Flowering field\",\"Hebrew\"],[\"Arleigh\",\"Meadow of the hare\",\"Old English\"],[\"Arlette\",\"Pledge\",\"Old English\"],[\"Ashley\",\"Meadow of ash trees\",\"Old English\"],[\"Audrey\",\"Noble strength\",\"Old English\"],[\"Augusta\",\"Venerable\",\"Latin\"],[\"Beatrix\",\"She who brings happiness\",\"German\"],[\"Becky\",\"Bound\",\"American\"],[\"Berenice\",\"She will bring victory\",\"Greek\"],[\"Bliss\",\"Delight joy or happiness\",\"Old English\"],[\"Blythe\",\"Cheerful\",\"Old English\"],[\"Bonnie\",\"Pretty\",\"English\"],[\"Breck\",\"Freckled\",\"Irish\"],[\"Bree\",\"Strong\",\"Irish\"],[\"Bridget\",\"Strength\",\"Irish\"],[\"Brimlad\",\"Seaway\",\"Unknown\"],[\"Britt\",\"From Britian\",\"Old English\"],[\"Cate\",\"Pure\",\"Greek\"],[\"Catherine\",\"Pure\",\"Greek\"],[\"Catheryn\",\"Pure\",\"Greek\"],[\"Cathryn\",\"Pure\",\"Greek\"],[\"Chelsea\",\"Port or landing place\",\"Old English\"],[\"Clover\",\"Clover\",\"Old English\"],[\"Constance\",\"Constant or steadfast\",\"Latin\"],[\"Coventina\",\"Water Goddess\",\"Greek\"],[\"Cwen\",\"Queen\",\"Welsh\"],[\"Cwene\",\"Queen\",\"Welsh\"],[\"Daisy\",\"Eye of the day\",\"Old English\"],[\"Darel\",\"Darling or beloved\",\"French\"],[\"Darelene\",\"Darling\",\"French\"],[\"Darelle\",\"Darling or beloved\",\"French\"],[\"Darlene\",\"Darling\",\"French\"],[\"Darline\",\"Darling\",\"French\"],[\"Daryl\",\"Darling\",\"French\"],[\"Dawn\",\"Daybreak or sunrise\",\"English\"],[\"Devona\",\"From Devonshire\",\"English\"],[\"Diera\",\"From Diera\",\"Unknown\"],[\"Dolly\",\"Gift of God\",\"American\"],[\"Domino\",\"Belonging to the Lord\",\"English\"],[\"Doretta\",\"Gift of God\",\"English\"],[\"Doris\",\"Of the sea\",\"Greek\"],[\"Eadlin\",\"Princess\",\"Unknown\"],[\"Earlene\",\"Noblewoman\",\"English\"],[\"Eartha\",\"Earthy\",\"English\"],[\"Easter\",\"Born at Easter\",\"English\"],[\"Eda\",\"Wealthy\",\"English\"],[\"Edina\",\"Ardent\",\"Irish\"],[\"Edit\",\"Prosperous in war\",\"Old English\"],[\"Edita\",\"Prosperous in war\",\"Spanish\"],[\"Edith\",\"Prosperous in war\",\"Old English\"],[\"Editha\",\"Prosperous in war\",\"German\"],[\"Edla\",\"Princess\",\"Unknown\"],[\"Edlin\",\"Princess\",\"English\"],[\"Edwina\",\"Prosperous friend\",\"Old English\"],[\"Edyt\",\"Prosperous in war\",\"Old English\"],[\"Edyth\",\"Prosperous in war\",\"Old English\"],[\"Elda\",\"Old and wise protector\",\"Old English\"],[\"Elene\",\"Light\",\"Greek\"],[\"Elga\",\"Pious\",\"Scandinavian\"],[\"Ellette\",\"Little elf\",\"French\"],[\"Elswyth\",\"Elf from the willow trees\",\"English\"],[\"Elva\",\"Elfin\",\"Old English\"],[\"Elvia\",\"Elfin\",\"Old English\"],[\"Elvina\",\"Elfin\",\"Old English\"],[\"Elwine\",\"Elf wise friend\",\"English\"],[\"Elwyna\",\"Elf wise friend\",\"English\"],[\"Engel\",\"Angel\",\"German\"],[\"Erlene\",\"Noblewoman\",\"English\"],[\"Erlina\",\"Noblewoman\",\"English\"],[\"Erline\",\"Noblewoman\",\"English\"],[\"Esma\",\"Emerald\",\"French\"],[\"Esme\",\"Emerald\",\"French\"],[\"Ethal\",\"Noble\",\"Old English\"],[\"Eugenia\",\"Well born or noble\",\"French\"],[\"Faline\",\"Catlike\",\"Latin\"],[\"Fancy\",\"Whimsical\",\"English\"],[\"Fanny\",\"Free\",\"American\"],[\"Felice\",\"Fortunate or happy\",\"Latin\"],[\"Flair\",\"Style or verve\",\"English\"],[\"Flora\",\"Flower\",\"Latin\"],[\"Florence\",\"Blooming or flowering\",\"Latin\"],[\"Frederica\",\"Peaceful ruler\",\"German\"],[\"Garyn\",\"Mighty with a spear\",\"English\"],[\"Gay\",\"Light hearted\",\"French\"],[\"Gayna\",\"White wave\",\"English\"],[\"Gemma\",\"Precious stone\",\"Latin\"],[\"Georgina\",\"Farmer\",\"English\"],[\"Gillian\",\"Downy bearded\",\"Latin\"],[\"Gladys\",\"Princess\",\"Irish\"],[\"Glenna\",\"Secluded valley or glen\",\"Irish\"],[\"Guinevere\",\"White wave\",\"Welsh\"],[\"Gwen\",\"White wave\",\"Welsh\"],[\"Gwendolyn\",\"White wave\",\"Welsh\"],[\"Harriet\",\"Ruler of an enclosure\",\"French\"],[\"Henrietta\",\"Ruler of the enclosure\",\"English\"],[\"Hild\",\"Battle maid\",\"German\"],[\"Hilda\",\"Battle maid\",\"German\"],[\"Hollis\",\"Near the holly bushes\",\"Old English\"],[\"Jetta\",\"A deep or glossy black\",\"Greek\"],[\"Joan\",\"God is gracious\",\"Hebrew\"],[\"Jody\",\"Praised\",\"American\"],[\"Juliana\",\"Downy bearded or youthful\",\"Latin\"],[\"Katie\",\"Pure\",\"English\"],[\"Keeley\",\"Brave warrior\",\"Irish\"],[\"Kendra\",\"Knowing\",\"Old english\"],[\"Leila\",\"Dark beauty\",\"Hebrew\"],[\"Lilian\",\"Lily\",\"Latin\"],[\"Linette\",\"Bird\",\"French\"],[\"Linn\",\"Waterfall\",\"English\"],[\"Lizbeth\",\"Consecrated to God\",\"English\"],[\"Lois\",\"Famous warrior\",\"German\"],[\"Lora\",\"Crowned with laurels\",\"Latin\"],[\"Loretta\",\"Crowned with laurels\",\"English\"],[\"Lorna\",\"Crowned with laurels\",\"Latin\"],[\"Lucetta\",\"Bringer of light\",\"English\"],[\"Lyn\",\"Waterfall\",\"English\"],[\"Lynet\",\"Idol\",\"Welsh\"],[\"Lynette\",\"Idol\",\"Welsh\"],[\"Lynn\",\"Waterfall\",\"English\"],[\"Lynna\",\"Waterfall\",\"English\"],[\"Lynne\",\"Waterfall\",\"English\"],[\"Mae\",\"Great\",\"English\"],[\"Maida\",\"Maiden\",\"English\"],[\"Mariam\",\"Bitter or sea of bitterness\",\"Hebrew\"],[\"Marian\",\"Bitter or sea of bitterness\",\"English\"],[\"Maud\",\"Mighty battle maiden\",\"English\"],[\"Maureen\",\"Bitter\",\"Irish\"],[\"Maxine\",\"The greatest\",\"Latin\"],[\"May\",\"To increase\",\"Latin\"],[\"Mayda\",\"Maiden\",\"Unknown\"],[\"Megan\",\"Pearl\",\"Irish\"],[\"Meghan\",\"Pearl\",\"Irish\"],[\"Mercia\",\"Compassion\",\"English\"],[\"Meryl\",\"Blackbird\",\"Latin\"],[\"Mildred\",\"Gentle advisor\",\"Old english\"],[\"Moira\",\"Sea of bitterness\",\"Irish\"],[\"Moire\",\"Sea of bitterness\",\"French\"],[\"Mona\",\"Noble\",\"Irish\"],[\"Nelda\",\"From the Alder trees\",\"Unknown\"],[\"Noreen\",\"Bright torch\",\"Greek\"],[\"Norma\",\"Man from the north\",\"German\"],[\"Octavia\",\"Eighth\",\"Italian\"],[\"Odelia\",\"Wealthy\",\"French\"],[\"Odelina\",\"Wealthy\",\"French\"],[\"Odelinda\",\"Wealthy\",\"French\"],[\"Odella\",\"Wealthy\",\"French\"],[\"Odelyn\",\"Wealthy\",\"French\"],[\"Odelyna\",\"Wealthy\",\"French\"],[\"Odette\",\"Wealthy\",\"French\"],[\"Odilia\",\"Wealthy\",\"French\"],[\"Ora\",\"Seacoast\",\"English\"],[\"Orva\",\"Worth gold\",\"French\"],[\"Ottilie\",\"Little wealthy one\",\"Unknown\"],[\"Peace\",\"Calm or tranquil\",\"English\"],[\"Peggy\",\"Pearl\",\"English\"],[\"Petra\",\"Rock\",\"Latin\"],[\"Petula\",\"Rock\",\"English\"],[\"Philippa\",\"Lover of horses\",\"Greek\"],[\"Philomena\",\"Lover of strength\",\"Greek\"],[\"Phyllis\",\"Leaf\",\"Greek\"],[\"Polly\",\"Small\",\"Latin\"],[\"Portia\",\"Pig\",\"Latin\"],[\"Primrose\",\"Primrose\",\"English\"],[\"Prudence\",\"Provident\",\"Latin\"],[\"Queenie\",\"Queen\",\"Old english\"],[\"Quenna\",\"Queen\",\"Old English\"],[\"Randi\",\"Wolf shield\",\"German\"],[\"Rexanne\",\"Gracious king\",\"English\"],[\"Rexella\",\"King of light\",\"English\"],[\"Rowena\",\"White haired\",\"Welsh\"],[\"Sheena\",\"God is gracious\",\"Hebrew\"],[\"Shelley\",\"From the ledge meadow\",\"English\"],[\"Sibley\",\"Fiendly\",\"English\"],[\"Silver\",\"Lustrous\",\"Old English\"],[\"Silvia\",\"Of the woods\",\"Latin\"],[\"Sunn\",\"Cheerful\",\"English\"],[\"Sunniva\",\"Gift of the sun\",\"Scandinavian\"],[\"Synne\",\"Cheerful\",\"English\"],[\"Synnove\",\"Gift of the sun\",\"Unknown\"],[\"Tait\",\"Pleasant and bright\",\"Old English\"],[\"Taite\",\"Pleasant and bright\",\"Old English\"],[\"Tate\",\"Pleasant and bright\",\"Old English\"],[\"Tayte\",\"Pleasant and bright\",\"English\"],[\"Thea\",\"Goddess\",\"Greek\"],[\"Udela\",\"Wealthy\",\"English\"],[\"Udele\",\"Wealthy\",\"English\"],[\"Verona\",\"Bringer of victory\",\"Italian\"],[\"Wanda\",\"Young tree\",\"German\"],[\"Whitney\",\"White island\",\"Old english\"],[\"Wilda\",\"Wild\",\"German\"],[\"Willa\",\"Resolute protector\",\"German\"],[\"Wilona\",\"Hoped for\",\"English\"],[\"Wilone\",\"Hoped for\",\"English\"],[\"Zara\",\"Princess\",\"Hebrew\"],[\"Zelda\",\"Companion\",\"Old english\"]]\n",
      "mode": "100644",
      "type": "blob"
    },
    "culture/name_generator.coffee": {
      "path": "culture/name_generator.coffee",
      "content": "AngloSaxon = require \"./data/names/anglo-saxon\"\nCities = require \"./data/cities/ca\"\n\nrand = (array) ->\n  index = Math.floor Math.random() * array.length\n\n  array[index]\n\nmodule.exports = ->\n  generate: ->\n    rand(AngloSaxon.male)[0]\n\n  randomCity: ->\n    rand(Cities)\n\n  zodiac: ->\n    rand zodiac\n\nzodiac = \"\"\"\n♈\n♉\n♊\n♋\n♌\n♍\n♎\n♏\n♐\n♑\n♒\n♓\n\"\"\".split \"\\n\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "entity.coffee": {
      "path": "entity.coffee",
      "content": "Model = require \"model\"\n\ngenerator = require(\"/culture/name_generator\")()\n\nmodule.exports = (I={}, self=Model(I)) ->\n  defaults I,\n    age: Math.floor Math.random()*30 + 11\n    hometown: generator.randomCity()\n    name: generator.generate()\n    zodiac: generator.zodiac()\n\n  self.attrObservable \"age\", \"hometown\", \"index\", \"name\", \"zodiac\"\n  self.attrModel \"position\", Point\n\n  self.extend\n    move: (world) ->\n      position = self.position()\n      delta = Point rand(3)-1, rand(3)-1\n\n      newPosition = position.add(delta)\n\n      if world.passable(newPosition)\n        self.position(newPosition)\n\n  return self\n",
      "mode": "100644",
      "type": "blob"
    },
    "game.coffee": {
      "path": "game.coffee",
      "content": "Model = require \"model\"\n\nWorld = require \"./world\"\n\nmodule.exports = (I={}, self=Model(I)) ->\n  I.step ?= 0\n\n  self.attrObservable \"activeTool\", \"tools\", \"inspectedCharacter\"\n  self.attrAccessor \"viewport\"\n  self.attrAccessor \"tiles\"\n\n  self.attrModel \"world\", World\n\n  self.extend\n    update: ->\n      if I.step % 20 is 0\n        self.world().entities().forEach (entity) ->\n          entity.move(self.world())\n\n      I.step += 1\n\n  return self\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/byte-grid.coffee": {
      "path": "lib/byte-grid.coffee",
      "content": "module.exports = ({width, height, data}) ->\n  length = width * height\n\n  data ?= new Uint8Array(length)\n\n  self =\n    width: width\n    height: height\n    region: (rect, iterator) ->\n      xStart = rect.x\n      yStart = rect.y\n\n      y = 0\n      while y < rect.height\n        x = 0\n        while x < rect.width\n          xPosition = x + xStart\n          yPosition = y + yStart\n          iterator self.get(xPosition, yPosition), xPosition, yPosition\n          x += 1\n        y += 1\n\n      return self\n\n    get: (x, y) ->\n      if 0 <= x < width and 0 <= y < height\n        data[y * width + x]\n\n    set: (x, y, value) ->\n      if 0 <= x < width and 0 <= y < height\n        data[y * width + x] = value\n      else\n        throw new Error \"index out of bounds\"\n\n    data: data\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "# This is what passes for the game at any point in time. I expect to have\n# a lot of experiments going in other files to mess around with systems!\n\n# TODO\n# Render a byte array as a tile map\n# Designate jobs for your dwarfs\n# Watch as they scamper around\n\nrequire \"./setup\"\nGame = require \"./game\"\n\nRenderer = require \"./render\"\nrenderer = null\n\nview =\n  x: 0\n  y: 0\n  width: 32\n  height: 18\n\nstate =\n  viewport: view\n  world:\n    width: 64\n    height: 64\n  tiles: require(\"./tiledata\")\n  activeTool: \"pan\"\n  tools: \"\"\"\n    pan\n    inspect\n  \"\"\".split(\"\\n\")\n\ngame = Game state\nglobal.game = game\n\ncanvas = require(\"./canvas\")(game)\ngame.canvas = canvas.element()\n\nTemplate = require \"./templates/main\"\ndocument.body.appendChild Template game\n\nupdate = ->\n  game.update()\n\ndraw = ->\n  renderer?.draw(canvas, game)\n\nstep = ->\n  update()\n  draw()\n\n  requestAnimationFrame step\n\nstep()\n\nPreload = require \"./preload\"\n\nPromise.all [\n  \"Objects/Wall\"\n  \"Objects/Floor\"\n  \"Objects/Ground0\"\n  \"Objects/Ground1\"\n  \"Characters/Player0\"\n  \"Characters/Player1\"\n  \"Objects/Pit0\"\n  \"Objects/Pit1\"\n].map Preload.image\n.then (sheets) ->\n\n  characters = [0...8].map (x) ->\n    [4, x, 0]\n\n  renderer = Renderer(sheets, characters)\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "width: 1536\nheight: 864\ndependencies:\n  ajax: \"distri/ajax:master\"\n  math: \"distri/math:master\"\n  model: \"distri/model:master\"\n  \"touch-canvas\": \"distri/touch-canvas:v0.3.1\"\n  util: \"distri/util:master\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "preload.coffee": {
      "path": "preload.coffee",
      "content": "Ajax = require \"ajax\"\najax = Ajax()\n\nbasePath = \"https://danielx.whimsy.space/DawnLike/\"\n\nmodule.exports =\n  image: (name) ->\n    ajax.getBlob(\"#{basePath}#{name}.png?o_0\")\n    .then (blob) ->\n      new Promise (resolve, reject) ->\n        img = new Image\n        img.onload = ->\n          resolve(img)\n        img.onerror = reject\n        img.src = URL.createObjectURL(blob)\n",
      "mode": "100644",
      "type": "blob"
    },
    "render.coffee": {
      "path": "render.coffee",
      "content": "module.exports = (sheets, characters) ->\n  S = 16 # Tile size\n\n  autoTileDeltas = [\n    []\n    [\n      [4, -1]\n      [2, 1]\n      [3, 0]\n      [-1, 1]\n      [2, -1]\n      [2, 0]\n      [-1, -1]\n      [-1, 0]\n      [5, 0] # 8\n      [1, 1]\n      [4, 0]\n      [0, 1]\n      [1, -1]\n      [1, 0]\n      [0, -1]\n      [0, 0]\n    ]\n    [ # This is for water tiles but it is all jacked up :P\n      [3, 0]\n      [3, 0] # 1\n      [-1, -1] # 2\n      [-1, 0]\n      [3, -1]\n      [-1, -1]\n      [-1, -1]\n      [-1, 0]\n      [6, -1] # 8\n      [1, 0]\n      [0, -1]\n      [0, 0]\n      [1, -1]\n      [1, 0]\n      [0, -1]\n      [0, 0]\n    ]\n  ]\n\n  adjacents = [\n    [0, -1]\n    [1, 0]\n    [0, 1]\n    [-1, 0]\n  ]\n  # Compute an auto-tile n-value 0-15\n  # Count up top, right, bottom, left, tiles that are the same\n  # Assume off-grid tiles are the same\n  autoTileValue = (world, tile, x, y) ->\n    mult = 1\n\n    adjacents.map ([dx, dy]) ->\n      (world.getTile(x + dx, y + dy) ? tile) is tile\n    .reduce (total, match) ->\n      total = total + match * mult\n      mult *= 2\n      total\n    , 0\n\n  drawSprite = (canvas, sheet, sx, sy, x, y) ->\n    canvas.drawImage(sheet,\n      sx * S, sy * S, S, S, # Source\n      x * S, y * S, S, S # Destination\n    )\n\n  drawCharacter = (canvas, index, t, x, y) ->\n    [sheetIndex, tx, ty] = characters[index]\n\n    if t % 1000 < 500\n      sheetIndex += 1\n\n    sheet = sheets[sheetIndex]\n\n    drawSprite(canvas, sheet, tx, ty, x, y)\n\n    return\n\n  drawTile = (canvas, world, tiles, index, t, x, y) ->\n    return unless index?\n\n    [sheetIndex, tx, ty, autoTile, altSheet] = tiles[index]\n    if altSheet? and t % 1000 < 500\n      sheet = sheets[altSheet]\n    else\n      sheet = sheets[sheetIndex]\n\n    if autoTile\n      [dtx, dty] = autoTileDeltas[autoTile][autoTileValue(world, index, x, y)]\n      tx += dtx\n      ty += dty\n\n    drawSprite(canvas, sheet, tx, ty, x, y)\n\n    return\n\n  drawValue = (canvas, value, x, y) ->\n    return unless value?\n\n    canvas.drawRect\n      color: \"rgb(#{value}, 128, #{value})\"\n      x: x * S\n      y: y * S\n      width: S\n      height: S\n\n  draw: (canvas, game) ->\n    world = game.world()\n    viewport = game.viewport()\n    tiles = game.tiles()\n\n    t = +new Date\n    canvas.fill('rgb(89, 125, 206)')\n\n    transform = Matrix.translate((-S * viewport.x)|0, (-S * viewport.y)|0)\n\n    renderView =\n      x: Math.floor viewport.x\n      y: Math.floor viewport.y\n      width: viewport.width + 1\n      height: viewport.height + 1\n\n    canvas.withTransform transform, (canvas) ->\n      # Draw Tiles\n      world.region renderView, (value, x, y) ->\n        drawTile(canvas, world, tiles, value, t, x, y)\n        #drawValue(canvas, value, x, y)\n        return\n\n      # Draw Objects\n\n      # Draw Characters\n      world.entities().forEach (entity) ->\n        index = entity.index()\n        {x, y} = entity.position()\n\n        drawCharacter canvas, index, t, x, y\n",
      "mode": "100644",
      "type": "blob"
    },
    "setup.coffee": {
      "path": "setup.coffee",
      "content": "require(\"math\").pollute()\n\n{defaults, extend} = require \"util\"\n\nglobal.defaults = defaults\n\nstyleNode = document.createElement(\"style\")\nstyleNode.innerHTML = require \"./style\"\n\ndocument.head.appendChild(styleNode)\n",
      "mode": "100644",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "*\n  box-sizing: border-box\n\nhtml\n  height: 100%\n\nbody\n  background-color: rgb(20,12,28)\n  color: #1B1421\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif\n  font-weight: 300\n  font-size: 18px\n  height: 100%\n  margin: 0\n  overflow: hidden\n  user-select: none\n\nh1, h2, h3\n  margin: 0\n\nh2 > .zodiac\n  float: right\n\nlabel\n  display: block\n\n  > h3\n    display: inline-block\n    font-size: 100%\n    margin-right: 0.25em\n\ncanvas\n  bottom: 0\n  position: absolute\n  top: 0\n  left: 0\n  right: 0\n  margin: auto\n  width: 1536px\n  height: 864px\n  image-rendering: -moz-crisp-edges\n  image-rendering: -o-crisp-edges\n  image-rendering: -webkit-optimize-contrast\n  image-rendering: pixelated\n  -ms-interpolation-mode: nearest-neighbor\n\ncanvas.detail\n  width: 144px\n  height: 144px\n\n.detail\n  position: absolute\n  right: 0\n  height: 100%\n  width: 300px\n  pointer-events: none\n\ncard\n  border: 1px solid #1B1421\n  display: block\n  border-radius: 4px\n  padding: 8px\n  background-color: #DEEED6\n  pointer-events: all\n\n.tools\n  position: absolute\n  top: 0\n  left: 0\n",
      "mode": "100644",
      "type": "blob"
    },
    "templates/actions.jadelet": {
      "path": "templates/actions.jadelet",
      "content": ".actions\n",
      "mode": "100644",
      "type": "blob"
    },
    "templates/character-card.jadelet": {
      "path": "templates/character-card.jadelet",
      "content": "card\n  h2\n    = @name\n    span.zodiac= @zodiac\n  label\n    h3 Age\n    span= @age\n  label\n    h3 Hometown\n    span= @hometown\n",
      "mode": "100644",
      "type": "blob"
    },
    "templates/detail.jadelet": {
      "path": "templates/detail.jadelet",
      "content": "- CharacterCard = require \"./character-card\"\n\n.detail\n  - if character = @inspectedCharacter()\n    = CharacterCard character\n",
      "mode": "100644",
      "type": "blob"
    },
    "templates/main.jadelet": {
      "path": "templates/main.jadelet",
      "content": "- Actions = require \"./actions\"\n- Detail = require \"./detail\"\n- Tools = require \"./tools\"\n\nmain\n  = @canvas\n  = Actions this\n  = Tools this\n  = Detail this\n",
      "mode": "100644",
      "type": "blob"
    },
    "templates/tools.jadelet": {
      "path": "templates/tools.jadelet",
      "content": ".tools\n  - self = this\n  - @tools.forEach (name) ->\n    - click = -> self.activeTool name\n    - active = -> \"active\" if name is self.activeTool()\n    button(click=click class=active)= name\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/byte-grid.coffee": {
      "path": "test/byte-grid.coffee",
      "content": "ByteGrid = require \"../lib/byte-grid\"\n\ndescribe \"Byte Grid\", ->\n  it \"should be a grid of bytes\", ->\n    grid = ByteGrid\n      width: 10\n      height: 10\n\n    [0...10].forEach (y) ->\n      [0...10].forEach (x) ->\n        grid.set(x, y, x + 10 * y)\n\n    assert.equal grid.get(5, 5), 55\n    assert.equal grid.get(7, 1), 17\n\n  it \"should iterate a region\", ->\n    grid = ByteGrid\n      width: 10\n      height: 10\n\n    [0...10].forEach (y) ->\n      [0...10].forEach (x) ->\n        grid.set(x, y, x + 10 * y)\n\n    rect =\n      x: 3\n      y: 2\n      width: 3\n      height: 2\n\n    grid.region rect, (value, x, y) ->\n      console.log x, y, value\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/culture/names.coffee": {
      "path": "test/culture/names.coffee",
      "content": "NameGenerator = require \"/culture/name_generator\"\n\ndescribe \"Culture Name Generator\", ->\n  it \"should generate random names\", ->\n    generator = NameGenerator()\n\n    [0..10].forEach ->\n      console.log generator.generate()\n",
      "mode": "100644",
      "type": "blob"
    },
    "world.coffee": {
      "path": "world.coffee",
      "content": "ByteGrid = require \"./lib/byte-grid\"\n\nEntity = require \"./entity\"\n\n{gaussian} = require(\"./terrain/generate\")\n\nmodule.exports = (I) ->\n  {width, height} = I\n\n  grid = ByteGrid\n    width: width\n    height: height\n\n  gaussian(grid)\n\n  grid.data.forEach (datum, i) ->\n    if datum < 110\n      grid.data[i] = 1\n    else if datum > 130\n      grid.data[i] = 0\n    else\n      grid.data[i] = 2\n\n  entities = [0...8].map (x) ->\n    Entity\n      index: x\n      position:\n        x: 16 + x % 5\n        y: 13 + x % 3\n\n  self =\n    getTile: grid.get\n    region: grid.region\n\n    entities: ->\n      entities\n\n    passable: ({x, y}) ->\n      return false unless 0 <= x < width\n      return false unless 0 <= y < height\n\n      !(self.getTile(x, y) % 2)\n\n    entityAt: (position) ->\n      (entities.filter (entity) ->\n        entity.position().equal(position)\n      )[0]\n",
      "mode": "100644",
      "type": "blob"
    },
    "tiledata.coffee": {
      "path": "tiledata.coffee",
      "content": "# Sheet index, sheetX, sheetY, autotileMode, altsheet\nmodule.exports = [\n  [1, 1, 19] # dirt\n  [6, 1, 11, 0, 7] # water\n  [1, 8, 7, 1] # grass\n  [6, 1, 27, 0, 7] # lava\n  [1, 15, 7, 1]\n  [1, 15, 19, 1]\n  [0, 3, 3]\n  [4, 0, 0]\n  [5, 0, 0]\n]\n",
      "mode": "100644"
    },
    "terrain/generate.coffee": {
      "path": "terrain/generate.coffee",
      "content": "ByteGrid = require \"../lib/byte-grid\"\n\ngaussianKernel = [0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006]\n\nnoiseFill = (buffer) ->\n  length = buffer.length\n  i = 0\n  while i < length\n    v = Math.floor Math.random() * 256\n    buffer[i] = v\n    i++\n\n  return buffer\n\n# Fill the grid with noise then smooth using a blur filter\ngaussian = (grid) ->\n  {data, width, height} = grid\n  length = data.length\n\n  noiseFill(grid.data)\n\n  swap = ByteGrid\n    width: width\n    height: height\n\n  # Apply blur kernel horizontally then vertically\n  i = 0\n  y = 0\n  while i < length\n    x = i % width\n    v = gaussianKernel.reduce (total, ratio, index) ->\n      (grid.get(index - 3 + x, y) ? 128) * ratio + total\n    , 0\n    if x is width - 1\n      y++\n    # Copy into a new buffer\n    swap.data[i] = v\n    i++\n  \n  i = 0\n  x = 0\n  while i < length\n    y = i % height\n    v = gaussianKernel.reduce (total, ratio, index) ->\n      (swap.get(x, index - 3 + y) ? 128) * ratio + total\n    , 0\n    if y is height - 1\n      x++\n    # Copy back to orig\n    data[i] = v\n    i++\n\n  return grid\n\ncellular = (grid) ->\n\n\ndiamondSquare = (grid) -> # TODO\n  {width, height} = grid\n\n  stride = height\n\n  # Initialize corners, assume wrap around\n  grid.set(0, 0, 128)\n  grid.set(0, stride - 1, 128)\n\n  # Diamond\n  grid.set(stride/2, stride/2, 128 + rand(128) - 64)\n\n  # Square\n  grid.set(stride/2, 0, )\n  \nmodule.exports =\n  gaussian: gaussian\n    ",
      "mode": "100644"
    }
  },
  "distribution": {
    "canvas": {
      "path": "canvas",
      "content": "(function() {\n  var SimpleTool, Tools, TouchCanvas, worldPosition;\n\n  TouchCanvas = require(\"touch-canvas\");\n\n  module.exports = function(game) {\n    var canvas;\n    canvas = TouchCanvas({\n      width: 512,\n      height: 288\n    });\n    canvas.on(\"touch\", function(e) {\n      return Tools[game.activeTool()].touch(e, game);\n    });\n    canvas.on(\"move\", function(e) {\n      return Tools[game.activeTool()].move(e, game);\n    });\n    canvas.on(\"release\", function(e) {\n      return Tools[game.activeTool()].release(e, game);\n    });\n    return canvas;\n  };\n\n  SimpleTool = function(touch) {\n    return {\n      touch: touch,\n      move: function() {},\n      release: function() {}\n    };\n  };\n\n  Tools = {\n    pan: (function() {\n      var initialPan, startPos;\n      startPos = null;\n      initialPan = null;\n      return {\n        touch: function(e, game) {\n          var viewport;\n          viewport = game.viewport();\n          startPos = e;\n          return initialPan = {\n            x: viewport.x,\n            y: viewport.y\n          };\n        },\n        move: function(_arg, game) {\n          var deltaX, deltaY, sX, sY, viewport, x, y;\n          x = _arg.x, y = _arg.y;\n          viewport = game.viewport();\n          if (startPos) {\n            sX = startPos.x, sY = startPos.y;\n            deltaX = (sX - x) * viewport.width;\n            deltaY = (sY - y) * viewport.height;\n            viewport.x = initialPan.x + deltaX;\n            return viewport.y = initialPan.y + deltaY;\n          }\n        },\n        release: function(e, game) {\n          return startPos = null;\n        }\n      };\n    })(),\n    inspect: SimpleTool(function(e, game) {\n      var c, p;\n      p = worldPosition(e, game.viewport());\n      c = game.world().entityAt(p);\n      if (c) {\n        return game.inspectedCharacter(c);\n      }\n    })\n  };\n\n  worldPosition = function(_arg, viewport) {\n    var x, y;\n    x = _arg.x, y = _arg.y;\n    return {\n      x: viewport.x + (x * viewport.width) | 0,\n      y: viewport.y + (y * viewport.height) | 0\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "culture/data/cities/ca": {
      "path": "culture/data/cities/ca",
      "content": "module.exports = [\"Adelanto\",\"Agoura Hills\",\"Alameda\",\"Albany\",\"Alhambra\",\"Aliso Viejo\",\"Alturas\",\"Amador City\",\"American Canyon\",\"Anaheim\",\"Anderson\",\"Angels Camp\",\"Antioch\",\"Apple Valley\",\"Arcadia\",\"Arcata\",\"Arroyo Grande\",\"Artesia\",\"Arvin\",\"Atascadero\",\"Atherton\",\"Atwater\",\"Auburn\",\"Avalon\",\"Avenal\",\"Azusa\",\"Bakersfield\",\"Baldwin Park\",\"Banning\",\"Barstow\",\"Beaumont\",\"Bell\",\"Bell Gardens\",\"Bellflower\",\"Belmont\",\"Belvedere\",\"Benicia\",\"Berkeley\",\"Beverly Hills\",\"Big Bear Lake\",\"Biggs\",\"Bishop\",\"Blue Lake\",\"Blythe\",\"Bradbury\",\"Brawley\",\"Brea\",\"Brentwood\",\"Brisbane\",\"Buellton\",\"Buena Park\",\"Burbank\",\"Burlingame\",\"Calabasas\",\"Calexico\",\"California City\",\"Calimesa\",\"Calipatria\",\"Calistoga\",\"Camarillo\",\"Campbell\",\"Canyon Lake\",\"Capitola\",\"Carlsbad\",\"Carmel-by-the-Sea\",\"Carpinteria\",\"Carson\",\"Cathedral City\",\"Ceres\",\"Cerritos\",\"Chico\",\"Chino\",\"Chino Hills\",\"Chowchilla\",\"Chula Vista\",\"Citrus Heights\",\"Claremont\",\"Clayton\",\"Clearlake\",\"Cloverdale\",\"Clovis\",\"Coachella\",\"Coalinga\",\"Colfax\",\"Colma\",\"Colton\",\"Colusa\",\"Commerce\",\"Compton\",\"Concord\",\"Corcoran\",\"Corning\",\"Corona\",\"Coronado\",\"Corte Madera\",\"Costa Mesa\",\"Cotati\",\"Covina\",\"Crescent City\",\"Cudahy\",\"Culver City\",\"Cupertino\",\"Cypress\",\"Daly City\",\"Dana Point\",\"Danville\",\"Davis\",\"Del Mar\",\"Del Rey Oaks\",\"Delano\",\"Desert Hot Springs\",\"Diamond Bar\",\"Dinuba\",\"Dixon\",\"Dorris\",\"Dos Palos\",\"Downey\",\"Duarte\",\"Dublin\",\"Dunsmuir\",\"East Palo Alto\",\"Eastvale\",\"El Cajon\",\"El Centro\",\"El Cerrito\",\"El Monte\",\"El Segundo\",\"Elk Grove\",\"Emeryville\",\"Encinitas\",\"Escalon\",\"Escondido\",\"Etna\",\"Eureka\",\"Exeter\",\"Fairfax\",\"Fairfield\",\"Farmersville\",\"Ferndale\",\"Fillmore\",\"Firebaugh\",\"Folsom\",\"Fontana\",\"Fort Bragg\",\"Fort Jones\",\"Fortuna\",\"Foster City\",\"Fountain Valley\",\"Fowler\",\"Fremont\",\"Fresno\",\"Fullerton\",\"Galt\",\"Garden Grove\",\"Gardena\",\"Gilroy\",\"Glendale\",\"Glendora\",\"Goleta\",\"Gonzales\",\"Grand Terrace\",\"Grass Valley\",\"Greenfield\",\"Gridley\",\"Grover Beach\",\"Guadalupe\",\"Gustine\",\"Half Moon Bay\",\"Hanford\",\"Hawaiian Gardens\",\"Hawthorne\",\"Hayward\",\"Healdsburg\",\"Hemet\",\"Hercules\",\"Hermosa Beach\",\"Hesperia\",\"Hidden Hills\",\"Highland\",\"Hillsborough\",\"Hollister\",\"Holtville\",\"Hughson\",\"Huntington Beach\",\"Huntington Park\",\"Huron\",\"Imperial\",\"Imperial Beach\",\"Indian Wells\",\"Indio\",\"Industry\",\"Inglewood\",\"Ione\",\"Inskip\",\"Irvine\",\"Irwindale\",\"Isleton\",\"Jackson\",\"Jurupa Valley\",\"Kerman\",\"King City\",\"Kingsburg\",\"La Cañada Flintridge\",\"La Habra\",\"La Habra Heights\",\"La Mesa\",\"La Mirada\",\"La Palma\",\"La Puente\",\"La Quinta\",\"La Verne\",\"Lafayette\",\"Laguna Beach\",\"Laguna Hills\",\"Laguna Niguel\",\"Laguna Woods\",\"Lake Elsinore\",\"Lake Forest\",\"Lakeport\",\"Lakewood\",\"Lancaster\",\"Larkspur\",\"Lathrop\",\"Lawndale\",\"Lemon Grove\",\"Lemoore\",\"Lincoln\",\"Lindsay\",\"Live Oak\",\"Livermore\",\"Livingston\",\"Lodi\",\"Loma Linda\",\"Lomita\",\"Lompoc\",\"Long Beach\",\"Loomis\",\"Los Alamitos\",\"Los Altos\",\"Los Altos Hills\",\"Los Angeles\",\"Los Banos\",\"Los Gatos\",\"Loyalton\",\"Lynwood\",\"Madera\",\"Malibu\",\"Mammoth Lakes\",\"Manhattan Beach\",\"Manteca\",\"Maricopa\",\"Marina\",\"Martinez\",\"Marysville\",\"Maywood\",\"McFarland\",\"Mendota\",\"Menifee\",\"Menlo Park\",\"Merced\",\"Mill Valley\",\"Millbrae\",\"Milpitas\",\"Mission Viejo\",\"Modesto\",\"Monrovia\",\"Montague\",\"Montclair\",\"Monte Sereno\",\"Montebello\",\"Monterey\",\"Monterey Park\",\"Moorpark\",\"Moraga\",\"Moreno Valley\",\"Morgan Hill\",\"Morro Bay\",\"Mount Shasta\",\"Mountain View\",\"Murrieta\",\"Napa\",\"National City\",\"Needles\",\"Nevada City\",\"Newark\",\"Newman\",\"Newport Beach\",\"Norco\",\"Norwalk\",\"Novato\",\"Oakdale\",\"Oakland\",\"Oakley\",\"Oceanside\",\"Ojai\",\"Ontario\",\"Orange\",\"Orange Cove\",\"Orinda\",\"Orland\",\"Oroville\",\"Oxnard\",\"Pacific Grove\",\"Pacifica\",\"Palm Desert\",\"Palm Springs\",\"Palmdale\",\"Palo Alto\",\"Palos Verdes Estates\",\"Paradise\",\"Paramount\",\"Parlier\",\"Pasadena\",\"Paso Robles\",\"Patterson\",\"Perris\",\"Petaluma\",\"Pico Rivera\",\"Piedmont\",\"Pinole\",\"Pismo Beach\",\"Pittsburg\",\"Placentia\",\"Placerville\",\"Pleasant Hill\",\"Pleasanton\",\"Plymouth\",\"Point Arena\",\"Pomona\",\"Port Hueneme\",\"Porterville\",\"Portola\",\"Portola Valley\",\"Poway\",\"Rancho Cordova\",\"Rancho Cucamonga\",\"Rancho Mirage\",\"Rancho Palos Verdes\",\"Rancho Santa Margarita\",\"Red Bluff\",\"Redding\",\"Redlands\",\"Redondo Beach\",\"Redwood City\",\"Reedley\",\"Rialto\",\"Richmond\",\"Ridgecrest\",\"Rio Dell\",\"Rio Vista\",\"Ripon\",\"Riverbank\",\"Riverside\",\"Rocklin\",\"Rohnert Park\",\"Rolling Hills\",\"Rolling Hills Estates\",\"Rosemead\",\"Roseville\",\"Ross\",\"Sacramento\",\"St. Helena\",\"Salinas\",\"San Anselmo\",\"San Bernardino\",\"San Bruno\",\"San Carlos\",\"San Clemente\",\"San Diego\",\"San Dimas\",\"San Fernando\",\"San Francisco\",\"San Gabriel\",\"San Jacinto\",\"San Joaquin\",\"San Jose\",\"San Juan Bautista\",\"San Juan Capistrano\",\"San Leandro\",\"San Luis Obispo\",\"San Marcos\",\"San Marino\",\"San Mateo\",\"San Pablo\",\"San Rafael\",\"San Ramon\",\"Sand City\",\"Sanger\",\"Santa Ana\",\"Santa Barbara\",\"Santa Clara\",\"Santa Clarita\",\"Santa Cruz\",\"Santa Fe Springs\",\"Santa Maria\",\"Santa Monica\",\"Santa Paula\",\"Santa Rosa\",\"Santee\",\"Saratoga\",\"Sausalito\",\"Scotts Valley\",\"Seal Beach\",\"Seaside\",\"Sebastopol\",\"Selma\",\"Shafter\",\"Shasta Lake\",\"Sierra Madre\",\"Signal Hill\",\"Simi Valley\",\"Solana Beach\",\"Soledad\",\"Solvang\",\"Sonoma\",\"Sonora\",\"South El Monte\",\"South Gate\",\"South Lake Tahoe\",\"South Pasadena\",\"South San Francisco\",\"Stanton\",\"Stockton\",\"Suisun City\",\"Sunnyvale\",\"Susanville\",\"Sutter Creek\",\"Taft\",\"Tehachapi\",\"Tehama\",\"Temecula\",\"Temple City\",\"Thousand Oaks\",\"Tiburon\",\"Torrance\",\"Tracy\",\"Trinidad\",\"Truckee\",\"Tulare\",\"Tulelake\",\"Turlock\",\"Tustin\",\"Twentynine Palms\",\"Ukiah\",\"Union City\",\"Upland\",\"Vacaville\",\"Vallejo\",\"Ventura\",\"Vernon\",\"Victorville\",\"Villa Park\",\"Visalia\",\"Vista\",\"Walnut\",\"Walnut Creek\",\"Wasco\",\"Waterford\",\"Watsonville\",\"Weed\",\"West Covina\",\"West Hollywood\",\"West Sacramento\",\"Westlake Village\",\"Westminster\",\"Westmorland\",\"Wheatland\",\"Whittier\",\"Wildomar\",\"Williams\",\"Willits\",\"Willows\",\"Windsor\",\"Winters\",\"Woodlake\",\"Woodland\",\"Woodside\",\"Yorba Linda\",\"Yountville\",\"Yreka\",\"Yuba City\",\"Yucaipa\",\"Yucca Valley\"];",
      "type": "blob"
    },
    "culture/data/names/anglo-saxon": {
      "path": "culture/data/names/anglo-saxon",
      "content": "(function() {\n  module.exports = {\n    male: [[\"Aart\", \"Like an eagle\", \"English\"], [\"Ace\", \"Unity\", \"Latin\"], [\"Acey\", \"Unity\", \"Latin\"], [\"Acton\", \"Town by the oak tree\", \"Old English\"], [\"Acwel\", \"Kills\", \"Unknown\"], [\"Acwellen\", \"Kills\", \"Unknown\"], [\"Aidan\", \"Little fiery one\", \"Irish\"], [\"Aiken\", \"Oaken\", \"English\"], [\"Alban\", \"Town on the white hill\", \"Latin\"], [\"Alden\", \"Old and wise protector\", \"Old English\"], [\"Aldin\", \"Old and wise protector\", \"Old English\"], [\"Aldred\", \"Wise counselor\", \"English\"], [\"Aldwyn\", \"Old friend\", \"English\"], [\"Alfred\", \"Wise counselor\", \"Old English\"], [\"Algar\", \"Noble spearman\", \"German\"], [\"Alger\", \"Noble spearman\", \"German\"], [\"Almund\", \"Defender of the temple\", \"Unknown\"], [\"Alton\", \"From the old town\", \"Old English\"], [\"Alwin\", \"Noble friend\", \"German\"], [\"Anson\", \"Divine\", \"German\"], [\"Archard\", \"Sacred\", \"Unknown\"], [\"Archerd\", \"Sacred\", \"Unknown\"], [\"Archibald\", \"Bold\", \"German\"], [\"Arian\", \"Echanted\", \"Greek\"], [\"Arlice\", \"Honorable\", \"Unknown\"], [\"Arlys\", \"Honorable\", \"Unknown\"], [\"Arlyss\", \"Honorable\", \"Unknown\"], [\"Artair\", \"Bear\", \"Scottish\"], [\"Arth\", \"Rock\", \"English\"], [\"Aston\", \"Eastern settlement\", \"English\"], [\"Audley\", \"Prosperous guardian or old friend\", \"English\"], [\"Averil\", \"Wild boar\", \"English\"], [\"Averill\", \"Wild boar\", \"English\"], [\"Avery\", \"Elf ruler\", \"English\"], [\"Banning\", \"Small and fair\", \"Irish\"], [\"Bar\", \"From the birch meadow\", \"English\"], [\"Barclay\", \"From the birch tree meadow\", \"English\"], [\"Barney\", \"Son of comfort\", \"English\"], [\"Barrett\", \"Commerce\", \"French\"], [\"Barton\", \"From the barley settlement\", \"Old English\"], [\"Basil\", \"Kingly\", \"Latin\"], [\"Baxter\", \"Baker\", \"Old English\"], [\"Bede\", \"Prayer\", \"English\"], [\"Berkeley\", \"From the birch tree meadow\", \"English\"], [\"Bernard\", \"Brave as a bear\", \"German\"], [\"Bertram\", \"Bright raven\", \"English\"], [\"Betlic\", \"Splendid\", \"English\"], [\"Boden\", \"Messenger\", \"French\"], [\"Boniface\", \"To do good\", \"Latin\"], [\"Bordan\", \"From the boar valley\", \"English\"], [\"Borden\", \"From the boar valley\", \"English\"], [\"Brant\", \"Proud\", \"Old English\"], [\"Brecc\", \"Freckled\", \"Irish\"], [\"Brice\", \"Strength or valor\", \"Welsh\"], [\"Brigham\", \"Dwells at the bridge\", \"Old English\"], [\"Bron\", \"Brown or dark\", \"English\"], [\"Bronson\", \"Son of the dark man\", \"English\"], [\"Brun\", \"Dark skinned\", \"German\"], [\"Bryce\", \"Strength or valor\", \"Welsh\"], [\"Burgess\", \"Town dweller\", \"English\"], [\"Burton\", \"From the fortified town\", \"Old English\"], [\"Byron\", \"At the cowshed\", \"Old English\"], [\"Camden\", \"From the winding valley\", \"Scottish\"], [\"Camdene\", \"From the winding valley\", \"Scottish\"], [\"Cary\", \"Descendant of the dark one\", \"Welsh\"], [\"Cecil\", \"Dim sighted or blind\", \"Latin\"], [\"Cerdic\", \"Beloved\", \"Welsh\"], [\"Chad\", \"Warrior\", \"Old English\"], [\"Chapman\", \"Merchant\", \"English\"], [\"Chester\", \"Rocky fortress\", \"Old English\"], [\"Clifford\", \"Ford near the cliff\", \"Old English\"], [\"Clive\", \"Cliff by the river\", \"Old English\"], [\"Colby\", \"Dark or dark haired\", \"Old English\"], [\"Corey\", \"Dweller near a hollow\", \"Irish\"], [\"Cosmo\", \"Order or harmony\", \"Greek\"], [\"Courtland\", \"From the court's land\", \"English\"], [\"Courtnay\", \"Courtier or court attendant\", \"English\"], [\"Courtney\", \"Courtier or court attendant\", \"English\"], [\"Creighton\", \"Dweller by the rocks\", \"English\"], [\"Cyril\", \"Master or Lord\", \"Greek\"], [\"Daegal\", \"Dweller by the dark stream\", \"English\"], [\"Dalston\", \"From Dougal's place\", \"English\"], [\"Delbert\", \"Bright as day\", \"English\"], [\"Dell\", \"Hollow or valley\", \"Old English\"], [\"Deman\", \"Man\", \"Scandinavian\"], [\"Denby\", \"From the Danish settlement\", \"Scandinavian\"], [\"Denton\", \"Settlement in the valley\", \"Old English\"], [\"Derian\", \"Small rocky hill\", \"English\"], [\"Desmond\", \"From south Munster\", \"Irish\"], [\"Devon\", \"Poet\", \"Irish\"], [\"Devyn\", \"Poet\", \"Irish\"], [\"Dougal\", \"Dark stranger\", \"Scottish\"], [\"Douglas\", \"Dark stream or dark river\", \"Scottish\"], [\"Drew\", \"Manly\", \"English\"], [\"Dudley\", \"The people's meadow\", \"Old English\"], [\"Duke\", \"Leader\", \"French\"], [\"Durwin\", \"Friend of the deer\", \"English\"], [\"Durwyn\", \"Friend of the deer\", \"English\"], [\"Eamon\", \"Wealthy guardian\", \"Irish\"], [\"Earl\", \"Nobleman\", \"English\"], [\"Earle\", \"Nobleman\", \"English\"], [\"Eddison\", \"Son of Edward\", \"English\"], [\"Edgar\", \"Lucky spearman\", \"Old English\"], [\"Edgard\", \"Lucky spearman\", \"Old English\"], [\"Edlin\", \"Wealthy friend\", \"English\"], [\"Edlyn\", \"Wealthy friend\", \"English\"], [\"Edmond\", \"Prosperous protector\", \"Old English\"], [\"Edmund\", \"Prosperous protector\", \"Old English\"], [\"Edric\", \"Wealthy ruler\", \"English\"], [\"Edsel\", \"Rich mans house\", \"English\"], [\"Edson\", \"Son of Edward\", \"English\"], [\"Edward\", \"Wealthy guardian\", \"Old English\"], [\"Edwin\", \"Prosperous friend\", \"Old English\"], [\"Edwyn\", \"Prosperous friend\", \"Old English\"], [\"Egbert\", \"Bright sword\", \"English\"], [\"Eldon\", \"Foreign hill\", \"Old English\"], [\"Eldred\", \"Old and wise advisor\", \"English\"], [\"Eldrid\", \"Old and wise advisor\", \"English\"], [\"Eldwin\", \"Old and wise friend\", \"English\"], [\"Eldwyn\", \"Old and wise friend\", \"English\"], [\"Elmer\", \"Noble\", \"Old English\"], [\"Emmet\", \"Industrious\", \"German\"], [\"Erian\", \"Enchanted\", \"Greek\"], [\"Erol\", \"Courageous\", \"Turkish\"], [\"Errol\", \"Wanderer\", \"Latin\"], [\"Esmond\", \"Wealthy protector\", \"English\"], [\"Faran\", \"Baker\", \"Arabic\"], [\"Felix\", \"Fortunate or happy\", \"Latin\"], [\"Fenton\", \"Marshland farm\", \"Old English\"], [\"Feran\", \"Traveler\", \"Old english\"], [\"Finian\", \"Light skinned\", \"Irish\"], [\"Firman\", \"Firm or strong\", \"French\"], [\"Fleming\", \"Dutchman from Flanders\", \"Old English\"], [\"Fletcher\", \"Arrow maker\", \"Old English\"], [\"Floyd\", \"Gray or white haired\", \"English\"], [\"Ford\", \"Dweller near the ford\", \"Old English\"], [\"Freeman\", \"Free man\", \"English\"], [\"Gaderian\", \"Gathers\", \"Unknown\"], [\"Galan\", \"Healer\", \"Greek\"], [\"Gar\", \"Spear\", \"English\"], [\"Gareth\", \"Gentle\", \"Welsh\"], [\"Garr\", \"Spear\", \"English\"], [\"Garrett\", \"Mighty with a spear\", \"Irish\"], [\"Garvin\", \"Friend in battle\", \"Old English\"], [\"Geoff\", \"Peaceful\", \"English\"], [\"Geoffrey\", \"Peaceful\", \"English\"], [\"Geraint\", \"Old\", \"English\"], [\"Gerard\", \"Brave with a spear\", \"Old English\"], [\"Gervaise\", \"Honorable\", \"French\"], [\"Giles\", \"Shield bearer\", \"French\"], [\"Godric\", \"Rules with God\", \"Unknown\"], [\"Godwine\", \"Friend of God\", \"Old English\"], [\"Gordie\", \"Hill near the meadow\", \"Old English\"], [\"Gordon\", \"Hill near the meadow\", \"Old English\"], [\"Gordy\", \"Hill near the meadow\", \"Old English\"], [\"Graeme\", \"Grand home\", \"Scottish\"], [\"Graham\", \"Grand home\", \"English\"], [\"Grahem\", \"Grand home\", \"English\"], [\"Gram\", \"Grand home\", \"English\"], [\"Grimm\", \"Fierce\", \"English\"], [\"Grimme\", \"Fierce\", \"English\"], [\"Grindan\", \"Sharp\", \"Unknown\"], [\"Hall\", \"That which is covered\", \"Old English\"], [\"Ham\", \"Hot\", \"Hebrew\"], [\"Holt\", \"Forest\", \"English\"], [\"Hugh\", \"Bright mind\", \"English\"], [\"Ingram\", \"Angel\", \"Old English\"], [\"Irwin\", \"Sea friend\", \"English\"], [\"Irwyn\", \"Sea friend\", \"English\"], [\"Ivor\", \"Archer's bow\", \"Scandinavian\"], [\"Jarvis\", \"Servant with a spear\", \"German\"], [\"Jeffrey\", \"Divinely peaceful\", \"Old English\"], [\"Judd\", \"Praised\", \"Hebrew\"], [\"Kendrick\", \"Royal ruler\", \"Scottish\"], [\"Kendryek\", \"Son of henry\", \"Irish\"], [\"Kenric\", \"Royal ruler\", \"English\"], [\"Kenton\", \"The royal settlement\", \"Old English\"], [\"Kenway\", \"Brave warrior\", \"Old English\"], [\"Kim\", \"Warrior chief\", \"Old English\"], [\"Kimball\", \"Warrior chief\", \"English\"], [\"King\", \"Monarch\", \"Old English\"], [\"Kingsley\", \"From the King's meadow\", \"Old English\"], [\"Kipp\", \"From the pointed hill\", \"Old English\"], [\"Landry\", \"Ruler\", \"Old English\"], [\"Lang\", \"Tall man\", \"Scandinavian\"], [\"Lange\", \"Tall man\", \"Scandinavian\"], [\"Lar\", \"Crowned with laurels\", \"Scandinavian\"], [\"Leanian\", \"Lion man or brave as a lion\", \"Greek\"], [\"Leax\", \"Salmon\", \"Unknown\"], [\"Leighton\", \"From the meadow farm\", \"Old English\"], [\"Leland\", \"From the meadow land\", \"Old English\"], [\"Leng\", \"Tall man\", \"Scandinavian\"], [\"Lex\", \"Defender of mankind\", \"Greek\"], [\"Lin\", \"Lives by the linden tree hill\", \"English\"], [\"Linn\", \"Lives by the linden tree hill\", \"English\"], [\"Lister\", \"Dyer\", \"English\"], [\"Lloyd\", \"Grey haired\", \"Welsh\"], [\"Lucan\", \"Bringer of light\", \"Old English\"], [\"Lunden\", \"From London\", \"English\"], [\"Lyn\", \"Waterfall\", \"English\"], [\"Lyndon\", \"Lives by the linden tree hill\", \"Old English\"], [\"Lynn\", \"Waterfall\", \"English\"], [\"Magen\", \"Protector\", \"Hebrew\"], [\"Mann\", \"Hero\", \"German\"], [\"Mannix\", \"Monk\", \"Irish\"], [\"Manton\", \"From the hero's town\", \"English\"], [\"Maxwell\", \"Dweller by the spring\", \"Scottish\"], [\"Merlin\", \"Sea hill\", \"Celtic\"], [\"Merton\", \"Sea town\", \"English\"], [\"Montgomery\", \"From the wealthy man's mountain\", \"Old English\"], [\"Morton\", \"Town by thr moor\", \"Old English\"], [\"Ned\", \"Wealthy guardian\", \"English\"], [\"Nerian\", \"Protects\", \"Unknown\"], [\"Neville\", \"New town\", \"French\"], [\"Newton\", \"From the new town\", \"English\"], [\"Nodin\", \"Wind\", \"American\"], [\"Norman\", \"Norseman\", \"French\"], [\"Norris\", \"Northerner\", \"French\"], [\"Norton\", \"From the north farm\", \"English\"], [\"Norvel\", \"From the north town\", \"English\"], [\"Norville\", \"From the north town\", \"French\"], [\"Nyle\", \"Island\", \"English\"], [\"Octe\", \"A son of Hengist\", \"Unknown\"], [\"Odel\", \"Forested hill\", \"English\"], [\"Odell\", \"Forested hill\", \"English\"], [\"Odi\", \"Ruler\", \"Scandinavian\"], [\"Odin\", \"God of all\", \"Old Norse\"], [\"Odon\", \"Ruler\", \"Scandinavian\"], [\"Ody\", \"Ruler\", \"Scandinavian\"], [\"Orde\", \"Beginning\", \"Latin\"], [\"Ormod\", \"Bear mountain\", \"English\"], [\"Orson\", \"Bear like\", \"Latin\"], [\"Orville\", \"Golden village\", \"French\"], [\"Orvin\", \"Brave friend or spear friend\", \"English\"], [\"Orvyn\", \"Brave friend or spear friend\", \"English\"], [\"Osmond\", \"Divine protection\", \"Old English\"], [\"Osric\", \"Divine ruler\", \"English\"], [\"Oswald\", \"Divine power\", \"Old English\"], [\"Oswin\", \"Divine friend\", \"Old English\"], [\"Page\", \"Attendent\", \"French\"], [\"Paige\", \"Attendent\", \"French\"], [\"Patton\", \"Warrior's town\", \"Old English\"], [\"Pax\", \"Peaceful\", \"Latin\"], [\"Paxton\", \"Peaceful town\", \"Latin\"], [\"Payne\", \"Man from the country\", \"Latin\"], [\"Pearce\", \"Rock\", \"English\"], [\"Pearson\", \"Son of Peter\", \"English\"], [\"Perry\", \"Dweller by the pear tree\", \"English\"], [\"Pierce\", \"Rock\", \"English\"], [\"Piers\", \"Lover of horses\", \"English\"], [\"Putnam\", \"Dweller by the pond\", \"English\"], [\"Ramm\", \"Ram\", \"English\"], [\"Rand\", \"Wolf's shield\", \"Old English\"], [\"Randolf\", \"Wolf shield\", \"Scandinavian\"], [\"Rawlins\", \"Famous in the land\", \"French\"], [\"Ray\", \"Dear brook\", \"English\"], [\"Rice\", \"Noble or rich\", \"English\"], [\"Ripley\", \"Meadow near the river\", \"English\"], [\"Ro\", \"Red haired\", \"English\"], [\"Roan\", \"Tree with red berries\", \"English\"], [\"Roe\", \"Deer\", \"English\"], [\"Row\", \"Red haired\", \"English\"], [\"Rowan\", \"Tree with red berries\", \"English\"], [\"Rowe\", \"Red haired\", \"English\"], [\"Roweson\", \"Son of the redhead\", \"English\"], [\"Rowson\", \"Son of the redhead\", \"English\"], [\"Ryce\", \"Powerful\", \"English\"], [\"Seaton\", \"Town near the sea\", \"English\"], [\"Seaver\", \"Fierce stronghold\", \"English\"], [\"Selwin\", \"Friend at court\", \"English\"], [\"Selwyn\", \"Friend at court\", \"English\"], [\"Sener\", \"Bringer of joy\", \"Turkish\"], [\"Sever\", \"Fierce stronghold\", \"English\"], [\"Seward\", \"Sea gaurdian\", \"Old English\"], [\"Sheldon\", \"Farm on the ledge\", \"Old English\"], [\"Shelley\", \"From the ledge meadow\", \"Old English\"], [\"Shelny\", \"From the ledge farm\", \"Old English\"], [\"Shepard\", \"Shepherd\", \"English\"], [\"Shephard\", \"Shepherd\", \"English\"], [\"Sheply\", \"From the sheep meadow\", \"English\"], [\"Sherard\", \"Of glorious valor\", \"English\"], [\"Sherwin\", \"Quick as the wind\", \"English\"], [\"Sherwyn\", \"Quick as the wind\", \"English\"], [\"Steadman\", \"Dwells at the farm\", \"English\"], [\"Stedman\", \"Dwells at the farm\", \"English\"], [\"Stepan\", \"Exalts\", \"Russian\"], [\"Stewart\", \"Steward\", \"Old English\"], [\"Stewert\", \"Steward\", \"Old English\"], [\"Stillman\", \"Quiet\", \"English\"], [\"Stilwell\", \"From the tranquil stream\", \"English\"], [\"Storm\", \"Tempestuous\", \"English\"], [\"Stuart\", \"Steward\", \"Old English\"], [\"Sutton\", \"Southern town\", \"Old English\"], [\"Tamar\", \"Palm tree\", \"Hebrew\"], [\"Tedman\", \"Protector of the land\", \"Old English\"], [\"Tedmund\", \"Protector of the land\", \"Old English\"], [\"Teller\", \"Storyteller\", \"Old English\"], [\"Tolan\", \"From the taxed land\", \"Old English\"], [\"Toland\", \"From the taxed land\", \"Old English\"], [\"Torr\", \"Watchtower\", \"Old English\"], [\"Trace\", \"Harvester\", \"Greek\"], [\"Tracey\", \"Harvester\", \"Greek\"], [\"Tracy\", \"Harvester\", \"Greek\"], [\"Tredan\", \"Tramples\", \"English\"], [\"Treddian\", \"Leaves\", \"English\"], [\"Upton\", \"From the high town\", \"Old English\"], [\"Verge\", \"Staff bearer\", \"Latin\"], [\"Vernon\", \"Youthful or springlike\", \"Latin\"], [\"Virgil\", \"Staff bearer\", \"Latin\"], [\"Wallace\", \"From Wales\", \"English\"], [\"Wallis\", \"From Wales\", \"English\"], [\"Ward\", \"Watchman\", \"Old English\"], [\"Ware\", \"Cautious\", \"Old English\"], [\"Whitney\", \"From the white island\", \"Old English\"], [\"Wilbur\", \"Walled stronghold\", \"Old English\"], [\"Wilfrid\", \"Resolute peacemaker\", \"English\"], [\"Winchell\", \"Bend in the road\", \"Old English\"], [\"Winston\", \"Friendly town\", \"Old English\"], [\"Woodrow\", \"Dweller by the wood\", \"Old English\"], [\"Wylie\", \"Enchanting\", \"English\"], [\"Wyman\", \"Fighter\", \"English\"], [\"Wynchell\", \"Drawer of water\", \"English\"], [\"Wyne\", \"Friend\", \"English\"]],\n    female: [[\"Acca\", \"Unity\", \"Latin\"], [\"Afra\", \"Young doe\", \"Hebrew\"], [\"Afton\", \"From Afton\", \"English\"], [\"Ainsley\", \"My own meadow\", \"Scottish\"], [\"Aisly\", \"Dwells at the ash tree meadow\", \"Scottish\"], [\"Alberta\", \"Noble and bright\", \"German\"], [\"Alodia\", \"Rich\", \"Unknown\"], [\"Alodie\", \"Rich\", \"Unknown\"], [\"Althena\", \"Healer\", \"Greek\"], [\"Amity\", \"Friendship\", \"Latin\"], [\"Annis\", \"Pure\", \"English\"], [\"Antonia\", \"Priceless, inestimable or praiseworthy\", \"Latin\"], [\"Ara\", \"Opinionated\", \"Arabic\"], [\"Ardith\", \"Flowering field\", \"Hebrew\"], [\"Arleigh\", \"Meadow of the hare\", \"Old English\"], [\"Arlette\", \"Pledge\", \"Old English\"], [\"Ashley\", \"Meadow of ash trees\", \"Old English\"], [\"Audrey\", \"Noble strength\", \"Old English\"], [\"Augusta\", \"Venerable\", \"Latin\"], [\"Beatrix\", \"She who brings happiness\", \"German\"], [\"Becky\", \"Bound\", \"American\"], [\"Berenice\", \"She will bring victory\", \"Greek\"], [\"Bliss\", \"Delight joy or happiness\", \"Old English\"], [\"Blythe\", \"Cheerful\", \"Old English\"], [\"Bonnie\", \"Pretty\", \"English\"], [\"Breck\", \"Freckled\", \"Irish\"], [\"Bree\", \"Strong\", \"Irish\"], [\"Bridget\", \"Strength\", \"Irish\"], [\"Brimlad\", \"Seaway\", \"Unknown\"], [\"Britt\", \"From Britian\", \"Old English\"], [\"Cate\", \"Pure\", \"Greek\"], [\"Catherine\", \"Pure\", \"Greek\"], [\"Catheryn\", \"Pure\", \"Greek\"], [\"Cathryn\", \"Pure\", \"Greek\"], [\"Chelsea\", \"Port or landing place\", \"Old English\"], [\"Clover\", \"Clover\", \"Old English\"], [\"Constance\", \"Constant or steadfast\", \"Latin\"], [\"Coventina\", \"Water Goddess\", \"Greek\"], [\"Cwen\", \"Queen\", \"Welsh\"], [\"Cwene\", \"Queen\", \"Welsh\"], [\"Daisy\", \"Eye of the day\", \"Old English\"], [\"Darel\", \"Darling or beloved\", \"French\"], [\"Darelene\", \"Darling\", \"French\"], [\"Darelle\", \"Darling or beloved\", \"French\"], [\"Darlene\", \"Darling\", \"French\"], [\"Darline\", \"Darling\", \"French\"], [\"Daryl\", \"Darling\", \"French\"], [\"Dawn\", \"Daybreak or sunrise\", \"English\"], [\"Devona\", \"From Devonshire\", \"English\"], [\"Diera\", \"From Diera\", \"Unknown\"], [\"Dolly\", \"Gift of God\", \"American\"], [\"Domino\", \"Belonging to the Lord\", \"English\"], [\"Doretta\", \"Gift of God\", \"English\"], [\"Doris\", \"Of the sea\", \"Greek\"], [\"Eadlin\", \"Princess\", \"Unknown\"], [\"Earlene\", \"Noblewoman\", \"English\"], [\"Eartha\", \"Earthy\", \"English\"], [\"Easter\", \"Born at Easter\", \"English\"], [\"Eda\", \"Wealthy\", \"English\"], [\"Edina\", \"Ardent\", \"Irish\"], [\"Edit\", \"Prosperous in war\", \"Old English\"], [\"Edita\", \"Prosperous in war\", \"Spanish\"], [\"Edith\", \"Prosperous in war\", \"Old English\"], [\"Editha\", \"Prosperous in war\", \"German\"], [\"Edla\", \"Princess\", \"Unknown\"], [\"Edlin\", \"Princess\", \"English\"], [\"Edwina\", \"Prosperous friend\", \"Old English\"], [\"Edyt\", \"Prosperous in war\", \"Old English\"], [\"Edyth\", \"Prosperous in war\", \"Old English\"], [\"Elda\", \"Old and wise protector\", \"Old English\"], [\"Elene\", \"Light\", \"Greek\"], [\"Elga\", \"Pious\", \"Scandinavian\"], [\"Ellette\", \"Little elf\", \"French\"], [\"Elswyth\", \"Elf from the willow trees\", \"English\"], [\"Elva\", \"Elfin\", \"Old English\"], [\"Elvia\", \"Elfin\", \"Old English\"], [\"Elvina\", \"Elfin\", \"Old English\"], [\"Elwine\", \"Elf wise friend\", \"English\"], [\"Elwyna\", \"Elf wise friend\", \"English\"], [\"Engel\", \"Angel\", \"German\"], [\"Erlene\", \"Noblewoman\", \"English\"], [\"Erlina\", \"Noblewoman\", \"English\"], [\"Erline\", \"Noblewoman\", \"English\"], [\"Esma\", \"Emerald\", \"French\"], [\"Esme\", \"Emerald\", \"French\"], [\"Ethal\", \"Noble\", \"Old English\"], [\"Eugenia\", \"Well born or noble\", \"French\"], [\"Faline\", \"Catlike\", \"Latin\"], [\"Fancy\", \"Whimsical\", \"English\"], [\"Fanny\", \"Free\", \"American\"], [\"Felice\", \"Fortunate or happy\", \"Latin\"], [\"Flair\", \"Style or verve\", \"English\"], [\"Flora\", \"Flower\", \"Latin\"], [\"Florence\", \"Blooming or flowering\", \"Latin\"], [\"Frederica\", \"Peaceful ruler\", \"German\"], [\"Garyn\", \"Mighty with a spear\", \"English\"], [\"Gay\", \"Light hearted\", \"French\"], [\"Gayna\", \"White wave\", \"English\"], [\"Gemma\", \"Precious stone\", \"Latin\"], [\"Georgina\", \"Farmer\", \"English\"], [\"Gillian\", \"Downy bearded\", \"Latin\"], [\"Gladys\", \"Princess\", \"Irish\"], [\"Glenna\", \"Secluded valley or glen\", \"Irish\"], [\"Guinevere\", \"White wave\", \"Welsh\"], [\"Gwen\", \"White wave\", \"Welsh\"], [\"Gwendolyn\", \"White wave\", \"Welsh\"], [\"Harriet\", \"Ruler of an enclosure\", \"French\"], [\"Henrietta\", \"Ruler of the enclosure\", \"English\"], [\"Hild\", \"Battle maid\", \"German\"], [\"Hilda\", \"Battle maid\", \"German\"], [\"Hollis\", \"Near the holly bushes\", \"Old English\"], [\"Jetta\", \"A deep or glossy black\", \"Greek\"], [\"Joan\", \"God is gracious\", \"Hebrew\"], [\"Jody\", \"Praised\", \"American\"], [\"Juliana\", \"Downy bearded or youthful\", \"Latin\"], [\"Katie\", \"Pure\", \"English\"], [\"Keeley\", \"Brave warrior\", \"Irish\"], [\"Kendra\", \"Knowing\", \"Old english\"], [\"Leila\", \"Dark beauty\", \"Hebrew\"], [\"Lilian\", \"Lily\", \"Latin\"], [\"Linette\", \"Bird\", \"French\"], [\"Linn\", \"Waterfall\", \"English\"], [\"Lizbeth\", \"Consecrated to God\", \"English\"], [\"Lois\", \"Famous warrior\", \"German\"], [\"Lora\", \"Crowned with laurels\", \"Latin\"], [\"Loretta\", \"Crowned with laurels\", \"English\"], [\"Lorna\", \"Crowned with laurels\", \"Latin\"], [\"Lucetta\", \"Bringer of light\", \"English\"], [\"Lyn\", \"Waterfall\", \"English\"], [\"Lynet\", \"Idol\", \"Welsh\"], [\"Lynette\", \"Idol\", \"Welsh\"], [\"Lynn\", \"Waterfall\", \"English\"], [\"Lynna\", \"Waterfall\", \"English\"], [\"Lynne\", \"Waterfall\", \"English\"], [\"Mae\", \"Great\", \"English\"], [\"Maida\", \"Maiden\", \"English\"], [\"Mariam\", \"Bitter or sea of bitterness\", \"Hebrew\"], [\"Marian\", \"Bitter or sea of bitterness\", \"English\"], [\"Maud\", \"Mighty battle maiden\", \"English\"], [\"Maureen\", \"Bitter\", \"Irish\"], [\"Maxine\", \"The greatest\", \"Latin\"], [\"May\", \"To increase\", \"Latin\"], [\"Mayda\", \"Maiden\", \"Unknown\"], [\"Megan\", \"Pearl\", \"Irish\"], [\"Meghan\", \"Pearl\", \"Irish\"], [\"Mercia\", \"Compassion\", \"English\"], [\"Meryl\", \"Blackbird\", \"Latin\"], [\"Mildred\", \"Gentle advisor\", \"Old english\"], [\"Moira\", \"Sea of bitterness\", \"Irish\"], [\"Moire\", \"Sea of bitterness\", \"French\"], [\"Mona\", \"Noble\", \"Irish\"], [\"Nelda\", \"From the Alder trees\", \"Unknown\"], [\"Noreen\", \"Bright torch\", \"Greek\"], [\"Norma\", \"Man from the north\", \"German\"], [\"Octavia\", \"Eighth\", \"Italian\"], [\"Odelia\", \"Wealthy\", \"French\"], [\"Odelina\", \"Wealthy\", \"French\"], [\"Odelinda\", \"Wealthy\", \"French\"], [\"Odella\", \"Wealthy\", \"French\"], [\"Odelyn\", \"Wealthy\", \"French\"], [\"Odelyna\", \"Wealthy\", \"French\"], [\"Odette\", \"Wealthy\", \"French\"], [\"Odilia\", \"Wealthy\", \"French\"], [\"Ora\", \"Seacoast\", \"English\"], [\"Orva\", \"Worth gold\", \"French\"], [\"Ottilie\", \"Little wealthy one\", \"Unknown\"], [\"Peace\", \"Calm or tranquil\", \"English\"], [\"Peggy\", \"Pearl\", \"English\"], [\"Petra\", \"Rock\", \"Latin\"], [\"Petula\", \"Rock\", \"English\"], [\"Philippa\", \"Lover of horses\", \"Greek\"], [\"Philomena\", \"Lover of strength\", \"Greek\"], [\"Phyllis\", \"Leaf\", \"Greek\"], [\"Polly\", \"Small\", \"Latin\"], [\"Portia\", \"Pig\", \"Latin\"], [\"Primrose\", \"Primrose\", \"English\"], [\"Prudence\", \"Provident\", \"Latin\"], [\"Queenie\", \"Queen\", \"Old english\"], [\"Quenna\", \"Queen\", \"Old English\"], [\"Randi\", \"Wolf shield\", \"German\"], [\"Rexanne\", \"Gracious king\", \"English\"], [\"Rexella\", \"King of light\", \"English\"], [\"Rowena\", \"White haired\", \"Welsh\"], [\"Sheena\", \"God is gracious\", \"Hebrew\"], [\"Shelley\", \"From the ledge meadow\", \"English\"], [\"Sibley\", \"Fiendly\", \"English\"], [\"Silver\", \"Lustrous\", \"Old English\"], [\"Silvia\", \"Of the woods\", \"Latin\"], [\"Sunn\", \"Cheerful\", \"English\"], [\"Sunniva\", \"Gift of the sun\", \"Scandinavian\"], [\"Synne\", \"Cheerful\", \"English\"], [\"Synnove\", \"Gift of the sun\", \"Unknown\"], [\"Tait\", \"Pleasant and bright\", \"Old English\"], [\"Taite\", \"Pleasant and bright\", \"Old English\"], [\"Tate\", \"Pleasant and bright\", \"Old English\"], [\"Tayte\", \"Pleasant and bright\", \"English\"], [\"Thea\", \"Goddess\", \"Greek\"], [\"Udela\", \"Wealthy\", \"English\"], [\"Udele\", \"Wealthy\", \"English\"], [\"Verona\", \"Bringer of victory\", \"Italian\"], [\"Wanda\", \"Young tree\", \"German\"], [\"Whitney\", \"White island\", \"Old english\"], [\"Wilda\", \"Wild\", \"German\"], [\"Willa\", \"Resolute protector\", \"German\"], [\"Wilona\", \"Hoped for\", \"English\"], [\"Wilone\", \"Hoped for\", \"English\"], [\"Zara\", \"Princess\", \"Hebrew\"], [\"Zelda\", \"Companion\", \"Old english\"]]\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "culture/name_generator": {
      "path": "culture/name_generator",
      "content": "(function() {\n  var AngloSaxon, Cities, rand, zodiac;\n\n  AngloSaxon = require(\"./data/names/anglo-saxon\");\n\n  Cities = require(\"./data/cities/ca\");\n\n  rand = function(array) {\n    var index;\n    index = Math.floor(Math.random() * array.length);\n    return array[index];\n  };\n\n  module.exports = function() {\n    return {\n      generate: function() {\n        return rand(AngloSaxon.male)[0];\n      },\n      randomCity: function() {\n        return rand(Cities);\n      },\n      zodiac: function() {\n        return rand(zodiac);\n      }\n    };\n  };\n\n  zodiac = \"♈\\n♉\\n♊\\n♋\\n♌\\n♍\\n♎\\n♏\\n♐\\n♑\\n♒\\n♓\".split(\"\\n\");\n\n}).call(this);\n",
      "type": "blob"
    },
    "entity": {
      "path": "entity",
      "content": "(function() {\n  var Model, generator;\n\n  Model = require(\"model\");\n\n  generator = require(\"/culture/name_generator\")();\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Model(I);\n    }\n    defaults(I, {\n      age: Math.floor(Math.random() * 30 + 11),\n      hometown: generator.randomCity(),\n      name: generator.generate(),\n      zodiac: generator.zodiac()\n    });\n    self.attrObservable(\"age\", \"hometown\", \"index\", \"name\", \"zodiac\");\n    self.attrModel(\"position\", Point);\n    self.extend({\n      move: function(world) {\n        var delta, newPosition, position;\n        position = self.position();\n        delta = Point(rand(3) - 1, rand(3) - 1);\n        newPosition = position.add(delta);\n        if (world.passable(newPosition)) {\n          return self.position(newPosition);\n        }\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "game": {
      "path": "game",
      "content": "(function() {\n  var Model, World;\n\n  Model = require(\"model\");\n\n  World = require(\"./world\");\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Model(I);\n    }\n    if (I.step == null) {\n      I.step = 0;\n    }\n    self.attrObservable(\"activeTool\", \"tools\", \"inspectedCharacter\");\n    self.attrAccessor(\"viewport\");\n    self.attrAccessor(\"tiles\");\n    self.attrModel(\"world\", World);\n    self.extend({\n      update: function() {\n        if (I.step % 20 === 0) {\n          self.world().entities().forEach(function(entity) {\n            return entity.move(self.world());\n          });\n        }\n        return I.step += 1;\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/byte-grid": {
      "path": "lib/byte-grid",
      "content": "(function() {\n  module.exports = function(_arg) {\n    var data, height, length, self, width;\n    width = _arg.width, height = _arg.height, data = _arg.data;\n    length = width * height;\n    if (data == null) {\n      data = new Uint8Array(length);\n    }\n    return self = {\n      width: width,\n      height: height,\n      region: function(rect, iterator) {\n        var x, xPosition, xStart, y, yPosition, yStart;\n        xStart = rect.x;\n        yStart = rect.y;\n        y = 0;\n        while (y < rect.height) {\n          x = 0;\n          while (x < rect.width) {\n            xPosition = x + xStart;\n            yPosition = y + yStart;\n            iterator(self.get(xPosition, yPosition), xPosition, yPosition);\n            x += 1;\n          }\n          y += 1;\n        }\n        return self;\n      },\n      get: function(x, y) {\n        if ((0 <= x && x < width) && (0 <= y && y < height)) {\n          return data[y * width + x];\n        }\n      },\n      set: function(x, y, value) {\n        if ((0 <= x && x < width) && (0 <= y && y < height)) {\n          return data[y * width + x] = value;\n        } else {\n          throw new Error(\"index out of bounds\");\n        }\n      },\n      data: data\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var Game, Preload, Renderer, Template, canvas, draw, game, renderer, state, step, update, view;\n\n  require(\"./setup\");\n\n  Game = require(\"./game\");\n\n  Renderer = require(\"./render\");\n\n  renderer = null;\n\n  view = {\n    x: 0,\n    y: 0,\n    width: 32,\n    height: 18\n  };\n\n  state = {\n    viewport: view,\n    world: {\n      width: 64,\n      height: 64\n    },\n    tiles: require(\"./tiledata\"),\n    activeTool: \"pan\",\n    tools: \"pan\\ninspect\".split(\"\\n\")\n  };\n\n  game = Game(state);\n\n  global.game = game;\n\n  canvas = require(\"./canvas\")(game);\n\n  game.canvas = canvas.element();\n\n  Template = require(\"./templates/main\");\n\n  document.body.appendChild(Template(game));\n\n  update = function() {\n    return game.update();\n  };\n\n  draw = function() {\n    return renderer != null ? renderer.draw(canvas, game) : void 0;\n  };\n\n  step = function() {\n    update();\n    draw();\n    return requestAnimationFrame(step);\n  };\n\n  step();\n\n  Preload = require(\"./preload\");\n\n  Promise.all([\"Objects/Wall\", \"Objects/Floor\", \"Objects/Ground0\", \"Objects/Ground1\", \"Characters/Player0\", \"Characters/Player1\", \"Objects/Pit0\", \"Objects/Pit1\"].map(Preload.image)).then(function(sheets) {\n    var characters;\n    characters = [0, 1, 2, 3, 4, 5, 6, 7].map(function(x) {\n      return [4, x, 0];\n    });\n    return renderer = Renderer(sheets, characters);\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"width\":1536,\"height\":864,\"dependencies\":{\"ajax\":\"distri/ajax:master\",\"math\":\"distri/math:master\",\"model\":\"distri/model:master\",\"touch-canvas\":\"distri/touch-canvas:v0.3.1\",\"util\":\"distri/util:master\"}};",
      "type": "blob"
    },
    "preload": {
      "path": "preload",
      "content": "(function() {\n  var Ajax, ajax, basePath;\n\n  Ajax = require(\"ajax\");\n\n  ajax = Ajax();\n\n  basePath = \"https://danielx.whimsy.space/DawnLike/\";\n\n  module.exports = {\n    image: function(name) {\n      return ajax.getBlob(\"\" + basePath + name + \".png?o_0\").then(function(blob) {\n        return new Promise(function(resolve, reject) {\n          var img;\n          img = new Image;\n          img.onload = function() {\n            return resolve(img);\n          };\n          img.onerror = reject;\n          return img.src = URL.createObjectURL(blob);\n        });\n      });\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "render": {
      "path": "render",
      "content": "(function() {\n  module.exports = function(sheets, characters) {\n    var S, adjacents, autoTileDeltas, autoTileValue, drawCharacter, drawSprite, drawTile, drawValue;\n    S = 16;\n    autoTileDeltas = [[], [[4, -1], [2, 1], [3, 0], [-1, 1], [2, -1], [2, 0], [-1, -1], [-1, 0], [5, 0], [1, 1], [4, 0], [0, 1], [1, -1], [1, 0], [0, -1], [0, 0]], [[3, 0], [3, 0], [-1, -1], [-1, 0], [3, -1], [-1, -1], [-1, -1], [-1, 0], [6, -1], [1, 0], [0, -1], [0, 0], [1, -1], [1, 0], [0, -1], [0, 0]]];\n    adjacents = [[0, -1], [1, 0], [0, 1], [-1, 0]];\n    autoTileValue = function(world, tile, x, y) {\n      var mult;\n      mult = 1;\n      return adjacents.map(function(_arg) {\n        var dx, dy, _ref;\n        dx = _arg[0], dy = _arg[1];\n        return ((_ref = world.getTile(x + dx, y + dy)) != null ? _ref : tile) === tile;\n      }).reduce(function(total, match) {\n        total = total + match * mult;\n        mult *= 2;\n        return total;\n      }, 0);\n    };\n    drawSprite = function(canvas, sheet, sx, sy, x, y) {\n      return canvas.drawImage(sheet, sx * S, sy * S, S, S, x * S, y * S, S, S);\n    };\n    drawCharacter = function(canvas, index, t, x, y) {\n      var sheet, sheetIndex, tx, ty, _ref;\n      _ref = characters[index], sheetIndex = _ref[0], tx = _ref[1], ty = _ref[2];\n      if (t % 1000 < 500) {\n        sheetIndex += 1;\n      }\n      sheet = sheets[sheetIndex];\n      drawSprite(canvas, sheet, tx, ty, x, y);\n    };\n    drawTile = function(canvas, world, tiles, index, t, x, y) {\n      var altSheet, autoTile, dtx, dty, sheet, sheetIndex, tx, ty, _ref, _ref1;\n      if (index == null) {\n        return;\n      }\n      _ref = tiles[index], sheetIndex = _ref[0], tx = _ref[1], ty = _ref[2], autoTile = _ref[3], altSheet = _ref[4];\n      if ((altSheet != null) && t % 1000 < 500) {\n        sheet = sheets[altSheet];\n      } else {\n        sheet = sheets[sheetIndex];\n      }\n      if (autoTile) {\n        _ref1 = autoTileDeltas[autoTile][autoTileValue(world, index, x, y)], dtx = _ref1[0], dty = _ref1[1];\n        tx += dtx;\n        ty += dty;\n      }\n      drawSprite(canvas, sheet, tx, ty, x, y);\n    };\n    drawValue = function(canvas, value, x, y) {\n      if (value == null) {\n        return;\n      }\n      return canvas.drawRect({\n        color: \"rgb(\" + value + \", 128, \" + value + \")\",\n        x: x * S,\n        y: y * S,\n        width: S,\n        height: S\n      });\n    };\n    return {\n      draw: function(canvas, game) {\n        var renderView, t, tiles, transform, viewport, world;\n        world = game.world();\n        viewport = game.viewport();\n        tiles = game.tiles();\n        t = +(new Date);\n        canvas.fill('rgb(89, 125, 206)');\n        transform = Matrix.translate((-S * viewport.x) | 0, (-S * viewport.y) | 0);\n        renderView = {\n          x: Math.floor(viewport.x),\n          y: Math.floor(viewport.y),\n          width: viewport.width + 1,\n          height: viewport.height + 1\n        };\n        return canvas.withTransform(transform, function(canvas) {\n          world.region(renderView, function(value, x, y) {\n            drawTile(canvas, world, tiles, value, t, x, y);\n          });\n          return world.entities().forEach(function(entity) {\n            var index, x, y, _ref;\n            index = entity.index();\n            _ref = entity.position(), x = _ref.x, y = _ref.y;\n            return drawCharacter(canvas, index, t, x, y);\n          });\n        });\n      }\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "setup": {
      "path": "setup",
      "content": "(function() {\n  var defaults, extend, styleNode, _ref;\n\n  require(\"math\").pollute();\n\n  _ref = require(\"util\"), defaults = _ref.defaults, extend = _ref.extend;\n\n  global.defaults = defaults;\n\n  styleNode = document.createElement(\"style\");\n\n  styleNode.innerHTML = require(\"./style\");\n\n  document.head.appendChild(styleNode);\n\n}).call(this);\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"* {\\n  box-sizing: border-box;\\n}\\nhtml {\\n  height: 100%;\\n}\\nbody {\\n  background-color: #140c1c;\\n  color: #1b1421;\\n  font-family: \\\"HelveticaNeue-Light\\\", \\\"Helvetica Neue Light\\\", \\\"Helvetica Neue\\\", Helvetica, Arial, \\\"Lucida Grande\\\", sans-serif;\\n  font-weight: 300;\\n  font-size: 18px;\\n  height: 100%;\\n  margin: 0;\\n  overflow: hidden;\\n  user-select: none;\\n}\\nh1,\\nh2,\\nh3 {\\n  margin: 0;\\n}\\nh2 > .zodiac {\\n  float: right;\\n}\\nlabel {\\n  display: block;\\n}\\nlabel > h3 {\\n  display: inline-block;\\n  font-size: 100%;\\n  margin-right: 0.25em;\\n}\\ncanvas {\\n  bottom: 0;\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  margin: auto;\\n  width: 1536px;\\n  height: 864px;\\n  image-rendering: -moz-crisp-edges;\\n  image-rendering: -o-crisp-edges;\\n  image-rendering: -webkit-optimize-contrast;\\n  image-rendering: pixelated;\\n  -ms-interpolation-mode: nearest-neighbor;\\n}\\ncanvas.detail {\\n  width: 144px;\\n  height: 144px;\\n}\\n.detail {\\n  position: absolute;\\n  right: 0;\\n  height: 100%;\\n  width: 300px;\\n  pointer-events: none;\\n}\\ncard {\\n  border: 1px solid #1b1421;\\n  display: block;\\n  border-radius: 4px;\\n  padding: 8px;\\n  background-color: #deeed6;\\n  pointer-events: all;\\n}\\n.tools {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n}\\n\";",
      "type": "blob"
    },
    "templates/actions": {
      "path": "templates/actions",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var __root;\n    __root = require(\"/lib/hamlet-runtime\")(this);\n    __root.buffer(__root.element(\"div\", this, {\n      \"class\": [\"actions\"]\n    }, function(__root) {}));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "templates/character-card": {
      "path": "templates/character-card",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var __root;\n    __root = require(\"/lib/hamlet-runtime\")(this);\n    __root.buffer(__root.element(\"card\", this, {}, function(__root) {\n      __root.buffer(__root.element(\"h2\", this, {}, function(__root) {\n        __root.buffer(this.name);\n        __root.buffer(__root.element(\"span\", this, {\n          \"class\": [\"zodiac\"]\n        }, function(__root) {\n          __root.buffer(this.zodiac);\n        }));\n      }));\n      __root.buffer(__root.element(\"label\", this, {}, function(__root) {\n        __root.buffer(__root.element(\"h3\", this, {}, function(__root) {\n          __root.buffer(\"Age\\n\");\n        }));\n        __root.buffer(__root.element(\"span\", this, {}, function(__root) {\n          __root.buffer(this.age);\n        }));\n      }));\n      __root.buffer(__root.element(\"label\", this, {}, function(__root) {\n        __root.buffer(__root.element(\"h3\", this, {}, function(__root) {\n          __root.buffer(\"Hometown\\n\");\n        }));\n        __root.buffer(__root.element(\"span\", this, {}, function(__root) {\n          __root.buffer(this.hometown);\n        }));\n      }));\n    }));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "templates/detail": {
      "path": "templates/detail",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var CharacterCard, __root;\n    __root = require(\"/lib/hamlet-runtime\")(this);\n    CharacterCard = require(\"./character-card\");\n    __root.buffer(__root.element(\"div\", this, {\n      \"class\": [\"detail\"]\n    }, function(__root) {\n      var character;\n      if (character = this.inspectedCharacter()) {\n        __root.buffer(CharacterCard(character));\n      }\n    }));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "templates/main": {
      "path": "templates/main",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var Actions, Detail, Tools, __root;\n    __root = require(\"/lib/hamlet-runtime\")(this);\n    Actions = require(\"./actions\");\n    Detail = require(\"./detail\");\n    Tools = require(\"./tools\");\n    __root.buffer(__root.element(\"main\", this, {}, function(__root) {\n      __root.buffer(this.canvas);\n      __root.buffer(Actions(this));\n      __root.buffer(Tools(this));\n      __root.buffer(Detail(this));\n    }));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "templates/tools": {
      "path": "templates/tools",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var __root;\n    __root = require(\"/lib/hamlet-runtime\")(this);\n    __root.buffer(__root.element(\"div\", this, {\n      \"class\": [\"tools\"]\n    }, function(__root) {\n      var self;\n      self = this;\n      this.tools.forEach(function(name) {\n        var active, click;\n        click = function() {\n          return self.activeTool(name);\n        };\n        active = function() {\n          if (name === self.activeTool()) {\n            return \"active\";\n          }\n        };\n        return __root.buffer(__root.element(\"button\", this, {\n          \"class\": [active],\n          \"click\": click\n        }, function(__root) {\n          __root.buffer(name);\n        }));\n      });\n    }));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "test/byte-grid": {
      "path": "test/byte-grid",
      "content": "(function() {\n  var ByteGrid;\n\n  ByteGrid = require(\"../lib/byte-grid\");\n\n  describe(\"Byte Grid\", function() {\n    it(\"should be a grid of bytes\", function() {\n      var grid;\n      grid = ByteGrid({\n        width: 10,\n        height: 10\n      });\n      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function(y) {\n        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function(x) {\n          return grid.set(x, y, x + 10 * y);\n        });\n      });\n      assert.equal(grid.get(5, 5), 55);\n      return assert.equal(grid.get(7, 1), 17);\n    });\n    return it(\"should iterate a region\", function() {\n      var grid, rect;\n      grid = ByteGrid({\n        width: 10,\n        height: 10\n      });\n      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function(y) {\n        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function(x) {\n          return grid.set(x, y, x + 10 * y);\n        });\n      });\n      rect = {\n        x: 3,\n        y: 2,\n        width: 3,\n        height: 2\n      };\n      return grid.region(rect, function(value, x, y) {\n        return console.log(x, y, value);\n      });\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "test/culture/names": {
      "path": "test/culture/names",
      "content": "(function() {\n  var NameGenerator;\n\n  NameGenerator = require(\"/culture/name_generator\");\n\n  describe(\"Culture Name Generator\", function() {\n    return it(\"should generate random names\", function() {\n      var generator;\n      generator = NameGenerator();\n      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function() {\n        return console.log(generator.generate());\n      });\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "world": {
      "path": "world",
      "content": "(function() {\n  var ByteGrid, Entity, gaussian;\n\n  ByteGrid = require(\"./lib/byte-grid\");\n\n  Entity = require(\"./entity\");\n\n  gaussian = require(\"./terrain/generate\").gaussian;\n\n  module.exports = function(I) {\n    var entities, grid, height, self, width;\n    width = I.width, height = I.height;\n    grid = ByteGrid({\n      width: width,\n      height: height\n    });\n    gaussian(grid);\n    grid.data.forEach(function(datum, i) {\n      if (datum < 110) {\n        return grid.data[i] = 1;\n      } else if (datum > 130) {\n        return grid.data[i] = 0;\n      } else {\n        return grid.data[i] = 2;\n      }\n    });\n    entities = [0, 1, 2, 3, 4, 5, 6, 7].map(function(x) {\n      return Entity({\n        index: x,\n        position: {\n          x: 16 + x % 5,\n          y: 13 + x % 3\n        }\n      });\n    });\n    return self = {\n      getTile: grid.get,\n      region: grid.region,\n      entities: function() {\n        return entities;\n      },\n      passable: function(_arg) {\n        var x, y;\n        x = _arg.x, y = _arg.y;\n        if (!((0 <= x && x < width))) {\n          return false;\n        }\n        if (!((0 <= y && y < height))) {\n          return false;\n        }\n        return !(self.getTile(x, y) % 2);\n      },\n      entityAt: function(position) {\n        return (entities.filter(function(entity) {\n          return entity.position().equal(position);\n        }))[0];\n      }\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "tiledata": {
      "path": "tiledata",
      "content": "(function() {\n  module.exports = [[1, 1, 19], [6, 1, 11, 0, 7], [1, 8, 7, 1], [6, 1, 27, 0, 7], [1, 15, 7, 1], [1, 15, 19, 1], [0, 3, 3], [4, 0, 0], [5, 0, 0]];\n\n}).call(this);\n",
      "type": "blob"
    },
    "terrain/generate": {
      "path": "terrain/generate",
      "content": "(function() {\n  var ByteGrid, cellular, diamondSquare, gaussian, gaussianKernel, noiseFill;\n\n  ByteGrid = require(\"../lib/byte-grid\");\n\n  gaussianKernel = [0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006];\n\n  noiseFill = function(buffer) {\n    var i, length, v;\n    length = buffer.length;\n    i = 0;\n    while (i < length) {\n      v = Math.floor(Math.random() * 256);\n      buffer[i] = v;\n      i++;\n    }\n    return buffer;\n  };\n\n  gaussian = function(grid) {\n    var data, height, i, length, swap, v, width, x, y;\n    data = grid.data, width = grid.width, height = grid.height;\n    length = data.length;\n    noiseFill(grid.data);\n    swap = ByteGrid({\n      width: width,\n      height: height\n    });\n    i = 0;\n    y = 0;\n    while (i < length) {\n      x = i % width;\n      v = gaussianKernel.reduce(function(total, ratio, index) {\n        var _ref;\n        return ((_ref = grid.get(index - 3 + x, y)) != null ? _ref : 128) * ratio + total;\n      }, 0);\n      if (x === width - 1) {\n        y++;\n      }\n      swap.data[i] = v;\n      i++;\n    }\n    i = 0;\n    x = 0;\n    while (i < length) {\n      y = i % height;\n      v = gaussianKernel.reduce(function(total, ratio, index) {\n        var _ref;\n        return ((_ref = swap.get(x, index - 3 + y)) != null ? _ref : 128) * ratio + total;\n      }, 0);\n      if (y === height - 1) {\n        x++;\n      }\n      data[i] = v;\n      i++;\n    }\n    return grid;\n  };\n\n  cellular = function(grid) {};\n\n  diamondSquare = function(grid) {\n    var height, stride, width;\n    width = grid.width, height = grid.height;\n    stride = height;\n    grid.set(0, 0, 128);\n    grid.set(0, stride - 1, 128);\n    grid.set(stride / 2, stride / 2, 128 + rand(128) - 64);\n    return grid.set(stride / 2, 0);\n  };\n\n  module.exports = {\n    gaussian: gaussian\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/hamlet-runtime": {
      "path": "lib/hamlet-runtime",
      "content": "(function(f){if(typeof exports===\"object\"&&typeof module!==\"undefined\"){module.exports=f()}else if(typeof define===\"function\"&&define.amd){define([],f)}else{var g;if(typeof window!==\"undefined\"){g=window}else if(typeof global!==\"undefined\"){g=global}else if(typeof self!==\"undefined\"){g=self}else{g=this}g.HamletRuntime = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error(\"Cannot find module '\"+o+\"'\");throw f.code=\"MODULE_NOT_FOUND\",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n// Generated by CoffeeScript 1.7.1\n(function() {\n  \"use strict\";\n  var Observable, Runtime, bindEvent, bindObservable, bufferTo, classes, createElement, empty, eventNames, get, id, isEvent, isFragment, makeElement, observeAttribute, observeAttributes, observeContent, specialBindings, valueBind, valueIndexOf;\n\n  Observable = require(\"o_0\");\n\n  eventNames = \"abort\\nblur\\nchange\\nclick\\ncontextmenu\\ndblclick\\ndrag\\ndragend\\ndragenter\\ndragexit\\ndragleave\\ndragover\\ndragstart\\ndrop\\nerror\\nfocus\\ninput\\nkeydown\\nkeypress\\nkeyup\\nload\\nmousedown\\nmousemove\\nmouseout\\nmouseover\\nmouseup\\nreset\\nresize\\nscroll\\nselect\\nsubmit\\ntouchcancel\\ntouchend\\ntouchenter\\ntouchleave\\ntouchmove\\ntouchstart\\nunload\".split(\"\\n\");\n\n  isEvent = function(name) {\n    return eventNames.indexOf(name) !== -1;\n  };\n\n  isFragment = function(node) {\n    return (node != null ? node.nodeType : void 0) === 11;\n  };\n\n  valueBind = function(element, value, context) {\n    Observable(function() {\n      var update;\n      value = Observable(value, context);\n      switch (element.nodeName) {\n        case \"SELECT\":\n          element.oninput = element.onchange = function() {\n            var optionValue, _ref, _value;\n            _ref = this.children[this.selectedIndex], optionValue = _ref.value, _value = _ref._value;\n            return value(_value || optionValue);\n          };\n          update = function(newValue) {\n            var options;\n            element._value = newValue;\n            if ((options = element._options)) {\n              if (newValue.value != null) {\n                return element.value = (typeof newValue.value === \"function\" ? newValue.value() : void 0) || newValue.value;\n              } else {\n                return element.selectedIndex = valueIndexOf(options, newValue);\n              }\n            } else {\n              return element.value = newValue;\n            }\n          };\n          return bindObservable(element, value, context, update);\n        default:\n          element.oninput = element.onchange = function() {\n            return value(element.value);\n          };\n          if (typeof element.attachEvent === \"function\") {\n            element.attachEvent(\"onkeydown\", function() {\n              return setTimeout(function() {\n                return value(element.value);\n              }, 0);\n            });\n          }\n          return bindObservable(element, value, context, function(newValue) {\n            if (element.value !== newValue) {\n              return element.value = newValue;\n            }\n          });\n      }\n    });\n  };\n\n  specialBindings = {\n    INPUT: {\n      checked: function(element, value, context) {\n        element.onchange = function() {\n          return typeof value === \"function\" ? value(element.checked) : void 0;\n        };\n        return bindObservable(element, value, context, function(newValue) {\n          return element.checked = newValue;\n        });\n      }\n    },\n    SELECT: {\n      options: function(element, values, context) {\n        var updateValues;\n        values = Observable(values, context);\n        updateValues = function(values) {\n          empty(element);\n          element._options = values;\n          return values.map(function(value, index) {\n            var option, optionName, optionValue;\n            option = createElement(\"option\");\n            option._value = value;\n            if (typeof value === \"object\") {\n              optionValue = (value != null ? value.value : void 0) || index;\n            } else {\n              optionValue = value.toString();\n            }\n            bindObservable(option, optionValue, value, function(newValue) {\n              return option.value = newValue;\n            });\n            optionName = (value != null ? value.name : void 0) || value;\n            bindObservable(option, optionName, value, function(newValue) {\n              return option.textContent = option.innerText = newValue;\n            });\n            element.appendChild(option);\n            if (value === element._value) {\n              element.selectedIndex = index;\n            }\n            return option;\n          });\n        };\n        return bindObservable(element, values, context, updateValues);\n      }\n    }\n  };\n\n  observeAttribute = function(element, context, name, value) {\n    var binding, nodeName, _ref;\n    nodeName = element.nodeName;\n    if (name === \"value\") {\n      valueBind(element, value);\n    } else if (binding = (_ref = specialBindings[nodeName]) != null ? _ref[name] : void 0) {\n      binding(element, value, context);\n    } else if (name.match(/^on/) && isEvent(name.substr(2))) {\n      bindEvent(element, name, value, context);\n    } else if (isEvent(name)) {\n      bindEvent(element, \"on\" + name, value, context);\n    } else {\n      bindObservable(element, value, context, function(newValue) {\n        if ((newValue != null) && newValue !== false) {\n          return element.setAttribute(name, newValue);\n        } else {\n          return element.removeAttribute(name);\n        }\n      });\n    }\n    return element;\n  };\n\n  observeAttributes = function(element, context, attributes) {\n    return Object.keys(attributes).forEach(function(name) {\n      var value;\n      value = attributes[name];\n      return observeAttribute(element, context, name, value);\n    });\n  };\n\n  bindObservable = function(element, value, context, update) {\n    var observable, observe, unobserve;\n    observable = Observable(value, context);\n    observe = function() {\n      observable.observe(update);\n      return update(observable());\n    };\n    unobserve = function() {\n      return observable.stopObserving(update);\n    };\n    observe();\n    return element;\n  };\n\n  bindEvent = function(element, name, fn, context) {\n    return element[name] = function() {\n      return fn.apply(context, arguments);\n    };\n  };\n\n  id = function(element, context, sources) {\n    var lastId, update, value;\n    value = Observable.concat.apply(Observable, sources.map(function(source) {\n      return Observable(source, context);\n    }));\n    update = function(newId) {\n      return element.id = newId;\n    };\n    lastId = function() {\n      return value.last();\n    };\n    return bindObservable(element, lastId, context, update);\n  };\n\n  classes = function(element, context, sources) {\n    var classNames, update, value;\n    value = Observable.concat.apply(Observable, sources.map(function(source) {\n      return Observable(source, context);\n    }));\n    update = function(classNames) {\n      return element.className = classNames;\n    };\n    classNames = function() {\n      return value.join(\" \");\n    };\n    return bindObservable(element, classNames, context, update);\n  };\n\n  createElement = function(name) {\n    return document.createElement(name);\n  };\n\n  observeContent = function(element, context, contentFn) {\n    var append, contents, update;\n    contents = [];\n    contentFn.call(context, {\n      buffer: bufferTo(context, contents),\n      element: makeElement\n    });\n    append = function(item) {\n      if (item == null) {\n\n      } else if (typeof item === \"string\") {\n        return element.appendChild(document.createTextNode(item));\n      } else if (typeof item === \"number\") {\n        return element.appendChild(document.createTextNode(item));\n      } else if (typeof item === \"boolean\") {\n        return element.appendChild(document.createTextNode(item));\n      } else if (typeof item.each === \"function\") {\n        return item.each(append);\n      } else if (typeof item.forEach === \"function\") {\n        return item.forEach(append);\n      } else {\n        return element.appendChild(item);\n      }\n    };\n    update = function(contents) {\n      empty(element);\n      return contents.forEach(append);\n    };\n    return update(contents);\n  };\n\n  bufferTo = function(context, collection) {\n    return function(content) {\n      if (typeof content === 'function') {\n        content = Observable(content, context);\n      }\n      collection.push(content);\n      return content;\n    };\n  };\n\n  makeElement = function(name, context, attributes, fn) {\n    var element;\n    if (attributes == null) {\n      attributes = {};\n    }\n    element = createElement(name);\n    Observable(function() {\n      if (attributes.id != null) {\n        id(element, context, attributes.id);\n        return delete attributes.id;\n      }\n    });\n    Observable(function() {\n      if (attributes[\"class\"] != null) {\n        classes(element, context, attributes[\"class\"]);\n        return delete attributes[\"class\"];\n      }\n    });\n    Observable(function() {\n      return observeAttributes(element, context, attributes);\n    }, context);\n    if (element.nodeName !== \"SELECT\") {\n      Observable(function() {\n        return observeContent(element, context, fn);\n      }, context);\n    }\n    return element;\n  };\n\n  Runtime = function(context) {\n    var self;\n    self = {\n      buffer: function(content) {\n        if (self.root) {\n          throw \"Cannot have multiple root elements\";\n        }\n        return self.root = content;\n      },\n      element: makeElement,\n      filter: function(name, content) {}\n    };\n    return self;\n  };\n\n  Runtime.VERSION = require(\"../package.json\").version;\n\n  Runtime.Observable = Observable;\n\n  module.exports = Runtime;\n\n  empty = function(node) {\n    var child, _results;\n    _results = [];\n    while (child = node.firstChild) {\n      _results.push(node.removeChild(child));\n    }\n    return _results;\n  };\n\n  valueIndexOf = function(options, value) {\n    if (typeof value === \"object\") {\n      return options.indexOf(value);\n    } else {\n      return options.map(function(option) {\n        return option.toString();\n      }).indexOf(value.toString());\n    }\n  };\n\n  get = function(x) {\n    if (typeof x === 'function') {\n      return x();\n    } else {\n      return x;\n    }\n  };\n\n}).call(this);\n\n},{\"../package.json\":3,\"o_0\":2}],2:[function(require,module,exports){\n(function (global){\n// Generated by CoffeeScript 1.8.0\n(function() {\n  var Observable, PROXY_LENGTH, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat, tryCallWithFinallyPop,\n    __slice = [].slice;\n\n  module.exports = Observable = function(value, context) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return copy(listeners).forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      changed = function() {\n        value = computeDependencies(self, fn, changed, context);\n        return notify(value);\n      };\n      changed();\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n    }\n    self.each = function(callback) {\n      magicDependency(self);\n      if (value != null) {\n        [value].forEach(function(item) {\n          return callback.call(item, item);\n        });\n      }\n      return self;\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          magicDependency(self);\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      if (PROXY_LENGTH) {\n        Object.defineProperty(self, 'length', {\n          get: function() {\n            magicDependency(self);\n            return value.length;\n          },\n          set: function(length) {\n            value.length = length;\n            return notifyReturning(value.length);\n          }\n        });\n      }\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function(callback) {\n          self.forEach(function(item, index) {\n            return callback.call(item, item, index, self);\n          });\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          magicDependency(self);\n          return value[index];\n        },\n        first: function() {\n          magicDependency(self);\n          return value[0];\n        },\n        last: function() {\n          magicDependency(self);\n          return value[value.length - 1];\n        },\n        size: function() {\n          magicDependency(self);\n          return value.length;\n        }\n      });\n    }\n    extend(self, {\n      listeners: listeners,\n      observe: function(listener) {\n        return listeners.push(listener);\n      },\n      stopObserving: function(fn) {\n        return remove(listeners, fn);\n      },\n      toggle: function() {\n        return self(!value);\n      },\n      increment: function(n) {\n        return self(value + n);\n      },\n      decrement: function(n) {\n        return self(value - n);\n      },\n      toString: function() {\n        return \"Observable(\" + value + \")\";\n      }\n    });\n    return self;\n  };\n\n  Observable.concat = function() {\n    var arg, args, collection, i, o, _i, _len;\n    args = new Array(arguments.length);\n    for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {\n      arg = arguments[i];\n      args[i] = arguments[i];\n    }\n    collection = Observable(args);\n    o = Observable(function() {\n      return flatten(collection.map(splat));\n    });\n    o.push = collection.push;\n    return o;\n  };\n\n  extend = function(target) {\n    var i, name, source, _i, _len;\n    for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {\n      source = arguments[i];\n      if (i > 0) {\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = [];\n\n  magicDependency = function(self) {\n    var observerSet;\n    observerSet = last(global.OBSERVABLE_ROOT_HACK);\n    if (observerSet) {\n      return observerSet.add(self);\n    }\n  };\n\n  tryCallWithFinallyPop = function(fn, context) {\n    try {\n      return fn.call(context);\n    } finally {\n      global.OBSERVABLE_ROOT_HACK.pop();\n    }\n  };\n\n  computeDependencies = function(self, fn, update, context) {\n    var deps, value, _ref;\n    deps = new Set;\n    global.OBSERVABLE_ROOT_HACK.push(deps);\n    value = tryCallWithFinallyPop(fn, context);\n    if ((_ref = self._deps) != null) {\n      _ref.forEach(function(observable) {\n        return observable.stopObserving(update);\n      });\n    }\n    self._deps = deps;\n    deps.forEach(function(observable) {\n      return observable.observe(update);\n    });\n    return value;\n  };\n\n  try {\n    Object.defineProperty((function() {}), 'length', {\n      get: function() {},\n      set: function() {}\n    });\n    PROXY_LENGTH = true;\n  } catch (_error) {\n    PROXY_LENGTH = false;\n  }\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n  copy = function(array) {\n    return array.concat([]);\n  };\n\n  get = function(arg) {\n    if (typeof arg === \"function\") {\n      return arg();\n    } else {\n      return arg;\n    }\n  };\n\n  splat = function(item) {\n    var result, results;\n    results = [];\n    if (item == null) {\n      return results;\n    }\n    if (typeof item.forEach === \"function\") {\n      item.forEach(function(i) {\n        return results.push(i);\n      });\n    } else {\n      result = get(item);\n      if (result != null) {\n        results.push(result);\n      }\n    }\n    return results;\n  };\n\n  last = function(array) {\n    return array[array.length - 1];\n  };\n\n  flatten = function(array) {\n    return array.reduce(function(a, b) {\n      return a.concat(b);\n    }, []);\n  };\n\n}).call(this);\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{}],3:[function(require,module,exports){\nmodule.exports={\n  \"name\": \"hamlet.coffee\",\n  \"version\": \"0.7.6\",\n  \"description\": \"Truly amazing templating!\",\n  \"devDependencies\": {\n    \"browserify\": \"^12.0.1\",\n    \"coffee-script\": \"~1.7.1\",\n    \"jsdom\": \"^7.2.0\",\n    \"mocha\": \"^2.3.3\"\n  },\n  \"dependencies\": {\n    \"hamlet-compiler\": \"0.7.0\",\n    \"o_0\": \"0.3.8\"\n  },\n  \"homepage\": \"hamlet.coffee\",\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"https://github.com/dr-coffee-labs/hamlet.git\"\n  },\n  \"scripts\": {\n    \"prepublish\": \"script/prepublish\",\n    \"test\": \"script/test\"\n  },\n  \"files\": [\n    \"dist/\"\n  ],\n  \"main\": \"dist/runtime.js\"\n}\n\n},{}]},{},[1])(1)\n});",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/honegar",
    "homepage": null,
    "description": "A sweet sweet honeypot of a game.",
    "html_url": "https://github.com/STRd6/honegar",
    "url": "https://api.github.com/repos/STRd6/honegar",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "ajax": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2016 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "# ajax\n\nA Promise returning wrapper for XMLHttpRequest\n\nThis aims to be a very small and very direct wrapper for XMLHttpRequest. We\nreturn a native promise and configure the requets via an options object.\n\n\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee": {
          "path": "main.coffee",
          "content": "{extend, defaults} = require \"./util\"\n\nrequire \"./shims\"\n\nmodule.exports = ->\n  ajax = (options={}) ->\n    {data, headers, method, overrideMimeType, password, url, responseType, timeout, user, withCredentials} = options\n    data ?= \"\"\n    method ?= \"GET\"\n    password ?= \"\"\n    responseType ?= \"\"\n    timeout ?= 0\n    user ?= \"\"\n    withCredentials ?= false\n\n    new ProgressPromise (resolve, reject, progress) ->\n      xhr = new XMLHttpRequest()\n      xhr.open(method, url, true, user, password)\n      xhr.responseType = responseType\n      xhr.timeout = timeout\n      xhr.withCredentialls = withCredentials\n\n      if headers\n        Object.keys(headers).forEach (header) ->\n          value = headers[header]\n          xhr.setRequestHeader header, value\n\n      if overrideMimeType\n        xhr.overrideMimeType overrideMimeType\n\n      xhr.onload = (e) ->\n        if (200 <= this.status < 300) or this.status is 304\n          resolve this.response\n          complete e, xhr, options\n        else\n          reject xhr\n          complete e, xhr, options\n\n      xhr.onerror = (e) ->\n        reject xhr\n        complete e, xhr, options\n\n      xhr.onprogress = progress\n\n      xhr.send(data)\n\n  complete = (args...) ->\n    completeHandlers.forEach (handler) ->\n      handler args...\n\n  configure = (optionDefaults) ->\n    (url, options={}) ->\n      if typeof url is \"object\"\n        options = url\n      else\n        options.url = url\n\n      defaults options, optionDefaults\n\n      ajax(options)\n\n  completeHandlers = []\n\n  extend ajax,\n    ajax: configure {}\n    complete: (handler) ->\n      completeHandlers.push handler\n\n    getJSON: configure\n      responseType: \"json\"\n\n    getBlob: configure\n      responseType: \"blob\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.5-pre.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/test.coffee": {
          "path": "test/test.coffee",
          "content": "Ajax = require \"../main\"\n\ndescribe \"Ajax\", ->\n  it \"should provide progress\", (done) ->\n    ajax = Ajax()\n\n    ajax\n      url: \"https://api.github.com/users\"\n      responseType: \"json\"\n    .progress (e) ->\n      console.log e\n    .then (data) ->\n      assert data[0].id is 1\n      done()\n\n  it \"should getJSON\", (done) ->\n    ajax = Ajax()\n\n    ajax\n      url: \"https://api.github.com/users\"\n      responseType: \"json\"\n    .then (data) ->\n      assert data[0].id is 1\n      assert data[0].login is \"mojombo\"\n\n      done()\n\n  it \"should have complete handlers\", (done) ->\n    ajax = Ajax()\n\n    ajax.complete (e, xhr, options) ->\n      done()\n\n    ajax.getJSON(\"https://api.github.com/users\")\n\n\n  it \"should work with options only\", (done) ->\n    ajax = Ajax()\n\n    ajax.getJSON(url: \"https://api.github.com/users\")\n    .then (data) ->\n      assert data[0].id is 1\n      assert data[0].login is \"mojombo\"\n\n      done()\n",
          "mode": "100644",
          "type": "blob"
        },
        "util.coffee": {
          "path": "util.coffee",
          "content": "module.exports =\n  defaults: (target, objects...) ->\n    for object in objects\n      for name of object\n        unless target.hasOwnProperty(name)\n          target[name] = object[name]\n\n    return target\n\n  extend: (target, sources...) ->\n    for source in sources\n      for name of source\n        target[name] = source[name]\n\n    return target\n",
          "mode": "100644",
          "type": "blob"
        },
        "shims.coffee": {
          "path": "shims.coffee",
          "content": "# Extend promises with `finally`\n# From: https://github.com/domenic/promises-unwrapping/issues/18\nPromise.prototype.finally ?= (callback) ->\n  # We don’t invoke the callback in here,\n  # because we want then() to handle its exceptions\n  this.then(\n    # Callback fulfills: pass on predecessor settlement\n    # Callback rejects: pass on rejection (=omit 2nd arg.)\n    (value) ->\n      Promise.resolve(callback())\n      .then -> return value\n    (reason) ->\n      Promise.resolve(callback())\n      .then -> throw reason\n  )\n\n# HACK: I really would prefer not to modify the native Promise prototype, but I\n# know no other way...\n\nPromise.prototype._notify ?= (event) ->\n  @_progressHandlers.forEach (handler) ->\n    try\n      handler(event)\n\nPromise.prototype.progress ?= (handler) ->\n  @_progressHandlers ?= []\n  @_progressHandlers.push handler\n\n  return this\n\nglobal.ProgressPromise = (fn) ->\n  p = new Promise (resolve, reject) ->\n    notify = ->\n      p._progressHandlers?.forEach (handler) ->\n        try\n          handler(event)\n\n    fn(resolve, reject, notify)\n\n  p.then = (onFulfilled, onRejected) ->\n    result = Promise.prototype.then.call(p, onFulfilled, onRejected)\n    # Pass progress through\n    p.progress result._notify.bind(result)\n\n    return result\n\n  return p\n",
          "mode": "100644"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var defaults, extend, _ref,\n    __slice = [].slice;\n\n  _ref = require(\"./util\"), extend = _ref.extend, defaults = _ref.defaults;\n\n  require(\"./shims\");\n\n  module.exports = function() {\n    var ajax, complete, completeHandlers, configure;\n    ajax = function(options) {\n      var data, headers, method, overrideMimeType, password, responseType, timeout, url, user, withCredentials;\n      if (options == null) {\n        options = {};\n      }\n      data = options.data, headers = options.headers, method = options.method, overrideMimeType = options.overrideMimeType, password = options.password, url = options.url, responseType = options.responseType, timeout = options.timeout, user = options.user, withCredentials = options.withCredentials;\n      if (data == null) {\n        data = \"\";\n      }\n      if (method == null) {\n        method = \"GET\";\n      }\n      if (password == null) {\n        password = \"\";\n      }\n      if (responseType == null) {\n        responseType = \"\";\n      }\n      if (timeout == null) {\n        timeout = 0;\n      }\n      if (user == null) {\n        user = \"\";\n      }\n      if (withCredentials == null) {\n        withCredentials = false;\n      }\n      return new ProgressPromise(function(resolve, reject, progress) {\n        var xhr;\n        xhr = new XMLHttpRequest();\n        xhr.open(method, url, true, user, password);\n        xhr.responseType = responseType;\n        xhr.timeout = timeout;\n        xhr.withCredentialls = withCredentials;\n        if (headers) {\n          Object.keys(headers).forEach(function(header) {\n            var value;\n            value = headers[header];\n            return xhr.setRequestHeader(header, value);\n          });\n        }\n        if (overrideMimeType) {\n          xhr.overrideMimeType(overrideMimeType);\n        }\n        xhr.onload = function(e) {\n          var _ref1;\n          if (((200 <= (_ref1 = this.status) && _ref1 < 300)) || this.status === 304) {\n            resolve(this.response);\n            return complete(e, xhr, options);\n          } else {\n            reject(xhr);\n            return complete(e, xhr, options);\n          }\n        };\n        xhr.onerror = function(e) {\n          reject(xhr);\n          return complete(e, xhr, options);\n        };\n        xhr.onprogress = progress;\n        return xhr.send(data);\n      });\n    };\n    complete = function() {\n      var args;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return completeHandlers.forEach(function(handler) {\n        return handler.apply(null, args);\n      });\n    };\n    configure = function(optionDefaults) {\n      return function(url, options) {\n        if (options == null) {\n          options = {};\n        }\n        if (typeof url === \"object\") {\n          options = url;\n        } else {\n          options.url = url;\n        }\n        defaults(options, optionDefaults);\n        return ajax(options);\n      };\n    };\n    completeHandlers = [];\n    return extend(ajax, {\n      ajax: configure({}),\n      complete: function(handler) {\n        return completeHandlers.push(handler);\n      },\n      getJSON: configure({\n        responseType: \"json\"\n      }),\n      getBlob: configure({\n        responseType: \"blob\"\n      })\n    });\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.5-pre.0\"};",
          "type": "blob"
        },
        "test/test": {
          "path": "test/test",
          "content": "(function() {\n  var Ajax;\n\n  Ajax = require(\"../main\");\n\n  describe(\"Ajax\", function() {\n    it(\"should provide progress\", function(done) {\n      var ajax;\n      ajax = Ajax();\n      return ajax({\n        url: \"https://api.github.com/users\",\n        responseType: \"json\"\n      }).progress(function(e) {\n        return console.log(e);\n      }).then(function(data) {\n        assert(data[0].id === 1);\n        return done();\n      });\n    });\n    it(\"should getJSON\", function(done) {\n      var ajax;\n      ajax = Ajax();\n      return ajax({\n        url: \"https://api.github.com/users\",\n        responseType: \"json\"\n      }).then(function(data) {\n        assert(data[0].id === 1);\n        assert(data[0].login === \"mojombo\");\n        return done();\n      });\n    });\n    it(\"should have complete handlers\", function(done) {\n      var ajax;\n      ajax = Ajax();\n      ajax.complete(function(e, xhr, options) {\n        return done();\n      });\n      return ajax.getJSON(\"https://api.github.com/users\");\n    });\n    return it(\"should work with options only\", function(done) {\n      var ajax;\n      ajax = Ajax();\n      return ajax.getJSON({\n        url: \"https://api.github.com/users\"\n      }).then(function(data) {\n        assert(data[0].id === 1);\n        assert(data[0].login === \"mojombo\");\n        return done();\n      });\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        },
        "util": {
          "path": "util",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "shims": {
          "path": "shims",
          "content": "(function() {\n  var _base, _base1, _base2;\n\n  if ((_base = Promise.prototype)[\"finally\"] == null) {\n    _base[\"finally\"] = function(callback) {\n      return this.then(function(value) {\n        return Promise.resolve(callback()).then(function() {\n          return value;\n        });\n      }, function(reason) {\n        return Promise.resolve(callback()).then(function() {\n          throw reason;\n        });\n      });\n    };\n  }\n\n  if ((_base1 = Promise.prototype)._notify == null) {\n    _base1._notify = function(event) {\n      return this._progressHandlers.forEach(function(handler) {\n        try {\n          return handler(event);\n        } catch (_error) {}\n      });\n    };\n  }\n\n  if ((_base2 = Promise.prototype).progress == null) {\n    _base2.progress = function(handler) {\n      if (this._progressHandlers == null) {\n        this._progressHandlers = [];\n      }\n      this._progressHandlers.push(handler);\n      return this;\n    };\n  }\n\n  global.ProgressPromise = function(fn) {\n    var p;\n    p = new Promise(function(resolve, reject) {\n      var notify;\n      notify = function() {\n        var _ref;\n        return (_ref = p._progressHandlers) != null ? _ref.forEach(function(handler) {\n          try {\n            return handler(event);\n          } catch (_error) {}\n        }) : void 0;\n      };\n      return fn(resolve, reject, notify);\n    });\n    p.then = function(onFulfilled, onRejected) {\n      var result;\n      result = Promise.prototype.then.call(p, onFulfilled, onRejected);\n      p.progress(result._notify.bind(result));\n      return result;\n    };\n    return p;\n  };\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "https://danielx.net/editor/"
      },
      "version": "0.1.5-pre.0",
      "entryPoint": "main",
      "repository": {
        "branch": "master",
        "default_branch": "master",
        "full_name": "distri/ajax",
        "homepage": null,
        "description": "Promise returning Ajax lib",
        "html_url": "https://github.com/distri/ajax",
        "url": "https://api.github.com/repos/distri/ajax",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    },
    "math": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "math\n====\n\nMath is for cool guys.\n",
          "mode": "100644",
          "type": "blob"
        },
        "math.coffee.md": {
          "path": "math.coffee.md",
          "content": "Math\n====\n\nRequire and export many math libraries.\n\n    Point = require \"point\"\n    Size = require \"size\"\n\n    Matrix = require \"matrix\"\n    Matrix.Point = Point\n\n    Random = require \"random\"\n\n    module.exports = self =\n      Point: Point\n      Matrix: Matrix\n      Random: Random\n      Rectangle: require \"./rectangle\"\n      rand: Random.rand\n      Size: Size\n      version: require(\"./pixie\").version\n\nPollute all libraries to the global namespace.\n\n      pollute: ->\n        Object.keys(self).forEach (key) ->\n          return if key is \"version\"\n          return if key is \"pollute\"\n\n          global[key] = self[key]\n\n        return self\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "entryPoint: \"math\"\nversion: \"0.2.5\"\ndependencies:\n  point: \"distri/point:v0.2.0\"\n  matrix: \"distri/matrix:v0.3.1\"\n  random: \"distri/random:v0.2.2\"\n  size: \"distri/size:v0.1.4\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "rectangle.coffee.md": {
          "path": "rectangle.coffee.md",
          "content": "Rectangle\n=========\n\nA rectangle is a size at a given position.\n\n    {abs, min} = Math\n\n    Size = require \"size\"\n\n    module.exports = Rectangle = (position, size) ->\n      if position?.size?\n        {position, size} = position\n\n      position: Point(position)\n      size: Size(size)\n      __proto__: Rectangle.prototype\n\n    Rectangle.prototype =\n      each: (iterator) ->\n        p = @position\n\n        @size.each (x, y) ->\n          iterator(p.x + x, p.y + y)\n\n    Rectangle.fromPoints = (start, end) ->\n      Rectangle Point(min(start.x, end.x), min(start.y, end.y)), Size(abs(end.x - start.x), abs(end.y - start.y))\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/math.coffee": {
          "path": "test/math.coffee",
          "content": "require(\"../math\").pollute()\n\ndescribe \"Point\", ->\n  it \"should exist\", ->\n    assert Point\n\n  it \"should construct points\", ->\n    assert Point()\n\ndescribe \"Matrix\", ->\n  it \"should exist and return matrices when invoked\", ->\n    assert Matrix\n\n    assert Matrix()\n\n  it \"should use the same `Point` class\", ->\n    assert Matrix.Point is Point\n\n    assert Matrix().transformPoint(Point()) instanceof Point\n\ndescribe \"Random\", ->\n  it \"should exist\", ->\n    assert Random\n\ndescribe \"rand\", ->\n  it \"should exist\", ->\n    assert rand\n\n    assert rand()?\n\ndescribe \"Size\", ->\n  it \"should exist\", ->\n    assert Size\n\ndescribe \"Math\", ->\n  it \"should have a version\", ->\n    assert require(\"../math\").version\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/rectangle.coffee": {
          "path": "test/rectangle.coffee",
          "content": "{Point, Size, Rectangle} = require \"../math\"\n\ndescribe \"rectangle\", ->\n  it \"should iterate\", ->\n    rectangle = Rectangle\n      position: Point(2, 2)\n      size: Size(2, 2)\n\n    total = 0\n    rectangle.each (x, y) ->\n      total += 1\n\n    assert.equal total, 4\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "math": {
          "path": "math",
          "content": "(function() {\n  var Matrix, Point, Random, Size, self;\n\n  Point = require(\"point\");\n\n  Size = require(\"size\");\n\n  Matrix = require(\"matrix\");\n\n  Matrix.Point = Point;\n\n  Random = require(\"random\");\n\n  module.exports = self = {\n    Point: Point,\n    Matrix: Matrix,\n    Random: Random,\n    Rectangle: require(\"./rectangle\"),\n    rand: Random.rand,\n    Size: Size,\n    version: require(\"./pixie\").version,\n    pollute: function() {\n      Object.keys(self).forEach(function(key) {\n        if (key === \"version\") {\n          return;\n        }\n        if (key === \"pollute\") {\n          return;\n        }\n        return global[key] = self[key];\n      });\n      return self;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"entryPoint\":\"math\",\"version\":\"0.2.5\",\"dependencies\":{\"point\":\"distri/point:v0.2.0\",\"matrix\":\"distri/matrix:v0.3.1\",\"random\":\"distri/random:v0.2.2\",\"size\":\"distri/size:v0.1.4\"}};",
          "type": "blob"
        },
        "rectangle": {
          "path": "rectangle",
          "content": "(function() {\n  var Rectangle, Size, abs, min;\n\n  abs = Math.abs, min = Math.min;\n\n  Size = require(\"size\");\n\n  module.exports = Rectangle = function(position, size) {\n    var _ref;\n    if ((position != null ? position.size : void 0) != null) {\n      _ref = position, position = _ref.position, size = _ref.size;\n    }\n    return {\n      position: Point(position),\n      size: Size(size),\n      __proto__: Rectangle.prototype\n    };\n  };\n\n  Rectangle.prototype = {\n    each: function(iterator) {\n      var p;\n      p = this.position;\n      return this.size.each(function(x, y) {\n        return iterator(p.x + x, p.y + y);\n      });\n    }\n  };\n\n  Rectangle.fromPoints = function(start, end) {\n    return Rectangle(Point(min(start.x, end.x), min(start.y, end.y)), Size(abs(end.x - start.x), abs(end.y - start.y)));\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "test/math": {
          "path": "test/math",
          "content": "(function() {\n  require(\"../math\").pollute();\n\n  describe(\"Point\", function() {\n    it(\"should exist\", function() {\n      return assert(Point);\n    });\n    return it(\"should construct points\", function() {\n      return assert(Point());\n    });\n  });\n\n  describe(\"Matrix\", function() {\n    it(\"should exist and return matrices when invoked\", function() {\n      assert(Matrix);\n      return assert(Matrix());\n    });\n    return it(\"should use the same `Point` class\", function() {\n      assert(Matrix.Point === Point);\n      return assert(Matrix().transformPoint(Point()) instanceof Point);\n    });\n  });\n\n  describe(\"Random\", function() {\n    return it(\"should exist\", function() {\n      return assert(Random);\n    });\n  });\n\n  describe(\"rand\", function() {\n    return it(\"should exist\", function() {\n      assert(rand);\n      return assert(rand() != null);\n    });\n  });\n\n  describe(\"Size\", function() {\n    return it(\"should exist\", function() {\n      return assert(Size);\n    });\n  });\n\n  describe(\"Math\", function() {\n    return it(\"should have a version\", function() {\n      return assert(require(\"../math\").version);\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        },
        "test/rectangle": {
          "path": "test/rectangle",
          "content": "(function() {\n  var Point, Rectangle, Size, _ref;\n\n  _ref = require(\"../math\"), Point = _ref.Point, Size = _ref.Size, Rectangle = _ref.Rectangle;\n\n  describe(\"rectangle\", function() {\n    return it(\"should iterate\", function() {\n      var rectangle, total;\n      rectangle = Rectangle({\n        position: Point(2, 2),\n        size: Size(2, 2)\n      });\n      total = 0;\n      rectangle.each(function(x, y) {\n        return total += 1;\n      });\n      return assert.equal(total, 4);\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "https://danielx.net/editor/"
      },
      "version": "0.2.5",
      "entryPoint": "math",
      "repository": {
        "branch": "master",
        "default_branch": "master",
        "full_name": "distri/math",
        "homepage": null,
        "description": "Math is for cool guys.",
        "html_url": "https://github.com/distri/math",
        "url": "https://api.github.com/repos/distri/math",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "point": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "point\n=====\n\nJavaScript Point implementation\n",
              "type": "blob"
            },
            "interactive_runtime.coffee.md": {
              "path": "interactive_runtime.coffee.md",
              "mode": "100644",
              "content": "Interactive Runtime\n-------------------\n\n    window.Point = require(\"./point\")\n\nRegister our example runner.\n\n    Interactive.register \"example\", ({source, runtimeElement}) ->\n      program = CoffeeScript.compile(source, bare: true)\n\n      outputElement = document.createElement \"pre\"\n      runtimeElement.empty().append outputElement\n\n      result = eval(program)\n\n      if typeof result is \"number\"\n        if result != (0 | result)\n          result = result.toFixed(4)\n    \n\n      outputElement.textContent = result\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.2.0\"\nentryPoint: \"point\"\n",
              "type": "blob"
            },
            "point.coffee.md": {
              "path": "point.coffee.md",
              "mode": "100644",
              "content": "\nCreate a new point with given x and y coordinates. If no arguments are given\ndefaults to (0, 0).\n\n>     #! example\n>     Point()\n\n----\n\n>     #! example\n>     Point(-2, 5)\n\n----\n\n    Point = (x, y) ->\n      if isObject(x)\n        {x, y} = x\n\n      __proto__: Point.prototype\n      x: x ? 0\n      y: y ? 0\n\nPoint protoype methods.\n\n    Point:: =\n\nConstrain the magnitude of a vector.\n\n      clamp: (n) ->\n        if @magnitude() > n\n          @norm(n)\n        else\n          @copy()\n\nCreates a copy of this point.\n\n      copy: ->\n        Point(@x, @y)\n\n>     #! example\n>     Point(1, 1).copy()\n\n----\n\nAdds a point to this one and returns the new point. You may\nalso use a two argument call like `point.add(x, y)`\nto add x and y values without a second point object.\n\n      add: (first, second) ->\n        if second?\n          Point(\n            @x + first\n            @y + second\n          )\n        else\n          Point(\n            @x + first.x,\n            @y + first.y\n          )\n\n>     #! example\n>     Point(2, 3).add(Point(3, 4))\n\n----\n\nSubtracts a point to this one and returns the new point.\n\n      subtract: (first, second) ->\n        if second?\n          Point(\n            @x - first,\n            @y - second\n          )\n        else\n          @add(first.scale(-1))\n\n>     #! example\n>     Point(1, 2).subtract(Point(2, 0))\n\n----\n\nScale this Point (Vector) by a constant amount.\n\n      scale: (scalar) ->\n        Point(\n          @x * scalar,\n          @y * scalar\n        )\n\n>     #! example\n>     point = Point(5, 6).scale(2)\n\n----\n\nThe `norm` of a vector is the unit vector pointing in the same direction. This method\ntreats the point as though it is a vector from the origin to (x, y).\n\n      norm: (length=1.0) ->\n        if m = @length()\n          @scale(length/m)\n        else\n          @copy()\n\n>     #! example\n>     point = Point(2, 3).norm()\n\n----\n\nDetermine whether this `Point` is equal to another `Point`. Returns `true` if\nthey are equal and `false` otherwise.\n\n      equal: (other) ->\n        @x == other.x && @y == other.y\n\n>     #! example\n>     point = Point(2, 3)\n>\n>     point.equal(Point(2, 3))\n\n----\n\nComputed the length of this point as though it were a vector from (0,0) to (x,y).\n\n      length: ->\n        Math.sqrt(@dot(this))\n\n>     #! example\n>     Point(5, 7).length()\n\n----\n\nCalculate the magnitude of this Point (Vector).\n\n      magnitude: ->\n        @length()\n\n>     #! example\n>     Point(5, 7).magnitude()\n\n----\n\nReturns the direction in radians of this point from the origin.\n\n      direction: ->\n        Math.atan2(@y, @x)\n\n>     #! example\n>     point = Point(0, 1)\n>\n>     point.direction()\n\n----\n\nCalculate the dot product of this point and another point (Vector).\n\n      dot: (other) ->\n        @x * other.x + @y * other.y\n\n\n`cross` calculates the cross product of this point and another point (Vector).\nUsually cross products are thought of as only applying to three dimensional vectors,\nbut z can be treated as zero. The result of this method is interpreted as the magnitude\nof the vector result of the cross product between [x1, y1, 0] x [x2, y2, 0]\nperpendicular to the xy plane.\n\n      cross: (other) ->\n        @x * other.y - other.x * @y\n\n\n`distance` computes the Euclidean distance between this point and another point.\n\n      distance: (other) ->\n        Point.distance(this, other)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     pointA.distance(pointB)\n\n----\n\n`toFixed` returns a string representation of this point with fixed decimal places.\n\n      toFixed: (n) ->\n        \"Point(#{@x.toFixed(n)}, #{@y.toFixed(n)})\"\n\n`toString` returns a string representation of this point. The representation is\nsuch that if `eval`d it will return a `Point`\n\n      toString: ->\n        \"Point(#{@x}, #{@y})\"\n\n`distance` Compute the Euclidean distance between two points.\n\n    Point.distance = (p1, p2) ->\n      Math.sqrt(Point.distanceSquared(p1, p2))\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distance(pointA, pointB)\n\n----\n\n`distanceSquared` The square of the Euclidean distance between two points.\n\n    Point.distanceSquared = (p1, p2) ->\n      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distanceSquared(pointA, pointB)\n\n----\n\n`interpolate` returns a point along the path from p1 to p2\n\n    Point.interpolate = (p1, p2, t) ->\n      p2.subtract(p1).scale(t).add(p1)\n\nConstruct a point on the unit circle for the given angle.\n\n    Point.fromAngle = (angle) ->\n      Point(Math.cos(angle), Math.sin(angle))\n\n>     #! example\n>     Point.fromAngle(Math.PI / 2)\n\n----\n\nIf you have two dudes, one standing at point p1, and the other\nstanding at point p2, then this method will return the direction\nthat the dude standing at p1 will need to face to look at p2.\n\n>     #! example\n>     p1 = Point(0, 0)\n>     p2 = Point(7, 3)\n>\n>     Point.direction(p1, p2)\n\n    Point.direction = (p1, p2) ->\n      Math.atan2(\n        p2.y - p1.y,\n        p2.x - p1.x\n      )\n\nThe centroid of a set of points is their arithmetic mean.\n\n    Point.centroid = (points...) ->\n      points.reduce((sumPoint, point) ->\n        sumPoint.add(point)\n      , Point(0, 0))\n      .scale(1/points.length)\n\nGenerate a random point on the unit circle.\n\n    Point.random = ->\n      Point.fromAngle(Math.random() * 2 * Math.PI)\n\nExport\n\n    module.exports = Point\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\nLive Examples\n-------------\n\n>     #! setup\n>     require(\"/interactive_runtime\")\n",
              "type": "blob"
            },
            "test/test.coffee": {
              "path": "test/test.coffee",
              "mode": "100644",
              "content": "Point = require \"../point\"\n\nok = assert\nequals = assert.equal\n\nTAU = 2 * Math.PI\n\ndescribe \"Point\", ->\n\n  TOLERANCE = 0.00001\n\n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n\n  it \"copy constructor\", ->\n    p = Point(3, 7)\n\n    p2 = Point(p)\n\n    equals p2.x, p.x\n    equals p2.y, p.y\n\n  it \"#add\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.add(p2)\n\n    equals result.x, p1.x + p2.x\n    equals result.y, p1.y + p2.y\n\n    equals p1.x, 5\n    equals p1.y, 6\n    equals p2.x, 7\n    equals p2.y, 5\n\n  it \"#add with two arguments\", ->\n    point = Point(3, 7)\n    x = 2\n    y = 1\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n    x = 2\n    y = 0\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n  it \"#add existing\", ->\n    p = Point(0, 0)\n\n    p.add(Point(3, 5))\n\n    equals p.x, 0\n    equals p.y, 0\n\n  it \"#subtract\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.subtract(p2)\n\n    equals result.x, p1.x - p2.x\n    equals result.y, p1.y - p2.y\n\n  it \"#subtract existing\", ->\n    p = Point(8, 6)\n\n    p.subtract(3, 4)\n\n    equals p.x, 8\n    equals p.y, 6\n\n  it \"#norm\", ->\n    p = Point(2, 0)\n\n    normal = p.norm()\n    equals normal.x, 1\n\n    normal = p.norm(5)\n    equals normal.x, 5\n\n    p = Point(0, 0)\n\n    normal = p.norm()\n    equals normal.x, 0, \"x value of norm of point(0,0) is 0\"\n    equals normal.y, 0, \"y value of norm of point(0,0) is 0\"\n\n  it \"#norm existing\", ->\n    p = Point(6, 8)\n\n    p.norm(5)\n\n    equals p.x, 6\n    equals p.y, 8\n\n  it \"#scale\", ->\n    p = Point(5, 6)\n    scalar = 2\n\n    result = p.scale(scalar)\n\n    equals result.x, p.x * scalar\n    equals result.y, p.y * scalar\n\n    equals p.x, 5\n    equals p.y, 6\n\n  it \"#scale existing\", ->\n    p = Point(0, 1)\n    scalar = 3\n\n    p.scale(scalar)\n\n    equals p.x, 0\n    equals p.y, 1\n\n  it \"#equal\", ->\n    ok Point(7, 8).equal(Point(7, 8))\n\n  it \"#magnitude\", ->\n    equals Point(3, 4).magnitude(), 5\n\n  it \"#length\", ->\n    equals Point(0, 0).length(), 0\n    equals Point(-1, 0).length(), 1\n\n  it \"#toString\", ->\n    p = Point(7, 5)\n    ok eval(p.toString()).equal(p)\n\n  it \"#clamp\", ->\n    p = Point(10, 10)\n    p2 = p.clamp(5)\n\n    equals p2.length(), 5\n\n  it \".centroid\", ->\n    centroid = Point.centroid(\n      Point(0, 0),\n      Point(10, 10),\n      Point(10, 0),\n      Point(0, 10)\n    )\n\n    equals centroid.x, 5\n    equals centroid.y, 5\n\n  it \".fromAngle\", ->\n    p = Point.fromAngle(TAU / 4)\n\n    equalEnough p.x, 0, TOLERANCE\n    equals p.y, 1\n\n  it \".random\", ->\n    p = Point.random()\n\n    ok p\n\n  it \".interpolate\", ->\n    p1 = Point(10, 7)\n    p2 = Point(-6, 29)\n\n    ok p1.equal(Point.interpolate(p1, p2, 0))\n    ok p2.equal(Point.interpolate(p1, p2, 1))\n",
              "type": "blob"
            }
          },
          "distribution": {
            "interactive_runtime": {
              "path": "interactive_runtime",
              "content": "(function() {\n  window.Point = require(\"./point\");\n\n  Interactive.register(\"example\", function(_arg) {\n    var outputElement, program, result, runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    program = CoffeeScript.compile(source, {\n      bare: true\n    });\n    outputElement = document.createElement(\"pre\");\n    runtimeElement.empty().append(outputElement);\n    result = eval(program);\n    if (typeof result === \"number\") {\n      if (result !== (0 | result)) {\n        result = result.toFixed(4);\n      }\n    }\n    return outputElement.textContent = result;\n  });\n\n}).call(this);\n\n//# sourceURL=interactive_runtime.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"point\"};",
              "type": "blob"
            },
            "point": {
              "path": "point",
              "content": "(function() {\n  var Point, isObject,\n    __slice = [].slice;\n\n  Point = function(x, y) {\n    var _ref;\n    if (isObject(x)) {\n      _ref = x, x = _ref.x, y = _ref.y;\n    }\n    return {\n      __proto__: Point.prototype,\n      x: x != null ? x : 0,\n      y: y != null ? y : 0\n    };\n  };\n\n  Point.prototype = {\n    clamp: function(n) {\n      if (this.magnitude() > n) {\n        return this.norm(n);\n      } else {\n        return this.copy();\n      }\n    },\n    copy: function() {\n      return Point(this.x, this.y);\n    },\n    add: function(first, second) {\n      if (second != null) {\n        return Point(this.x + first, this.y + second);\n      } else {\n        return Point(this.x + first.x, this.y + first.y);\n      }\n    },\n    subtract: function(first, second) {\n      if (second != null) {\n        return Point(this.x - first, this.y - second);\n      } else {\n        return this.add(first.scale(-1));\n      }\n    },\n    scale: function(scalar) {\n      return Point(this.x * scalar, this.y * scalar);\n    },\n    norm: function(length) {\n      var m;\n      if (length == null) {\n        length = 1.0;\n      }\n      if (m = this.length()) {\n        return this.scale(length / m);\n      } else {\n        return this.copy();\n      }\n    },\n    equal: function(other) {\n      return this.x === other.x && this.y === other.y;\n    },\n    length: function() {\n      return Math.sqrt(this.dot(this));\n    },\n    magnitude: function() {\n      return this.length();\n    },\n    direction: function() {\n      return Math.atan2(this.y, this.x);\n    },\n    dot: function(other) {\n      return this.x * other.x + this.y * other.y;\n    },\n    cross: function(other) {\n      return this.x * other.y - other.x * this.y;\n    },\n    distance: function(other) {\n      return Point.distance(this, other);\n    },\n    toFixed: function(n) {\n      return \"Point(\" + (this.x.toFixed(n)) + \", \" + (this.y.toFixed(n)) + \")\";\n    },\n    toString: function() {\n      return \"Point(\" + this.x + \", \" + this.y + \")\";\n    }\n  };\n\n  Point.distance = function(p1, p2) {\n    return Math.sqrt(Point.distanceSquared(p1, p2));\n  };\n\n  Point.distanceSquared = function(p1, p2) {\n    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);\n  };\n\n  Point.interpolate = function(p1, p2, t) {\n    return p2.subtract(p1).scale(t).add(p1);\n  };\n\n  Point.fromAngle = function(angle) {\n    return Point(Math.cos(angle), Math.sin(angle));\n  };\n\n  Point.direction = function(p1, p2) {\n    return Math.atan2(p2.y - p1.y, p2.x - p1.x);\n  };\n\n  Point.centroid = function() {\n    var points;\n    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    return points.reduce(function(sumPoint, point) {\n      return sumPoint.add(point);\n    }, Point(0, 0)).scale(1 / points.length);\n  };\n\n  Point.random = function() {\n    return Point.fromAngle(Math.random() * 2 * Math.PI);\n  };\n\n  module.exports = Point;\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n}).call(this);\n\n//# sourceURL=point.coffee",
              "type": "blob"
            },
            "test/test": {
              "path": "test/test",
              "content": "(function() {\n  var Point, TAU, equals, ok;\n\n  Point = require(\"../point\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  TAU = 2 * Math.PI;\n\n  describe(\"Point\", function() {\n    var TOLERANCE, equalEnough;\n    TOLERANCE = 0.00001;\n    equalEnough = function(expected, actual, tolerance, message) {\n      message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n    };\n    it(\"copy constructor\", function() {\n      var p, p2;\n      p = Point(3, 7);\n      p2 = Point(p);\n      equals(p2.x, p.x);\n      return equals(p2.y, p.y);\n    });\n    it(\"#add\", function() {\n      var p1, p2, result;\n      p1 = Point(5, 6);\n      p2 = Point(7, 5);\n      result = p1.add(p2);\n      equals(result.x, p1.x + p2.x);\n      equals(result.y, p1.y + p2.y);\n      equals(p1.x, 5);\n      equals(p1.y, 6);\n      equals(p2.x, 7);\n      return equals(p2.y, 5);\n    });\n    it(\"#add with two arguments\", function() {\n      var point, result, x, y;\n      point = Point(3, 7);\n      x = 2;\n      y = 1;\n      result = point.add(x, y);\n      equals(result.x, point.x + x);\n      equals(result.y, point.y + y);\n      x = 2;\n      y = 0;\n      result = point.add(x, y);\n      equals(result.x, point.x + x);\n      return equals(result.y, point.y + y);\n    });\n    it(\"#add existing\", function() {\n      var p;\n      p = Point(0, 0);\n      p.add(Point(3, 5));\n      equals(p.x, 0);\n      return equals(p.y, 0);\n    });\n    it(\"#subtract\", function() {\n      var p1, p2, result;\n      p1 = Point(5, 6);\n      p2 = Point(7, 5);\n      result = p1.subtract(p2);\n      equals(result.x, p1.x - p2.x);\n      return equals(result.y, p1.y - p2.y);\n    });\n    it(\"#subtract existing\", function() {\n      var p;\n      p = Point(8, 6);\n      p.subtract(3, 4);\n      equals(p.x, 8);\n      return equals(p.y, 6);\n    });\n    it(\"#norm\", function() {\n      var normal, p;\n      p = Point(2, 0);\n      normal = p.norm();\n      equals(normal.x, 1);\n      normal = p.norm(5);\n      equals(normal.x, 5);\n      p = Point(0, 0);\n      normal = p.norm();\n      equals(normal.x, 0, \"x value of norm of point(0,0) is 0\");\n      return equals(normal.y, 0, \"y value of norm of point(0,0) is 0\");\n    });\n    it(\"#norm existing\", function() {\n      var p;\n      p = Point(6, 8);\n      p.norm(5);\n      equals(p.x, 6);\n      return equals(p.y, 8);\n    });\n    it(\"#scale\", function() {\n      var p, result, scalar;\n      p = Point(5, 6);\n      scalar = 2;\n      result = p.scale(scalar);\n      equals(result.x, p.x * scalar);\n      equals(result.y, p.y * scalar);\n      equals(p.x, 5);\n      return equals(p.y, 6);\n    });\n    it(\"#scale existing\", function() {\n      var p, scalar;\n      p = Point(0, 1);\n      scalar = 3;\n      p.scale(scalar);\n      equals(p.x, 0);\n      return equals(p.y, 1);\n    });\n    it(\"#equal\", function() {\n      return ok(Point(7, 8).equal(Point(7, 8)));\n    });\n    it(\"#magnitude\", function() {\n      return equals(Point(3, 4).magnitude(), 5);\n    });\n    it(\"#length\", function() {\n      equals(Point(0, 0).length(), 0);\n      return equals(Point(-1, 0).length(), 1);\n    });\n    it(\"#toString\", function() {\n      var p;\n      p = Point(7, 5);\n      return ok(eval(p.toString()).equal(p));\n    });\n    it(\"#clamp\", function() {\n      var p, p2;\n      p = Point(10, 10);\n      p2 = p.clamp(5);\n      return equals(p2.length(), 5);\n    });\n    it(\".centroid\", function() {\n      var centroid;\n      centroid = Point.centroid(Point(0, 0), Point(10, 10), Point(10, 0), Point(0, 10));\n      equals(centroid.x, 5);\n      return equals(centroid.y, 5);\n    });\n    it(\".fromAngle\", function() {\n      var p;\n      p = Point.fromAngle(TAU / 4);\n      equalEnough(p.x, 0, TOLERANCE);\n      return equals(p.y, 1);\n    });\n    it(\".random\", function() {\n      var p;\n      p = Point.random();\n      return ok(p);\n    });\n    return it(\".interpolate\", function() {\n      var p1, p2;\n      p1 = Point(10, 7);\n      p2 = Point(-6, 29);\n      ok(p1.equal(Point.interpolate(p1, p2, 0)));\n      return ok(p2.equal(Point.interpolate(p1, p2, 1)));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "point",
          "repository": {
            "id": 13484982,
            "name": "point",
            "full_name": "distri/point",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/point",
            "description": "JavaScript Point implementation",
            "fork": false,
            "url": "https://api.github.com/repos/distri/point",
            "forks_url": "https://api.github.com/repos/distri/point/forks",
            "keys_url": "https://api.github.com/repos/distri/point/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/point/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/point/teams",
            "hooks_url": "https://api.github.com/repos/distri/point/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/point/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/point/events",
            "assignees_url": "https://api.github.com/repos/distri/point/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/point/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/point/tags",
            "blobs_url": "https://api.github.com/repos/distri/point/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/point/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/point/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/point/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/point/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/point/languages",
            "stargazers_url": "https://api.github.com/repos/distri/point/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/point/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/point/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/point/subscription",
            "commits_url": "https://api.github.com/repos/distri/point/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/point/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/point/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/point/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/point/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/point/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/point/merges",
            "archive_url": "https://api.github.com/repos/distri/point/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/point/downloads",
            "issues_url": "https://api.github.com/repos/distri/point/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/point/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/point/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/point/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/point/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/point/releases{/id}",
            "created_at": "2013-10-10T22:59:27Z",
            "updated_at": "2013-12-23T23:33:20Z",
            "pushed_at": "2013-10-15T00:22:04Z",
            "git_url": "git://github.com/distri/point.git",
            "ssh_url": "git@github.com:distri/point.git",
            "clone_url": "https://github.com/distri/point.git",
            "svn_url": "https://github.com/distri/point",
            "homepage": null,
            "size": 836,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "matrix": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "matrix\n======\n\nWhere matrices become heroes, together.\n",
              "type": "blob"
            },
            "matrix.coffee.md": {
              "path": "matrix.coffee.md",
              "mode": "100644",
              "content": "Matrix\n======\n\n```\n   _        _\n  | a  c tx  |\n  | b  d ty  |\n  |_0  0  1 _|\n```\n\nCreates a matrix for 2d affine transformations.\n\n`concat`, `inverse`, `rotate`, `scale` and `translate` return new matrices with\nthe transformations applied. The matrix is not modified in place.\n\nReturns the identity matrix when called with no arguments.\n\n    Matrix = (a, b, c, d, tx, ty) ->\n      if isObject(a)\n        {a, b, c, d, tx, ty} = a\n\n      __proto__: Matrix.prototype\n      a: a ? 1\n      b: b ? 0\n      c: c ? 0\n      d: d ? 1\n      tx: tx ? 0\n      ty: ty ? 0\n\nA `Point` constructor for the methods that return points. This can be overridden\nwith a compatible constructor if you want fancier points.\n\n    Matrix.Point = require \"./point\"\n\n    Matrix.prototype =\n\n`concat` returns the result of this matrix multiplied by another matrix\ncombining the geometric effects of the two. In mathematical terms,\nconcatenating two matrixes is the same as combining them using matrix multiplication.\nIf this matrix is A and the matrix passed in is B, the resulting matrix is A x B\nhttp://mathworld.wolfram.com/MatrixMultiplication.html\n\n      concat: (matrix) ->\n        Matrix(\n          @a * matrix.a + @c * matrix.b,\n          @b * matrix.a + @d * matrix.b,\n          @a * matrix.c + @c * matrix.d,\n          @b * matrix.c + @d * matrix.d,\n          @a * matrix.tx + @c * matrix.ty + @tx,\n          @b * matrix.tx + @d * matrix.ty + @ty\n        )\n\n\nReturn a new matrix that is a `copy` of this matrix.\n\n      copy: ->\n        Matrix(@a, @b, @c, @d, @tx, @ty)\n\nGiven a point in the pretransform coordinate space, returns the coordinates of\nthat point after the transformation occurs. Unlike the standard transformation\napplied using the transformPoint() method, the deltaTransformPoint() method\ndoes not consider the translation parameters tx and ty.\n\nReturns a new `Point` transformed by this matrix ignoring tx and ty.\n\n      deltaTransformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y,\n          @b * point.x + @d * point.y\n        )\n\nReturns a new matrix that is the inverse of this matrix.\nhttp://mathworld.wolfram.com/MatrixInverse.html\n\n      inverse: ->\n        determinant = @a * @d - @b * @c\n\n        Matrix(\n          @d / determinant,\n          -@b / determinant,\n          -@c / determinant,\n          @a / determinant,\n          (@c * @ty - @d * @tx) / determinant,\n          (@b * @tx - @a * @ty) / determinant\n        )\n\nReturns a new matrix that corresponds this matrix multiplied by a\na rotation matrix.\n\nThe first parameter `theta` is the amount to rotate in radians.\n\nThe second optional parameter, `aboutPoint` is the point about which the\nrotation occurs. Defaults to (0,0).\n\n      rotate: (theta, aboutPoint) ->\n        @concat(Matrix.rotation(theta, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na scaling matrix.\n\n      scale: (sx, sy, aboutPoint) ->\n        @concat(Matrix.scale(sx, sy, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na skewing matrix.\n\n      skew: (skewX, skewY) ->\n        @concat(Matrix.skew(skewX, skewY))\n\nReturns a string representation of this matrix.\n\n      toString: ->\n        \"Matrix(#{@a}, #{@b}, #{@c}, #{@d}, #{@tx}, #{@ty})\"\n\nReturns the result of applying the geometric transformation represented by the\nMatrix object to the specified point.\n\n      transformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y + @tx,\n          @b * point.x + @d * point.y + @ty\n        )\n\nTranslates the matrix along the x and y axes, as specified by the tx and ty parameters.\n\n      translate: (tx, ty) ->\n        @concat(Matrix.translation(tx, ty))\n\nCreates a matrix transformation that corresponds to the given rotation,\naround (0,0) or the specified point.\n\n    Matrix.rotate = Matrix.rotation = (theta, aboutPoint) ->\n      rotationMatrix = Matrix(\n        Math.cos(theta),\n        Math.sin(theta),\n        -Math.sin(theta),\n        Math.cos(theta)\n      )\n\n      if aboutPoint?\n        rotationMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            rotationMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return rotationMatrix\n\nReturns a matrix that corresponds to scaling by factors of sx, sy along\nthe x and y axis respectively.\n\nIf only one parameter is given the matrix is scaled uniformly along both axis.\n\nIf the optional aboutPoint parameter is given the scaling takes place\nabout the given point.\n\n    Matrix.scale = (sx, sy, aboutPoint) ->\n      sy = sy || sx\n\n      scaleMatrix = Matrix(sx, 0, 0, sy)\n\n      if aboutPoint\n        scaleMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            scaleMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return scaleMatrix\n\n\nReturns a matrix that corresponds to a skew of skewX, skewY.\n\n    Matrix.skew = (skewX, skewY) ->\n      Matrix(0, Math.tan(skewY), Math.tan(skewX), 0)\n\nReturns a matrix that corresponds to a translation of tx, ty.\n\n    Matrix.translate = Matrix.translation = (tx, ty) ->\n      Matrix(1, 0, 0, 1, tx, ty)\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\n    frozen = (object) ->\n      Object.freeze?(object)\n\n      return object\n\nConstants\n---------\n\nA constant representing the identity matrix.\n\n    Matrix.IDENTITY = frozen Matrix()\n\nA constant representing the horizontal flip transformation matrix.\n\n    Matrix.HORIZONTAL_FLIP = frozen Matrix(-1, 0, 0, 1)\n\nA constant representing the vertical flip transformation matrix.\n\n    Matrix.VERTICAL_FLIP = frozen Matrix(1, 0, 0, -1)\n\nExports\n-------\n\n    module.exports = Matrix\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.3.1\"\nentryPoint: \"matrix\"\n",
              "type": "blob"
            },
            "test/matrix.coffee": {
              "path": "test/matrix.coffee",
              "mode": "100644",
              "content": "Matrix = require \"../matrix\"\nPoint = require \"../point\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Matrix\", ->\n\n  TOLERANCE = 0.00001\n  \n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \n  matrixEqual = (m1, m2) ->\n    equalEnough(m1.a, m2.a, TOLERANCE)\n    equalEnough(m1.b, m2.b, TOLERANCE)\n    equalEnough(m1.c, m2.c, TOLERANCE)\n    equalEnough(m1.d, m2.d, TOLERANCE)\n    equalEnough(m1.tx, m2.tx, TOLERANCE)\n    equalEnough(m1.ty, m2.ty, TOLERANCE)\n  \n  test \"copy constructor\", ->\n   matrix = Matrix(1, 0, 0, 1, 10, 12)\n  \n   matrix2 = Matrix(matrix)\n  \n   ok matrix != matrix2\n   matrixEqual(matrix2, matrix)\n  \n  test \"Matrix() (Identity)\", ->\n    matrix = Matrix()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"Empty\", ->\n    matrix = Matrix(0, 0, 0, 0, 0, 0)\n  \n    equals(matrix.a, 0, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 0, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#copy\", ->\n    matrix = Matrix(2, 0, 0, 2)\n  \n    copyMatrix = matrix.copy()\n  \n    matrixEqual copyMatrix, matrix\n  \n    copyMatrix.a = 4\n  \n    equals copyMatrix.a, 4\n    equals matrix.a, 2, \"Old 'a' value is unchanged\"\n  \n  test \".scale\", ->\n    matrix = Matrix.scale(2, 2)\n  \n    equals(matrix.a, 2, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 2, \"d\")\n  \n    matrix = Matrix.scale(3)\n  \n    equals(matrix.a, 3, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 3, \"d\")\n  \n  test \".scale (about a point)\", ->\n    p = Point(5, 17)\n  \n    transformedPoint = Matrix.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#scale (about a point)\", ->\n    p = Point(3, 11)\n  \n    transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#skew\", ->\n    matrix = Matrix()\n\n    angle = 0.25 * Math.PI\n  \n    matrix = matrix.skew(angle, 0)\n  \n    equals matrix.c, Math.tan(angle)\n  \n  test \".rotation\", ->\n    matrix = Matrix.rotation(Math.PI / 2)\n  \n    equalEnough(matrix.a, 0, TOLERANCE)\n    equalEnough(matrix.b, 1, TOLERANCE)\n    equalEnough(matrix.c,-1, TOLERANCE)\n    equalEnough(matrix.d, 0, TOLERANCE)\n  \n  test \".rotation (about a point)\", ->\n    p = Point(11, 7)\n  \n    transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#rotate (about a point)\", ->\n    p = Point(8, 5);\n  \n    transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#inverse (Identity)\", ->\n    matrix = Matrix().inverse()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#concat\", ->\n    matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2))\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"#toString\", ->\n    matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5)\n    matrixEqual eval(matrix.toString()), matrix\n  \n  test \"Maths\", ->\n    a = Matrix(12, 3, 3, 1, 7, 9)\n    b = Matrix(3, 8, 3, 2, 1, 5)\n  \n    c = a.concat(b)\n  \n    equals(c.a, 60)\n    equals(c.b, 17)\n    equals(c.c, 42)\n    equals(c.d, 11)\n    equals(c.tx, 34)\n    equals(c.ty, 17)\n  \n  test \"Order of transformations should match manual concat\", ->\n    tx = 10\n    ty = 5\n    theta = Math.PI/3\n    s = 2\n  \n    m1 = Matrix().translate(tx, ty).scale(s).rotate(theta)\n    m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta))\n  \n    matrixEqual(m1, m2)\n  \n  test \"IDENTITY is immutable\", ->\n    identity = Matrix.IDENTITY\n  \n    identity.a = 5\n  \n    equals identity.a, 1\n",
              "type": "blob"
            },
            "point.coffee.md": {
              "path": "point.coffee.md",
              "mode": "100644",
              "content": "Point\n=====\n\nA very simple Point object constructor.\n\n    module.exports = (x, y) ->\n      x: x\n      y: y\n",
              "type": "blob"
            }
          },
          "distribution": {
            "matrix": {
              "path": "matrix",
              "content": "(function() {\n  var Matrix, frozen, isObject;\n\n  Matrix = function(a, b, c, d, tx, ty) {\n    var _ref;\n    if (isObject(a)) {\n      _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;\n    }\n    return {\n      __proto__: Matrix.prototype,\n      a: a != null ? a : 1,\n      b: b != null ? b : 0,\n      c: c != null ? c : 0,\n      d: d != null ? d : 1,\n      tx: tx != null ? tx : 0,\n      ty: ty != null ? ty : 0\n    };\n  };\n\n  Matrix.Point = require(\"./point\");\n\n  Matrix.prototype = {\n    concat: function(matrix) {\n      return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);\n    },\n    copy: function() {\n      return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);\n    },\n    deltaTransformPoint: function(point) {\n      return Matrix.Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);\n    },\n    inverse: function() {\n      var determinant;\n      determinant = this.a * this.d - this.b * this.c;\n      return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);\n    },\n    rotate: function(theta, aboutPoint) {\n      return this.concat(Matrix.rotation(theta, aboutPoint));\n    },\n    scale: function(sx, sy, aboutPoint) {\n      return this.concat(Matrix.scale(sx, sy, aboutPoint));\n    },\n    skew: function(skewX, skewY) {\n      return this.concat(Matrix.skew(skewX, skewY));\n    },\n    toString: function() {\n      return \"Matrix(\" + this.a + \", \" + this.b + \", \" + this.c + \", \" + this.d + \", \" + this.tx + \", \" + this.ty + \")\";\n    },\n    transformPoint: function(point) {\n      return Matrix.Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);\n    },\n    translate: function(tx, ty) {\n      return this.concat(Matrix.translation(tx, ty));\n    }\n  };\n\n  Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {\n    var rotationMatrix;\n    rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));\n    if (aboutPoint != null) {\n      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));\n    }\n    return rotationMatrix;\n  };\n\n  Matrix.scale = function(sx, sy, aboutPoint) {\n    var scaleMatrix;\n    sy = sy || sx;\n    scaleMatrix = Matrix(sx, 0, 0, sy);\n    if (aboutPoint) {\n      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));\n    }\n    return scaleMatrix;\n  };\n\n  Matrix.skew = function(skewX, skewY) {\n    return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);\n  };\n\n  Matrix.translate = Matrix.translation = function(tx, ty) {\n    return Matrix(1, 0, 0, 1, tx, ty);\n  };\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n  frozen = function(object) {\n    if (typeof Object.freeze === \"function\") {\n      Object.freeze(object);\n    }\n    return object;\n  };\n\n  Matrix.IDENTITY = frozen(Matrix());\n\n  Matrix.HORIZONTAL_FLIP = frozen(Matrix(-1, 0, 0, 1));\n\n  Matrix.VERTICAL_FLIP = frozen(Matrix(1, 0, 0, -1));\n\n  module.exports = Matrix;\n\n}).call(this);\n\n//# sourceURL=matrix.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.3.1\",\"entryPoint\":\"matrix\"};",
              "type": "blob"
            },
            "test/matrix": {
              "path": "test/matrix",
              "content": "(function() {\n  var Matrix, Point, equals, ok, test;\n\n  Matrix = require(\"../matrix\");\n\n  Point = require(\"../point\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Matrix\", function() {\n    var TOLERANCE, equalEnough, matrixEqual;\n    TOLERANCE = 0.00001;\n    equalEnough = function(expected, actual, tolerance, message) {\n      message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n    };\n    matrixEqual = function(m1, m2) {\n      equalEnough(m1.a, m2.a, TOLERANCE);\n      equalEnough(m1.b, m2.b, TOLERANCE);\n      equalEnough(m1.c, m2.c, TOLERANCE);\n      equalEnough(m1.d, m2.d, TOLERANCE);\n      equalEnough(m1.tx, m2.tx, TOLERANCE);\n      return equalEnough(m1.ty, m2.ty, TOLERANCE);\n    };\n    test(\"copy constructor\", function() {\n      var matrix, matrix2;\n      matrix = Matrix(1, 0, 0, 1, 10, 12);\n      matrix2 = Matrix(matrix);\n      ok(matrix !== matrix2);\n      return matrixEqual(matrix2, matrix);\n    });\n    test(\"Matrix() (Identity)\", function() {\n      var matrix;\n      matrix = Matrix();\n      equals(matrix.a, 1, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 1, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      equals(matrix.ty, 0, \"ty\");\n      return matrixEqual(matrix, Matrix.IDENTITY);\n    });\n    test(\"Empty\", function() {\n      var matrix;\n      matrix = Matrix(0, 0, 0, 0, 0, 0);\n      equals(matrix.a, 0, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 0, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      return equals(matrix.ty, 0, \"ty\");\n    });\n    test(\"#copy\", function() {\n      var copyMatrix, matrix;\n      matrix = Matrix(2, 0, 0, 2);\n      copyMatrix = matrix.copy();\n      matrixEqual(copyMatrix, matrix);\n      copyMatrix.a = 4;\n      equals(copyMatrix.a, 4);\n      return equals(matrix.a, 2, \"Old 'a' value is unchanged\");\n    });\n    test(\".scale\", function() {\n      var matrix;\n      matrix = Matrix.scale(2, 2);\n      equals(matrix.a, 2, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 2, \"d\");\n      matrix = Matrix.scale(3);\n      equals(matrix.a, 3, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      return equals(matrix.d, 3, \"d\");\n    });\n    test(\".scale (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(5, 17);\n      transformedPoint = Matrix.scale(3, 7, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#scale (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(3, 11);\n      transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#skew\", function() {\n      var angle, matrix;\n      matrix = Matrix();\n      angle = 0.25 * Math.PI;\n      matrix = matrix.skew(angle, 0);\n      return equals(matrix.c, Math.tan(angle));\n    });\n    test(\".rotation\", function() {\n      var matrix;\n      matrix = Matrix.rotation(Math.PI / 2);\n      equalEnough(matrix.a, 0, TOLERANCE);\n      equalEnough(matrix.b, 1, TOLERANCE);\n      equalEnough(matrix.c, -1, TOLERANCE);\n      return equalEnough(matrix.d, 0, TOLERANCE);\n    });\n    test(\".rotation (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(11, 7);\n      transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#rotate (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(8, 5);\n      transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#inverse (Identity)\", function() {\n      var matrix;\n      matrix = Matrix().inverse();\n      equals(matrix.a, 1, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 1, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      return equals(matrix.ty, 0, \"ty\");\n    });\n    test(\"#concat\", function() {\n      var matrix;\n      matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2));\n      return matrixEqual(matrix, Matrix.IDENTITY);\n    });\n    test(\"#toString\", function() {\n      var matrix;\n      matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5);\n      return matrixEqual(eval(matrix.toString()), matrix);\n    });\n    test(\"Maths\", function() {\n      var a, b, c;\n      a = Matrix(12, 3, 3, 1, 7, 9);\n      b = Matrix(3, 8, 3, 2, 1, 5);\n      c = a.concat(b);\n      equals(c.a, 60);\n      equals(c.b, 17);\n      equals(c.c, 42);\n      equals(c.d, 11);\n      equals(c.tx, 34);\n      return equals(c.ty, 17);\n    });\n    test(\"Order of transformations should match manual concat\", function() {\n      var m1, m2, s, theta, tx, ty;\n      tx = 10;\n      ty = 5;\n      theta = Math.PI / 3;\n      s = 2;\n      m1 = Matrix().translate(tx, ty).scale(s).rotate(theta);\n      m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta));\n      return matrixEqual(m1, m2);\n    });\n    return test(\"IDENTITY is immutable\", function() {\n      var identity;\n      identity = Matrix.IDENTITY;\n      identity.a = 5;\n      return equals(identity.a, 1);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/matrix.coffee",
              "type": "blob"
            },
            "point": {
              "path": "point",
              "content": "(function() {\n  module.exports = function(x, y) {\n    return {\n      x: x,\n      y: y\n    };\n  };\n\n}).call(this);\n\n//# sourceURL=point.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.3.1",
          "entryPoint": "matrix",
          "repository": {
            "id": 13551996,
            "name": "matrix",
            "full_name": "distri/matrix",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/matrix",
            "description": "Where matrices become heroes, together.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/matrix",
            "forks_url": "https://api.github.com/repos/distri/matrix/forks",
            "keys_url": "https://api.github.com/repos/distri/matrix/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/matrix/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/matrix/teams",
            "hooks_url": "https://api.github.com/repos/distri/matrix/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/matrix/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/matrix/events",
            "assignees_url": "https://api.github.com/repos/distri/matrix/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/matrix/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/matrix/tags",
            "blobs_url": "https://api.github.com/repos/distri/matrix/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/matrix/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/matrix/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/matrix/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/matrix/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/matrix/languages",
            "stargazers_url": "https://api.github.com/repos/distri/matrix/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/matrix/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/matrix/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/matrix/subscription",
            "commits_url": "https://api.github.com/repos/distri/matrix/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/matrix/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/matrix/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/matrix/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/matrix/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/matrix/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/matrix/merges",
            "archive_url": "https://api.github.com/repos/distri/matrix/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/matrix/downloads",
            "issues_url": "https://api.github.com/repos/distri/matrix/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/matrix/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/matrix/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/matrix/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/matrix/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/matrix/releases{/id}",
            "created_at": "2013-10-14T03:46:16Z",
            "updated_at": "2013-12-23T23:45:28Z",
            "pushed_at": "2013-10-15T00:22:51Z",
            "git_url": "git://github.com/distri/matrix.git",
            "ssh_url": "git@github.com:distri/matrix.git",
            "clone_url": "https://github.com/distri/matrix.git",
            "svn_url": "https://github.com/distri/matrix",
            "homepage": null,
            "size": 580,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.3.1",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "random": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "random\n======\n\nRandom generation.\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.2.2\"\nentryPoint: \"random\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "random.coffee.md": {
              "path": "random.coffee.md",
              "content": "Random\n======\n\nSome useful methods for generating random things.\n\nHelpers\n-------\n\n`τ` is the circle constant.\n\n    τ = 2 * Math.PI\n\n`U` returns a continuous uniform distribution between `min` and `max`.\n\n    U = (min, max) ->\n      ->\n        Math.random() * (max - min) + min\n\n`standardUniformDistribution` is the uniform distribution between [0, 1]\n\n    standardUniformDistribution = U(0, 1)\n\n`rand` is a helpful shortcut for generating random numbers from a standard\nuniform distribution or from a discreet set of integers.\n\n    rand = (n) ->\n      if n\n        Math.floor(n * standardUniformDistribution())\n      else\n        standardUniformDistribution()\n\nMethods\n-------\n\n    module.exports = Random =\n\nReturns a random angle, uniformly distributed, between 0 and τ.\n\n      angle: ->\n        rand() * τ\n\nA binomial distribution.\n\n      binomial: (n=1, p=0.5) ->\n        [0...n].map ->\n          if rand() < p\n            1\n          else\n            0\n        .reduce (a, b) ->\n          a + b\n        , 0\n\nReturns a random float between two numbers.\n\n      between: (min, max) ->\n        rand() * (max - min) + min\n\nReturns random integers from [0, n) if n is given.\nOtherwise returns random float between 0 and 1.\n\n      rand: rand\n\nReturns random float from [-n / 2, n / 2] if n is given.\nOtherwise returns random float between -0.5 and 0.5.\n\n      signed: (n=1) ->\n        (n * rand()) - (n / 2)\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/random.coffee": {
              "path": "test/random.coffee",
              "content": "Random = require \"../random\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Random\", ->\n\n  test \"methods\", ->\n    [\n      \"angle\"\n      \"binomial\"\n      \"between\"\n      \"rand\"\n      \"signed\"\n    ].forEach (name) ->\n      ok(Random[name], name)\n\n  it \"should have binomial\", ->\n    result = Random.binomial()\n\n    assert result is 1 or result is 0\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.2\",\"entryPoint\":\"random\"};",
              "type": "blob"
            },
            "random": {
              "path": "random",
              "content": "(function() {\n  var Random, U, rand, standardUniformDistribution, τ;\n\n  τ = 2 * Math.PI;\n\n  U = function(min, max) {\n    return function() {\n      return Math.random() * (max - min) + min;\n    };\n  };\n\n  standardUniformDistribution = U(0, 1);\n\n  rand = function(n) {\n    if (n) {\n      return Math.floor(n * standardUniformDistribution());\n    } else {\n      return standardUniformDistribution();\n    }\n  };\n\n  module.exports = Random = {\n    angle: function() {\n      return rand() * τ;\n    },\n    binomial: function(n, p) {\n      var _i, _results;\n      if (n == null) {\n        n = 1;\n      }\n      if (p == null) {\n        p = 0.5;\n      }\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).map(function() {\n        if (rand() < p) {\n          return 1;\n        } else {\n          return 0;\n        }\n      }).reduce(function(a, b) {\n        return a + b;\n      }, 0);\n    },\n    between: function(min, max) {\n      return rand() * (max - min) + min;\n    },\n    rand: rand,\n    signed: function(n) {\n      if (n == null) {\n        n = 1;\n      }\n      return (n * rand()) - (n / 2);\n    }\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "test/random": {
              "path": "test/random",
              "content": "(function() {\n  var Random, equals, ok, test;\n\n  Random = require(\"../random\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Random\", function() {\n    test(\"methods\", function() {\n      return [\"angle\", \"binomial\", \"between\", \"rand\", \"signed\"].forEach(function(name) {\n        return ok(Random[name], name);\n      });\n    });\n    return it(\"should have binomial\", function() {\n      var result;\n      result = Random.binomial();\n      return assert(result === 1 || result === 0);\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "https://danielx.net/editor/"
          },
          "version": "0.2.2",
          "entryPoint": "random",
          "repository": {
            "branch": "v0.2.2",
            "default_branch": "master",
            "full_name": "distri/random",
            "homepage": null,
            "description": "Random generation.",
            "html_url": "https://github.com/distri/random",
            "url": "https://api.github.com/repos/distri/random",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        },
        "size": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "size\n====\n\n2d extent\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "content": "Size\n====\n\nA simple 2d extent.\n\n    Size = (width, height) ->\n      if Array.isArray(width)\n        [width, height] = width\n      else if typeof width is \"object\"\n        {width, height} = width\n\n      width: width\n      height: height\n      __proto__: Size.prototype\n\n    Size.prototype =\n      copy: ->\n        Size(this)\n\n      scale: (scalar) ->\n        Size(@width * scalar, @height * scalar)\n\n      toString: ->\n        \"Size(#{@width}, #{@height})\"\n\n      max: (otherSize) ->\n        Size(\n          Math.max(@width, otherSize.width)\n          Math.max(@height, otherSize.height)\n        )\n\n      each: (iterator) ->\n        [0...@height].forEach (y) =>\n          [0...@width].forEach (x) ->\n            iterator(x, y)\n\n      inverse: ->\n        Size(1/@width, 1/@height)\n\n    module.exports = Size\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.1.4\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/test.coffee": {
              "path": "test/test.coffee",
              "content": "Size = require \"../main\"\n\ndescribe \"Size\", ->\n  it \"should have a width and height\", ->\n    size = Size(10, 10)\n\n    assert.equal size.width, 10\n    assert.equal size.height, 10\n\n  it \"should be createable from an array\", ->\n    size = Size [5, 4]\n\n    assert.equal size.width, 5\n    assert.equal size.height, 4\n\n  it \"should be createable from an object\", ->\n    size = Size\n      width: 6\n      height: 7\n\n    assert.equal size.width, 6\n    assert.equal size.height, 7\n\n  it \"should iterate\", ->\n    size = Size(4, 5)\n    total = 0\n\n    size.each (x, y) ->\n      total += 1\n\n    assert.equal total, 20\n\n  it \"should have no iterations when empty\", ->\n    size = Size(0, 0)\n    total = 0\n\n    size.each (x, y) ->\n      total += 1\n\n    assert.equal total, 0\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var Size;\n\n  Size = function(width, height) {\n    var _ref, _ref1;\n    if (Array.isArray(width)) {\n      _ref = width, width = _ref[0], height = _ref[1];\n    } else if (typeof width === \"object\") {\n      _ref1 = width, width = _ref1.width, height = _ref1.height;\n    }\n    return {\n      width: width,\n      height: height,\n      __proto__: Size.prototype\n    };\n  };\n\n  Size.prototype = {\n    copy: function() {\n      return Size(this);\n    },\n    scale: function(scalar) {\n      return Size(this.width * scalar, this.height * scalar);\n    },\n    toString: function() {\n      return \"Size(\" + this.width + \", \" + this.height + \")\";\n    },\n    max: function(otherSize) {\n      return Size(Math.max(this.width, otherSize.width), Math.max(this.height, otherSize.height));\n    },\n    each: function(iterator) {\n      var _i, _ref, _results;\n      return (function() {\n        _results = [];\n        for (var _i = 0, _ref = this.height; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach((function(_this) {\n        return function(y) {\n          var _i, _ref, _results;\n          return (function() {\n            _results = [];\n            for (var _i = 0, _ref = _this.width; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }\n            return _results;\n          }).apply(this).forEach(function(x) {\n            return iterator(x, y);\n          });\n        };\n      })(this));\n    },\n    inverse: function() {\n      return Size(1 / this.width, 1 / this.height);\n    }\n  };\n\n  module.exports = Size;\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.1.4\"};",
              "type": "blob"
            },
            "test/test": {
              "path": "test/test",
              "content": "(function() {\n  var Size;\n\n  Size = require(\"../main\");\n\n  describe(\"Size\", function() {\n    it(\"should have a width and height\", function() {\n      var size;\n      size = Size(10, 10);\n      assert.equal(size.width, 10);\n      return assert.equal(size.height, 10);\n    });\n    it(\"should be createable from an array\", function() {\n      var size;\n      size = Size([5, 4]);\n      assert.equal(size.width, 5);\n      return assert.equal(size.height, 4);\n    });\n    it(\"should be createable from an object\", function() {\n      var size;\n      size = Size({\n        width: 6,\n        height: 7\n      });\n      assert.equal(size.width, 6);\n      return assert.equal(size.height, 7);\n    });\n    it(\"should iterate\", function() {\n      var size, total;\n      size = Size(4, 5);\n      total = 0;\n      size.each(function(x, y) {\n        return total += 1;\n      });\n      return assert.equal(total, 20);\n    });\n    return it(\"should have no iterations when empty\", function() {\n      var size, total;\n      size = Size(0, 0);\n      total = 0;\n      size.each(function(x, y) {\n        return total += 1;\n      });\n      return assert.equal(total, 0);\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://www.danielx.net/editor/"
          },
          "version": "0.1.4",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.1.4",
            "default_branch": "master",
            "full_name": "distri/size",
            "homepage": null,
            "description": "2d extent",
            "html_url": "https://github.com/distri/size",
            "url": "https://api.github.com/repos/distri/size",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    },
    "model": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "Model\n=====\n\nThe `Model` module provides helper methods to compose nested data models.\n\nModels uses [Observable](/observable/docs) to keep the internal data in sync.\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "Model\n=====\n\nThe `Model` module provides helper methods to compose nested data models.\n\nModels uses [Observable](/observable/docs) to keep the internal data in sync.\n\n    Core = require \"./core\"\n    Observable = global.Observable ? require \"observable\"\n\n    module.exports = Model = (I={}, self=Core(I)) ->\n\n      self.extend\n\nObserve any number of attributes as simple observables. For each attribute name passed in we expose a public getter/setter method and listen to changes when the value is set.\n\n        attrObservable: (names...) ->\n          names.forEach (name) ->\n            self[name] = Observable(I[name])\n\n            self[name].observe (newValue) ->\n              I[name] = newValue\n\n          return self\n\nObserve an attribute as a model. Treats the attribute given as an Observable\nmodel instance exposting a getter/setter method of the same name. The Model\nconstructor must be passed in explicitly.\n\n        attrModel: (name, Model) ->\n          model = Model(I[name])\n\n          self[name] = Observable(model)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.I\n\n          return self\n\nObserve an attribute as a list of sub-models. This is the same as `attrModel`\nexcept the attribute is expected to be an array of models rather than a single one.\n\n        attrModels: (name, Model) ->\n          models = (I[name] or []).map (x) ->\n            Model(x)\n\n          self[name] = Observable(models)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.map (instance) ->\n              instance.I\n\n          return self\n\nThe JSON representation is kept up to date via the observable properites and resides in `I`.\n\n        toJSON: ->\n          I\n\nReturn our public object.\n\n      return self\n\n    Model.Core = Core\n    Model.Observable = Observable\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.2.0-pre.2\"\ndependencies:\n  observable: \"distri/observable:v0.3.7\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/model.coffee": {
          "path": "test/model.coffee",
          "content": "Model = require \"../main\"\n\ndescribe 'Model', ->\n  # Association Testing model\n  Person = (I) ->\n    person = Model(I)\n\n    person.attrAccessor(\n      'firstName'\n      'lastName'\n      'suffix'\n    )\n\n    person.fullName = ->\n      \"#{@firstName()} #{@lastName()} #{@suffix()}\"\n\n    return person\n\n  describe \"#attrObservable\", ->\n    it 'should allow for observing of attributes', ->\n      model = Model\n        name: \"Duder\"\n\n      model.attrObservable \"name\"\n\n      model.name(\"Dudeman\")\n\n      assert.equal model.name(), \"Dudeman\"\n\n    it 'should bind properties to observable attributes', ->\n      model = Model\n        name: \"Duder\"\n\n      model.attrObservable \"name\"\n\n      model.name(\"Dudeman\")\n\n      assert.equal model.name(), \"Dudeman\"\n      assert.equal model.name(), model.I.name\n\n  describe \"#attrModel\", ->\n    it \"should be a model instance\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      assert.equal model.person().fullName(), \"Duder Mannington Jr.\"\n\n    it \"should allow setting the associated model\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      otherPerson = Person\n        firstName: \"Mr.\"\n        lastName: \"Man\"\n\n      model.person(otherPerson)\n\n      assert.equal model.person().firstName(), \"Mr.\"\n\n    it \"shouldn't update the instance properties after it's been replaced\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      duder = model.person()\n\n      otherPerson = Person\n        firstName: \"Mr.\"\n        lastName: \"Man\"\n\n      model.person(otherPerson)\n\n      duder.firstName(\"Joe\")\n\n      assert.equal duder.I.firstName, \"Joe\"\n      assert.equal model.I.person.firstName, \"Mr.\"\n\n  describe \"#attrModels\", ->\n    it \"should have an array of model instances\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      assert.equal model.people()[0].fullName(), \"Duder Mannington Jr.\"\n\n    it \"should track pushes\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      model.people.push Person\n        firstName: \"JoJo\"\n        lastName: \"Loco\"\n\n      assert.equal model.people().length, 3\n      assert.equal model.I.people.length, 3\n\n    it \"should track pops\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      model.people.pop()\n\n      assert.equal model.people().length, 1\n      assert.equal model.I.people.length, 1\n\n  describe \"#toJSON\", ->\n    it \"should return an object appropriate for JSON serialization\", ->\n      model = Model\n        test: true\n\n      assert model.toJSON().test\n\n  describe \"#observeAll\", ->\n    it \"should observe all attributes of a simple model\"\n    ->  # TODO\n      model = Model\n        test: true\n        yolo: \"4life\"\n\n      model.observeAll()\n\n      assert model.test()\n      assert.equal model.yolo(), \"4life\"\n\n    it \"should camel case underscored names\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "core.coffee.md": {
          "path": "core.coffee.md",
          "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
          "mode": "100644"
        },
        "test/core.coffee": {
          "path": "test/core.coffee",
          "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
          "mode": "100644"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var Core, Model, Observable, _ref,\n    __slice = [].slice;\n\n  Core = require(\"./core\");\n\n  Observable = (_ref = global.Observable) != null ? _ref : require(\"observable\");\n\n  module.exports = Model = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    self.extend({\n      attrObservable: function() {\n        var names;\n        names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        names.forEach(function(name) {\n          self[name] = Observable(I[name]);\n          return self[name].observe(function(newValue) {\n            return I[name] = newValue;\n          });\n        });\n        return self;\n      },\n      attrModel: function(name, Model) {\n        var model;\n        model = Model(I[name]);\n        self[name] = Observable(model);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.I;\n        });\n        return self;\n      },\n      attrModels: function(name, Model) {\n        var models;\n        models = (I[name] || []).map(function(x) {\n          return Model(x);\n        });\n        self[name] = Observable(models);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.map(function(instance) {\n            return instance.I;\n          });\n        });\n        return self;\n      },\n      toJSON: function() {\n        return I;\n      }\n    });\n    return self;\n  };\n\n  Model.Core = Core;\n\n  Model.Observable = Observable;\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.0-pre.2\",\"dependencies\":{\"observable\":\"distri/observable:v0.3.7\"}};",
          "type": "blob"
        },
        "test/model": {
          "path": "test/model",
          "content": "(function() {\n  var Model;\n\n  Model = require(\"../main\");\n\n  describe('Model', function() {\n    var Person;\n    Person = function(I) {\n      var person;\n      person = Model(I);\n      person.attrAccessor('firstName', 'lastName', 'suffix');\n      person.fullName = function() {\n        return \"\" + (this.firstName()) + \" \" + (this.lastName()) + \" \" + (this.suffix());\n      };\n      return person;\n    };\n    describe(\"#attrObservable\", function() {\n      it('should allow for observing of attributes', function() {\n        var model;\n        model = Model({\n          name: \"Duder\"\n        });\n        model.attrObservable(\"name\");\n        model.name(\"Dudeman\");\n        return assert.equal(model.name(), \"Dudeman\");\n      });\n      return it('should bind properties to observable attributes', function() {\n        var model;\n        model = Model({\n          name: \"Duder\"\n        });\n        model.attrObservable(\"name\");\n        model.name(\"Dudeman\");\n        assert.equal(model.name(), \"Dudeman\");\n        return assert.equal(model.name(), model.I.name);\n      });\n    });\n    describe(\"#attrModel\", function() {\n      it(\"should be a model instance\", function() {\n        var model;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        return assert.equal(model.person().fullName(), \"Duder Mannington Jr.\");\n      });\n      it(\"should allow setting the associated model\", function() {\n        var model, otherPerson;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        otherPerson = Person({\n          firstName: \"Mr.\",\n          lastName: \"Man\"\n        });\n        model.person(otherPerson);\n        return assert.equal(model.person().firstName(), \"Mr.\");\n      });\n      return it(\"shouldn't update the instance properties after it's been replaced\", function() {\n        var duder, model, otherPerson;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        duder = model.person();\n        otherPerson = Person({\n          firstName: \"Mr.\",\n          lastName: \"Man\"\n        });\n        model.person(otherPerson);\n        duder.firstName(\"Joe\");\n        assert.equal(duder.I.firstName, \"Joe\");\n        return assert.equal(model.I.person.firstName, \"Mr.\");\n      });\n    });\n    describe(\"#attrModels\", function() {\n      it(\"should have an array of model instances\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        return assert.equal(model.people()[0].fullName(), \"Duder Mannington Jr.\");\n      });\n      it(\"should track pushes\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        model.people.push(Person({\n          firstName: \"JoJo\",\n          lastName: \"Loco\"\n        }));\n        assert.equal(model.people().length, 3);\n        return assert.equal(model.I.people.length, 3);\n      });\n      return it(\"should track pops\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        model.people.pop();\n        assert.equal(model.people().length, 1);\n        return assert.equal(model.I.people.length, 1);\n      });\n    });\n    describe(\"#toJSON\", function() {\n      return it(\"should return an object appropriate for JSON serialization\", function() {\n        var model;\n        model = Model({\n          test: true\n        });\n        return assert(model.toJSON().test);\n      });\n    });\n    return describe(\"#observeAll\", function() {\n      it(\"should observe all attributes of a simple model\");\n      (function() {\n        var model;\n        model = Model({\n          test: true,\n          yolo: \"4life\"\n        });\n        model.observeAll();\n        assert(model.test());\n        return assert.equal(model.yolo(), \"4life\");\n      });\n      return it(\"should camel case underscored names\");\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        },
        "core": {
          "path": "core",
          "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n",
          "type": "blob"
        },
        "test/core": {
          "path": "test/core",
          "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "https://danielx.net/editor/"
      },
      "version": "0.2.0-pre.2",
      "entryPoint": "main",
      "repository": {
        "branch": "master",
        "default_branch": "master",
        "full_name": "distri/model",
        "homepage": null,
        "description": "",
        "html_url": "https://github.com/distri/model",
        "url": "https://api.github.com/repos/distri/model",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "observable": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "[![Build Status](https://travis-ci.org/distri/observable.svg?branch=npm)](https://travis-ci.org/distri/observable)\n\nObservable\n==========\n\nInstallation\n------------\n\nNode\n\n    npm install o_0\n\nUsage\n-----\n\n    Observable = require \"o_0\"\n\nGet notified when the value changes.\n\n    observable = Observable 5\n\n    observable() # 5\n\n    observable.observe (newValue) ->\n      console.log newValue\n\n    observable 10 # logs 10 to console\n\nArrays\n------\n\nProxy array methods.\n\n    observable = Observable [1, 2, 3]\n\n    observable.forEach (value) ->\n      # 1, 2, 3\n\nFunctions\n---------\n\nAutomagically compute dependencies for observable functions.\n\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n    lastName \"Bro\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value, context) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        copy(listeners).forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n\nOur return function is a function that holds only a cached value which is updated\nwhen it's dependencies change.\n\nThe `magicDependency` call is so other functions can depend on this computed function the\nsame way we depend on other types of observables.\n\n        self = ->\n          # Automagic dependency observation\n          magicDependency(self)\n\n          return value\n\n        changed = ->\n          value = computeDependencies(self, fn, changed, context)\n          notify(value)\n\n        changed()\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            magicDependency(self)\n\n          return value\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (callback) ->\n        magicDependency(self)\n\n        if value?\n          [value].forEach (item) ->\n            callback.call(item, item)\n\n        return self\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            magicDependency(self)\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        try # Provide length on a best effort basis because older browsers choke\n          Object.defineProperty self, 'length',\n            get: ->\n              magicDependency(self)\n              value.length\n            set: (length) ->\n              value.length = length\n              notifyReturning(value.length)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (callback) ->\n            self.forEach (item, index) ->\n              callback.call(item, item, index, self)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            magicDependency(self)\n            value[index]\n\n          first: ->\n            magicDependency(self)\n            value[0]\n\n          last: ->\n            magicDependency(self)\n            value[value.length-1]\n\n          size: ->\n            magicDependency(self)\n            value.length\n\n      extend self,\n        listeners: listeners\n\n        observe: (listener) ->\n          listeners.push listener\n\n        stopObserving: (fn) ->\n          remove listeners, fn\n\n        toggle: ->\n          self !value\n\n        increment: (n) ->\n          self value + n\n\n        decrement: (n) ->\n          self value - n\n\n        toString: ->\n          \"Observable(#{value})\"\n\n      return self\n\n    Observable.concat = (args...) ->\n      args = Observable(args)\n\n      o = Observable ->\n        flatten args.map(splat)\n\n      o.push = args.push\n\n      return o\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nSuper hax for computing dependencies. This needs to be a shared global so that\ndifferent bundled versions of observable libraries can interoperate.\n\n    global.OBSERVABLE_ROOT_HACK = []\n\n    magicDependency = (self) ->\n      observerSet = last(global.OBSERVABLE_ROOT_HACK)\n      if observerSet\n        observerSet.add self\n\nAutomagically compute dependencies.\n\n    computeDependencies = (self, fn, update, context) ->\n      deps = new Set\n\n      global.OBSERVABLE_ROOT_HACK.push(deps)\n\n      try\n        value = fn.call(context)\n      finally\n        global.OBSERVABLE_ROOT_HACK.pop()\n\n      self._deps?.forEach (observable) ->\n        observable.stopObserving update\n\n      self._deps = deps\n\n      deps.forEach (observable) ->\n        observable.observe update\n\n      return value\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n\n    copy = (array) ->\n      array.concat([])\n\n    get = (arg) ->\n      if typeof arg is \"function\"\n        arg()\n      else\n        arg\n\n    splat = (item) ->\n      results = []\n\n      return results unless item?\n\n      if typeof item.forEach is \"function\"\n        item.forEach (i) ->\n          results.push i\n      else\n        result = get item\n\n        results.push result if result?\n\n      results\n\n    last = (array) ->\n      array[array.length - 1]\n\n    flatten = (array) ->\n      array.reduce (a, b) ->\n        a.concat(b)\n      , []\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.3.7\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/observable.coffee": {
              "path": "test/observable.coffee",
              "content": "global.Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it \"should not fire when setting to the same value\", ->\n    o = Observable 5\n\n    o.observe ->\n      assert false\n\n    o(5)\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n    it \"should have the correct `this` scope for items\", (done) ->\n      o = Observable 5\n\n      o.each ->\n        assert.equal this, 5\n        done()\n\n    it \"should have the correct `this` scope for items in observable arrays\", ->\n      scopes = []\n\n      o = Observable [\"I'm\", \"an\", \"array\"]\n\n      o.each ->\n        scopes.push this\n\n      assert.equal scopes[0], \"I'm\"\n      assert.equal scopes[1], \"an\"\n      assert.equal scopes[2], \"array\"\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\n  it \"should increment\", ->\n    observable = Observable 1\n\n    observable.increment(5)\n\n    assert.equal observable(), 6\n\n  it \"should decremnet\", ->\n    observable = Observable 1\n\n    observable.decrement 5\n\n    assert.equal observable(), -4\n\n  it \"should toggle\", ->\n    observable = Observable false\n\n    observable.toggle()\n    assert.equal observable(), true\n\n    observable.toggle()\n    assert.equal observable(), false\n\n  it \"should trigger when toggling\", (done) ->\n    observable = Observable true\n    observable.observe (v) ->\n      assert.equal v, false\n      done()\n\n    observable.toggle()\n\n  it \"should have a nice toString\", ->\n    observable = Observable 5\n\n    assert.equal observable.toString(), \"Observable(5)\"\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  it \"#remove non-existent element\", ->\n    o = Observable [1, 2, 3]\n\n    assert.equal o.remove(0), undefined\n\n  it \"should proxy the length property\", ->\n    o = Observable [1, 2, 3]\n\n    assert.equal o.length, 3\n\n    called = false\n    o.observe (value) ->\n      assert.equal value[0], 1\n      assert.equal value[1], undefined\n      called = true\n\n    o.length = 1\n    assert.equal o.length, 1\n    assert.equal called, true\n\n  it \"should auto detect conditionals of length as a dependency\", ->\n    observableArray = Observable [1, 2, 3]\n\n    o = Observable ->\n      if observableArray.length > 5\n        true\n      else\n        false\n\n    assert.equal o(), false\n\n    called = 0\n    o.observe ->\n      called += 1\n\n    observableArray.push 4, 5, 6\n\n    assert.equal called, 1\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should compute array#get as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.get(0)\n\n    assert.equal observableFn(), 0\n\n    observableArray([5])\n\n    assert.equal observableFn(), 5\n\n  it \"should compute array#first as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.first() + 1\n\n    assert.equal observableFn(), 1\n\n    observableArray([5])\n\n    assert.equal observableFn(), 6\n\n  it \"should compute array#last as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.last()\n\n    assert.equal observableFn(), 2\n\n    observableArray.pop()\n\n    assert.equal observableFn(), 1\n\n    observableArray([5])\n\n    assert.equal observableFn(), 5\n\n  it \"should compute array#size as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.size() * 2\n\n    assert.equal observableFn(), 6\n\n    observableArray.pop()\n    assert.equal observableFn(), 4\n    observableArray.shift()\n    assert.equal observableFn(), 2\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should work with dynamic dependencies\", ->\n    observableArray = Observable []\n\n    dynamicObservable = Observable ->\n      observableArray.filter (item) ->\n        item.age() > 3\n\n    assert.equal dynamicObservable().length, 0\n\n    observableArray.push\n      age: Observable 1\n\n    observableArray()[0].age 5\n    assert.equal dynamicObservable().length, 1\n\n  it \"should work with context\", ->\n    model =\n      a: Observable \"Hello\"\n      b: Observable \"there\"\n\n    model.c = Observable ->\n      \"#{@a()} #{@b()}\"\n    , model\n\n    assert.equal model.c(), \"Hello there\"\n\n    model.b \"world\"\n\n    assert.equal model.c(), \"Hello world\"\n\n  it \"should be ok even if the function throws an exception\", ->\n    assert.throws ->\n      t = Observable ->\n        throw \"wat\"\n\n    # TODO: Should be able to find a test case that is affected by this rather that\n    # checking it directly\n    assert.equal global.OBSERVABLE_ROOT_HACK.length, 0\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each()\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n\n  it \"should work on an array dependency\", ->\n    oA = Observable [1, 2, 3]\n\n    o = Observable ->\n      oA()[0]\n\n    last = Observable ->\n      oA()[oA().length-1]\n\n    assert.equal o(), 1\n\n    oA.unshift 0\n\n    assert.equal o(), 0\n\n    oA.push 4\n\n    assert.equal last(), 4, \"Last should be 4\"\n\n  it \"should work with multiple dependencies\", ->\n    letter = Observable \"A\"\n    checked = ->\n      l = letter()\n      @name().indexOf(l) is 0\n\n    first = {name: Observable(\"Andrew\")}\n    first.checked = Observable checked, first\n\n    second = {name: Observable(\"Benjamin\")}\n    second.checked = Observable checked, second\n\n    assert.equal first.checked(), true\n    assert.equal second.checked(), false\n\n    assert.equal letter.listeners.length, 2\n\n    letter \"B\"\n\n    assert.equal first.checked(), false\n    assert.equal second.checked(), true\n\n  it \"shouldn't double count dependencies\", ->\n    dep = Observable \"yo\"\n\n    o = Observable ->\n      dep()\n      dep()\n      dep()\n\n    count = 0\n    o.observe ->\n      count += 1\n\n    dep('heyy')\n\n    assert.equal count, 1\n\n  it \"should work with nested observable construction\", ->\n    gen = Observable ->\n      Observable \"Duder\"\n\n    o = gen()\n\n    assert.equal o(), \"Duder\"\n\n    o(\"wat\")\n\n    assert.equal o(), \"wat\"\n\n  describe \"Scoping\", ->\n    it \"should be scoped to optional context\", (done) ->\n      model =\n        firstName: Observable \"Duder\"\n        lastName: Observable \"Man\"\n\n      model.name = Observable ->\n        \"#{@firstName()} #{@lastName()}\"\n      , model\n\n      model.name.observe (newValue) ->\n        assert.equal newValue, \"Duder Bro\"\n\n        done()\n\n      model.lastName \"Bro\"\n\n  describe \"concat\", ->\n    it \"should work with a single observable\", ->\n      observable = Observable \"something\"\n      observableArray = Observable.concat observable\n      assert.equal observableArray.last(), \"something\"\n\n      observable \"something else\"\n      assert.equal observableArray.last(), \"something else\"\n\n    it \"should work with an undefined observable\", ->\n      observable = Observable undefined\n      observableArray = Observable.concat observable\n      assert.equal observableArray.size(), 0\n\n      observable \"defined\"\n      assert.equal observableArray.size(), 1\n\n    it \"should work with undefined\", ->\n      observableArray = Observable.concat undefined\n      assert.equal observableArray.size(), 0\n\n    it \"should work with []\", ->\n      observableArray = Observable.concat []\n      assert.equal observableArray.size(), 0\n\n    it \"should return an observable array that changes based on changes in inputs\", ->\n      numbers = Observable [1, 2, 3]\n      letters = Observable [\"a\", \"b\", \"c\"]\n      item = Observable({})\n      nullable = Observable null\n\n      observableArray = Observable.concat numbers, \"literal\", letters, item, nullable\n\n      assert.equal observableArray().length, 3 + 1 + 3 + 1\n\n      assert.equal observableArray()[0], 1\n      assert.equal observableArray()[3], \"literal\"\n      assert.equal observableArray()[4], \"a\"\n      assert.equal observableArray()[7], item()\n\n      numbers.push 4\n\n      assert.equal observableArray().length, 9\n\n      nullable \"cool\"\n\n      assert.equal observableArray().length, 10\n\n    it \"should work with observable functions that return arrays\", ->\n      item = Observable(\"wat\")\n\n      computedArray = Observable ->\n        [item()]\n\n      observableArray = Observable.concat computedArray, computedArray\n\n      assert.equal observableArray().length, 2\n\n      assert.equal observableArray()[1], \"wat\"\n\n      item \"yolo\"\n\n      assert.equal observableArray()[1], \"yolo\"\n\n    it \"should have a push method\", ->\n      observableArray = Observable.concat()\n\n      observable = Observable \"hey\"\n\n      observableArray.push observable\n\n      assert.equal observableArray()[0], \"hey\"\n\n      observable \"wat\"\n\n      assert.equal observableArray()[0], \"wat\"\n\n      observableArray.push \"cool\"\n      observableArray.push \"radical\"\n\n      assert.equal observableArray().length, 3\n\n    it \"should be observable\", (done) ->\n      observableArray = Observable.concat()\n\n      observableArray.observe (items) ->\n        assert.equal items.length, 3\n        done()\n\n      observableArray.push [\"A\", \"B\", \"C\"]\n\n    it \"should have an each method\", ->\n      observableArray = Observable.concat([\"A\", \"B\", \"C\"])\n\n      n = 0\n      observableArray.each () ->\n        n += 1\n\n      assert.equal n, 3\n\n  describe \"nesting dependencies\", ->\n    it \"should update the correct observable\", ->\n      a = Observable \"a\"\n      b = Observable \"b\"\n\n      results = Observable ->\n        r = Observable.concat()\n\n        r.push a\n        r.push b\n\n        r\n\n      # TODO: Should this just be\n      #     results.first()\n      assert.equal results().first(), \"a\"\n\n      a(\"newA\")\n\n      assert.equal results().first(), \"newA\"\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var Observable, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat,\n    __slice = [].slice;\n\n  Observable = function(value, context) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return copy(listeners).forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      changed = function() {\n        value = computeDependencies(self, fn, changed, context);\n        return notify(value);\n      };\n      changed();\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n    }\n    self.each = function(callback) {\n      magicDependency(self);\n      if (value != null) {\n        [value].forEach(function(item) {\n          return callback.call(item, item);\n        });\n      }\n      return self;\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          magicDependency(self);\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      try {\n        Object.defineProperty(self, 'length', {\n          get: function() {\n            magicDependency(self);\n            return value.length;\n          },\n          set: function(length) {\n            value.length = length;\n            return notifyReturning(value.length);\n          }\n        });\n      } catch (_error) {}\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function(callback) {\n          self.forEach(function(item, index) {\n            return callback.call(item, item, index, self);\n          });\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          magicDependency(self);\n          return value[index];\n        },\n        first: function() {\n          magicDependency(self);\n          return value[0];\n        },\n        last: function() {\n          magicDependency(self);\n          return value[value.length - 1];\n        },\n        size: function() {\n          magicDependency(self);\n          return value.length;\n        }\n      });\n    }\n    extend(self, {\n      listeners: listeners,\n      observe: function(listener) {\n        return listeners.push(listener);\n      },\n      stopObserving: function(fn) {\n        return remove(listeners, fn);\n      },\n      toggle: function() {\n        return self(!value);\n      },\n      increment: function(n) {\n        return self(value + n);\n      },\n      decrement: function(n) {\n        return self(value - n);\n      },\n      toString: function() {\n        return \"Observable(\" + value + \")\";\n      }\n    });\n    return self;\n  };\n\n  Observable.concat = function() {\n    var args, o;\n    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    args = Observable(args);\n    o = Observable(function() {\n      return flatten(args.map(splat));\n    });\n    o.push = args.push;\n    return o;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = [];\n\n  magicDependency = function(self) {\n    var observerSet;\n    observerSet = last(global.OBSERVABLE_ROOT_HACK);\n    if (observerSet) {\n      return observerSet.add(self);\n    }\n  };\n\n  computeDependencies = function(self, fn, update, context) {\n    var deps, value, _ref;\n    deps = new Set;\n    global.OBSERVABLE_ROOT_HACK.push(deps);\n    try {\n      value = fn.call(context);\n    } finally {\n      global.OBSERVABLE_ROOT_HACK.pop();\n    }\n    if ((_ref = self._deps) != null) {\n      _ref.forEach(function(observable) {\n        return observable.stopObserving(update);\n      });\n    }\n    self._deps = deps;\n    deps.forEach(function(observable) {\n      return observable.observe(update);\n    });\n    return value;\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n  copy = function(array) {\n    return array.concat([]);\n  };\n\n  get = function(arg) {\n    if (typeof arg === \"function\") {\n      return arg();\n    } else {\n      return arg;\n    }\n  };\n\n  splat = function(item) {\n    var result, results;\n    results = [];\n    if (item == null) {\n      return results;\n    }\n    if (typeof item.forEach === \"function\") {\n      item.forEach(function(i) {\n        return results.push(i);\n      });\n    } else {\n      result = get(item);\n      if (result != null) {\n        results.push(result);\n      }\n    }\n    return results;\n  };\n\n  last = function(array) {\n    return array[array.length - 1];\n  };\n\n  flatten = function(array) {\n    return array.reduce(function(a, b) {\n      return a.concat(b);\n    }, []);\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.3.7\"};",
              "type": "blob"
            },
            "test/observable": {
              "path": "test/observable",
              "content": "(function() {\n  global.Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it(\"should not fire when setting to the same value\", function() {\n      var o;\n      o = Observable(5);\n      o.observe(function() {\n        return assert(false);\n      });\n      return o(5);\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n      it(\"should have the correct `this` scope for items\", function(done) {\n        var o;\n        o = Observable(5);\n        return o.each(function() {\n          assert.equal(this, 5);\n          return done();\n        });\n      });\n      return it(\"should have the correct `this` scope for items in observable arrays\", function() {\n        var o, scopes;\n        scopes = [];\n        o = Observable([\"I'm\", \"an\", \"array\"]);\n        o.each(function() {\n          return scopes.push(this);\n        });\n        assert.equal(scopes[0], \"I'm\");\n        assert.equal(scopes[1], \"an\");\n        return assert.equal(scopes[2], \"array\");\n      });\n    });\n    it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n    it(\"should increment\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.increment(5);\n      return assert.equal(observable(), 6);\n    });\n    it(\"should decremnet\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.decrement(5);\n      return assert.equal(observable(), -4);\n    });\n    it(\"should toggle\", function() {\n      var observable;\n      observable = Observable(false);\n      observable.toggle();\n      assert.equal(observable(), true);\n      observable.toggle();\n      return assert.equal(observable(), false);\n    });\n    it(\"should trigger when toggling\", function(done) {\n      var observable;\n      observable = Observable(true);\n      observable.observe(function(v) {\n        assert.equal(v, false);\n        return done();\n      });\n      return observable.toggle();\n    });\n    return it(\"should have a nice toString\", function() {\n      var observable;\n      observable = Observable(5);\n      return assert.equal(observable.toString(), \"Observable(5)\");\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    it(\"#remove non-existent element\", function() {\n      var o;\n      o = Observable([1, 2, 3]);\n      return assert.equal(o.remove(0), void 0);\n    });\n    it(\"should proxy the length property\", function() {\n      var called, o;\n      o = Observable([1, 2, 3]);\n      assert.equal(o.length, 3);\n      called = false;\n      o.observe(function(value) {\n        assert.equal(value[0], 1);\n        assert.equal(value[1], void 0);\n        return called = true;\n      });\n      o.length = 1;\n      assert.equal(o.length, 1);\n      return assert.equal(called, true);\n    });\n    return it(\"should auto detect conditionals of length as a dependency\", function() {\n      var called, o, observableArray;\n      observableArray = Observable([1, 2, 3]);\n      o = Observable(function() {\n        if (observableArray.length > 5) {\n          return true;\n        } else {\n          return false;\n        }\n      });\n      assert.equal(o(), false);\n      called = 0;\n      o.observe(function() {\n        return called += 1;\n      });\n      observableArray.push(4, 5, 6);\n      return assert.equal(called, 1);\n    });\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should compute array#get as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.get(0);\n      });\n      assert.equal(observableFn(), 0);\n      observableArray([5]);\n      return assert.equal(observableFn(), 5);\n    });\n    it(\"should compute array#first as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.first() + 1;\n      });\n      assert.equal(observableFn(), 1);\n      observableArray([5]);\n      return assert.equal(observableFn(), 6);\n    });\n    it(\"should compute array#last as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.last();\n      });\n      assert.equal(observableFn(), 2);\n      observableArray.pop();\n      assert.equal(observableFn(), 1);\n      observableArray([5]);\n      return assert.equal(observableFn(), 5);\n    });\n    it(\"should compute array#size as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.size() * 2;\n      });\n      assert.equal(observableFn(), 6);\n      observableArray.pop();\n      assert.equal(observableFn(), 4);\n      observableArray.shift();\n      return assert.equal(observableFn(), 2);\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should work with dynamic dependencies\", function() {\n      var dynamicObservable, observableArray;\n      observableArray = Observable([]);\n      dynamicObservable = Observable(function() {\n        return observableArray.filter(function(item) {\n          return item.age() > 3;\n        });\n      });\n      assert.equal(dynamicObservable().length, 0);\n      observableArray.push({\n        age: Observable(1)\n      });\n      observableArray()[0].age(5);\n      return assert.equal(dynamicObservable().length, 1);\n    });\n    it(\"should work with context\", function() {\n      var model;\n      model = {\n        a: Observable(\"Hello\"),\n        b: Observable(\"there\")\n      };\n      model.c = Observable(function() {\n        return \"\" + (this.a()) + \" \" + (this.b());\n      }, model);\n      assert.equal(model.c(), \"Hello there\");\n      model.b(\"world\");\n      return assert.equal(model.c(), \"Hello world\");\n    });\n    it(\"should be ok even if the function throws an exception\", function() {\n      assert.throws(function() {\n        var t;\n        return t = Observable(function() {\n          throw \"wat\";\n        });\n      });\n      return assert.equal(global.OBSERVABLE_ROOT_HACK.length, 0);\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each());\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n    it(\"should work on an array dependency\", function() {\n      var last, o, oA;\n      oA = Observable([1, 2, 3]);\n      o = Observable(function() {\n        return oA()[0];\n      });\n      last = Observable(function() {\n        return oA()[oA().length - 1];\n      });\n      assert.equal(o(), 1);\n      oA.unshift(0);\n      assert.equal(o(), 0);\n      oA.push(4);\n      return assert.equal(last(), 4, \"Last should be 4\");\n    });\n    it(\"should work with multiple dependencies\", function() {\n      var checked, first, letter, second;\n      letter = Observable(\"A\");\n      checked = function() {\n        var l;\n        l = letter();\n        return this.name().indexOf(l) === 0;\n      };\n      first = {\n        name: Observable(\"Andrew\")\n      };\n      first.checked = Observable(checked, first);\n      second = {\n        name: Observable(\"Benjamin\")\n      };\n      second.checked = Observable(checked, second);\n      assert.equal(first.checked(), true);\n      assert.equal(second.checked(), false);\n      assert.equal(letter.listeners.length, 2);\n      letter(\"B\");\n      assert.equal(first.checked(), false);\n      return assert.equal(second.checked(), true);\n    });\n    it(\"shouldn't double count dependencies\", function() {\n      var count, dep, o;\n      dep = Observable(\"yo\");\n      o = Observable(function() {\n        dep();\n        dep();\n        return dep();\n      });\n      count = 0;\n      o.observe(function() {\n        return count += 1;\n      });\n      dep('heyy');\n      return assert.equal(count, 1);\n    });\n    it(\"should work with nested observable construction\", function() {\n      var gen, o;\n      gen = Observable(function() {\n        return Observable(\"Duder\");\n      });\n      o = gen();\n      assert.equal(o(), \"Duder\");\n      o(\"wat\");\n      return assert.equal(o(), \"wat\");\n    });\n    describe(\"Scoping\", function() {\n      return it(\"should be scoped to optional context\", function(done) {\n        var model;\n        model = {\n          firstName: Observable(\"Duder\"),\n          lastName: Observable(\"Man\")\n        };\n        model.name = Observable(function() {\n          return \"\" + (this.firstName()) + \" \" + (this.lastName());\n        }, model);\n        model.name.observe(function(newValue) {\n          assert.equal(newValue, \"Duder Bro\");\n          return done();\n        });\n        return model.lastName(\"Bro\");\n      });\n    });\n    describe(\"concat\", function() {\n      it(\"should work with a single observable\", function() {\n        var observable, observableArray;\n        observable = Observable(\"something\");\n        observableArray = Observable.concat(observable);\n        assert.equal(observableArray.last(), \"something\");\n        observable(\"something else\");\n        return assert.equal(observableArray.last(), \"something else\");\n      });\n      it(\"should work with an undefined observable\", function() {\n        var observable, observableArray;\n        observable = Observable(void 0);\n        observableArray = Observable.concat(observable);\n        assert.equal(observableArray.size(), 0);\n        observable(\"defined\");\n        return assert.equal(observableArray.size(), 1);\n      });\n      it(\"should work with undefined\", function() {\n        var observableArray;\n        observableArray = Observable.concat(void 0);\n        return assert.equal(observableArray.size(), 0);\n      });\n      it(\"should work with []\", function() {\n        var observableArray;\n        observableArray = Observable.concat([]);\n        return assert.equal(observableArray.size(), 0);\n      });\n      it(\"should return an observable array that changes based on changes in inputs\", function() {\n        var item, letters, nullable, numbers, observableArray;\n        numbers = Observable([1, 2, 3]);\n        letters = Observable([\"a\", \"b\", \"c\"]);\n        item = Observable({});\n        nullable = Observable(null);\n        observableArray = Observable.concat(numbers, \"literal\", letters, item, nullable);\n        assert.equal(observableArray().length, 3 + 1 + 3 + 1);\n        assert.equal(observableArray()[0], 1);\n        assert.equal(observableArray()[3], \"literal\");\n        assert.equal(observableArray()[4], \"a\");\n        assert.equal(observableArray()[7], item());\n        numbers.push(4);\n        assert.equal(observableArray().length, 9);\n        nullable(\"cool\");\n        return assert.equal(observableArray().length, 10);\n      });\n      it(\"should work with observable functions that return arrays\", function() {\n        var computedArray, item, observableArray;\n        item = Observable(\"wat\");\n        computedArray = Observable(function() {\n          return [item()];\n        });\n        observableArray = Observable.concat(computedArray, computedArray);\n        assert.equal(observableArray().length, 2);\n        assert.equal(observableArray()[1], \"wat\");\n        item(\"yolo\");\n        return assert.equal(observableArray()[1], \"yolo\");\n      });\n      it(\"should have a push method\", function() {\n        var observable, observableArray;\n        observableArray = Observable.concat();\n        observable = Observable(\"hey\");\n        observableArray.push(observable);\n        assert.equal(observableArray()[0], \"hey\");\n        observable(\"wat\");\n        assert.equal(observableArray()[0], \"wat\");\n        observableArray.push(\"cool\");\n        observableArray.push(\"radical\");\n        return assert.equal(observableArray().length, 3);\n      });\n      it(\"should be observable\", function(done) {\n        var observableArray;\n        observableArray = Observable.concat();\n        observableArray.observe(function(items) {\n          assert.equal(items.length, 3);\n          return done();\n        });\n        return observableArray.push([\"A\", \"B\", \"C\"]);\n      });\n      return it(\"should have an each method\", function() {\n        var n, observableArray;\n        observableArray = Observable.concat([\"A\", \"B\", \"C\"]);\n        n = 0;\n        observableArray.each(function() {\n          return n += 1;\n        });\n        return assert.equal(n, 3);\n      });\n    });\n    return describe(\"nesting dependencies\", function() {\n      return it(\"should update the correct observable\", function() {\n        var a, b, results;\n        a = Observable(\"a\");\n        b = Observable(\"b\");\n        results = Observable(function() {\n          var r;\n          r = Observable.concat();\n          r.push(a);\n          r.push(b);\n          return r;\n        });\n        assert.equal(results().first(), \"a\");\n        a(\"newA\");\n        return assert.equal(results().first(), \"newA\");\n      });\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "https://danielx.net/editor/"
          },
          "version": "0.3.7",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.3.7",
            "default_branch": "master",
            "full_name": "distri/observable",
            "homepage": "http://observable.us",
            "description": "",
            "html_url": "https://github.com/distri/observable",
            "url": "https://api.github.com/repos/distri/observable",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    },
    "touch-canvas": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "touch-canvas\n============\n\nA canvas you can touch\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "entryPoint: \"touch_canvas\"\nversion: \"0.3.1\"\ndependencies:\n  \"bindable\": \"distri/bindable:v0.1.0\"\n  \"core\": \"distri/core:v0.6.0\"\n  \"pixie-canvas\": \"distri/pixie-canvas:v0.9.2\"\n",
          "type": "blob"
        },
        "touch_canvas.coffee.md": {
          "path": "touch_canvas.coffee.md",
          "mode": "100644",
          "content": "Touch Canvas\n============\n\nDemo\n----\n\n>     #! demo\n>     paint = (position) ->\n>       x = position.x * canvas.width()\n>       y = position.y * canvas.height()\n>\n>       canvas.drawCircle\n>         radius: 10\n>         color: \"red\"\n>         position:\n>           x: x\n>           y: y\n>\n>     canvas.on \"touch\", (p) ->\n>       paint(p)\n>\n>     canvas.on \"move\", (p) ->\n>       paint(p)\n\n----\n\nImplementation\n--------------\n\nA canvas element that reports mouse and touch events in the range [0, 1].\n\n    Bindable = require \"bindable\"\n    Core = require \"core\"\n    PixieCanvas = require \"pixie-canvas\"\n\nA number really close to 1. We should never actually return 1, but move events\nmay get a little fast and loose with exiting the canvas, so let's play it safe.\n\n    MAX = 0.999999999999\n\n    TouchCanvas = (I={}) ->\n      self = PixieCanvas I\n\n      Core(I, self)\n\n      self.include Bindable\n\n      element = self.element()\n\n      # Keep track of if the mouse is active in the element\n      active = false\n\nWhen we click within the canvas set the value for the position we clicked at.\n\n      listen element, \"mousedown\", (e) ->\n        active = true\n\n        self.trigger \"touch\", localPosition(e)\n\nHandle touch starts\n\n      listen element, \"touchstart\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"touch\", localPosition(touch)\n\nWhen the mouse moves apply a change for each x value in the intervening positions.\n\n      listen element, \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle moves outside of the element.\n\n      listen document, \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle touch moves.\n\n      listen element, \"touchmove\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"move\", localPosition(touch)\n\nHandle releases.\n\n      listen element, \"mouseup\", (e) ->\n        self.trigger \"release\", localPosition(e)\n        active = false\n\n        return\n\nHandle touch ends.\n\n      listen element, \"touchend\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"release\", localPosition(touch)\n\nWhenever the mouse button is released from anywhere, deactivate. Be sure to\ntrigger the release event if the mousedown started within the element.\n\n      listen document, \"mouseup\", (e) ->\n        if active\n          self.trigger \"release\", localPosition(e)\n\n        active = false\n\n        return\n\nHelpers\n-------\n\nProcess touches\n\n      processTouches = (event, fn) ->\n        event.preventDefault()\n\n        if event.type is \"touchend\"\n          # touchend doesn't have any touches, but does have changed touches\n          touches = event.changedTouches\n        else\n          touches = event.touches\n\n        self.debug? Array::map.call touches, ({identifier, pageX, pageY}) ->\n          \"[#{identifier}: #{pageX}, #{pageY} (#{event.type})]\\n\"\n\n        Array::forEach.call touches, fn\n\nLocal event position.\n\n      localPosition = (e) ->\n        rect = element.getBoundingClientRect()\n\n        point =\n          x: clamp (e.pageX - rect.left) / rect.width, 0, MAX\n          y: clamp (e.pageY - rect.top) / rect.height, 0, MAX\n\n        # Add mouse into touch identifiers as 0\n        point.identifier = (e.identifier + 1) or 0\n\n        return point\n\nReturn self\n\n      return self\n\nAttach an event listener to an element\n\n    listen = (element, event, handler) ->\n      element.addEventListener(event, handler, false)\n\nClamp a number to be within a range.\n\n    clamp = (number, min, max) ->\n      Math.min(Math.max(number, min), max)\n\nExport\n\n    module.exports = TouchCanvas\n\nInteractive Examples\n--------------------\n\n>     #! setup\n>     TouchCanvas = require \"/touch_canvas\"\n>\n>     Interactive.register \"demo\", ({source, runtimeElement}) ->\n>       canvas = TouchCanvas\n>         width: 400\n>         height: 200\n>\n>       code = CoffeeScript.compile(source)\n>\n>       runtimeElement.empty().append canvas.element()\n>       Function(\"canvas\", code)(canvas)\n",
          "type": "blob"
        },
        "test/touch.coffee": {
          "path": "test/touch.coffee",
          "mode": "100644",
          "content": "TouchCanvas = require \"../touch_canvas\"\n\nextend = (target, sources...) ->\n  for source in sources\n    for name of source\n      target[name] = source[name]\n\n  return target\n\nfireEvent = (element, type, params={}) ->\n  event = document.createEvent(\"Events\")\n  event.initEvent type, true, false\n  extend event, params\n  element.dispatchEvent event\n\ndescribe \"TouchCanvas\", ->\n  it \"should be creatable\", ->\n    c = TouchCanvas()\n    assert c\n\n    document.body.appendChild(c.element())\n  \n  it \"should fire events\", (done) ->\n    canvas = TouchCanvas()\n\n    canvas.on \"touch\", (e) ->\n      done()\n\n    fireEvent canvas.element(), \"mousedown\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"entryPoint\":\"touch_canvas\",\"version\":\"0.3.1\",\"dependencies\":{\"bindable\":\"distri/bindable:v0.1.0\",\"core\":\"distri/core:v0.6.0\",\"pixie-canvas\":\"distri/pixie-canvas:v0.9.2\"}};",
          "type": "blob"
        },
        "touch_canvas": {
          "path": "touch_canvas",
          "content": "(function() {\n  var Bindable, Core, MAX, PixieCanvas, TouchCanvas, clamp, listen;\n\n  Bindable = require(\"bindable\");\n\n  Core = require(\"core\");\n\n  PixieCanvas = require(\"pixie-canvas\");\n\n  MAX = 0.999999999999;\n\n  TouchCanvas = function(I) {\n    var active, element, localPosition, processTouches, self;\n    if (I == null) {\n      I = {};\n    }\n    self = PixieCanvas(I);\n    Core(I, self);\n    self.include(Bindable);\n    element = self.element();\n    active = false;\n    listen(element, \"mousedown\", function(e) {\n      active = true;\n      return self.trigger(\"touch\", localPosition(e));\n    });\n    listen(element, \"touchstart\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"touch\", localPosition(touch));\n      });\n    });\n    listen(element, \"mousemove\", function(e) {\n      if (active) {\n        return self.trigger(\"move\", localPosition(e));\n      }\n    });\n    listen(document, \"mousemove\", function(e) {\n      if (active) {\n        return self.trigger(\"move\", localPosition(e));\n      }\n    });\n    listen(element, \"touchmove\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"move\", localPosition(touch));\n      });\n    });\n    listen(element, \"mouseup\", function(e) {\n      self.trigger(\"release\", localPosition(e));\n      active = false;\n    });\n    listen(element, \"touchend\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"release\", localPosition(touch));\n      });\n    });\n    listen(document, \"mouseup\", function(e) {\n      if (active) {\n        self.trigger(\"release\", localPosition(e));\n      }\n      active = false;\n    });\n    processTouches = function(event, fn) {\n      var touches;\n      event.preventDefault();\n      if (event.type === \"touchend\") {\n        touches = event.changedTouches;\n      } else {\n        touches = event.touches;\n      }\n      if (typeof self.debug === \"function\") {\n        self.debug(Array.prototype.map.call(touches, function(_arg) {\n          var identifier, pageX, pageY;\n          identifier = _arg.identifier, pageX = _arg.pageX, pageY = _arg.pageY;\n          return \"[\" + identifier + \": \" + pageX + \", \" + pageY + \" (\" + event.type + \")]\\n\";\n        }));\n      }\n      return Array.prototype.forEach.call(touches, fn);\n    };\n    localPosition = function(e) {\n      var point, rect;\n      rect = element.getBoundingClientRect();\n      point = {\n        x: clamp((e.pageX - rect.left) / rect.width, 0, MAX),\n        y: clamp((e.pageY - rect.top) / rect.height, 0, MAX)\n      };\n      point.identifier = (e.identifier + 1) || 0;\n      return point;\n    };\n    return self;\n  };\n\n  listen = function(element, event, handler) {\n    return element.addEventListener(event, handler, false);\n  };\n\n  clamp = function(number, min, max) {\n    return Math.min(Math.max(number, min), max);\n  };\n\n  module.exports = TouchCanvas;\n\n}).call(this);\n\n//# sourceURL=touch_canvas.coffee",
          "type": "blob"
        },
        "test/touch": {
          "path": "test/touch",
          "content": "(function() {\n  var TouchCanvas, extend, fireEvent,\n    __slice = [].slice;\n\n  TouchCanvas = require(\"../touch_canvas\");\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  fireEvent = function(element, type, params) {\n    var event;\n    if (params == null) {\n      params = {};\n    }\n    event = document.createEvent(\"Events\");\n    event.initEvent(type, true, false);\n    extend(event, params);\n    return element.dispatchEvent(event);\n  };\n\n  describe(\"TouchCanvas\", function() {\n    it(\"should be creatable\", function() {\n      var c;\n      c = TouchCanvas();\n      assert(c);\n      return document.body.appendChild(c.element());\n    });\n    return it(\"should fire events\", function(done) {\n      var canvas;\n      canvas = TouchCanvas();\n      canvas.on(\"touch\", function(e) {\n        return done();\n      });\n      return fireEvent(canvas.element(), \"mousedown\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/touch.coffee",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.3.1",
      "entryPoint": "touch_canvas",
      "repository": {
        "id": 13783983,
        "name": "touch-canvas",
        "full_name": "distri/touch-canvas",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/touch-canvas",
        "description": "A canvas you can touch",
        "fork": false,
        "url": "https://api.github.com/repos/distri/touch-canvas",
        "forks_url": "https://api.github.com/repos/distri/touch-canvas/forks",
        "keys_url": "https://api.github.com/repos/distri/touch-canvas/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/touch-canvas/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/touch-canvas/teams",
        "hooks_url": "https://api.github.com/repos/distri/touch-canvas/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/touch-canvas/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/touch-canvas/events",
        "assignees_url": "https://api.github.com/repos/distri/touch-canvas/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/touch-canvas/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/touch-canvas/tags",
        "blobs_url": "https://api.github.com/repos/distri/touch-canvas/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/touch-canvas/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/touch-canvas/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/touch-canvas/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/touch-canvas/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/touch-canvas/languages",
        "stargazers_url": "https://api.github.com/repos/distri/touch-canvas/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/touch-canvas/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/touch-canvas/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/touch-canvas/subscription",
        "commits_url": "https://api.github.com/repos/distri/touch-canvas/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/touch-canvas/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/touch-canvas/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/touch-canvas/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/touch-canvas/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/touch-canvas/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/touch-canvas/merges",
        "archive_url": "https://api.github.com/repos/distri/touch-canvas/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/touch-canvas/downloads",
        "issues_url": "https://api.github.com/repos/distri/touch-canvas/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/touch-canvas/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/touch-canvas/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/touch-canvas/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/touch-canvas/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/touch-canvas/releases{/id}",
        "created_at": "2013-10-22T19:46:48Z",
        "updated_at": "2013-11-29T20:46:28Z",
        "pushed_at": "2013-11-29T20:46:28Z",
        "git_url": "git://github.com/distri/touch-canvas.git",
        "ssh_url": "git@github.com:distri/touch-canvas.git",
        "clone_url": "https://github.com/distri/touch-canvas.git",
        "svn_url": "https://github.com/distri/touch-canvas",
        "homepage": null,
        "size": 280,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.3.1",
        "defaultBranch": "master"
      },
      "dependencies": {
        "bindable": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.coffee.md": {
              "path": "README.coffee.md",
              "mode": "100644",
              "content": "Bindable\n========\n\n    Core = require \"core\"\n\nAdd event binding to objects.\n\n>     bindable = Bindable()\n>     bindable.on \"greet\", ->\n>       console.log \"yo!\"\n>     bindable.trigger \"greet\"\n>     #=> \"yo!\" is printed to log\n\nUse as a mixin.\n\n>    self.include Bindable\n\n    module.exports = (I={}, self=Core(I)) ->\n      eventCallbacks = {}\n\n      self.extend\n\nAdds a function as an event listener.\n\nThis will call `coolEventHandler` after `yourObject.trigger \"someCustomEvent\"`\nis called.\n\n>     yourObject.on \"someCustomEvent\", coolEventHandler\n\nHandlers can be attached to namespaces as well. The namespaces are only used\nfor finer control of targeting event removal. For example if you are making a\ncustom drawing system you could unbind `\".Drawable\"` events and add your own.\n\n>     yourObject.on \"\"\n\n        on: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          # HACK: Here we annotate the callback function with namespace metadata\n          # This will probably lead to some strange edge cases, but should work fine\n          # for simple cases.\n          if namespace\n            callback.__PIXIE ||= {}\n            callback.__PIXIE[namespace] = true\n\n          eventCallbacks[event] ||= []\n          eventCallbacks[event].push(callback)\n\n          return self\n\nRemoves a specific event listener, or all event listeners if\nno specific listener is given.\n\nRemoves the handler coolEventHandler from the event `\"someCustomEvent\"` while\nleaving the other events intact.\n\n>     yourObject.off \"someCustomEvent\", coolEventHandler\n\nRemoves all handlers attached to `\"anotherCustomEvent\"`\n\n>     yourObject.off \"anotherCustomEvent\"\n\nRemove all handlers from the `\".Drawable\" namespace`\n\n>     yourObject.off \".Drawable\"\n\n        off: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          if event\n            eventCallbacks[event] ||= []\n\n            if namespace\n              # Select only the callbacks that do not have this namespace metadata\n              eventCallbacks[event] = eventCallbacks.filter (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n            else\n              if callback\n                remove eventCallbacks[event], callback\n              else\n                eventCallbacks[event] = []\n          else if namespace\n            # No event given\n            # Select only the callbacks that do not have this namespace metadata\n            # for any events bound\n            for key, callbacks of eventCallbacks\n              eventCallbacks[key] = callbacks.filter (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n          return self\n\nCalls all listeners attached to the specified event.\n\n>     # calls each event handler bound to \"someCustomEvent\"\n>     yourObject.trigger \"someCustomEvent\"\n\nAdditional parameters can be passed to the handlers.\n\n>     yourObject.trigger \"someEvent\", \"hello\", \"anotherParameter\"\n\n        trigger: (event, parameters...) ->\n          callbacks = eventCallbacks[event]\n\n          if callbacks\n            callbacks.forEach (callback) ->\n              callback.apply(self, parameters)\n\n          return self\n\nLegacy method aliases.\n\n      self.extend\n        bind: self.on\n        unbind: self.off\n\nHelpers\n-------\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"README\"\nversion: \"0.1.0\"\ndependencies:\n  core: \"distri/core:v0.6.0\"\n",
              "type": "blob"
            },
            "test/bindable.coffee": {
              "path": "test/bindable.coffee",
              "mode": "100644",
              "content": "test = it\nok = assert\nequal = assert.equal\n\nBindable = require \"../README\"\n\ndescribe \"Bindable\", ->\n\n  test \"#bind and #trigger\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"Multiple bindings\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"#trigger arguments\", ->\n    o = Bindable()\n\n    param1 = \"the message\"\n    param2 = 3\n\n    o.bind \"test\", (p1, p2) ->\n      equal(p1, param1)\n      equal(p2, param2)\n\n    o.trigger \"test\", param1, param2\n\n  test \"#unbind\", ->\n    o = Bindable()\n\n    callback = ->\n      ok false\n\n    o.bind \"test\", callback\n    # Unbind specific event\n    o.unbind \"test\", callback\n    o.trigger \"test\"\n\n    o.bind \"test\", callback\n    # Unbind all events\n    o.unbind \"test\"\n    o.trigger \"test\"\n\n  test \"#trigger namespace\", ->\n    o = Bindable()\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\"\n    o.trigger \"test\"\n\n  test \"#unbind namespaced\", ->\n    o = Bindable()\n\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\", ->\n    o.trigger \"test\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "README": {
              "path": "README",
              "content": "(function() {\n  var Core, remove,\n    __slice = [].slice;\n\n  Core = require(\"core\");\n\n  module.exports = function(I, self) {\n    var eventCallbacks;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    eventCallbacks = {};\n    self.extend({\n      on: function(namespacedEvent, callback) {\n        var event, namespace, _ref;\n        _ref = namespacedEvent.split(\".\"), event = _ref[0], namespace = _ref[1];\n        if (namespace) {\n          callback.__PIXIE || (callback.__PIXIE = {});\n          callback.__PIXIE[namespace] = true;\n        }\n        eventCallbacks[event] || (eventCallbacks[event] = []);\n        eventCallbacks[event].push(callback);\n        return self;\n      },\n      off: function(namespacedEvent, callback) {\n        var callbacks, event, key, namespace, _ref;\n        _ref = namespacedEvent.split(\".\"), event = _ref[0], namespace = _ref[1];\n        if (event) {\n          eventCallbacks[event] || (eventCallbacks[event] = []);\n          if (namespace) {\n            eventCallbacks[event] = eventCallbacks.filter(function(callback) {\n              var _ref1;\n              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;\n            });\n          } else {\n            if (callback) {\n              remove(eventCallbacks[event], callback);\n            } else {\n              eventCallbacks[event] = [];\n            }\n          }\n        } else if (namespace) {\n          for (key in eventCallbacks) {\n            callbacks = eventCallbacks[key];\n            eventCallbacks[key] = callbacks.filter(function(callback) {\n              var _ref1;\n              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;\n            });\n          }\n        }\n        return self;\n      },\n      trigger: function() {\n        var callbacks, event, parameters;\n        event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n        callbacks = eventCallbacks[event];\n        if (callbacks) {\n          callbacks.forEach(function(callback) {\n            return callback.apply(self, parameters);\n          });\n        }\n        return self;\n      }\n    });\n    return self.extend({\n      bind: self.on,\n      unbind: self.off\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=README.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"README\",\"version\":\"0.1.0\",\"dependencies\":{\"core\":\"distri/core:v0.6.0\"}};",
              "type": "blob"
            },
            "test/bindable": {
              "path": "test/bindable",
              "content": "(function() {\n  var Bindable, equal, ok, test;\n\n  test = it;\n\n  ok = assert;\n\n  equal = assert.equal;\n\n  Bindable = require(\"../README\");\n\n  describe(\"Bindable\", function() {\n    test(\"#bind and #trigger\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      return o.trigger(\"test\");\n    });\n    test(\"Multiple bindings\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      return o.trigger(\"test\");\n    });\n    test(\"#trigger arguments\", function() {\n      var o, param1, param2;\n      o = Bindable();\n      param1 = \"the message\";\n      param2 = 3;\n      o.bind(\"test\", function(p1, p2) {\n        equal(p1, param1);\n        return equal(p2, param2);\n      });\n      return o.trigger(\"test\", param1, param2);\n    });\n    test(\"#unbind\", function() {\n      var callback, o;\n      o = Bindable();\n      callback = function() {\n        return ok(false);\n      };\n      o.bind(\"test\", callback);\n      o.unbind(\"test\", callback);\n      o.trigger(\"test\");\n      o.bind(\"test\", callback);\n      o.unbind(\"test\");\n      return o.trigger(\"test\");\n    });\n    test(\"#trigger namespace\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test.TestNamespace\", function() {\n        return ok(true);\n      });\n      o.trigger(\"test\");\n      o.unbind(\".TestNamespace\");\n      return o.trigger(\"test\");\n    });\n    return test(\"#unbind namespaced\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test.TestNamespace\", function() {\n        return ok(true);\n      });\n      o.trigger(\"test\");\n      o.unbind(\".TestNamespace\", function() {});\n      return o.trigger(\"test\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/bindable.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.1.0",
          "entryPoint": "README",
          "repository": {
            "id": 17189431,
            "name": "bindable",
            "full_name": "distri/bindable",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/bindable",
            "description": "Event binding",
            "fork": false,
            "url": "https://api.github.com/repos/distri/bindable",
            "forks_url": "https://api.github.com/repos/distri/bindable/forks",
            "keys_url": "https://api.github.com/repos/distri/bindable/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/bindable/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/bindable/teams",
            "hooks_url": "https://api.github.com/repos/distri/bindable/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/bindable/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/bindable/events",
            "assignees_url": "https://api.github.com/repos/distri/bindable/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/bindable/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/bindable/tags",
            "blobs_url": "https://api.github.com/repos/distri/bindable/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/bindable/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/bindable/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/bindable/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/bindable/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/bindable/languages",
            "stargazers_url": "https://api.github.com/repos/distri/bindable/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/bindable/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/bindable/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/bindable/subscription",
            "commits_url": "https://api.github.com/repos/distri/bindable/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/bindable/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/bindable/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/bindable/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/bindable/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/bindable/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/bindable/merges",
            "archive_url": "https://api.github.com/repos/distri/bindable/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/bindable/downloads",
            "issues_url": "https://api.github.com/repos/distri/bindable/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/bindable/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/bindable/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/bindable/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/bindable/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/bindable/releases{/id}",
            "created_at": "2014-02-25T21:50:35Z",
            "updated_at": "2014-02-25T21:50:35Z",
            "pushed_at": "2014-02-25T21:50:35Z",
            "git_url": "git://github.com/distri/bindable.git",
            "ssh_url": "git@github.com:distri/bindable.git",
            "clone_url": "https://github.com/distri/bindable.git",
            "svn_url": "https://github.com/distri/bindable",
            "homepage": null,
            "size": 0,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.1.0",
            "defaultBranch": "master"
          },
          "dependencies": {
            "core": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "core\n====\n\nAn object extension system.\n",
                  "type": "blob"
                },
                "core.coffee.md": {
                  "path": "core.coffee.md",
                  "mode": "100644",
                  "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
                  "type": "blob"
                },
                "test/core.coffee": {
                  "path": "test/core.coffee",
                  "mode": "100644",
                  "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "core": {
                  "path": "core",
                  "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
                  "type": "blob"
                },
                "test/core": {
                  "path": "test/core",
                  "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.6.0",
              "entryPoint": "core",
              "repository": {
                "id": 13567517,
                "name": "core",
                "full_name": "distri/core",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/core",
                "description": "An object extension system.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/core",
                "forks_url": "https://api.github.com/repos/distri/core/forks",
                "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/core/teams",
                "hooks_url": "https://api.github.com/repos/distri/core/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/core/events",
                "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/core/tags",
                "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/core/languages",
                "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/core/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/core/subscription",
                "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/core/merges",
                "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/core/downloads",
                "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
                "created_at": "2013-10-14T17:04:33Z",
                "updated_at": "2013-12-24T00:49:21Z",
                "pushed_at": "2013-10-14T23:49:11Z",
                "git_url": "git://github.com/distri/core.git",
                "ssh_url": "git@github.com:distri/core.git",
                "clone_url": "https://github.com/distri/core.git",
                "svn_url": "https://github.com/distri/core",
                "homepage": null,
                "size": 592,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.6.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            }
          }
        },
        "core": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "core\n====\n\nAn object extension system.\n",
              "type": "blob"
            },
            "core.coffee.md": {
              "path": "core.coffee.md",
              "mode": "100644",
              "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
              "type": "blob"
            },
            "test/core.coffee": {
              "path": "test/core.coffee",
              "mode": "100644",
              "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "core": {
              "path": "core",
              "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
              "type": "blob"
            },
            "test/core": {
              "path": "test/core",
              "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.6.0",
          "entryPoint": "core",
          "repository": {
            "id": 13567517,
            "name": "core",
            "full_name": "distri/core",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/core",
            "description": "An object extension system.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/core",
            "forks_url": "https://api.github.com/repos/distri/core/forks",
            "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/core/teams",
            "hooks_url": "https://api.github.com/repos/distri/core/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/core/events",
            "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/core/tags",
            "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/core/languages",
            "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/core/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/core/subscription",
            "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/core/merges",
            "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/core/downloads",
            "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
            "created_at": "2013-10-14T17:04:33Z",
            "updated_at": "2013-12-24T00:49:21Z",
            "pushed_at": "2013-10-14T23:49:11Z",
            "git_url": "git://github.com/distri/core.git",
            "ssh_url": "git@github.com:distri/core.git",
            "clone_url": "https://github.com/distri/core.git",
            "svn_url": "https://github.com/distri/core",
            "homepage": null,
            "size": 592,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.6.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "pixie-canvas": {
          "source": {
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"pixie_canvas\"\nversion: \"0.9.2\"\n",
              "type": "blob"
            },
            "pixie_canvas.coffee.md": {
              "path": "pixie_canvas.coffee.md",
              "mode": "100644",
              "content": "Pixie Canvas\n============\n\nPixieCanvas provides a convenient wrapper for working with Context2d.\n\nMethods try to be as flexible as possible as to what arguments they take.\n\nNon-getter methods return `this` for method chaining.\n\n    TAU = 2 * Math.PI\n\n    module.exports = (options={}) ->\n        defaults options,\n          width: 400\n          height: 400\n          init: ->\n\n        canvas = document.createElement \"canvas\"\n        canvas.width = options.width\n        canvas.height = options.height\n\n        context = undefined\n\n        self =\n\n`clear` clears the entire canvas (or a portion of it).\n\nTo clear the entire canvas use `canvas.clear()`\n\n>     #! paint\n>     # Set up: Fill canvas with blue\n>     canvas.fill(\"blue\")\n>\n>     # Clear a portion of the canvas\n>     canvas.clear\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n\n          clear: ({x, y, width, height}={}) ->\n            x ?= 0\n            y ?= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            context.clearRect(x, y, width, height)\n\n            return this\n\nFills the entire canvas (or a specified section of it) with\nthe given color.\n\n>     #! paint\n>     # Paint the town (entire canvas) red\n>     canvas.fill \"red\"\n>\n>     # Fill a section of the canvas white (#FFF)\n>     canvas.fill\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#FFF\"\n\n          fill: (color={}) ->\n            unless (typeof color is \"string\") or color.channels\n              {x, y, width, height, bounds, color} = color\n\n            {x, y, width, height} = bounds if bounds\n\n            x ||= 0\n            y ||= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            @fillColor(color)\n            context.fillRect(x, y, width, height)\n\n            return this\n\nA direct map to the Context2d draw image. `GameObject`s\nthat implement drawable will have this wrapped up nicely,\nso there is a good chance that you will not have to deal with\nit directly.\n\n>     #! paint\n>     $ \"<img>\",\n>       src: \"https://secure.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045\"\n>       load: ->\n>         canvas.drawImage(this, 25, 25)\n\n          drawImage: (args...) ->\n            context.drawImage(args...)\n\n            return this\n\nDraws a circle at the specified position with the specified\nradius and color.\n\n>     #! paint\n>     # Draw a large orange circle\n>     canvas.drawCircle\n>       radius: 30\n>       position: Point(100, 75)\n>       color: \"orange\"\n>\n>     # You may also set a stroke\n>     canvas.drawCircle\n>       x: 25\n>       y: 50\n>       radius: 10\n>       color: \"blue\"\n>       stroke:\n>         color: \"red\"\n>         width: 1\n\nYou can pass in circle objects as well.\n\n>     #! paint\n>     # Create a circle object to set up the next examples\n>     circle =\n>       radius: 20\n>       x: 50\n>       y: 50\n>\n>     # Draw a given circle in yellow\n>     canvas.drawCircle\n>       circle: circle\n>       color: \"yellow\"\n>\n>     # Draw the circle in green at a different position\n>     canvas.drawCircle\n>       circle: circle\n>       position: Point(25, 75)\n>       color: \"green\"\n\nYou may set a stroke, or even pass in only a stroke to draw an unfilled circle.\n\n>     #! paint\n>     # Draw an outline circle in purple.\n>     canvas.drawCircle\n>       x: 50\n>       y: 75\n>       radius: 10\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n>\n\n          drawCircle: ({x, y, radius, position, color, stroke, circle}) ->\n            {x, y, radius} = circle if circle\n            {x, y} = position if position\n\n            radius = 0 if radius < 0\n\n            context.beginPath()\n            context.arc(x, y, radius, 0, TAU, true)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return this\n\nDraws a rectangle at the specified position with given\nwidth and height. Optionally takes a position, bounds\nand color argument.\n\n\n          drawRect: ({x, y, width, height, position, bounds, color, stroke}) ->\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            if color\n              @fillColor(color)\n              context.fillRect(x, y, width, height)\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.strokeRect(x, y, width, height)\n\n            return @\n\n>     #! paint\n>     # Draw a red rectangle using x, y, width and height\n>     canvas.drawRect\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#F00\"\n\n----\n\nYou can mix and match position, witdth and height.\n\n>     #! paint\n>     canvas.drawRect\n>       position: Point(0, 0)\n>       width: 50\n>       height: 50\n>       color: \"blue\"\n>       stroke:\n>         color: \"orange\"\n>         width: 3\n\n----\n\nA bounds can be reused to draw multiple rectangles.\n\n>     #! paint\n>     bounds =\n>       x: 100\n>       y: 0\n>       width: 100\n>       height: 100\n>\n>     # Draw a purple rectangle using bounds\n>     canvas.drawRect\n>       bounds: bounds\n>       color: \"green\"\n>\n>     # Draw the outline of the same bounds, but at a different position\n>     canvas.drawRect\n>       bounds: bounds\n>       position: Point(0, 50)\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n\n----\n\nDraw a line from `start` to `end`.\n\n>     #! paint\n>     # Draw a sweet diagonal\n>     canvas.drawLine\n>       start: Point(0, 0)\n>       end: Point(200, 200)\n>       color: \"purple\"\n>\n>     # Draw another sweet diagonal\n>     canvas.drawLine\n>       start: Point(200, 0)\n>       end: Point(0, 200)\n>       color: \"red\"\n>       width: 6\n>\n>     # Now draw a sweet horizontal with a direction and a length\n>     canvas.drawLine\n>       start: Point(0, 100)\n>       length: 200\n>       direction: Point(1, 0)\n>       color: \"orange\"\n\n          drawLine: ({start, end, width, color, direction, length}) ->\n            width ||= 3\n\n            if direction\n              end = direction.norm(length).add(start)\n\n            @lineWidth(width)\n            @strokeColor(color)\n\n            context.beginPath()\n            context.moveTo(start.x, start.y)\n            context.lineTo(end.x, end.y)\n            context.closePath()\n            context.stroke()\n\n            return this\n\nDraw a polygon.\n\n>     #! paint\n>     # Draw a sweet rhombus\n>     canvas.drawPoly\n>       points: [\n>         Point(50, 25)\n>         Point(75, 50)\n>         Point(50, 75)\n>         Point(25, 50)\n>       ]\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawPoly: ({points, color, stroke}) ->\n            context.beginPath()\n            points.forEach (point, i) ->\n              if i == 0\n                context.moveTo(point.x, point.y)\n              else\n                context.lineTo(point.x, point.y)\n            context.lineTo points[0].x, points[0].y\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return @\n\nDraw a rounded rectangle.\n\nAdapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html\n\n>     #! paint\n>     # Draw a purple rounded rectangle with a red outline\n>     canvas.drawRoundRect\n>       position: Point(25, 25)\n>       radius: 10\n>       width: 150\n>       height: 100\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawRoundRect: ({x, y, width, height, radius, position, bounds, color, stroke}) ->\n            radius = 5 unless radius?\n\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            context.beginPath()\n            context.moveTo(x + radius, y)\n            context.lineTo(x + width - radius, y)\n            context.quadraticCurveTo(x + width, y, x + width, y + radius)\n            context.lineTo(x + width, y + height - radius)\n            context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)\n            context.lineTo(x + radius, y + height)\n            context.quadraticCurveTo(x, y + height, x, y + height - radius)\n            context.lineTo(x, y + radius)\n            context.quadraticCurveTo(x, y, x + radius, y)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @lineWidth(stroke.width)\n              @strokeColor(stroke.color)\n              context.stroke()\n\n            return this\n\nDraws text on the canvas at the given position, in the given color.\nIf no color is given then the previous fill color is used.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: '#eee'\n>\n>     # A line to indicate the baseline\n>     canvas.drawLine\n>       start: Point(25, 50)\n>       end: Point(125, 50)\n>       color: \"#333\"\n>       width: 1\n>\n>     # Draw some text, note the position of the baseline\n>     canvas.drawText\n>       position: Point(25, 50)\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n\n\n          drawText: ({x, y, text, position, color, font}) ->\n            {x, y} = position if position\n\n            @fillColor(color)\n            @font(font) if font\n            context.fillText(text, x, y)\n\n            return this\n\nCenters the given text on the canvas at the given y position. An x position\nor point position can also be given in which case the text is centered at the\nx, y or position value specified.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: \"#eee\"\n>\n>     # Center text on the screen at y value 25\n>     canvas.centerText\n>       y: 25\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n>\n>     # Center text at point (75, 75)\n>     canvas.centerText\n>       position: Point(75, 75)\n>       color: \"green\"\n>       text: \"take this\"\n\n          centerText: ({text, x, y, position, color, font}) ->\n            {x, y} = position if position\n\n            x = canvas.width / 2 unless x?\n\n            textWidth = @measureText(text)\n\n            @drawText {\n              text\n              color\n              font\n              x: x - (textWidth) / 2\n              y\n            }\n\nSetting the fill color:\n\n`canvas.fillColor(\"#FF0000\")`\n\nPassing no arguments returns the fillColor:\n\n`canvas.fillColor() # => \"#FF000000\"`\n\nYou can also pass a Color object:\n\n`canvas.fillColor(Color('sky blue'))`\n\n          fillColor: (color) ->\n            if color\n              if color.channels\n                context.fillStyle = color.toString()\n              else\n                context.fillStyle = color\n\n              return @\n            else\n              return context.fillStyle\n\nSetting the stroke color:\n\n`canvas.strokeColor(\"#FF0000\")`\n\nPassing no arguments returns the strokeColor:\n\n`canvas.strokeColor() # => \"#FF0000\"`\n\nYou can also pass a Color object:\n\n`canvas.strokeColor(Color('sky blue'))`\n\n          strokeColor: (color) ->\n            if color\n              if color.channels\n                context.strokeStyle = color.toString()\n              else\n                context.strokeStyle = color\n\n              return this\n            else\n              return context.strokeStyle\n\nDetermine how wide some text is.\n\n`canvas.measureText('Hello World!') # => 55`\n\nIt may have accuracy issues depending on the font used.\n\n          measureText: (text) ->\n            context.measureText(text).width\n\nPasses this canvas to the block with the given matrix transformation\napplied. All drawing methods called within the block will draw\ninto the canvas with the transformation applied. The transformation\nis removed at the end of the block, even if the block throws an error.\n\n          withTransform: (matrix, block) ->\n            context.save()\n\n            context.transform(\n              matrix.a,\n              matrix.b,\n              matrix.c,\n              matrix.d,\n              matrix.tx,\n              matrix.ty\n            )\n\n            try\n              block(this)\n            finally\n              context.restore()\n\n            return this\n\nStraight proxy to context `putImageData` method.\n\n          putImageData: (args...) ->\n            context.putImageData(args...)\n\n            return this\n\nContext getter.\n\n          context: ->\n            context\n\nGetter for the actual html canvas element.\n\n          element: ->\n            canvas\n\nStraight proxy to context pattern creation.\n\n          createPattern: (image, repitition) ->\n            context.createPattern(image, repitition)\n\nSet a clip rectangle.\n\n          clip: (x, y, width, height) ->\n            context.beginPath()\n            context.rect(x, y, width, height)\n            context.clip()\n\n            return this\n\nGenerate accessors that get properties from the context object.\n\n        contextAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                context[attr] = newVal\n                return @\n              else\n                context[attr]\n\n        contextAttrAccessor(\n          \"font\",\n          \"globalAlpha\",\n          \"globalCompositeOperation\",\n          \"lineWidth\",\n          \"textAlign\",\n        )\n\nGenerate accessors that get properties from the canvas object.\n\n        canvasAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                canvas[attr] = newVal\n                return @\n              else\n                canvas[attr]\n\n        canvasAttrAccessor(\n          \"height\",\n          \"width\",\n        )\n\n        context = canvas.getContext('2d')\n\n        options.init(self)\n\n        return self\n\nHelpers\n-------\n\nFill in default properties for an object, setting them only if they are not\nalready present.\n\n    defaults = (target, objects...) ->\n      for object in objects\n        for name of object\n          unless target.hasOwnProperty(name)\n            target[name] = object[name]\n\n      return target\n\nInteractive Examples\n--------------------\n\n>     #! setup\n>     Canvas = require \"/pixie_canvas\"\n>\n>     window.Point ?= (x, y) ->\n>       x: x\n>       y: y\n>\n>     Interactive.register \"paint\", ({source, runtimeElement}) ->\n>       canvas = Canvas\n>         width: 400\n>         height: 200\n>\n>       code = CoffeeScript.compile(source)\n>\n>       runtimeElement.empty().append canvas.element()\n>       Function(\"canvas\", code)(canvas)\n",
              "type": "blob"
            },
            "test/test.coffee": {
              "path": "test/test.coffee",
              "mode": "100644",
              "content": "Canvas = require \"../pixie_canvas\"\n\ndescribe \"pixie canvas\", ->\n  it \"Should create a canvas\", ->\n    canvas = Canvas\n      width: 400\n      height: 150\n\n    assert canvas\n\n    assert canvas.width() is 400\n",
              "type": "blob"
            }
          },
          "distribution": {
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"pixie_canvas\",\"version\":\"0.9.2\"};",
              "type": "blob"
            },
            "pixie_canvas": {
              "path": "pixie_canvas",
              "content": "(function() {\n  var TAU, defaults,\n    __slice = [].slice;\n\n  TAU = 2 * Math.PI;\n\n  module.exports = function(options) {\n    var canvas, canvasAttrAccessor, context, contextAttrAccessor, self;\n    if (options == null) {\n      options = {};\n    }\n    defaults(options, {\n      width: 400,\n      height: 400,\n      init: function() {}\n    });\n    canvas = document.createElement(\"canvas\");\n    canvas.width = options.width;\n    canvas.height = options.height;\n    context = void 0;\n    self = {\n      clear: function(_arg) {\n        var height, width, x, y, _ref;\n        _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height;\n        if (x == null) {\n          x = 0;\n        }\n        if (y == null) {\n          y = 0;\n        }\n        if (width == null) {\n          width = canvas.width;\n        }\n        if (height == null) {\n          height = canvas.height;\n        }\n        context.clearRect(x, y, width, height);\n        return this;\n      },\n      fill: function(color) {\n        var bounds, height, width, x, y, _ref;\n        if (color == null) {\n          color = {};\n        }\n        if (!((typeof color === \"string\") || color.channels)) {\n          _ref = color, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height, bounds = _ref.bounds, color = _ref.color;\n        }\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        x || (x = 0);\n        y || (y = 0);\n        if (width == null) {\n          width = canvas.width;\n        }\n        if (height == null) {\n          height = canvas.height;\n        }\n        this.fillColor(color);\n        context.fillRect(x, y, width, height);\n        return this;\n      },\n      drawImage: function() {\n        var args;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        context.drawImage.apply(context, args);\n        return this;\n      },\n      drawCircle: function(_arg) {\n        var circle, color, position, radius, stroke, x, y;\n        x = _arg.x, y = _arg.y, radius = _arg.radius, position = _arg.position, color = _arg.color, stroke = _arg.stroke, circle = _arg.circle;\n        if (circle) {\n          x = circle.x, y = circle.y, radius = circle.radius;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (radius < 0) {\n          radius = 0;\n        }\n        context.beginPath();\n        context.arc(x, y, radius, 0, TAU, true);\n        context.closePath();\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.stroke();\n        }\n        return this;\n      },\n      drawRect: function(_arg) {\n        var bounds, color, height, position, stroke, width, x, y;\n        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (color) {\n          this.fillColor(color);\n          context.fillRect(x, y, width, height);\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.strokeRect(x, y, width, height);\n        }\n        return this;\n      },\n      drawLine: function(_arg) {\n        var color, direction, end, length, start, width;\n        start = _arg.start, end = _arg.end, width = _arg.width, color = _arg.color, direction = _arg.direction, length = _arg.length;\n        width || (width = 3);\n        if (direction) {\n          end = direction.norm(length).add(start);\n        }\n        this.lineWidth(width);\n        this.strokeColor(color);\n        context.beginPath();\n        context.moveTo(start.x, start.y);\n        context.lineTo(end.x, end.y);\n        context.closePath();\n        context.stroke();\n        return this;\n      },\n      drawPoly: function(_arg) {\n        var color, points, stroke;\n        points = _arg.points, color = _arg.color, stroke = _arg.stroke;\n        context.beginPath();\n        points.forEach(function(point, i) {\n          if (i === 0) {\n            return context.moveTo(point.x, point.y);\n          } else {\n            return context.lineTo(point.x, point.y);\n          }\n        });\n        context.lineTo(points[0].x, points[0].y);\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.stroke();\n        }\n        return this;\n      },\n      drawRoundRect: function(_arg) {\n        var bounds, color, height, position, radius, stroke, width, x, y;\n        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, radius = _arg.radius, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;\n        if (radius == null) {\n          radius = 5;\n        }\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        context.beginPath();\n        context.moveTo(x + radius, y);\n        context.lineTo(x + width - radius, y);\n        context.quadraticCurveTo(x + width, y, x + width, y + radius);\n        context.lineTo(x + width, y + height - radius);\n        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);\n        context.lineTo(x + radius, y + height);\n        context.quadraticCurveTo(x, y + height, x, y + height - radius);\n        context.lineTo(x, y + radius);\n        context.quadraticCurveTo(x, y, x + radius, y);\n        context.closePath();\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.lineWidth(stroke.width);\n          this.strokeColor(stroke.color);\n          context.stroke();\n        }\n        return this;\n      },\n      drawText: function(_arg) {\n        var color, font, position, text, x, y;\n        x = _arg.x, y = _arg.y, text = _arg.text, position = _arg.position, color = _arg.color, font = _arg.font;\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        this.fillColor(color);\n        if (font) {\n          this.font(font);\n        }\n        context.fillText(text, x, y);\n        return this;\n      },\n      centerText: function(_arg) {\n        var color, font, position, text, textWidth, x, y;\n        text = _arg.text, x = _arg.x, y = _arg.y, position = _arg.position, color = _arg.color, font = _arg.font;\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (x == null) {\n          x = canvas.width / 2;\n        }\n        textWidth = this.measureText(text);\n        return this.drawText({\n          text: text,\n          color: color,\n          font: font,\n          x: x - textWidth / 2,\n          y: y\n        });\n      },\n      fillColor: function(color) {\n        if (color) {\n          if (color.channels) {\n            context.fillStyle = color.toString();\n          } else {\n            context.fillStyle = color;\n          }\n          return this;\n        } else {\n          return context.fillStyle;\n        }\n      },\n      strokeColor: function(color) {\n        if (color) {\n          if (color.channels) {\n            context.strokeStyle = color.toString();\n          } else {\n            context.strokeStyle = color;\n          }\n          return this;\n        } else {\n          return context.strokeStyle;\n        }\n      },\n      measureText: function(text) {\n        return context.measureText(text).width;\n      },\n      withTransform: function(matrix, block) {\n        context.save();\n        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);\n        try {\n          block(this);\n        } finally {\n          context.restore();\n        }\n        return this;\n      },\n      putImageData: function() {\n        var args;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        context.putImageData.apply(context, args);\n        return this;\n      },\n      context: function() {\n        return context;\n      },\n      element: function() {\n        return canvas;\n      },\n      createPattern: function(image, repitition) {\n        return context.createPattern(image, repitition);\n      },\n      clip: function(x, y, width, height) {\n        context.beginPath();\n        context.rect(x, y, width, height);\n        context.clip();\n        return this;\n      }\n    };\n    contextAttrAccessor = function() {\n      var attrs;\n      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return attrs.forEach(function(attr) {\n        return self[attr] = function(newVal) {\n          if (newVal != null) {\n            context[attr] = newVal;\n            return this;\n          } else {\n            return context[attr];\n          }\n        };\n      });\n    };\n    contextAttrAccessor(\"font\", \"globalAlpha\", \"globalCompositeOperation\", \"lineWidth\", \"textAlign\");\n    canvasAttrAccessor = function() {\n      var attrs;\n      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return attrs.forEach(function(attr) {\n        return self[attr] = function(newVal) {\n          if (newVal != null) {\n            canvas[attr] = newVal;\n            return this;\n          } else {\n            return canvas[attr];\n          }\n        };\n      });\n    };\n    canvasAttrAccessor(\"height\", \"width\");\n    context = canvas.getContext('2d');\n    options.init(self);\n    return self;\n  };\n\n  defaults = function() {\n    var name, object, objects, target, _i, _len;\n    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = objects.length; _i < _len; _i++) {\n      object = objects[_i];\n      for (name in object) {\n        if (!target.hasOwnProperty(name)) {\n          target[name] = object[name];\n        }\n      }\n    }\n    return target;\n  };\n\n}).call(this);\n\n//# sourceURL=pixie_canvas.coffee",
              "type": "blob"
            },
            "test/test": {
              "path": "test/test",
              "content": "(function() {\n  var Canvas;\n\n  Canvas = require(\"../pixie_canvas\");\n\n  describe(\"pixie canvas\", function() {\n    return it(\"Should create a canvas\", function() {\n      var canvas;\n      canvas = Canvas({\n        width: 400,\n        height: 150\n      });\n      assert(canvas);\n      return assert(canvas.width() === 400);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.9.2",
          "entryPoint": "pixie_canvas",
          "repository": {
            "id": 12096899,
            "name": "pixie-canvas",
            "full_name": "distri/pixie-canvas",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/pixie-canvas",
            "description": "A pretty ok HTML5 canvas wrapper",
            "fork": false,
            "url": "https://api.github.com/repos/distri/pixie-canvas",
            "forks_url": "https://api.github.com/repos/distri/pixie-canvas/forks",
            "keys_url": "https://api.github.com/repos/distri/pixie-canvas/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/pixie-canvas/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/pixie-canvas/teams",
            "hooks_url": "https://api.github.com/repos/distri/pixie-canvas/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/pixie-canvas/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/pixie-canvas/events",
            "assignees_url": "https://api.github.com/repos/distri/pixie-canvas/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/pixie-canvas/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/pixie-canvas/tags",
            "blobs_url": "https://api.github.com/repos/distri/pixie-canvas/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/pixie-canvas/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/pixie-canvas/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/pixie-canvas/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/pixie-canvas/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/pixie-canvas/languages",
            "stargazers_url": "https://api.github.com/repos/distri/pixie-canvas/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/pixie-canvas/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/pixie-canvas/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/pixie-canvas/subscription",
            "commits_url": "https://api.github.com/repos/distri/pixie-canvas/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/pixie-canvas/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/pixie-canvas/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/pixie-canvas/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/pixie-canvas/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/pixie-canvas/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/pixie-canvas/merges",
            "archive_url": "https://api.github.com/repos/distri/pixie-canvas/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/pixie-canvas/downloads",
            "issues_url": "https://api.github.com/repos/distri/pixie-canvas/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/pixie-canvas/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/pixie-canvas/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/pixie-canvas/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/pixie-canvas/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/pixie-canvas/releases{/id}",
            "created_at": "2013-08-14T01:15:34Z",
            "updated_at": "2013-11-29T20:54:07Z",
            "pushed_at": "2013-11-29T20:54:07Z",
            "git_url": "git://github.com/distri/pixie-canvas.git",
            "ssh_url": "git@github.com:distri/pixie-canvas.git",
            "clone_url": "https://github.com/distri/pixie-canvas.git",
            "svn_url": "https://github.com/distri/pixie-canvas",
            "homepage": null,
            "size": 664,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 1,
            "forks": 0,
            "open_issues": 1,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.9.2",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    },
    "util": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "util\n====\n\nSmall utility methods for JS\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\nApply a stylesheet idempotently.\n\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(previousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.1\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/test.coffee": {
          "path": "test/test.coffee",
          "content": "{applyStylesheet} = require \"../main\"\n\ndescribe \"util\", ->\n  it \"should apply stylesheets\", ->\n    applyStylesheet(\"body { background-color: red; }\", \"test\")\n    applyStylesheet(\"body { background-color: #EEE; }\", \"test\")\n",
          "mode": "100644"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(previousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.1\"};",
          "type": "blob"
        },
        "test/test": {
          "path": "test/test",
          "content": "(function() {\n  var applyStylesheet;\n\n  applyStylesheet = require(\"../main\").applyStylesheet;\n\n  describe(\"util\", function() {\n    return it(\"should apply stylesheets\", function() {\n      applyStylesheet(\"body { background-color: red; }\", \"test\");\n      return applyStylesheet(\"body { background-color: #EEE; }\", \"test\");\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/more-cleanup/"
      },
      "version": "0.1.1",
      "entryPoint": "main",
      "repository": {
        "branch": "master",
        "default_branch": "master",
        "full_name": "distri/util",
        "homepage": null,
        "description": "Small utility methods for JS",
        "html_url": "https://github.com/distri/util",
        "url": "https://api.github.com/repos/distri/util",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});