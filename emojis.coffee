module.exports =
  literacy: """
    📔 Notebook With Decorative Cover
    📕 Closed Book
    📖 Open Book
    📗 Green Book
    📘 Blue Book
    📙 Orange Book
    📚 Books
    📓 Notebook
    📃 Page With Curl
    📜 Scroll
    📄 Page Facing Up
    📰 Newspaper
    ✏ Pencil
    🖋 Lower Left Fountain Pen
    🖊 Lower Left Ballpoint Pen
    🖌 Lower Left Paintbrush
    🖍 Lower Left Crayon
  """
  food: """
    🍇 Grapes
    🍈 Melon
    🍉 Watermelon
    🍊 Tangerine
    🍋 Lemon
    🍌 Banana
    🍍 Pineapple
    🍎 Red Apple
    🍏 Green Apple
    🍐 Pear
    🍑 Peach
    🍒 Cherries
    🍓 Strawberry
    🍅 Tomato
    🍆 Aubergine
    🌽 Ear of Maize
    🌶 Hot Pepper
    🍄 Mushroom
    🌰 Chestnut
    🍞 Bread
    🧀 Cheese Wedge
    🍖 Meat on Bone
    🍗 Poultry Leg
    🍔 Hamburger
    🍟 French Fries
    🍕 Slice of Pizza
    🌭 Hot Dog
    🌮 Taco
    🌯 Burrito
    🍳 Cooking
    🍲 Pot of Food
    🍿 Popcorn
    🍱 Bento Box
    🍘 Rice Cracker
    🍙 Rice Ball
    🍚 Cooked Rice
    🍛 Curry and Rice
    🍜 Steaming Bowl
    🍝 Spaghetti
    🍠 Roasted Sweet Potato
    🍢 Oden
    🍣 Sushi
    🍤 Fried Shrimp
    🍥 Fish Cake With Swirl Design
    🍡 Dango
    🍦 Soft Ice Cream
    🍧 Shaved Ice
    🍨 Ice Cream
    🍩 Doughnut
    🍪 Cookie
    🎂 Birthday Cake
    🍰 Shortcake
    🍫 Chocolate Bar
    🍬 Candy
    🍭 Lollipop
    🍮 Custard
    🍯 Honey Pot
    ☕ Hot Beverage
    🍵 Teacup Without Handle
    🍶 Sake Bottle and Cup
    🍾 Bottle With Popping Cork
    🍷 Wine Glass
    🍸 Cocktail Glass
    🍹 Tropical Drink
    🍺 Beer Mug
  """
  weapons: """
    🗡 Dagger Knife
    🏹 Bow and Arrow
  """
  items: """
    🔪 Hocho
    🔮 Crystal Ball
    💉 Syringe
    💊 Pill
    🔧 Wrench
    🔑 Key
    🗝 Old Key
    🔨 Hammer
    ⛏ Pick
    ⚙ Gear
    📦 Package
    ✉ Envelope
  """
  furniture: """
    🚪 Door
    🛏 Bed
    🛋 Couch and Lamp
    🚽 Toilet
    🚿 Shower
    🛁 Bathtub
    🗄 File Cabinet
    🗑 Wastebasket
    📮 Postbox
    🕰 Mantelpiece Clock
  """
  money: """
    💎 Gem Stone
    💰 Money Bag
    💴 Banknote With Yen Sign
    💵 Banknote With Dollar Sign
    💶 Banknote With Euro Sign
    💷 Banknote With Pound Sign
  """
  buildings: """
    ⚒ Hammer and Pick
    🛠 Hammer and Wrench
    ⚔ Crossed Swords
    🍻 Clinking Beer Mugs
    🍽 Fork and Knife With Plate
    ⚗ Alembic
    ⚖ Scales
    💈 Barber Pole
  """
  other: """
    🍼 Baby Bottle
    🍴 Fork and Knife
    🔬 Microscope
    🔭 Telescope
  """

Object.keys(module.exports).forEach (type) ->
  module.exports[type] = module.exports[type].split("\n").map (row) ->
    row.split(" ")[0]
